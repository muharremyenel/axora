import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQuery } from "@tanstack/react-query"
import { TaskPriority, TaskStatus, TaskFilter } from "@/types/task"
import { categoryService } from "@/services/categoryService"
import { userService } from "@/services/userService"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { ControllerRenderProps } from "react-hook-form"

interface TaskFiltersProps {
  onFilter: (filters: TaskFilter) => void
}

const taskFilterSchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  categoryId: z.string().optional(),
  assignedUserId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

type TaskFilterValues = z.infer<typeof taskFilterSchema>

export default function TaskFilters({ onFilter }: TaskFiltersProps) {
  const form = useForm<TaskFilterValues>({
    resolver: zodResolver(taskFilterSchema),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  })

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  })

  const onSubmit = (data: TaskFilterValues) => {
    const filters: TaskFilter = {}
    if (data.status) filters.status = data.status as TaskStatus
    if (data.priority) filters.priority = data.priority as TaskPriority
    if (data.categoryId) filters.categoryId = parseInt(data.categoryId)
    if (data.assignedUserId) filters.assignedUserId = parseInt(data.assignedUserId)
    if (data.startDate) filters.startDate = data.startDate
    if (data.endDate) filters.endDate = data.endDate
    onFilter(filters)
  }

  const clearFilters = () => {
    form.reset()
    onFilter({})
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        <FormField
          control={form.control}
          name="status"
          render={({ field }: { field: ControllerRenderProps<TaskFilterValues, "status"> }) => (
            <FormItem>
              <FormLabel>Durum</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(TaskStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }: { field: ControllerRenderProps<TaskFilterValues, "priority"> }) => (
            <FormItem>
              <FormLabel>Öncelik</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(TaskPriority).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {getPriorityLabel(priority)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }: { field: ControllerRenderProps<TaskFilterValues, "categoryId"> }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignedUserId"
          render={({ field }: { field: ControllerRenderProps<TaskFilterValues, "assignedUserId"> }) => (
            <FormItem>
              <FormLabel>Atanan Kullanıcı</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }: { field: ControllerRenderProps<TaskFilterValues, "startDate"> }) => (
            <FormItem>
              <FormLabel>Başlangıç Tarihi</FormLabel>
              <FormControl>
                <input
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }: { field: ControllerRenderProps<TaskFilterValues, "endDate"> }) => (
            <FormItem>
              <FormLabel>Bitiş Tarihi</FormLabel>
              <FormControl>
                <input
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-end gap-2 col-span-full">
          <Button type="submit">Filtrele</Button>
          <Button
            type="button"
            variant="outline"
            onClick={clearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Temizle
          </Button>
        </div>
      </form>
    </Form>
  )
} 