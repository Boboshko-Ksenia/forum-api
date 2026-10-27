import type { UserRepositoryContract } from "../../domain/user/repository";
import type { PasswordHasherContract, TokenSignerContract, UserServiceContract } from "./user.types";

export function createUserService(
    repository: UserRepositoryContract,
    passwordHasher: PasswordHasherContract,
    tokenSigner: TokenSignerContract
): UserServiceContract {
    return {
        async register(data) {
            const { email, password } = data;

            const hashPassword = await passwordHasher.hashPassword(password);
            
            const user = await repository.createUser({
                email: email.trim(),
                passwordHash: hashPassword
            });
            
            return {
                id: user.id,
                email: user.email
            };
        },

        async login(data) {
            const { email, password } = data;

            const user = await repository.getUserByEmail(email.trim());
         
            if (!user || !await passwordHasher.verifyPassword(user.passwordHash, password)) {
                throw new Error("INVALID CREDENTIALS");
            }
            
            return {
                user: {
                    id: user.id,
                    email: user.email
                },
                token: tokenSigner.signAccessToken(user.id)
            }
        }
    };
}