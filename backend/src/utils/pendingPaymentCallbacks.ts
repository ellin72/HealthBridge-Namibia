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
 * Note: This function should only be called once per callback. The retry count tracks
 * how many times the callback was stored, not how many times processing failed.
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

  // Check if callback already exists - if it does, don't overwrite it
  // The existing callback should be processed, not replaced
  const existing = pendingCallbacks.get(key);
  if (existing) {
    // Callback already stored - don't overwrite or increment retry count
    // The retry count should only increment when processing fails, not when storing
    console.log(`Pending callback already exists: ${key}`, { 
      paymentReference, 
      transactionId, 
      existingRetryCount: existing.retryCount 
    });
    return;
  }

  // Store new callback with retry count starting at 0
  pendingCallbacks.set(key, {
    paymentReference,
    transactionId,
    status,
    metadata,
    timestamp: new Date(),
    retryCount: 0
  });

  console.log(`Stored pending callback: ${key}`, { paymentReference, transactionId });
}

/**
 * Get and remove a pending callback if it exists
 * This function removes the callback from the map to prevent duplicate processing
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

  // Remove callback from map to prevent duplicate processing
  // This ensures the callback can only be processed once
  pendingCallbacks.delete(key);
  
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

