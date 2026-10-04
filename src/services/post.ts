
import type { Post } from '../domain/post/entity.js'
import type { PostRepository } from '../domain/post/repository.js'
import type { PostService } from './types.js'

export function createPostService(postRepository: PostRepository): PostService {
    return {
        getAllPosts(category?: string, take?: number) {
            return postRepository.getAllPosts(category, take)
        },

        getPostById(id: number) {
            return postRepository.getPostById(id)
        },

        createPost(postData: Omit<Post, 'id'>) {
            return postRepository.createPost(postData)
        }
    }
}

