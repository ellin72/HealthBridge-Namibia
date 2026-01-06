"use strict";
/**
 * Policy Engine
 * Utility to retrieve and apply configurable policies
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyType = void 0;
exports.getActivePolicy = getActivePolicy;
exports.getDataRetentionPolicy = getDataRetentionPolicy;
exports.getAccessControlPolicy = getAccessControlPolicy;
exports.getPaymentPolicy = getPaymentPolicy;
exports.getConsentPolicy = getConsentPolicy;
exports.requires2FAForPayment = requires2FAForPayment;
const prisma_1 = require("./prisma");
var PolicyType;
(function (PolicyType) {
    PolicyType["DATA_RETENTION"] = "DATA_RETENTION";
    PolicyType["ACCESS_CONTROL"] = "ACCESS_CONTROL";
    PolicyType["CONSENT"] = "CONSENT";
    PolicyType["PAYMENT"] = "PAYMENT";
    PolicyType["NOTIFICATION"] = "NOTIFICATION";
    PolicyType["COMPLIANCE"] = "COMPLIANCE";
})(PolicyType || (exports.PolicyType = PolicyType = {}));
/**
 * Get active policy by type
 */
async function getActivePolicy(policyType) {
    try {
        const now = new Date();
        const policy = await prisma_1.prisma.policy.findFirst({
            where: {
                policyType,
                isActive: true,
                effectiveDate: { lte: now },
                OR: [
                    { expirationDate: null },
                    { expirationDate: { gte: now } }
                ]
            },
            orderBy: { version: 'desc' }
        });
        if (!policy) {
            return null;
        }
        return {
            ...policy,
            policyData: JSON.parse(policy.policyData)
        };
    }
    catch (error) {
        console.error('Error fetching policy:', error);
        return null;
    }
}
/**
 * Get data retention policy
 */
async function getDataRetentionPolicy() {
    const policy = await getActivePolicy(PolicyType.DATA_RETENTION);
    if (!policy) {
        // Default retention: 7 years (2555 days)
        return {
            retentionPeriod: 2555,
            autoDelete: false,
            archiveBeforeDelete: true
        };
    }
    return policy.policyData;
}
/**
 * Get access control policy
 */
async function getAccessControlPolicy(role) {
    const policy = await getActivePolicy(PolicyType.ACCESS_CONTROL);
    if (!policy) {
        return null;
    }
    const policyData = policy.policyData;
    // Find role-specific policy
    if (policyData.roles && policyData.roles[role]) {
        return policyData.roles[role];
    }
    return policyData.default || null;
}
/**
 * Get payment policy
 */
async function getPaymentPolicy() {
    const policy = await getActivePolicy(PolicyType.PAYMENT);
    if (!policy) {
        // Default payment policy
        return {
            maxTransactionAmount: 10000,
            require2FA: true,
            twoFAThreshold: 5000
        };
    }
    return policy.policyData;
}
/**
 * Get consent policy
 */
async function getConsentPolicy(consentType) {
    const policy = await getActivePolicy(PolicyType.CONSENT);
    if (!policy) {
        return null;
    }
    const policyData = policy.policyData;
    if (policyData.consents && policyData.consents[consentType]) {
        return policyData.consents[consentType];
    }
    return policyData.default || null;
}
/**
 * Check if 2FA is required for payment
 */
async function requires2FAForPayment(amount) {
    const paymentPolicy = await getPaymentPolicy();
    if (!paymentPolicy.require2FA) {
        return false;
    }
    return amount >= (paymentPolicy.twoFAThreshold || 5000);
}
//# sourceMappingURL=policyEngine.js.map