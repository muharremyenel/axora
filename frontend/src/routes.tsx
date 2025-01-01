import { createBrowserRouter } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import DashboardPage from "./pages/DashboardPage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import TasksPage from "./pages/tasks/TasksPage"
import CategoriesPage from "./pages/categories/CategoriesPage"
import TeamsPage from "./pages/teams/TeamsPage"
import UserManagementPage from "./pages/users/UserManagementPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "tasks",
        element: <TasksPage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "teams",
        element: <TeamsPage />,
      },
      {
        path: "admin/users",
        element: <UserManagementPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]) 