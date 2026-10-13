import { Router } from 'express'
import type { createCategoryHandlers } from '../handlers/category.js'

export function createCategoryRouter(categoryHandlers: ReturnType<typeof createCategoryHandlers>) {
    const categoryRouter = Router()

    categoryRouter.get('/', categoryHandlers.getAllCategoriesHandler)
    categoryRouter.get('/:id', categoryHandlers.getCategoryByIdHandler)
    categoryRouter.post('/', categoryHandlers.createCategoryHandler)

    return categoryRouter
}