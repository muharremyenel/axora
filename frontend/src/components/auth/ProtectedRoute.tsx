import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, isAdmin } = useAuthStore()

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
} 