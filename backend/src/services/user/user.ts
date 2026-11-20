import type { RefreshSessionRepositoryContract } from "../../domain/refresh-session/repository";
import type { PublicUser } from "../../domain/user/entity";
import type { UserRepositoryContract } from "../../domain/user/repository";
import type { PasswordHasherContract, RefreshTokenHasherContract, TokenSignerContract, TokenVerifierContract, UserInput, UserServiceContract, UserTokens } from "./user.types";

export function createUserService(
    repository: UserRepositoryContract,
    passwordHasher: PasswordHasherContract,
    tokenSigner: TokenSignerContract,
    tokenVerifier: TokenVerifierContract,
    refreshSessionRepository: RefreshSessionRepositoryContract,
    refreshTokenHasher: RefreshTokenHasherContract
): UserServiceContract {
    return {
    async register(data: UserInput): Promise<PublicUser> {
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

    async login(data: UserInput): Promise<{ user: PublicUser } & UserTokens> {
        const { email, password } = data;

        const user = await repository.getUserByEmail(email.trim());
        if (!user || !(await passwordHasher.verifyPassword(user.passwordHash, password))) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const refreshToken = tokenSigner.signRefreshToken(user.id);

        await refreshSessionRepository.create({
            userId: user.id,
            tokenHash: refreshTokenHasher.hashRefreshToken(refreshToken),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });

        return {
            user: {
                id: user.id,
                email: user.email
            },
            accessToken: tokenSigner.signAccessToken(user.id),
            refreshToken: refreshToken
        };
    },
    async refresh(refreshToken: string): Promise<UserTokens> {
        const userId = tokenVerifier.verifyRefreshToken(refreshToken);
        const user = await repository.getUserById(userId);
        if (!user) {
            throw new Error("INVALID_REFRESH_TOKEN");
        }
        return {
            accessToken: tokenSigner.signAccessToken(user.id),
            refreshToken: refreshToken
        };
    },
    async me(id: number): Promise<PublicUser> {
        const user = await repository.getUserById(id);

        if (!user) {
            throw new Error("UNAUTHORIZED");
        }
        return {
            id: user.id,
            email: user.email
        };
    },
    async logout(refreshToken?: string): Promise<void> {
        if (!refreshToken) {
        return;
        }
        try {
            const tokenHash = refreshTokenHasher.hashRefreshToken(refreshToken);
            await refreshSessionRepository.delete(tokenHash);
        } catch (error) {

        }
    },
}
}