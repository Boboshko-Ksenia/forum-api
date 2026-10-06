import express from 'express'
import { createPostRepository } from './repositories/post.js'
import { createPostService } from './services/post.js'
import { createPostRouter } from './transport/routers/post.js'
import { createPostHandlers } from './transport/handlers/post.js'
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

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})