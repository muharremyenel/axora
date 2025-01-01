import { useMutation, useQueryClient } from "@tanstack/react-query"
import { taskService } from "@/services/taskService"
import { Task, TaskStatus } from "@/types/task"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TaskStatusSelectProps {
  task: Task
}

export default function TaskStatusSelect({ task }: TaskStatusSelectProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (status: TaskStatus) => taskService.updateTaskStatus(task.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  return (
    <Select
      defaultValue={task.status}
      onValueChange={(value) => mutation.mutate(value as TaskStatus)}
      disabled={mutation.isPending}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={TaskStatus.TODO}>Yapılacak</SelectItem>
        <SelectItem value={TaskStatus.IN_PROGRESS}>Devam Ediyor</SelectItem>
        <SelectItem value={TaskStatus.DONE}>Tamamlandı</SelectItem>
      </SelectContent>
    </Select>
  )
} 