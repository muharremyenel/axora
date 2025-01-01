export type User = {
  id: number
  name: string
  email: string
  role: "ROLE_ADMIN" | "ROLE_USER"
  active: boolean
  createdAt: string
  updatedAt?: string
} 