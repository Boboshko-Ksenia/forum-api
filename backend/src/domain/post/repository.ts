import type { Post } from './entity.js'

export interface PostRepository {
    getAllPosts(category?: string, take?: number): Promise<Post[]>
    getPostById(id: number): Promise<Post | null>
    createPost(post: Omit<Post, 'id'>): Promise<Post>
}