export enum UserRole {
  ROLE_USER = "ROLE_USER",
  ROLE_ADMIN = "ROLE_ADMIN",
}

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface RegisterResponse {
  token: string
  user: User
} 