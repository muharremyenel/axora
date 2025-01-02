export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE"
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH"
}

export interface Task {
  id: number
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
  categoryId: number
  category: string
  assignedUserId: number
  assignedUser: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskRequest {
  title: string
  description: string
  priority: TaskPriority
  dueDate: string
  categoryId: number
  assignedUserId: number
}

export interface UpdateTaskRequest extends CreateTaskRequest {}

export interface TaskFilter {
  status?: TaskStatus
  priority?: TaskPriority
  categoryId?: number
  assignedUserId?: number
} 