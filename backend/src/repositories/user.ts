import type { UserRepositoryContract } from "../domain/user/repository";

type Database = typeof import("../prisma/db.js").db;

export function createUserRepository(db: Database): UserRepositoryContract{
    return {
        async createUser(data) {
            try {
                return await db.orm.public.User.create(data);

                 
            }
            catch(error) {
                if(error instanceof Error && "sqlState" in error && error.sqlState == "23505") {
                    throw new Error("Email is already used!");
                }

                throw error;
            }
        },

        async getUserByEmail(email) {
            return db.orm.public.User.where({ email }).first();
        }
    }
}