import express from 'express'
import { createPostRepository } from './repositories/post.js'
import { createPostService } from './services/post.js'
import { createPostRouter } from './transport/routers/post.js'
import { createPostHandlers } from './transport/handlers/post.js'
import { createCategoryRepository } from './repositories/category.js'
import { createCategoryService } from './services/category.js'
import { createCategoryHandlers } from './transport/handlers/category.js'
import { createCategoryRouter } from './transport/routers/category.js'
import { db } from './prisma/db.js'

const app = express()
const PORT = 8000
const HOST = 'localhost'

app.use(express.json())
const postRepository = createPostRepository(db)
const postService = createPostService(postRepository)
const postHandlers = createPostHandlers(postService)
const postRouter = createPostRouter(postHandlers)

app.use('/posts', postRouter)

const categoryRepository = createCategoryRepository(db)
const categoryService = createCategoryService(categoryRepository)
const categoryHandlers = createCategoryHandlers(categoryService)
const categoryRouter = createCategoryRouter(categoryHandlers)

app.use('/categories', categoryRouter)

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})