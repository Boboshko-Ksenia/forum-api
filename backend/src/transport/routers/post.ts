import { Router } from 'express'
import { createPostHandlers } from '../handlers/post/post.js'
import type { PostService } from '../../services/types.js'
import { createRequireAuth } from '../middlewares/require-auth.js';


export function createPostRouter(postHandlers: ReturnType<typeof createPostHandlers>): Router {
    const postRouter = Router()
    
    postRouter.get('/', postHandlers.getAllPostsHandler)
    postRouter.post('/', createRequireAuth, postHandlers.createPostHandler);
    postRouter.get('/:id', postHandlers.getPostByIdHandler)
    postRouter.post('/', postHandlers.createPostHandler)
   
    return postRouter
}