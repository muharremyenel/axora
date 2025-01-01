import axios from "@/lib/axios"
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/category"

const categoryService = {
  getCategories: () => {
    return axios.get<Category[]>("/categories").then((res) => res.data)
  },

  getCategoryById: (id: number) => {
    return axios.get<Category>(`/categories/${id}`).then((res) => res.data)
  },

  createCategory: (data: CreateCategoryRequest) => {
    return axios.post<Category>("/categories", data).then((res) => res.data)
  },

  updateCategory: (id: number, data: UpdateCategoryRequest) => {
    return axios.put<Category>(`/categories/${id}`, data).then((res) => res.data)
  },

  deleteCategory: (id: number) => {
    return axios.delete<void>(`/categories/${id}`).then((res) => res.data)
  },
}

export { categoryService } 