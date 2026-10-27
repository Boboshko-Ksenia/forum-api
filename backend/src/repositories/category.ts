import type { Category } from "../domain/category/category"
import { db } from "../prisma/db"
import type { CategoryRepository } from "../domain/category/repository.js"

export function createCategoryRepository(db: any): CategoryRepository {
    async function getAllCategories(): Promise<Category[]> {
        const categories = await db.orm.public.Category.all()
        return categories as unknown as Category[]
    }

    async function getCategoryById(id: number): Promise<Category | null> {
        const category = await db.orm.public.Category.where({ id }).first()
        return (category as unknown as Category) || null
    }

    async function createCategory(input: Omit<Category, 'id'>): Promise<Category> {
        try {
            const created = await db.orm.public.Category.create(input as any)
            return created as unknown as Category
        } catch (error: any) {
            if (error instanceof Error && "sqlState" in error) {
                if (error.sqlState === "23505") {
                    throw new Error("Category already exists")
                }
            }
            throw error
        }
    }
    return { getAllCategories, getCategoryById, createCategory }
}