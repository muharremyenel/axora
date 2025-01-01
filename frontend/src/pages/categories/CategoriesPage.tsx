import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { categoryService } from "@/services/categoryService"
import { useAuthStore } from "@/store/useAuthStore"
import { Category } from "@/types/category"
import CategoryFormDialog from "@/components/categories/CategoryFormDialog"
import DeleteDialog from "@/components/common/DeleteDialog"

export default function CategoriesPage() {
  const { isAdmin, isAuthenticated } = useAuthStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category>()
  const queryClient = useQueryClient()

  const { data: categories = [], isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
    enabled: isAuthenticated(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      setIsDeleteOpen(false)
      setSelectedCategory(undefined)
    },
  })

  const handleCreate = () => {
    setSelectedCategory(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsFormOpen(true)
  }

  const handleDelete = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteOpen(true)
  }

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  if (isError) {
    return <div>Hata: {(error as Error).message}</div>
  }

  if (!isAuthenticated() || !isAdmin()) {
    return <div>Bu sayfaya erişim yetkiniz yok</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kategoriler</h2>
          <p className="text-muted-foreground">
            Görev kategorilerini yönetin
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kategori
        </Button>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50">
            <tr>
              <th scope="col" className="px-6 py-3">Ad</th>
              <th scope="col" className="px-6 py-3">Açıklama</th>
              <th scope="col" className="px-6 py-3">Renk</th>
              <th scope="col" className="px-6 py-3">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <tr key={category.id} className="border-b">
                <td className="px-6 py-4 font-medium">{category.name}</td>
                <td className="px-6 py-4">{category.description}</td>
                <td className="px-6 py-4">
                  <div 
                    className="w-6 h-6 rounded" 
                    style={{ backgroundColor: category.colorCode }}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                      Düzenle
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(category)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CategoryFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        category={selectedCategory}
      />
      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={() => selectedCategory && deleteMutation.mutate(selectedCategory.id)}
        title="Kategoriyi Sil"
        description="Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve bu kategoriye ait görevler etkilenebilir."
        loading={deleteMutation.isPending}
      />
    </div>
  )
} 