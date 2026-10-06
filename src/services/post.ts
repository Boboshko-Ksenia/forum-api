
import type { Post } from '../domain/post/entity.js'
import type { PostRepository } from '../domain/post/repository.js'
import type { PostService } from './types.js'

export function createPostService(postRepository: PostRepository): PostService {
    
        async function getAllPosts(category?: string, take?: number): Promise<Post[]> {
            return postRepository.getAllPosts(category, take)
        }

        async function getPostById(id: number): Promise<Post | null> {
            return postRepository.getPostById(id)
        }

        async function createPost(postData: Omit<Post, 'id'>): Promise<Post> {
            const { title, content, author, category } = postData
            let post = {
                title: title,
                content: content,
                author: author,
                category: category
        }
        return postRepository.createPost(postData)
        }
        

    return { getAllPosts, getPostById, createPost }
}

