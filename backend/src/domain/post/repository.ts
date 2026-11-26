import type { Post, PostWithCategory } from "./entity.js";
import type { CreatePostInput } from "../../services/types.ts";

export interface PostFilter {
	take?: number | undefined;
	categoryId?: number | undefined
}
export interface PostRepository {
	getAllPosts(filter?: PostFilter): Promise<PostWithCategory[]>;
	getPostById(id: number): Promise<PostWithCategory | null>;
	createPost(post: CreatePostInput): Promise<Post>;
	findPostByTitle: (title: string) => Promise<PostWithCategory | null>;
}
