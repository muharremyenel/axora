import axios from "@/lib/axios"
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/types/auth"

const authService = {
  login: (data: LoginRequest) => {
    return axios.post<LoginResponse>("/auth/login", data).then((res) => res.data)
  },

  register: (data: RegisterRequest) => {
    return axios.post<RegisterResponse>("/auth/register", data).then((res) => res.data)
  },
}

export { authService } 