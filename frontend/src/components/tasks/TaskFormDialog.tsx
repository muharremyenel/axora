import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { taskService } from "@/services/taskService"
import { categoryService } from "@/services/categoryService"
import { userService } from "@/services/userService"
import { Task, TaskPriority } from "@/types/task"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarIcon, AlertCircle } from "lucide-react"


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

  const form = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    values: task ? {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      categoryId: task.categoryId,
      assignedUserId: task.assignedUserId
    } : {
      title: "",
      description: "",
      priority: TaskPriority.MEDIUM,
      dueDate: "",
      categoryId: 0,
      assignedUserId: 0
    }
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {task ? "Görevi Düzenle" : "Yeni Görev"}
          </DialogTitle>
          <DialogDescription>
            {task ? "Görev bilgilerini güncelleyin" : "Yeni bir görev oluşturun"}. Tüm zorunlu alanları (*) doldurun.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sol Kolon */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Görev Başlığı <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...form.register("title")}
                    placeholder="Örn: Rapor hazırlama"
                    className={cn(
                      "w-full",
                      form.formState.errors.title && "border-destructive"
                    )}
                  />
                  {form.formState.errors.title && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>{form.formState.errors.title.message}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Açıklama <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    {...form.register("description")}
                    placeholder="Görev detaylarını yazın..."
                    className="min-h-[120px]"
                  />
                  {form.formState.errors.description && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>{form.formState.errors.description.message}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Teslim Tarihi <span className="text-destructive">*</span>
                  </label>
                  <Controller
                    name="dueDate"
                    control={form.control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(new Date(field.value), "PPP", { locale: tr })
                            ) : (
                              <span>Tarih seçin</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[280px] p-0" side="bottom" align="start" sideOffset={4}>
                          <Calendar
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={(date) => field.onChange(date?.toISOString())}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
              </div>

              {/* Sağ Kolon */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Öncelik <span className="text-destructive">*</span>
                  </label>
                  <Controller
                    name="priority"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue>
                            {field.value && (
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    field.value === TaskPriority.HIGH
                                      ? "destructive"
                                      : field.value === TaskPriority.MEDIUM
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {field.value === TaskPriority.HIGH
                                    ? "Yüksek"
                                    : field.value === TaskPriority.MEDIUM
                                    ? "Orta"
                                    : "Düşük"}
                                </Badge>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TaskPriority.LOW}>
                            <Badge variant="secondary">Düşük</Badge>
                          </SelectItem>
                          <SelectItem value={TaskPriority.MEDIUM}>
                            <Badge>Orta</Badge>
                          </SelectItem>
                          <SelectItem value={TaskPriority.HIGH}>
                            <Badge variant="destructive">Yüksek</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Kategori <span className="text-destructive">*</span>
                  </label>
                  <Controller
                    name="categoryId"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Atanan Kullanıcı <span className="text-destructive">*</span>
                  </label>
                  <Controller
                    name="assignedUserId"
                    control={form.control}
                    render={({ field }) => {
                      const [searchTerm, setSearchTerm] = React.useState("");
                      const filteredUsers = users.filter(user => 
                        user.name.toLowerCase().includes(searchTerm.toLowerCase())
                      );

                      return (
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Kullanıcı seçin">
                              {field.value ? users.find((user) => user.id === field.value)?.name : "Kullanıcı seçin"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <div className="flex items-center px-2 pb-1.5">
                              <Input
                                placeholder="Kullanıcı ara..."
                                className="h-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                            {filteredUsers.length === 0 ? (
                              <div className="text-sm text-muted-foreground text-center py-2">
                                Kullanıcı bulunamadı
                              </div>
                            ) : (
                              filteredUsers.map((user) => (
                                <SelectItem
                                  key={user.id}
                                  value={user.id.toString()}
                                >
                                  {user.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
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
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Kaydediliyor...
                </>
              ) : task ? (
                "Güncelle"
              ) : (
                "Oluştur"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 