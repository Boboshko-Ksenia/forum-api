import { error } from 'console'
import type { PostService } from '../../../services/types.js'
import type { PostDTO } from '../../dto/post/post.dto.js'
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
            if (isNaN(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({ message: "Invalid post ID" })
            }
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
            const { name, content, authorId, categoryId } = req.body
            if(!name || !content || !categoryId) {
                return res.status(422).json({ message: "Name, content, and category ID are required" })
            }
            try {
                const newPost = await postService.createPost({ name, content, authorId, categoryId } as any)
                return res.status(201).json(newPost)
            } catch (error: any) {
                const errorMessage = 
                    typeof error === "string" ? error :
                    error instanceof Error ? error.message :
                    (error && typeof error === "object" && "message" in error) ? String(error.message) :
                    String(error);
                if (error.message === "Category not found" || errorMessage === "CATEGORY NOT FOUND") {
                    return res.status(400).json({ message: "Category not found" })
                }
                
                if (error.message === "Post already exists" || errorMessage === "POST ALREADY EXIST") {
                    return res.status(409).json({ message: "Post already exists" })
                }
                return res.status(500).json({ message: errorMessage })
            }
            
        }
    }}
    

