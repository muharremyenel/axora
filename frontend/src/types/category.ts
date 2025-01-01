export interface Category {
  id: number
  name: string
  description: string
  colorCode: string
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  description: string
  colorCode: string
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {} 