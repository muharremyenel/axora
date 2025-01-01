import { Task, TaskPriority, TaskStatus } from "@/types/task"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

interface TaskTableProps {
  tasks: Task[]
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
}

const priorityColors = {
  [TaskPriority.LOW]: "bg-blue-100 text-blue-800",
  [TaskPriority.MEDIUM]: "bg-yellow-100 text-yellow-800",
  [TaskPriority.HIGH]: "bg-red-100 text-red-800",
}

const statusColors = {
  [TaskStatus.TODO]: "bg-gray-100 text-gray-800",
  [TaskStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800",
  [TaskStatus.DONE]: "bg-green-100 text-green-800",
}

const statusDisplayNames = {
  [TaskStatus.TODO]: "Yapılacak",
  [TaskStatus.IN_PROGRESS]: "Devam Ediyor",
  [TaskStatus.DONE]: "Tamamlandı",
}

const priorityDisplayNames = {
  [TaskPriority.LOW]: "Düşük",
  [TaskPriority.MEDIUM]: "Orta",
  [TaskPriority.HIGH]: "Yüksek",
}

export default function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50">
          <tr>
            <th scope="col" className="px-6 py-3">Başlık</th>
            <th scope="col" className="px-6 py-3">Durum</th>
            <th scope="col" className="px-6 py-3">Öncelik</th>
            <th scope="col" className="px-6 py-3">Atanan</th>
            <th scope="col" className="px-6 py-3">Teslim Tarihi</th>
            <th scope="col" className="px-6 py-3">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-b">
              <td className="px-6 py-4 font-medium">{task.title}</td>
              <td className="px-6 py-4">
                <Badge className={statusColors[task.status]}>
                  {statusDisplayNames[task.status]}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <Badge className={priorityColors[task.priority]}>
                  {priorityDisplayNames[task.priority]}
                </Badge>
              </td>
              <td className="px-6 py-4">
                {task.assignedUser?.name}
              </td>
              <td className="px-6 py-4">
                {formatDate(task.dueDate)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(task)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(task)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 