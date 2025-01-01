import axios from "@/lib/axios"
import { User } from "@/types/user"

export const userService = {
  getUsers: async () => {
    const response = await axios.get<User[]>("/api/users")
    return response.data
  },

  getUserById: async (id: number) => {
    const response = await axios.get<User>(`/api/users/${id}`)
    return response.data
  },

  createUser: async (data: Omit<User, "id" | "createdAt" | "updatedAt">) => {
    const response = await axios.post<User>("/api/users", data)
    return response.data
  },

  updateUser: async (id: number, data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>) => {
    const response = await axios.put<User>(`/api/users/${id}`, data)
    return response.data
  },

  deleteUser: async (id: number) => {
    const response = await axios.delete<void>(`/api/users/${id}`)
    return response.data
  },

  // Profil yönetimi için yeni metodlar
  getProfile: async () => {
    const response = await axios.get<User>("/api/users/profile")
    return response.data
  },

  updateProfile: async (data: { name: string; email: string }) => {
    const response = await axios.put<User>("/api/users/profile", data)
    return response.data
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await axios.put<void>("/api/users/profile/password", data)
    return response.data
  },
} 