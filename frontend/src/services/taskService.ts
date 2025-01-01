import axios from "@/lib/axios"
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilter, TaskStatus } from "@/types/task"

const handleError = (error: any) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message)
  }
  throw new Error("Bir hata oluştu")
}

const taskService = {
  getTasks: async (filters?: TaskFilter) => {
    try {
      const response = await axios.get<Task[]>("/tasks", { params: filters })
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },

  getMyTasks: async (filters?: TaskFilter) => {
    try {
      const response = await axios.get<Task[]>("/tasks/my-tasks", { params: filters })
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },

  getTaskById: async (id: number) => {
    try {
      const response = await axios.get<Task>(`/tasks/${id}`)
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },

  createTask: async (data: CreateTaskRequest) => {
    try {
      const response = await axios.post<Task>("/tasks", data)
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },

  updateTask: async (id: number, data: UpdateTaskRequest) => {
    try {
      const response = await axios.put<Task>(`/tasks/${id}`, data)
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },

  updateTaskStatus: async (id: number, status: TaskStatus) => {
    try {
      const response = await axios.patch<Task>(`/tasks/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },

  deleteTask: async (id: number) => {
    try {
      const response = await axios.delete<void>(`/tasks/${id}`)
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },
}

export { taskService } 