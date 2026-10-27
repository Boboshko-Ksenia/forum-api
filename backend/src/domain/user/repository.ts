import type { User } from "./entity"

export interface UserRepositoryContract{
    createUser:(data: NewUser) => Promise<User> 
    getUserByEmail:(email: string) => Promise<User | null>
}

export type NewUser = Omit<User, "id">