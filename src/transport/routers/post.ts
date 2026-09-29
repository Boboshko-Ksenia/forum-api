import { Router } from 'express'
import { createPostHandlers } from '../handlers/post.js'
import type { PostService } from '../../services/types.js'


export function createPostRouter(postService: PostService): Router {
    const postRouter = Router()
    const handlers = createPostHandlers(postService)

    postRouter.get('/', handlers.getAllPostsHandler)
    postRouter.get('/:id', handlers.getPostByIdHandler)
    postRouter.post('/', handlers.createPostHandler)

    return postRouter
}