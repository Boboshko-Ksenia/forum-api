export interface RefreshSession {
    id: number;
    tokenHash: string;
    userId: number;
    createdAt: String;
    expiresAt: String;
}