import type { PostService } from '../../services/types.js'
import type { PostDTO } from '../dto/post.dto.js'
import type { Request, Response } from 'express'

export function createPostHandlers(postService: PostService) {
    return {
        getAllPostsHandler: async (req: Request, res: Response) => {
            const { category, take } = req.query
            const parsedTake = take ? Number(take as string) : undefined
            const posts = await postService.getAllPosts(category as string | undefined, parsedTake)
            return res.status(200).json(posts)
        },

        getPostByIdHandler: async (req: Request, res: Response) => {
            const { id } = req.params
            const post = await postService.getPostById(Number(id as string))
            if (!post) {
                return res.status(404).json({ message: "Post not found" })
            }
            return res.status(200).json(post)
        },
        createPostHandler: async (
            req: Request<{}, {}, PostDTO>,
            res: Response
        ) => {
            const { title, content, author, category } = req.body
            if(!title || !content) {
                return res.status(422).json({ message: "Title and content are required" })
            }
            const newPost = await postService.createPost({ title, content, author, category })
            return res.status(201).json(newPost)
    }}}

