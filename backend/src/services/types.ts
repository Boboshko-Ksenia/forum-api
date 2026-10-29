
import type { Category } from '../domain/category/category.js'

export interface Post {
  id: number;
  name: string;
  content: string;
  authorId: number;
  author?: {
    id: number;
    email: string;
  };
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
}
export type CreatePostInput = Omit<Post, 'id' | 'category'>
export interface PostService {
    getAllPosts(category?: string, take?: number): Promise<Post[]>
    getPostById(id: number): Promise<Post | null>
    createPost(post: CreatePostInput): Promise<Post>
}
export interface CategoryService {
    getAllCategories(): Promise<Category[]>
    getCategoryById(id: number): Promise<Category | null>
    createCategory(input: Omit<Category, 'id'>): Promise<Category>
}