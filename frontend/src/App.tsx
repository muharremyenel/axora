import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "sonner"
import LoginPage from "./pages/auth/LoginPage"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import MainLayout from "./components/layout/MainLayout"
import DashboardPage from "./pages/dashboard/DashboardPage"
import TasksPage from "./pages/tasks/TasksPage"
import CategoriesPage from "./pages/categories/CategoriesPage"
import TeamsPage from "./pages/teams/TeamsPage"
import TeamDetailsPage from "./pages/teams/TeamDetailsPage"
import UserManagementPage from "./pages/users/UserManagementPage"
import ProfilePage from "./pages/profile/ProfilePage"
import { useAuthStore } from "./store/useAuthStore"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage"
import TaskDetailPage from "@/pages/tasks/TaskDetailPage"

const queryClient = new QueryClient()

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  //const isAdmin = useAuthStore((state) => state.isAdmin)

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              isAuthenticated() ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage />
              )
            }
          />
          
          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Admin routes */}
            <Route
              path="/categories"
              element={
                <ProtectedRoute requireAdmin>
                  <CategoriesPage />
                </ProtectedRoute>
              }
            />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:id" element={<TeamDetailsPage />} />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster richColors position="top-right" />
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default App 