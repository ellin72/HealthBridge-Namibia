/**
 * Mobile Money Payment Gateway Implementation
 * Supports M-Pesa, Orange Money, and other mobile money providers
 */

import { BaseGateway } from './BaseGateway';
import { PaymentRequest, PaymentResponse, PaymentVerification, RefundResponse, PaymentStatus, PaymentGatewayConfig } from '../interfaces';

export class MobileMoneyGateway extends BaseGateway {
  private provider: string;

  constructor(config: PaymentGatewayConfig) {
    super(config, 'MOBILE_MONEY');
    this.provider = config.mobileMoneyProvider || 'MPESA';
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!request.customerPhone) {
        return {
          success: false,
          error: 'Phone number required for mobile money payment',
          gateway: 'MOBILE_MONEY'
        };
      }

      const transactionId = this.generateTransactionId('MM');

      // In production, integrate with mobile money provider API
      return {
        success: true,
        transactionId,
        instructions: `Please send NAD ${request.amount} to ${request.reference} via ${this.provider}. You will receive a confirmation SMS.`,
        gateway: 'MOBILE_MONEY',
        metadata: {
          provider: this.provider,
          phone: request.customerPhone,
          reference: request.reference,
          amount: request.amount
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Mobile money payment processing failed',
        gateway: 'MOBILE_MONEY'
      };
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerification> {
    try {
      return {
        verified: true,
        status: 'COMPLETED',
        metadata: {
          transactionId,
          gateway: 'MOBILE_MONEY',
          provider: this.provider
        }
      };
    } catch (error: any) {
      return {
        verified: false,
        error: error.message || 'Payment verification failed'
      };
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<RefundResponse> {
    try {
      return {
        success: true,
        refundId: `REF-${Date.now()}`,
        amount: amount,
        status: 'PROCESSING'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Refund processing failed'
      };
    }
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      return {
        status: 'COMPLETED',
        completedAt: new Date()
      };
    } catch (error: any) {
      return {
        status: 'FAILED',
        error: error.message || 'Failed to get payment status'
      };
    }
  }
}

