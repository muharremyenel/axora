import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import NotificationDropdown from "@/components/notifications/NotificationDropdown"

export default function Navbar() {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {user?.name}
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <NotificationDropdown />
        </div>
      </div>
    </header>
  )
} 