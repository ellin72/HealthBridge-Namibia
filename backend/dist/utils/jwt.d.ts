import { UserRole } from '@prisma/client';
export interface TokenPayload {
    userId: string;
    email: string;
    role: UserRole;
}
export declare const generateToken: (payload: TokenPayload) => string;
export declare const verifyToken: (token: string) => TokenPayload;
//# sourceMappingURL=jwt.d.ts.map