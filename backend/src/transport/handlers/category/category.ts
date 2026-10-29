import type { Request, Response } from 'express'
import type { CategoryService } from '../../../services/types.js' 
import { error } from 'console'


export function createCategoryHandlers(categoryService: CategoryService) {
    return {
        getAllCategoriesHandler: async (req: Request, res: Response) => {
            const categories = await categoryService.getAllCategories()
            return res.status(200).json(categories)
        },

    getCategoryByIdHandler: async (req: Request, res: Response) => {
        const { id } = req.params
        if (isNaN(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({ message: "Invalid category ID" })
        }
        const category = await categoryService.getCategoryById(Number(id))
        if (!category) {
            return res.status(404).json({ message: "Category not found" })
        }
        return res.status(200).json(category)
    },

    createCategoryHandler: async (req: Request, res: Response) => {
        const { name } = req.body
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(422).json({ message: "Name is required" })
        }
        try {
            const newCategory = await categoryService.createCategory({ name })
            return res.status(201).json(newCategory)
        } catch (rawError) {
            const error = rawError as any
            if (error?.message === "Category already exists" || error?.code === "23505" || error?.sqlState === "23505") {
                return res.status(409).json({ message: "Category already exists" })
            }
            return res.status(500).json({ message: error?.message || String(error) })
        }
    }}}