import { create } from "zustand"
import { User, UserRole } from "@/types/auth"

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  isAdmin: () => boolean
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
  token: localStorage.getItem("token"),
  setAuth: (user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", token)
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    set({ user: null, token: null })
    window.location.href = '/login'
  },
  isAdmin: () => {
    const user = get().user
    return user?.role === UserRole.ROLE_ADMIN
  },
  isAuthenticated: () => {
    const token = get().token
    const user = get().user
    return !!token && !!user
  },
})) 