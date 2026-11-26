import type { UserRepositoryContract } from "../domain/user/repository";
import type { Database } from "../prisma/db.js";


export function createUserRepository(db: Database): UserRepositoryContract {
	return {
		async createUser(data) {
			try {
				const newUser = await db.orm.public.User.create(data);
				return newUser;
			} catch (error) {
				if (
					error instanceof Error &&
					"sqlState" in error &&
					error.sqlState == "23505"
				) {
					throw new Error("Email is already used!");
				}

				throw error;
			}
		},

		async getUserByEmail(email) {
			return db.orm.public.User.where({ email }).first();
		},
		async getUserById(id) {
			return db.orm.public.User.where({ id }).first();
		},
	};
}
