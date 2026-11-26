import { isStructuredError } from "@prisma/orm-postgres/utils";
import type { PostRepository } from "../domain/post/repository.js";
import type { Database } from "../prisma/db.js";

export function createPostRepository(
	db: Database,
): PostRepository {
	return {
		async getAllPosts(filter) {
			const { take, categoryId } = filter ?? {};
			const query = db.orm.public.Post.orderBy((post) => {
				return post.id.asc();
			})
				.include("category")
				.include("author")
				.where({ categoryId });

			if (!take) {
			const posts = await query.all();
			return posts.map((post) => ({ ...post, author: post.author.email }));
			}

		const posts = await query.limit(take).all();
		return posts.map((post) => ({ ...post, author: post.author.email }));
		},

		async createPost(post) {
			try {
				const { categoryId, author, ...fields } = post;
				void author;
				const createdPost = await db.orm.public.Post.create({
					...fields,
					categoryId,
				});

				const postWithRelations = await db.orm.public.Post.where({
					id: createdPost.id,
				})
					.include("category")
					.include("author")
					.first();

				if (!postWithRelations) {
					throw new Error("POST NOT FOUND");
				}

				return { ...postWithRelations, author: postWithRelations.author.email };
			} catch (error) {
				if (error instanceof Error && "sqlState" in error) {
					if (error.sqlState === "23505") {
						throw new Error("POST ALREADY EXIST");
					}

					if (
						isStructuredError(error) &&
						error.code === "ORM.RELATION_ROW_MISSING"
					) {
						throw new Error("CATEGORY NOT FOUND");
					}
				}
				throw error;
			}
		},

		async getPostById(id) {
			const post = await db.orm.public.Post.where({ id })
				.include("category")
				.include("author")
				.first();

			if (!post) {
				return null;
			}

			return { ...post, author: post.author.email };
		},

		async findPostByTitle(title) {
			const post = await db.orm.public.Post.where({ name: title })
				.include("category")
				.include("author")
				.first();

			if (!post) {
				return null;
			}

			return { ...post, author: post.author.email };
		},
	};
}