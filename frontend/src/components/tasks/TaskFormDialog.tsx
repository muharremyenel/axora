import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { taskService } from "@/services/taskService"
import { categoryService } from "@/services/categoryService"
import { userService } from "@/services/userService"
import { Task, TaskPriority } from "@/types/task"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const taskSchema = z.object({
  title: z.string().min(3, "En az 3 karakter olmalıdır"),
  description: z.string().min(3, "En az 3 karakter olmalıdır"),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z.string(),
  categoryId: z.number().min(1, "Kategori seçilmeli"),
  assignedUserId: z.number().min(1, "Kullanıcı seçilmeli"),
})

type TaskForm = z.infer<typeof taskSchema>

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task
}

export default function TaskFormDialog({ open, onOpenChange, task }: TaskFormDialogProps) {
  const queryClient = useQueryClient()

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  })

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  })

  const { control, register, handleSubmit, formState: { errors } } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      categoryId: task.categoryId,
      assignedUserId: task.assignedUserId,
    } : {
      priority: TaskPriority.MEDIUM,
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: TaskForm) => taskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      onOpenChange(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskForm }) => 
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      onOpenChange(false)
    },
  })

  const onSubmit = (data: TaskForm) => {
    if (task) {
      updateMutation.mutate({ 
        id: task.id, 
        data: {
          ...data,
          categoryId: data.categoryId,
          assignedUserId: data.assignedUserId,
        }
      })
    } else {
      createMutation.mutate({
        ...data,
        categoryId: data.categoryId,
        assignedUserId: data.assignedUserId,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {task ? "Görevi Düzenle" : "Yeni Görev"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("title")}
              placeholder="Görev başlığı"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Textarea
              {...register("description")}
              placeholder="Görev açıklaması"
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Öncelik seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskPriority.LOW}>Düşük</SelectItem>
                    <SelectItem value={TaskPriority.MEDIUM}>Orta</SelectItem>
                    <SelectItem value={TaskPriority.HIGH}>Yüksek</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && (
              <p className="text-sm text-destructive mt-1">{errors.priority.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-sm text-destructive mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="assignedUserId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kullanıcı seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.assignedUserId && (
              <p className="text-sm text-destructive mt-1">{errors.assignedUserId.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register("dueDate")}
              type="date"
            />
            {errors.dueDate && (
              <p className="text-sm text-destructive mt-1">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Kaydediliyor..."
                : task ? "Güncelle" : "Oluştur"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 