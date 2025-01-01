import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Category } from "@/types/category"
import { categoryService } from "@/services/categoryService"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category
}

export default function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
}: DeleteCategoryDialogProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => categoryService.deleteCategory(category.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kategoriyi Sil</DialogTitle>
          <DialogDescription>
            "{category.name}" kategorisini silmek istediğinizden emin misiniz?
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