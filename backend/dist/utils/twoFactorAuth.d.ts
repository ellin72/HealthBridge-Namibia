/**
 * Two-Factor Authentication for Payment Approvals
 */
/**
 * Generate 2FA secret for user
 */
export declare function generate2FASecret(userId: string): Promise<{
    secret: string;
    qrCodeUrl: string;
    backupCodes: string[];
}>;
/**
 * Verify 2FA token
 */
export declare function verify2FAToken(userId: string, token: string): Promise<boolean>;
/**
 * Enable 2FA for user
 */
export declare function enable2FA(userId: string, token: string): Promise<boolean>;
/**
 * Disable 2FA for user
 */
export declare function disable2FA(userId: string): Promise<void>;
/**
 * Check if 2FA is enabled for user
 */
export declare function is2FAEnabled(userId: string): Promise<boolean>;
//# sourceMappingURL=twoFactorAuth.d.ts.map