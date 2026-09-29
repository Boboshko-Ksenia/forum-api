import type { Post } from './entity.js'

export interface PostRepository {
    getAllPosts(category?: string, take?: number): Post[]
    getPostById(id: number): Post | undefined
    createPost(post: Omit<Post, 'id'>): Promise<Post>
}