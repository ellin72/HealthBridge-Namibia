import crypto from 'crypto';

/**
 * Financial Data Encryption Utility
 * Ensures PCI-DSS compliance for sensitive financial information
 */

const ENCRYPTION_KEY = process.env.FINANCIAL_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypt sensitive financial data
 */
export function encryptFinancialData(data: string): { encrypted: string; iv: string; authTag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

/**
 * Decrypt sensitive financial data
 */
export function decryptFinancialData(encryptedData: string, iv: string, authTag: string): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Hash payment card data (one-way, for verification)
 * Never store full card numbers - use tokenization
 */
export function hashCardData(cardNumber: string): string {
  return crypto.createHash('sha256').update(cardNumber).digest('hex');
}

/**
 * Mask card number for display (shows only last 4 digits)
 */
export function maskCardNumber(cardNumber: string): string {
  if (cardNumber.length < 4) return '****';
  return '**** **** **** ' + cardNumber.slice(-4);
}

/**
 * Encrypt and store card token (for PCI-DSS compliance)
 */
export function encryptCardToken(token: string): string {
  const { encrypted, iv, authTag } = encryptFinancialData(token);
  return JSON.stringify({ encrypted, iv, authTag });
}

/**
 * Decrypt card token
 */
export function decryptCardToken(encryptedToken: string): string {
  const { encrypted, iv, authTag } = JSON.parse(encryptedToken);
  return decryptFinancialData(encrypted, iv, authTag);
}

