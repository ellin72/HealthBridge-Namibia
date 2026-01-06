/**
 * Policy Engine
 * Utility to retrieve and apply configurable policies
 */
export declare enum PolicyType {
    DATA_RETENTION = "DATA_RETENTION",
    ACCESS_CONTROL = "ACCESS_CONTROL",
    CONSENT = "CONSENT",
    PAYMENT = "PAYMENT",
    NOTIFICATION = "NOTIFICATION",
    COMPLIANCE = "COMPLIANCE"
}
/**
 * Get active policy by type
 */
export declare function getActivePolicy(policyType: PolicyType): Promise<any | null>;
/**
 * Get data retention policy
 */
export declare function getDataRetentionPolicy(): Promise<any>;
/**
 * Get access control policy
 */
export declare function getAccessControlPolicy(role: string): Promise<any>;
/**
 * Get payment policy
 */
export declare function getPaymentPolicy(): Promise<any>;
/**
 * Get consent policy
 */
export declare function getConsentPolicy(consentType: string): Promise<any>;
/**
 * Check if 2FA is required for payment
 */
export declare function requires2FAForPayment(amount: number): Promise<boolean>;
//# sourceMappingURL=policyEngine.d.ts.map