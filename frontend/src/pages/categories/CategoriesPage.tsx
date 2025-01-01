import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { categoryService } from "@/services/categoryService"
import { useAuthStore } from "@/store/useAuthStore"
import { useState } from "react"
import { Category } from "@/types/category"
import CategoryFormDialog from "@/components/categories/CategoryFormDialog"

export default function CategoriesPage() {
  const { isAdmin, isAuthenticated } = useAuthStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category>()

  const { data: categories = [], isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
    enabled: isAuthenticated(),
  })

  const handleCreate = () => {
    setSelectedCategory(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsFormOpen(true)
  }

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  if (isError) {
    return <div>Hata: {(error as Error).message}</div>
  }

  if (!isAuthenticated()) {
    return <div>Lütfen giriş yapın</div>
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
        {isAdmin() && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Kategori
          </Button>
        )}
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50">
            <tr>
              <th scope="col" className="px-6 py-3">Kategori</th>
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
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: category.colorCode }}
                  />
                </td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                    Düzenle
                  </Button>
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
    </div>
  )
} 