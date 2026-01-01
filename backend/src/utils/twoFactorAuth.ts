import crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { PrismaClient } from '@prisma/client';
import { encryptFinancialData, decryptFinancialData } from './financialEncryption';

const prisma = new PrismaClient();

/**
 * Two-Factor Authentication for Payment Approvals
 */

/**
 * Generate 2FA secret for user
 */
export async function generate2FASecret(userId: string): Promise<{
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}> {
  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `HealthBridge (${userId})`,
    issuer: 'HealthBridge Namibia'
  });

  // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () => 
    crypto.randomBytes(4).toString('hex').toUpperCase()
  );

  // Encrypt and store
  const encryptedSecret = encryptFinancialData(secret.base32 || '');
  const encryptedBackupCodes = encryptFinancialData(JSON.stringify(backupCodes));

  await prisma.twoFactorAuth.upsert({
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
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

  return {
    secret: secret.base32 || '',
    qrCodeUrl,
    backupCodes
  };
}

/**
 * Verify 2FA token
 */
export async function verify2FAToken(userId: string, token: string): Promise<boolean> {
  const twoFA = await prisma.twoFactorAuth.findUnique({
    where: { userId }
  });

  if (!twoFA || !twoFA.isEnabled) {
    return false;
  }

  // Decrypt secret
  const encryptedSecret = JSON.parse(twoFA.secret);
  const secret = decryptFinancialData(
    encryptedSecret.encrypted,
    encryptedSecret.iv,
    encryptedSecret.authTag
  );

  // Verify token
  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2 // Allow 2 time steps of tolerance
  });

  // Check backup codes if token verification fails
  if (!verified && twoFA.backupCodes) {
    try {
      const encryptedBackupCodes = JSON.parse(twoFA.backupCodes);
      const backupCodes = JSON.parse(decryptFinancialData(
        encryptedBackupCodes.encrypted,
        encryptedBackupCodes.iv,
        encryptedBackupCodes.authTag
      ));

      const codeIndex = backupCodes.indexOf(token);
      if (codeIndex !== -1) {
        // Remove used backup code
        backupCodes.splice(codeIndex, 1);
        const newEncryptedBackupCodes = encryptFinancialData(JSON.stringify(backupCodes));
        await prisma.twoFactorAuth.update({
          where: { userId },
          data: {
            backupCodes: JSON.stringify(newEncryptedBackupCodes),
            lastUsed: new Date()
          }
        });
        return true;
      }
    } catch (error) {
      console.error('Error checking backup codes:', error);
    }
  }

  if (verified) {
    await prisma.twoFactorAuth.update({
      where: { userId },
      data: { lastUsed: new Date() }
    });
  }

  return verified;
}

/**
 * Enable 2FA for user
 */
export async function enable2FA(userId: string, token: string): Promise<boolean> {
  const verified = await verify2FAToken(userId, token);
  
  if (verified) {
    await prisma.twoFactorAuth.update({
      where: { userId },
      data: { isEnabled: true }
    });
  }

  return verified;
}

/**
 * Disable 2FA for user
 */
export async function disable2FA(userId: string): Promise<void> {
  await prisma.twoFactorAuth.update({
    where: { userId },
    data: { isEnabled: false }
  });
}

/**
 * Check if 2FA is enabled for user
 */
export async function is2FAEnabled(userId: string): Promise<boolean> {
  const twoFA = await prisma.twoFactorAuth.findUnique({
    where: { userId },
    select: { isEnabled: true }
  });

  return twoFA?.isEnabled || false;
}

