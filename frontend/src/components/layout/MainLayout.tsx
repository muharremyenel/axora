import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import { useWebSocket } from '@/hooks/useWebSocket';

export default function MainLayout() {
  useWebSocket();
  
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