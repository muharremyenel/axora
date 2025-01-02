import axios from "@/lib/axios"
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilter, TaskStatus } from "@/types/task"
import { CommentRequest, CommentResponse } from "@/types/comment"

const handleError = (error: any) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message)
  }
  throw new Error("Bir hata oluştu")
}

export const taskService = {
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

  getTaskComments: async (taskId: number) => {
    try {
      const response = await axios.get<CommentResponse[]>(`/api/tasks/${taskId}/comments`)
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },

  addComment: async (taskId: number, data: CommentRequest) => {
    try {
      const response = await axios.post<CommentResponse>(`/api/tasks/${taskId}/comments`, data)
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },

  deleteComment: async (taskId: number, commentId: number) => {
    try {
      await axios.delete(`/api/tasks/${taskId}/comments/${commentId}`)
    } catch (error) {
      throw handleError(error)
    }
  },

  updateComment: async (taskId: number, commentId: number, data: CommentRequest) => {
    try {
      const response = await axios.put<CommentResponse>(`/api/tasks/${taskId}/comments/${commentId}`, data)
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  }
} 