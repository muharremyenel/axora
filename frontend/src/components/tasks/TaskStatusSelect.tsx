import { useMutation, useQueryClient } from "@tanstack/react-query"
import { taskService } from "@/services/taskService"
import { Task, TaskStatus } from "@/types/task"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface TaskStatusSelectProps {
  task: Task
}

export default function TaskStatusSelect({ task }: TaskStatusSelectProps) {
  const queryClient = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(task.status)
  const [isChanged, setIsChanged] = useState(false)

  const mutation = useMutation({
    mutationFn: (status: TaskStatus) => taskService.updateTaskStatus(task.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      setIsChanged(false)
    },
  })

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as TaskStatus)
    setIsChanged(true)
  }

  return (
    <div className="flex gap-2 items-center">
      <Select
        value={selectedStatus}
        onValueChange={handleStatusChange}
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
      {isChanged && (
        <Button 
          size="sm" 
          onClick={() => mutation.mutate(selectedStatus)}
          disabled={mutation.isPending}
        >
          Güncelle
        </Button>
      )}
    </div>
  )
} 