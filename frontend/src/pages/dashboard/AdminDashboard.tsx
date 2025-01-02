import { useQuery } from "@tanstack/react-query"
import { Users, CheckSquare, FolderKanban, Users2 } from "lucide-react"
import StatsCard from "@/components/dashboard/StatsCard"
import { userService } from "@/services/userService"
import { taskService } from "@/services/taskService"
import { categoryService } from "@/services/categoryService"
import { teamService } from "@/services/teamService"
import { TaskStatus } from "@/types/task"

export default function AdminDashboard() {
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  })

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => taskService.getTasks(),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  })

  const { data: teams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: () => teamService.getTeams(),
  })

  const activeTasks = tasks.filter(task => task.status !== TaskStatus.DONE)
  const thisMonth = new Date()
  const tasksThisMonth = tasks.filter(task => {
    const createdDate = new Date(task.createdAt)
    return createdDate.getMonth() === thisMonth.getMonth()
  })

  const activeTeams = teams.filter(team => team.active)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
          Yönetim Paneli
        </h2>
        <p className="text-muted-foreground">Sistem geneli istatistikler ve metrikler</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Toplam Kullanıcı"
          value={users.length}
          icon={Users}
          className="bg-white/50 backdrop-blur-lg border-white/20 shadow-lg hover:shadow-xl transition-all"
        />
        <StatsCard
          title="Aktif Görevler"
          value={activeTasks.length}
          icon={CheckSquare}
          description="Bu ay oluşturulan"
          trend={{ value: tasksThisMonth.length, isPositive: true }}
        />
        <StatsCard
          title="Kategoriler"
          value={categories.length}
          icon={FolderKanban}
        />
        <StatsCard
          title="Takımlar"
          value={teams.length}
          icon={Users2}
          description={`${activeTeams.length} aktif takım`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <div className="rounded-lg border bg-card">
            <div className="flex items-center justify-between p-6">
              <h3 className="text-lg font-medium">Son Eklenen Kullanıcılar</h3>
            </div>
            <div className="p-6 pt-0">
              {users.length > 0 ? (
                <div className="space-y-4">
                  {users
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map(user => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Henüz veri yok
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="rounded-lg border bg-card">
            <div className="flex items-center justify-between p-6">
              <h3 className="text-lg font-medium">Görev Durumları</h3>
            </div>
            <div className="p-6 pt-0">
              {tasks.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>Yapılacak</div>
                    <div className="font-medium">
                      {tasks.filter(t => t.status === TaskStatus.TODO).length}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Devam Eden</div>
                    <div className="font-medium">
                      {tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Tamamlanan</div>
                    <div className="font-medium">
                      {tasks.filter(t => t.status === TaskStatus.DONE).length}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Henüz veri yok
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 