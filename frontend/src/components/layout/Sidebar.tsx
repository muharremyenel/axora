import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/useAuthStore"
import { CheckSquare, FolderKanban, LayoutDashboard, Users, UserCog, LogOut, User } from "lucide-react"

export default function Sidebar() {
  const location = useLocation()
  const { isAdmin, logout } = useAuthStore()

  const userNavItems = [
    { title: "Dashboard", href: "/", icon: LayoutDashboard },
    { title: "Görevler", href: "/tasks", icon: CheckSquare },
    { title: "Takımlar", href: "/teams", icon: Users },
    { title: "Profil", href: "/profile", icon: User },
  ]

  const adminNavItems = [
    { title: "Dashboard", href: "/", icon: LayoutDashboard },
    { title: "Görevler", href: "/tasks", icon: CheckSquare },
    { title: "Kategoriler", href: "/categories", icon: FolderKanban },
    { title: "Takımlar", href: "/teams", icon: Users },
    { title: "Kullanıcı Yönetimi", href: "/admin/users", icon: UserCog },
    { title: "Profil", href: "/profile", icon: User },
  ]

  const navItems = isAdmin() ? adminNavItems : userNavItems

  const handleLogout = async () => {
    logout()
  }

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-2xl font-bold">Axora</h2>
      </div>
      <div className="flex flex-col h-[calc(100vh-4rem)] p-4">
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
        <div className="border-t pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </Button>
        </div>
      </div>
    </div>
  )
} 