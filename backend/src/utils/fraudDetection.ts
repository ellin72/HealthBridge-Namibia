/**
 * Fraud Detection Service
 * Analyzes payment patterns and flags suspicious transactions
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface FraudCheckResult {
  riskScore: number; // 0-1, where 1 is highest risk
  flagged: boolean;
  reasons: string[];
  recommendation: 'APPROVE' | 'REVIEW' | 'REJECT';
}

/**
 * Analyze payment for fraud indicators
 */
export async function analyzePaymentForFraud(
  userId: string,
  amount: number,
  method: string,
  ipAddress?: string,
  userAgent?: string
): Promise<FraudCheckResult> {
  const reasons: string[] = [];
  let riskScore = 0;

  // Check 1: Unusual amount
  const avgAmount = await getAveragePaymentAmount(userId);
  if (avgAmount > 0) {
    const deviation = Math.abs(amount - avgAmount) / avgAmount;
    if (deviation > 2) { // More than 200% deviation
      riskScore += 0.3;
      reasons.push('Payment amount significantly different from user average');
    }
  }

  // Check 2: Multiple rapid payments
  const recentPayments = await getRecentPaymentsCount(userId, 5); // Last 5 minutes
  if (recentPayments > 3) {
    riskScore += 0.4;
    reasons.push('Multiple rapid payments detected');
  }

  // Check 3: Large amount
  if (amount > 10000) { // NAD 10,000
    riskScore += 0.2;
    reasons.push('Large payment amount');
  }

  // Check 4: Payment method risk
  if (method === 'BANK_TRANSFER' && amount > 5000) {
    riskScore += 0.1;
    reasons.push('Large bank transfer');
  }

  // Check 5: New payment method for user
  const hasUsedMethod = await hasUserUsedPaymentMethod(userId, method);
  if (!hasUsedMethod && amount > 1000) {
    riskScore += 0.2;
    reasons.push('New payment method for user with significant amount');
  }

  // Check 6: Geographic anomalies (if IP tracking available)
  if (ipAddress) {
    // In production, check against known user locations
    // For now, we'll skip this check
  }

  // Determine recommendation
  let recommendation: 'APPROVE' | 'REVIEW' | 'REJECT';
  if (riskScore >= 0.7) {
    recommendation = 'REJECT';
  } else if (riskScore >= 0.4) {
    recommendation = 'REVIEW';
  } else {
    recommendation = 'APPROVE';
  }

  return {
    riskScore: Math.min(riskScore, 1),
    flagged: riskScore >= 0.4,
    reasons,
    recommendation
  };
}

/**
 * Get average payment amount for user
 */
async function getAveragePaymentAmount(userId: string): Promise<number> {
  const result = await prisma.payment.aggregate({
    where: {
      userId,
      status: 'COMPLETED',
      createdAt: {
        gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
      }
    },
    _avg: {
      amount: true
    }
  });

  return result._avg.amount || 0;
}

/**
 * Get count of recent payments
 */
async function getRecentPaymentsCount(userId: string, minutes: number): Promise<number> {
  const count = await prisma.payment.count({
    where: {
      userId,
      createdAt: {
        gte: new Date(Date.now() - minutes * 60 * 1000)
      }
    }
  });

  return count;
}

/**
 * Check if user has used this payment method before
 */
async function hasUserUsedPaymentMethod(userId: string, method: string): Promise<boolean> {
  const count = await prisma.payment.count({
    where: {
      userId,
      method: method as any,
      status: 'COMPLETED'
    }
  });

  return count > 0;
}

/**
 * Log fraud detection result
 */
export async function logFraudCheck(
  paymentId: string,
  result: FraudCheckResult,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await prisma.paymentAuditLog.create({
    data: {
      paymentId,
      action: result.flagged ? 'SUSPICIOUS' : 'APPROVED',
      ipAddress,
      userAgent,
      details: JSON.stringify({
        riskScore: result.riskScore,
        reasons: result.reasons,
        recommendation: result.recommendation
      }),
      riskScore: result.riskScore,
      flagged: result.flagged
    }
  });
}

