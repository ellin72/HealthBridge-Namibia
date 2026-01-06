"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate2FASecret = generate2FASecret;
exports.verify2FAToken = verify2FAToken;
exports.enable2FA = enable2FA;
exports.disable2FA = disable2FA;
exports.is2FAEnabled = is2FAEnabled;
const crypto_1 = __importDefault(require("crypto"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const prisma_1 = require("./prisma");
const financialEncryption_1 = require("./financialEncryption");
/**
 * Two-Factor Authentication for Payment Approvals
 */
/**
 * Generate 2FA secret for user
 */
async function generate2FASecret(userId) {
    // Generate secret
    const secret = speakeasy_1.default.generateSecret({
        name: `HealthBridge (${userId})`,
        issuer: 'HealthBridge Namibia'
    });
    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () => crypto_1.default.randomBytes(4).toString('hex').toUpperCase());
    // Encrypt and store
    const encryptedSecret = (0, financialEncryption_1.encryptFinancialData)(secret.base32 || '');
    const encryptedBackupCodes = (0, financialEncryption_1.encryptFinancialData)(JSON.stringify(backupCodes));
    await prisma_1.prisma.twoFactorAuth.upsert({
        where: { userId },
        create: {
            userId,
            secret: JSON.stringify(encryptedSecret),
            backupCodes: JSON.stringify(encryptedBackupCodes),
            isEnabled: false
        },
        update: {
            secret: JSON.stringify(encryptedSecret),
            backupCodes: JSON.stringify(encryptedBackupCodes)
        }
    });
    // Generate QR code
    const qrCodeUrl = await qrcode_1.default.toDataURL(secret.otpauth_url || '');
    return {
        secret: secret.base32 || '',
        qrCodeUrl,
        backupCodes
    };
}
/**
 * Verify 2FA token
 */
async function verify2FAToken(userId, token) {
    const twoFA = await prisma_1.prisma.twoFactorAuth.findUnique({
        where: { userId }
    });
    if (!twoFA || !twoFA.isEnabled) {
        return false;
    }
    // Decrypt secret
    const encryptedSecret = JSON.parse(twoFA.secret);
    const secret = (0, financialEncryption_1.decryptFinancialData)(encryptedSecret.encrypted, encryptedSecret.iv, encryptedSecret.authTag);
    // Verify token
    const verified = speakeasy_1.default.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: 2 // Allow 2 time steps of tolerance
    });
    // Check backup codes if token verification fails
    if (!verified && twoFA.backupCodes) {
        try {
            const encryptedBackupCodes = JSON.parse(twoFA.backupCodes);
            const backupCodes = JSON.parse((0, financialEncryption_1.decryptFinancialData)(encryptedBackupCodes.encrypted, encryptedBackupCodes.iv, encryptedBackupCodes.authTag));
            const codeIndex = backupCodes.indexOf(token);
            if (codeIndex !== -1) {
                // Remove used backup code
                backupCodes.splice(codeIndex, 1);
                const newEncryptedBackupCodes = (0, financialEncryption_1.encryptFinancialData)(JSON.stringify(backupCodes));
                await prisma_1.prisma.twoFactorAuth.update({
                    where: { userId },
                    data: {
                        backupCodes: JSON.stringify(newEncryptedBackupCodes),
                        lastUsed: new Date()
                    }
                });
                return true;
            }
        }
        catch (error) {
            console.error('Error checking backup codes:', error);
        }
    }
    if (verified) {
        await prisma_1.prisma.twoFactorAuth.update({
            where: { userId },
            data: { lastUsed: new Date() }
        });
    }
    return verified;
}
/**
 * Enable 2FA for user
 */
async function enable2FA(userId, token) {
    const verified = await verify2FAToken(userId, token);
    if (verified) {
        await prisma_1.prisma.twoFactorAuth.update({
            where: { userId },
            data: { isEnabled: true }
        });
    }
    return verified;
}
/**
 * Disable 2FA for user
 */
async function disable2FA(userId) {
    await prisma_1.prisma.twoFactorAuth.update({
        where: { userId },
        data: { isEnabled: false }
    });
}
/**
 * Check if 2FA is enabled for user
 */
async function is2FAEnabled(userId) {
    const twoFA = await prisma_1.prisma.twoFactorAuth.findUnique({
        where: { userId },
        select: { isEnabled: true }
    });
    return twoFA?.isEnabled || false;
}
//# sourceMappingURL=twoFactorAuth.js.map