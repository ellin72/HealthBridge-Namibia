/**
 * Fraud Detection Service
 * Analyzes payment patterns and flags suspicious transactions
 */
export interface FraudCheckResult {
    riskScore: number;
    flagged: boolean;
    reasons: string[];
    recommendation: 'APPROVE' | 'REVIEW' | 'REJECT';
}
/**
 * Analyze payment for fraud indicators
 */
export declare function analyzePaymentForFraud(userId: string, amount: number, method: string, ipAddress?: string, userAgent?: string): Promise<FraudCheckResult>;
/**
 * Log fraud detection result
 */
export declare function logFraudCheck(paymentId: string, result: FraudCheckResult, ipAddress?: string, userAgent?: string): Promise<void>;
//# sourceMappingURL=fraudDetection.d.ts.map