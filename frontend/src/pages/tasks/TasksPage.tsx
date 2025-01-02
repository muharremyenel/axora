import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { taskService } from "@/services/taskService"
import { useAuthStore } from "@/store/useAuthStore"
import { Task } from "@/types/task"
import TaskStatusSelect from "@/components/tasks/TaskStatusSelect"
import TaskFormDialog from "@/components/tasks/TaskFormDialog"
import DeleteDialog from "@/components/common/DeleteDialog"
import { useNavigate } from "react-router-dom"

export default function TasksPage() {
  const { isAdmin, isAuthenticated } = useAuthStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task>()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: tasks = [], isLoading, isError, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => isAdmin() ? taskService.getTasks() : taskService.getMyTasks(),
    enabled: isAuthenticated(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      setIsDeleteOpen(false)
      setSelectedTask(undefined)
    },
  })

  const handleCreate = () => {
    setSelectedTask(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (task: Task) => {
    setSelectedTask(task)
    setIsFormOpen(true)
  }

  const handleDelete = (task: Task) => {
    setSelectedTask(task)
    setIsDeleteOpen(true)
  }

  const handleRowClick = (task: Task) => {
    navigate(`/tasks/${task.id}`);
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  if (isError) {
    return <div>Hata: {(error as Error).message}</div>
  }

  if (!isAuthenticated()) {
    return <div>Lütfen giriş yapın</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Görevler</h2>
          <p className="text-muted-foreground">
            {isAdmin() ? "Tüm görevleri yönetin" : "Görevlerinizi yönetin"}
          </p>
        </div>
        {isAdmin() && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Görev
          </Button>
        )}
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50">
            <tr>
              <th scope="col" className="px-6 py-3">Başlık</th>
              <th scope="col" className="px-6 py-3">Açıklama</th>
              {isAdmin() && <th scope="col" className="px-6 py-3">Atanan</th>}
              {isAdmin() && <th scope="col" className="px-6 py-3">Kategori</th>}
              <th scope="col" className="px-6 py-3">Öncelik</th>
              <th scope="col" className="px-6 py-3">Durum</th>
              <th scope="col" className="px-6 py-3">Teslim Tarihi</th>
              {isAdmin() && <th scope="col" className="px-6 py-3">İşlemler</th>}
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task) => (
              <tr 
                key={task.id}
                onClick={() => handleRowClick(task)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <td className="px-6 py-4 font-medium">{task.title}</td>
                <td className="px-6 py-4">{task.description}</td>
                {isAdmin() && <td className="px-6 py-4">{task.assignedUser || '-'}</td>}
                {isAdmin() && <td className="px-6 py-4">{task.category || '-'}</td>}
                <td className="px-6 py-4">
                  <Badge variant={
                    task.priority === "HIGH" ? "destructive" :
                    task.priority === "MEDIUM" ? "default" :
                    "secondary"
                  }>
                    {task.priority === "HIGH" ? "Yüksek" :
                     task.priority === "MEDIUM" ? "Orta" :
                     "Düşük"}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <TaskStatusSelect task={task} />
                </td>
                <td className="px-6 py-4">{task.dueDate}</td>
                {isAdmin() && (
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(task);
                        }}
                      >
                        Düzenle
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(task);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdmin() && (
        <>
          <TaskFormDialog
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            task={selectedTask}
          />
          <DeleteDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onConfirm={() => selectedTask && deleteMutation.mutate(selectedTask.id)}
            title="Görevi Sil"
            description="Bu görevi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
            loading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  )
} 