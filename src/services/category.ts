import type { Category } from "../domain/category/category.js"
import type { CategoryRepository } from "../domain/category/repository.js"
import type { CategoryService } from './types.js'
export function createCategoryService(categoryRepository: CategoryRepository) {
    async function getAllCategories(): Promise<Category[]> {
        return categoryRepository.getAllCategories()
    }

    async function getCategoryById(id: number): Promise<Category | null> {
        return categoryRepository.getCategoryById(id)
    }

    async function createCategory(input: Omit<Category, 'id'>): Promise<Category> {
        return categoryRepository.createCategory(input)
    }
    return { getAllCategories, getCategoryById, createCategory }
}