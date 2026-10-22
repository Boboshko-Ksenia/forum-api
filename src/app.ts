import express from 'express'
import cookieParser from 'cookie-parser'
import { createPostRepository } from './repositories/post.js'
import { createPostService } from './services/post/post.js'
import { createPostRouter } from './transport/routers/post.js'
import { createPostHandlers } from './transport/handlers/post/post.js'
import { createCategoryRepository } from './repositories/category.js'
import { createCategoryService } from './services/category/category.js'
import { createCategoryHandlers } from './transport/handlers/category/category.js'
import { createCategoryRouter } from './transport/routers/category.js'
import { createUserRouter } from "./transport/routers/user.js";
import { createUserRepository } from "./repositories/user.js";
import { createUserService } from "./services/user/user.js";
import { createUserHandler } from "./transport/handlers/user/user.js";
import { hashPassword, verifyPassword } from "./lib/password.js";
import { signAccessToken } from "./lib/jwt.js";
import { db } from './prisma/db.js'

const app = express()
const PORT = 8000
const HOST = 'localhost'

app.use(express.json())
app.use(cookieParser())
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

const userRepository = createUserRepository(db);
const userService = createUserService(userRepository, 
    { hashPassword: hashPassword, 
        verifyPassword: verifyPassword
    }, { signAccessToken: signAccessToken}
);
const userHandlers = createUserHandler(userService);
const userRouter = createUserRouter(userHandlers);

app.use('/user', userRouter)

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})