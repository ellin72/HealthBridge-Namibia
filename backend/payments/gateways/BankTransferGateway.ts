/**
 * Bank Transfer Payment Gateway Implementation
 * Manual bank transfer processing
 */

import { BaseGateway } from './BaseGateway';
import { PaymentRequest, PaymentResponse, PaymentVerification, RefundResponse, PaymentStatus, PaymentGatewayConfig } from '../interfaces';

export class BankTransferGateway extends BaseGateway {
  private bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branchCode: string;
  };

  constructor(config: PaymentGatewayConfig) {
    super(config, 'BANK_TRANSFER');
    this.bankDetails = config.bankTransferDetails || {
      accountName: config.accountName || 'HealthBridge Namibia',
      accountNumber: config.accountNumber || '',
      bankName: config.bankName || 'Standard Bank',
      branchCode: config.branchCode || ''
    };
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const transactionId = this.generateTransactionId('BT');

      const instructions = `Please transfer NAD ${request.amount} to:
Account Name: ${this.bankDetails.accountName}
Account Number: ${this.bankDetails.accountNumber}
Bank: ${this.bankDetails.bankName}
Branch Code: ${this.bankDetails.branchCode}
Reference: ${request.reference}`;

      return {
        success: true,
        transactionId,
        instructions,
        gateway: 'BANK_TRANSFER',
        metadata: {
          reference: request.reference,
          amount: request.amount,
          bankDetails: this.bankDetails
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Bank transfer processing failed',
        gateway: 'BANK_TRANSFER'
      };
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerification> {
    try {
      // Bank transfers require manual verification
      return {
        verified: false,
        status: 'PENDING',
        metadata: {
          transactionId,
          gateway: 'BANK_TRANSFER',
          note: 'Requires manual verification'
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
      // Bank transfers require manual processing, so we return failure with clear message
      return {
        success: false,
        error: 'Bank transfer refunds require manual processing. Please contact support to initiate the refund.',
        status: 'REQUIRES_MANUAL_PROCESSING'
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
        status: 'PENDING',
        error: 'Bank transfer status requires manual verification'
      };
    } catch (error: any) {
      return {
        status: 'FAILED',
        error: error.message || 'Failed to get payment status'
      };
    }
  }
}

