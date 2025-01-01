import { User } from "./auth"

export interface Team {
  id: number
  name: string
  description?: string
  members: User[]
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTeamRequest {
  name: string
  description?: string
  memberIds: number[]
}

export interface UpdateTeamRequest extends CreateTeamRequest {} 