"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.hash = hash;
exports.generateEncryptionKey = generateEncryptionKey;
const crypto_1 = __importDefault(require("crypto"));
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;
// Get encryption key from environment or generate one
function getEncryptionKey() {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('ENCRYPTION_KEY environment variable is required');
    }
    return Buffer.from(key, 'hex');
}
// Encrypt sensitive data (AES-256-GCM)
function encrypt(text) {
    const key = getEncryptionKey();
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const salt = crypto_1.default.randomBytes(SALT_LENGTH);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, key, iv);
    cipher.setAAD(salt);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();
    // Combine salt + iv + tag + encrypted
    return Buffer.concat([salt, iv, tag, Buffer.from(encrypted, 'hex')]).toString('hex');
}
// Decrypt sensitive data
function decrypt(encryptedData) {
    const key = getEncryptionKey();
    const data = Buffer.from(encryptedData, 'hex');
    const salt = data.slice(0, SALT_LENGTH);
    const iv = data.slice(SALT_LENGTH, TAG_POSITION);
    const tag = data.slice(TAG_POSITION, ENCRYPTED_POSITION);
    const encrypted = data.slice(ENCRYPTED_POSITION);
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    decipher.setAAD(salt);
    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
// Hash sensitive data (one-way)
function hash(data) {
    return crypto_1.default.createHash('sha256').update(data).digest('hex');
}
// Generate encryption key (for initial setup)
function generateEncryptionKey() {
    return crypto_1.default.randomBytes(32).toString('hex');
}
//# sourceMappingURL=encryption.js.map