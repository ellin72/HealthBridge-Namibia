/**
 * Pending Payment Callbacks Utility
 * Handles payment callbacks that arrive before payment records are created
 * Prevents lost transactions due to race conditions
 */
interface PendingCallback {
    paymentReference?: string;
    transactionId?: string;
    status: string;
    metadata?: any;
    timestamp: Date;
    retryCount: number;
}
/**
 * Store a pending callback for later processing
 * Note: This function should only be called once per callback. The retry count tracks
 * how many times the callback was stored, not how many times processing failed.
 */
export declare function storePendingCallback(paymentReference: string | undefined, transactionId: string | undefined, status: string, metadata?: any): void;
/**
 * Peek at a pending callback without removing it
 * Use this to check if a callback exists before processing
 */
export declare function peekPendingCallback(paymentReference?: string, transactionId?: string): PendingCallback | null;
/**
 * Get and remove a pending callback if it exists
 * This function removes the callback from the map to prevent duplicate processing
 * IMPORTANT: Only call this when you're about to process the callback immediately.
 * If processing fails, the callback will be lost. Consider using peekPendingCallback
 * first and only removing after successful processing.
 */
export declare function getPendingCallback(paymentReference?: string, transactionId?: string): PendingCallback | null;
/**
 * Remove a pending callback (after successful processing)
 */
export declare function removePendingCallback(paymentReference?: string, transactionId?: string): void;
/**
 * Clean up expired callbacks (should be called periodically)
 */
export declare function cleanupExpiredCallbacks(): void;
export {};
//# sourceMappingURL=pendingPaymentCallbacks.d.ts.map