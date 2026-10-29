import type { Category } from './category.js'

export interface CategoryRepository {
    getAllCategories(): Promise<Category[]>
    getCategoryById(id: number): Promise<Category | null>
    createCategory(input: Omit<Category, 'id'>): Promise<Category>
}