import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuthStore } from "@/store/useAuthStore"
import { userService } from "@/services/userService"
import { User as UserIcon } from "lucide-react"
import ProfileFormDialog from "@/components/profile/ProfileFormDialog"
import ChangePasswordDialog from "@/components/profile/ChangePasswordDialog"

export default function ProfilePage() {
  const {} = useAuthStore()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userService.getProfile(),
  })

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  if (!user) {
    return <div>Kullanıcı bulunamadı</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profil</h2>
        <p className="text-muted-foreground">
          Profil bilgilerinizi görüntüleyin ve güncelleyin
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <UserIcon className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                {user.role === "ROLE_ADMIN" ? "Admin" : "Kullanıcı"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={() => setIsProfileOpen(true)}>
              Profili Düzenle
            </Button>
            <Button variant="outline" onClick={() => setIsPasswordOpen(true)}>
              Şifre Değiştir
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Hesap Bilgileri</h3>
          <div className="space-y-4">
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
      </div>

      <ProfileFormDialog
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        user={user}
      />
      <ChangePasswordDialog
        open={isPasswordOpen}
        onOpenChange={setIsPasswordOpen}
      />
    </div>
  )
} 