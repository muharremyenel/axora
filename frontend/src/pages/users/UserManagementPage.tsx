import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { userService } from "@/services/userService"
import { useAuthStore } from "@/store/useAuthStore"
import { useState } from "react"
import { User } from "@/types/auth"
import UserFormDialog from "@/components/users/UserFormDialog"

export default function UserManagementPage() {
  const { isAdmin, isAuthenticated } = useAuthStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User>()

  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
    enabled: isAuthenticated() && isAdmin(),
  })

  const handleCreate = () => {
    setSelectedUser(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsFormOpen(true)
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
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                    Düzenle
                  </Button>
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
    </div>
  )
} 