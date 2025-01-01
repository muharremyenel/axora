import { useQuery } from "@tanstack/react-query"
import { taskService } from "@/services/taskService"
import { useAuthStore } from "@/store/useAuthStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TaskStatus, TaskPriority } from "@/types/task"
import { formatDate } from "@/lib/utils"

export default function DashboardPage() {
  const { isAdmin } = useAuthStore()

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => isAdmin()
      ? taskService.getTasks()
      : taskService.getMyTasks(),
  })

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return "bg-gray-500/10 text-gray-500"
      case TaskStatus.IN_PROGRESS:
        return "bg-blue-500/10 text-blue-500"
      case TaskStatus.DONE:
        return "bg-green-500/10 text-green-500"
    }
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return "bg-green-500/10 text-green-500"
      case TaskPriority.MEDIUM:
        return "bg-yellow-500/10 text-yellow-500"
      case TaskPriority.HIGH:
        return "bg-red-500/10 text-red-500"
    }
  }

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return "Yapılacak"
      case TaskStatus.IN_PROGRESS:
        return "Devam Ediyor"
      case TaskStatus.DONE:
        return "Tamamlandı"
    }
  }

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return "Düşük"
      case TaskPriority.MEDIUM:
        return "Orta"
      case TaskPriority.HIGH:
        return "Yüksek"
    }
  }

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  const tasksByStatus = tasks?.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1
    return acc
  }, {} as Record<TaskStatus, number>) || {}

  const tasksByPriority = tasks?.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1
    return acc
  }, {} as Record<TaskPriority, number>) || {}

  const upcomingTasks = tasks
    ?.filter(task => task.status !== TaskStatus.DONE)
    ?.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    ?.slice(0, 5) || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          {isAdmin() ? "Tüm görevlerin durumunu görüntüleyin" : "Görevlerinizin durumunu görüntüleyin"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Görev
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks?.length || 0}</div>
          </CardContent>
        </Card>

        {Object.values(TaskStatus).map((status) => (
          <Card key={status}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {getStatusLabel(status)}
              </CardTitle>
              <Badge className={getStatusColor(status)}>
                {tasksByStatus[status] || 0}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks?.length ? ((tasksByStatus[status] || 0) / tasks.length * 100).toFixed(0) : 0}%
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Öncelik Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.values(TaskPriority).map((priority) => (
                <div key={priority} className="flex items-center gap-4">
                  <Badge className={getPriorityColor(priority)}>
                    {getPriorityLabel(priority)}
                  </Badge>
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full ${getPriorityColor(priority)}`}
                        style={{
                          width: `${tasks?.length ? ((tasksByPriority[priority] || 0) / tasks.length * 100).toFixed(0) : 0}%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-10 text-right">
                    {tasksByPriority[priority] || 0}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yaklaşan Görevler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-4">
                  <Badge className={getStatusColor(task.status)}>
                    {getStatusLabel(task.status)}
                  </Badge>
                  <div className="flex-1">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(task.dueDate)}
                    </div>
                  </div>
                  <Badge className={getPriorityColor(task.priority)}>
                    {getPriorityLabel(task.priority)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 