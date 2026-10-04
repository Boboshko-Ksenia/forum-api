import type { Post } from '../domain/post/entity.js'
import type { PostRepository } from '../domain/post/repository.js'

export function createPostRepository(): PostRepository {
    let posts = [
        {
            id: 1,
            title: "First Post",
            content: "This is the content of the first post.",
            author: "Ksyusha",
            category: "dancing"
        },
        {
            id: 2,
            title: "Second Post",
            content: "This is the content of the second post.",
            author: "Ksyusha",
            category: "cooking"
        },
        {
            id: 3,
            title: "Third Post",
            content: "This is the content of the third post.",
            author: "Ksyusha",
            category: "programming"
        }
    ]
    return {
        getAllPosts(category?: string, take?: number) {
            let result = posts
            if (category) {
                result = result.filter((post) => post.category === category)
            }
            if (take) {
                result = result.slice(0, take)
            }
            return result
        },
        getPostById(id: number) {
            return posts.find((post) => post["id"] == id)
        },
        createPost(post: Omit<Post, 'id'>): Promise<Post> {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                const newPost: Post = {
                    id: Date.now(),
                    ...post
                };
                posts = [...posts, newPost]
                resolve(newPost)
            }, 1000 )})
    }}}