/**
 * Policy Engine
 * Utility to retrieve and apply configurable policies
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export enum PolicyType {
  DATA_RETENTION = 'DATA_RETENTION',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  CONSENT = 'CONSENT',
  PAYMENT = 'PAYMENT',
  NOTIFICATION = 'NOTIFICATION',
  COMPLIANCE = 'COMPLIANCE'
}

/**
 * Get active policy by type
 */
export async function getActivePolicy(policyType: PolicyType): Promise<any | null> {
  try {
    const now = new Date();

    const policy = await prisma.policy.findFirst({
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
  } catch (error) {
    console.error('Error fetching policy:', error);
    return null;
  }
}

/**
 * Get data retention policy
 */
export async function getDataRetentionPolicy(): Promise<any> {
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
export async function getAccessControlPolicy(role: string): Promise<any> {
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
export async function getPaymentPolicy(): Promise<any> {
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
export async function getConsentPolicy(consentType: string): Promise<any> {
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
export async function requires2FAForPayment(amount: number): Promise<boolean> {
  const paymentPolicy = await getPaymentPolicy();
  
  if (!paymentPolicy.require2FA) {
    return false;
  }

  return amount >= (paymentPolicy.twoFAThreshold || 5000);
}

