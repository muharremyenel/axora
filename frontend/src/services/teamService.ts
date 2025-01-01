import axios from "@/lib/axios"
import { Team, CreateTeamRequest, UpdateTeamRequest } from "@/types/team"

const teamService = {
  getTeams: () => {
    return axios.get<Team[]>("/api/teams").then((res) => res.data)
  },

  getTeamById: (id: number) => {
    return axios.get<Team>(`/api/teams/${id}`).then((res) => res.data)
  },

  createTeam: (data: CreateTeamRequest) => {
    return axios.post<Team>("/api/teams", data).then((res) => res.data)
  },

  updateTeam: (id: number, data: UpdateTeamRequest) => {
    return axios.put<Team>(`/api/teams/${id}`, data).then((res) => res.data)
  },

  deleteTeam: (id: number) => {
    return axios.delete<void>(`/api/teams/${id}`).then((res) => res.data)
  },
}

export { teamService } 