import axios from "@/lib/axios"
import { User } from "@/types/auth"

const handleError = (error: any) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message)
  }
  throw new Error("Bir hata oluştu")
}

const userService = {
  getUsers: async () => {
    try {
      const response = await axios.get<User[]>("/users")
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },

  getUserById: async (id: number) => {
    try {
      const response = await axios.get<User>(`/users/${id}`)
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },

  createUser: async (data: Omit<User, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await axios.post<User>("/users", data)
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },

  updateUser: async (id: number, data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>) => {
    try {
      const response = await axios.put<User>(`/users/${id}`, data)
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },
}

export { userService } 