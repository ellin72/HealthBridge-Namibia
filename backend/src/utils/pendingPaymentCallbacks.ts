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

// In-memory store for pending callbacks (with TTL of 1 hour)
const pendingCallbacks = new Map<string, PendingCallback>();
const CALLBACK_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_RETRIES = 10;

/**
 * Generate a key for storing pending callbacks
 */
function getCallbackKey(paymentReference?: string, transactionId?: string): string | null {
  if (paymentReference) {
    return `ref:${paymentReference}`;
  }
  if (transactionId) {
    return `txn:${transactionId}`;
  }
  return null;
}

/**
 * Store a pending callback for later processing
 */
export function storePendingCallback(
  paymentReference: string | undefined,
  transactionId: string | undefined,
  status: string,
  metadata?: any
): void {
  const key = getCallbackKey(paymentReference, transactionId);
  if (!key) {
    console.warn('Cannot store pending callback: no paymentReference or transactionId');
    return;
  }

  // Check if callback already exists
  const existing = pendingCallbacks.get(key);
  const retryCount = existing ? existing.retryCount + 1 : 0;

  if (retryCount >= MAX_RETRIES) {
    console.error(`Pending callback exceeded max retries: ${key}`, { paymentReference, transactionId });
    pendingCallbacks.delete(key);
    return;
  }

  pendingCallbacks.set(key, {
    paymentReference,
    transactionId,
    status,
    metadata,
    timestamp: new Date(),
    retryCount
  });

  console.log(`Stored pending callback: ${key}`, { paymentReference, transactionId, retryCount });
}

/**
 * Get and remove a pending callback if it exists
 */
export function getPendingCallback(
  paymentReference?: string,
  transactionId?: string
): PendingCallback | null {
  const key = getCallbackKey(paymentReference, transactionId);
  if (!key) {
    return null;
  }

  const callback = pendingCallbacks.get(key);
  if (!callback) {
    return null;
  }

  // Check if callback has expired
  const age = Date.now() - callback.timestamp.getTime();
  if (age > CALLBACK_TTL) {
    console.warn(`Pending callback expired: ${key}`, { age, ttl: CALLBACK_TTL });
    pendingCallbacks.delete(key);
    return null;
  }

  return callback;
}

/**
 * Remove a pending callback (after successful processing)
 */
export function removePendingCallback(
  paymentReference?: string,
  transactionId?: string
): void {
  const key = getCallbackKey(paymentReference, transactionId);
  if (key) {
    pendingCallbacks.delete(key);
    console.log(`Removed pending callback: ${key}`);
  }
}

/**
 * Clean up expired callbacks (should be called periodically)
 */
export function cleanupExpiredCallbacks(): void {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, callback] of pendingCallbacks.entries()) {
    const age = now - callback.timestamp.getTime();
    if (age > CALLBACK_TTL) {
      pendingCallbacks.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`Cleaned up ${cleaned} expired pending callbacks`);
  }
}

// Clean up expired callbacks every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredCallbacks, 5 * 60 * 1000);
}

