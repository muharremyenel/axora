import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-72">
        <Navbar />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 