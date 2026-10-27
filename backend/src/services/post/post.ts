
import type { Post } from '../../domain/post/entity.js'
import type { PostRepository } from '../../domain/post/repository.js'
import type { PostService } from '../types.js'

export function createPostService(postRepository: PostRepository): PostService {
    
        async function getAllPosts(category?: string, take?: number): Promise<any> {
            return postRepository.getAllPosts(category, take)
        }

        async function getPostById(id: number): Promise<any> {
            return postRepository.getPostById(id)
        }

        async function createPost(postData: any): Promise<any> {
            const { name, content, author, authorId, categoryId } = postData
            let post = {
                name: name,
                content: content,
                author: author,
                authorId: authorId,
                categoryId: categoryId
        }
        return postRepository.createPost(post)
        }
        

    return { getAllPosts, getPostById, createPost }
}

