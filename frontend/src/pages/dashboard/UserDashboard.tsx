import { useQuery } from "@tanstack/react-query"
import { CheckSquare, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import StatsCard from "@/components/dashboard/StatsCard"
import { taskService } from "@/services/taskService"
import { TaskStatus } from "@/types/task"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

export default function UserDashboard() {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", "my"],
    queryFn: () => taskService.getMyTasks(),
  })

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  const activeTasks = tasks.filter(task => task.status !== TaskStatus.DONE)
  const upcomingTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7)
    return task.status !== TaskStatus.DONE && dueDate <= nextWeek
  })
  const overdueTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    return task.status !== TaskStatus.DONE && dueDate < today
  })
  const completedTasks = tasks.filter(task => task.status === TaskStatus.DONE)

  const thisMonth = new Date()
  const completedThisMonth = completedTasks.filter(task => {
    const completedDate = new Date(task.updatedAt)
    return completedDate.getMonth() === thisMonth.getMonth()
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Görevleriniz ve performans metrikleriniz
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Aktif Görevler"
          value={activeTasks.length}
          icon={CheckSquare}
          description="Devam eden"
        />
        <StatsCard
          title="Yaklaşan Teslim"
          value={upcomingTasks.length}
          icon={Clock}
          description="Bu hafta"
          trend={upcomingTasks.length > 0 ? { value: upcomingTasks.length, isPositive: false } : undefined}
        />
        <StatsCard
          title="Geciken"
          value={overdueTasks.length}
          icon={AlertCircle}
          trend={overdueTasks.length > 0 ? { value: overdueTasks.length, isPositive: false } : undefined}
        />
        <StatsCard
          title="Tamamlanan"
          value={completedThisMonth.length}
          icon={CheckCircle2}
          description="Bu ay"
          trend={completedThisMonth.length > 0 ? { value: completedThisMonth.length, isPositive: true } : undefined}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Aktif Görevlerim</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeTasks.length > 0 ? (
                  activeTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-4">
                      <Badge variant={
                        task.status === TaskStatus.IN_PROGRESS ? "default" : "secondary"
                      }>
                        {task.status === TaskStatus.IN_PROGRESS ? "Devam Ediyor" : "Yapılacak"}
                      </Badge>
                      <div className="flex-1">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(task.dueDate)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Henüz aktif görev yok
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Yaklaşan Teslimler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-4">
                      <Badge variant={
                        new Date(task.dueDate) < new Date() ? "destructive" : "default"
                      }>
                        {formatDate(task.dueDate)}
                      </Badge>
                      <div className="flex-1">
                        <div className="font-medium">{task.title}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Yaklaşan teslim tarihi yok
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 