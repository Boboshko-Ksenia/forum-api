import { Router } from 'express'
import { createPostHandlers } from '../handlers/post.js'
import type { PostService } from '../../services/types.js'


export function createPostRouter(postHandlers: ReturnType<typeof createPostHandlers>): Router {
    const postRouter = Router()
    
    postRouter.get('/', postHandlers.getAllPostsHandler)
    postRouter.get('/:id', postHandlers.getPostByIdHandler)
    postRouter.post('/', postHandlers.createPostHandler)

    return postRouter
}