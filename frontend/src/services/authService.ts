import axios from "@/lib/axios"
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/types/auth"

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
}

const authService = {
  login: (data: LoginRequest) => {
    return axios.post<LoginResponse>("/auth/login", data).then((res) => res.data)
  },

  register: (data: RegisterRequest) => {
    return axios.post<RegisterResponse>("/auth/register", data).then((res) => res.data)
  },

  forgotPassword: (data: ForgotPasswordRequest) => {
    return axios.post("/auth/forgot-password", data).then((res) => res.data)
  },

  resetPassword: (data: ResetPasswordRequest) => {
    return axios.post("/auth/reset-password", data).then((res) => res.data)
  }
}

export { authService } 