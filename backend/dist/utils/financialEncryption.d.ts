/**
 * Encrypt sensitive financial data
 */
export declare function encryptFinancialData(data: string): {
    encrypted: string;
    iv: string;
    authTag: string;
};
/**
 * Decrypt sensitive financial data
 */
export declare function decryptFinancialData(encryptedData: string, iv: string, authTag: string): string;
/**
 * Hash payment card data (one-way, for verification)
 * Never store full card numbers - use tokenization
 */
export declare function hashCardData(cardNumber: string): string;
/**
 * Mask card number for display (shows only last 4 digits)
 */
export declare function maskCardNumber(cardNumber: string): string;
/**
 * Encrypt and store card token (for PCI-DSS compliance)
 */
export declare function encryptCardToken(token: string): string;
/**
 * Decrypt card token
 */
export declare function decryptCardToken(encryptedToken: string): string;
//# sourceMappingURL=financialEncryption.d.ts.map