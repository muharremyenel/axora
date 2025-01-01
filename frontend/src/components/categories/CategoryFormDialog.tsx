import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { categoryService } from "@/services/categoryService"
import { Category } from "@/types/category"

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
}

const categorySchema = z.object({
  name: z.string().min(1, "Kategori adı zorunludur"),
  description: z.string().min(1, "Açıklama zorunludur"),
  colorCode: z.string().min(1, "Renk seçimi zorunludur"),
})

type CategoryForm = z.infer<typeof categorySchema>

export default function CategoryFormDialog({ open, onOpenChange, category }: CategoryFormDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    values: category ? {
      name: category.name,
      description: category.description,
      colorCode: category.colorCode
    } : {
      name: "",
      description: "",
      colorCode: "#000000"
    }
  })

  const createMutation = useMutation({
    mutationFn: (data: CategoryForm) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      onOpenChange(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryForm }) => 
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      onOpenChange(false)
    },
  })

  const onSubmit = (data: CategoryForm) => {
    if (category) {
      updateMutation.mutate({ id: category.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Kategori Düzenle" : "Yeni Kategori"}
          </DialogTitle>
          <DialogDescription>
            {category ? "Kategori bilgilerini güncelleyin" : "Yeni bir kategori oluşturun"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...form.register("name")}
              placeholder="Kategori adı"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Textarea
              {...form.register("description")}
              placeholder="Kategori açıklaması"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div>
            <Input
              {...form.register("colorCode")}
              type="color"
            />
            {form.formState.errors.colorCode && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.colorCode.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              {category ? "Güncelle" : "Oluştur"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 