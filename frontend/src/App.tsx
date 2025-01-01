import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import LoginPage from "./pages/auth/LoginPage"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import MainLayout from "./components/layout/MainLayout"
import DashboardPage from "./pages/dashboard/DashboardPage"
import TasksPage from "./pages/tasks/TasksPage"
import CategoriesPage from "./pages/categories/CategoriesPage"
import UserManagementPage from "./pages/users/UserManagementPage"
import { useAuthStore } from "./store/useAuthStore"

const queryClient = new QueryClient()

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

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
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/teams" element={<div>Teams Page</div>} />
            
            {/* Admin routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default App 