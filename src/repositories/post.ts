import { isStructuredError } from '@prisma/orm-postgres/utils'
import type { Post } from '../domain/post/entity.js'
import type { PostRepository } from '../domain/post/repository.js'
import type { CreatePostInput } from '../services/types.js'

type Database = typeof import("../prisma/db.js").db

export function createPostRepository(db: Database): PostRepository {
    
    
    async function getAllPosts(categoryName?: string, take?: number): Promise<Post[]> {
        let query = db.orm.public.Post.include("category")
        let result = await query.all()
        if (categoryName) {
            result = result.filter(post => post.category?.name === categoryName)
        }
        if (take) {
            result = result.slice(0, take)
        }
        return result as unknown as Post[]
    }
    async function getPostById(id: number): Promise<Post | null> {
        
        const post = await db.orm.public.Post.include("category").where({ id }).first()
        return post as unknown as Post | null
    }
    async function createPost(post: Omit<Post, 'id'> & { categoryId?: number }): Promise<Post> {
        try {
            const { categoryId, ...fields} = post
            const created = await db.orm.public.Post.create({
                ...fields, 
                categoryId: categoryId
            } as any)
            const postId = (created as any).id || (Array.isArray(created) ? created[0]?.id : undefined)
            const fullPost = await db.orm.public.Post.include("category").where({ id: postId }).first()
            return fullPost as unknown as Post
        } catch (error: any) {
            if (error instanceof Error && "sqlState" in error) {
                if (error.sqlState === "23505") {
                    throw new Error("POST ALREADY EXIST");
                }
                if (error.sqlState === "23503" || (error.message && error.message.includes("foreign key constraint"))) {
                    throw new Error("CATEGORY NOT FOUND");
                }
                if (isStructuredError(error) && error.code === "ORM.RELATION.ROW.MISSING") {
                    throw new Error("CATEGORY NOT FOUND");
                } 
            }
            throw error;
        }   
    }
    return { getAllPosts, getPostById, createPost }
}    