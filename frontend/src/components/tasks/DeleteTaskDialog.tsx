import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Task } from "@/types/task"
import { taskService } from "@/services/taskService"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task
}

export default function DeleteTaskDialog({
  open,
  onOpenChange,
  task,
}: DeleteTaskDialogProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => taskService.deleteTask(task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Görevi Sil</DialogTitle>
          <DialogDescription>
            "{task.title}" görevini silmek istediğinizden emin misiniz?
            Bu işlem geri alınamaz.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            İptal
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Siliniyor..." : "Sil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 