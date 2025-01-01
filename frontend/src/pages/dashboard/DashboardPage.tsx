import { useAuthStore } from "@/store/useAuthStore"
import AdminDashboard from "./AdminDashboard"
import UserDashboard from "./UserDashboard"

export default function DashboardPage() {
  const { isAdmin } = useAuthStore()

  return isAdmin() ? <AdminDashboard /> : <UserDashboard />
} 