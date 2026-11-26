import type { RefreshSessionRepositoryContract } from "../domain/refresh-session/repository.ts";
import type { Database } from "../prisma/db.js";


export function createRefreshSessionRepository(
	db: Database,
): RefreshSessionRepositoryContract {
	const refreshSessionModel = (db.orm.public as any).RefreshSession;

	return {
		async create(data) {
			return await refreshSessionModel.create({
				...data,
				createdAt: new Date().toISOString(),
				expiresAt: data.expiresAt
					? new Date(String(data.expiresAt)).toISOString()
					: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
			});
		},

		async getByHash(tokenHash) {
			return await refreshSessionModel.where({ tokenHash }).first();
		},

		async update(oldHash, newHash, expiresAt) {
			const result = await refreshSessionModel
				.where({ tokenHash: oldHash })
				.update({
					tokenHash: newHash,
					expiresAt: expiresAt
						? new Date(String(expiresAt)).toISOString()
						: new Date().toISOString(),
				});
			return result ? true : false;
		},

		async delete(tokenHash) {
			await refreshSessionModel.where({ tokenHash }).delete();
		},
	};
}
