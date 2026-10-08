import type { Post } from '../domain/post/entity.js'

export interface PostService {
    getAllPosts(category?: string, take?: number): Promise<Post[]>
    getPostById(id: number): Promise<Post | null>
    createPost(post: Omit<Post, 'id'>): Promise<Post>
}