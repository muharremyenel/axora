import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { userService } from "@/services/userService"
import { User } from "@/types/user"
import { toast } from "@/components/ui/use-toast"
import { Trash2, UserPlus, Pencil } from "lucide-react"
import DeleteDialog from "@/components/common/DeleteDialog"
import UserFormDialog from "@/components/users/UserFormDialog"

export default function UserManagementPage() {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setIsDeleteOpen(false)
      toast({
        title: "Başarılı",
        description: "Kullanıcı silindi",
      })
    },
  })

  const handleDelete = (user: User) => {
    if (user.role === "ROLE_ADMIN") {
      toast({
        title: "Hata",
        description: "Admin kullanıcısı silinemez"
      })
      return
    }
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedUser(undefined)
    setIsFormOpen(true)
  }

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kullanıcı Yönetimi</h2>
          <p className="text-muted-foreground">
            Kullanıcıları görüntüleyin, düzenleyin ve silin
          </p>
        </div>
        <Button onClick={handleCreate}>
          <UserPlus className="mr-2 h-4 w-4" />
          Yeni Kullanıcı
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  {user.role === "ROLE_ADMIN" ? "Admin" : "Kullanıcı"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(user)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(user)}
                  disabled={user.role === "ROLE_ADMIN"}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div>
                <div className="text-sm font-medium">Hesap Oluşturulma</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
              {user.updatedAt && (
                <div>
                  <div className="text-sm font-medium">Son Güncelleme</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm font-medium">Durum</div>
                <div className="text-sm text-muted-foreground">
                  {user.active ? "Aktif" : "Pasif"}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Kullanıcıyı Sil"
        description={`${selectedUser?.name} adlı kullanıcıyı silmek istediğinize emin misiniz?`}
        onConfirm={() => selectedUser && deleteMutation.mutate(selectedUser.id)}
      />

      <UserFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={selectedUser}
      />
    </div>
  )
} 