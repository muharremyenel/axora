import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Task, TaskStatus } from "@/types/task"
import { taskService } from "@/services/taskService"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface UpdateTaskStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task
}

export default function UpdateTaskStatusDialog({
  open,
  onOpenChange,
  task,
}: UpdateTaskStatusDialogProps) {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<TaskStatus>(task.status)

  const mutation = useMutation({
    mutationFn: () => taskService.updateTaskStatus(task.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      onOpenChange(false)
    },
  })

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Görev Durumunu Güncelle</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="font-medium">{task.title}</p>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>

          <Select
            value={status}
            onValueChange={(value) => setStatus(value as TaskStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Durum seçin" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TaskStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {getStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            İptal
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Güncelleniyor..." : "Güncelle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 