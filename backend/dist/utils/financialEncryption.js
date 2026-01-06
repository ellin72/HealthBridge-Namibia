"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptFinancialData = encryptFinancialData;
exports.decryptFinancialData = decryptFinancialData;
exports.hashCardData = hashCardData;
exports.maskCardNumber = maskCardNumber;
exports.encryptCardToken = encryptCardToken;
exports.decryptCardToken = decryptCardToken;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Financial Data Encryption Utility
 * Ensures PCI-DSS compliance for sensitive financial information
 */
const ENCRYPTION_KEY = process.env.FINANCIAL_ENCRYPTION_KEY || crypto_1.default.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-gcm';
/**
 * Encrypt sensitive financial data
 */
function encryptFinancialData(data) {
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
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
function decryptFinancialData(encryptedData, iv, authTag) {
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
/**
 * Hash payment card data (one-way, for verification)
 * Never store full card numbers - use tokenization
 */
function hashCardData(cardNumber) {
    return crypto_1.default.createHash('sha256').update(cardNumber).digest('hex');
}
/**
 * Mask card number for display (shows only last 4 digits)
 */
function maskCardNumber(cardNumber) {
    if (cardNumber.length < 4)
        return '****';
    return '**** **** **** ' + cardNumber.slice(-4);
}
/**
 * Encrypt and store card token (for PCI-DSS compliance)
 */
function encryptCardToken(token) {
    const { encrypted, iv, authTag } = encryptFinancialData(token);
    return JSON.stringify({ encrypted, iv, authTag });
}
/**
 * Decrypt card token
 */
function decryptCardToken(encryptedToken) {
    const { encrypted, iv, authTag } = JSON.parse(encryptedToken);
    return decryptFinancialData(encrypted, iv, authTag);
}
//# sourceMappingURL=financialEncryption.js.map