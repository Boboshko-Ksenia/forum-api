import type { Post } from '../domain/post/entity.js'
import type { PostRepository } from '../domain/post/repository.js'

type Database = typeof import("../prisma/db.js").db

export function createPostRepository(db: Database): PostRepository {
    
    
    async function getAllPosts(category?: string, take?: number): Promise<Post[]> {
        let result = await db.orm.public.Post.all()
        if (category) {
            result = result.filter((post) => post.category === category)
        }
        if (take) {
            result = result.slice(0, take)
        }
        return result as unknown as Post[]
    }
    async function getPostById(id: number): Promise<Post | null> {
        return db.orm.public.Post.where({ id }).first() as unknown as Post | null
    }
    async function createPost(post: Omit<Post, 'id'>): Promise<Post> {
        return db.orm.public.Post.create(post as unknown as any) as unknown as Post
    }
    return { getAllPosts, getPostById, createPost }
}    