"use strict";
/**
 * Fraud Detection Service
 * Analyzes payment patterns and flags suspicious transactions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePaymentForFraud = analyzePaymentForFraud;
exports.logFraudCheck = logFraudCheck;
const prisma_1 = require("./prisma");
/**
 * Analyze payment for fraud indicators
 */
async function analyzePaymentForFraud(userId, amount, method, ipAddress, userAgent) {
    const reasons = [];
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
    let recommendation;
    if (riskScore >= 0.7) {
        recommendation = 'REJECT';
    }
    else if (riskScore >= 0.4) {
        recommendation = 'REVIEW';
    }
    else {
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
async function getAveragePaymentAmount(userId) {
    const result = await prisma_1.prisma.payment.aggregate({
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
async function getRecentPaymentsCount(userId, minutes) {
    const count = await prisma_1.prisma.payment.count({
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
async function hasUserUsedPaymentMethod(userId, method) {
    const count = await prisma_1.prisma.payment.count({
        where: {
            userId,
            method: method,
            status: 'COMPLETED'
        }
    });
    return count > 0;
}
/**
 * Log fraud detection result
 */
async function logFraudCheck(paymentId, result, ipAddress, userAgent) {
    await prisma_1.prisma.paymentAuditLog.create({
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
//# sourceMappingURL=fraudDetection.js.map