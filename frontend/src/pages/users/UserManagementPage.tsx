import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { userService } from "@/services/userService"
import { useAuthStore } from "@/store/useAuthStore"
import { User } from "@/types/auth"
import UserFormDialog from "@/components/users/UserFormDialog"
import DeleteDialog from "@/components/common/DeleteDialog"

export default function UserManagementPage() {
  const { isAdmin, isAuthenticated } = useAuthStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User>()
  const queryClient = useQueryClient()

  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
    enabled: isAuthenticated() && isAdmin(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setIsDeleteOpen(false)
      setSelectedUser(undefined)
    },
  })

  const handleCreate = () => {
    setSelectedUser(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  if (isError) {
    return <div>Hata: {(error as Error).message}</div>
  }

  if (!isAuthenticated() || !isAdmin()) {
    return <div>Bu sayfaya erişim yetkiniz yok</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kullanıcılar</h2>
          <p className="text-muted-foreground">
            Kullanıcıları yönetin
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kullanıcı
        </Button>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50">
            <tr>
              <th scope="col" className="px-6 py-3">Ad Soyad</th>
              <th scope="col" className="px-6 py-3">E-posta</th>
              <th scope="col" className="px-6 py-3">Rol</th>
              <th scope="col" className="px-6 py-3">Durum</th>
              <th scope="col" className="px-6 py-3">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <Badge variant={user.role === "ROLE_ADMIN" ? "default" : "secondary"}>
                    {user.role === "ROLE_ADMIN" ? "Admin" : "Kullanıcı"}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={user.active ? "default" : "destructive"}>
                    {user.active ? "Aktif" : "Pasif"}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                      Düzenle
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(user)}
                      className="text-destructive hover:text-destructive"
                      disabled={user.id === 1} // Admin kullanıcısını silmeyi engelle
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={selectedUser}
      />
      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={() => selectedUser && deleteMutation.mutate(selectedUser.id)}
        title="Kullanıcıyı Sil"
        description="Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve kullanıcıya atanmış görevler etkilenebilir."
        loading={deleteMutation.isPending}
      />
    </div>
  )
} 