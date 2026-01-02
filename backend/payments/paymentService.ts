/**
 * Payment Service
 * Main service that routes payments to appropriate gateway
 */

import { IPaymentGateway, PaymentRequest, PaymentResponse, PaymentVerification, RefundResponse, PaymentStatus } from './interfaces';
import { PayTodayGateway } from './gateways/PayTodayGateway';
import { SnapScanGateway } from './gateways/SnapScanGateway';
import { MobileMoneyGateway } from './gateways/MobileMoneyGateway';
import { BankTransferGateway } from './gateways/BankTransferGateway';
import { TransactionLogger } from './transactionLogger';

export class PaymentService {
  private gateways: Map<string, IPaymentGateway>;

  constructor() {
    this.gateways = new Map();
    this.initializeGateways();
  }

  /**
   * Initialize payment gateways
   */
  private initializeGateways(): void {
    // PayToday
    if (process.env.PAYTODAY_API_KEY && process.env.PAYTODAY_API_SECRET) {
      this.gateways.set('PAYTODAY', new PayTodayGateway({
        apiKey: process.env.PAYTODAY_API_KEY,
        apiSecret: process.env.PAYTODAY_API_SECRET,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
      }));
    }

    // SnapScan
    if (process.env.SNAPSCAN_API_KEY && process.env.SNAPSCAN_API_SECRET) {
      this.gateways.set('SNAPSCAN', new SnapScanGateway({
        apiKey: process.env.SNAPSCAN_API_KEY,
        apiSecret: process.env.SNAPSCAN_API_SECRET,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
      }));
    }

    // Mobile Money
    if (process.env.MOBILE_MONEY_PROVIDER) {
      this.gateways.set('MOBILE_MONEY', new MobileMoneyGateway({
        mobileMoneyProvider: process.env.MOBILE_MONEY_PROVIDER,
        apiKey: process.env.MOBILE_MONEY_API_KEY,
        apiSecret: process.env.MOBILE_MONEY_API_SECRET
      }));
    }

    // Bank Transfer
    this.gateways.set('BANK_TRANSFER', new BankTransferGateway({
      accountName: process.env.BANK_ACCOUNT_NAME,
      accountNumber: process.env.BANK_ACCOUNT_NUMBER,
      bankName: process.env.BANK_NAME || 'Standard Bank',
      branchCode: process.env.BANK_BRANCH_CODE
    }));
  }

  /**
   * Process payment
   */
  async processPayment(
    request: PaymentRequest,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<PaymentResponse> {
    const gateway = this.getGateway(request.method);
    
    if (!gateway) {
      await TransactionLogger.logTransaction({
        transactionType: 'PAYMENT',
        userId,
        amount: request.amount,
        currency: request.currency,
        status: 'FAILED',
        paymentMethod: request.method,
        errorMessage: `Unsupported payment method: ${request.method}`,
        ipAddress,
        userAgent
      });

      return {
        success: false,
        error: `Unsupported payment method: ${request.method}`
      };
    }

    try {
      const response = await gateway.processPayment(request);

      // Log transaction
      await TransactionLogger.logTransaction({
        transactionType: 'PAYMENT',
        transactionId: response.transactionId,
        userId,
        amount: request.amount,
        currency: request.currency,
        status: response.success ? 'SUCCESS' : 'FAILED',
        paymentMethod: request.method,
        gateway: response.gateway || request.method,
        gatewayTransactionId: response.transactionId,
        metadata: response.metadata,
        ipAddress,
        userAgent,
        errorMessage: response.error
      });

      return response;
    } catch (error: any) {
      await TransactionLogger.logTransaction({
        transactionType: 'PAYMENT',
        userId,
        amount: request.amount,
        currency: request.currency,
        status: 'FAILED',
        paymentMethod: request.method,
        gateway: request.method,
        errorMessage: error.message,
        ipAddress,
        userAgent
      });

      return {
        success: false,
        error: error.message || 'Payment processing failed'
      };
    }
  }

  /**
   * Verify payment
   */
  async verifyPayment(
    transactionId: string,
    method: string,
    userId?: string
  ): Promise<PaymentVerification> {
    const gateway = this.getGateway(method);
    
    if (!gateway) {
      return {
        verified: false,
        error: `Unsupported payment method: ${method}`
      };
    }

    try {
      return await gateway.verifyPayment(transactionId);
    } catch (error: any) {
      return {
        verified: false,
        error: error.message || 'Payment verification failed'
      };
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(
    transactionId: string,
    method: string,
    amount?: number,
    userId?: string
  ): Promise<RefundResponse> {
    const gateway = this.getGateway(method);
    
    if (!gateway) {
      return {
        success: false,
        error: `Unsupported payment method: ${method}`
      };
    }

    try {
      const response = await gateway.refundPayment(transactionId, amount);

      // Log refund transaction
      await TransactionLogger.logTransaction({
        transactionType: 'REFUND',
        transactionId,
        userId,
        status: response.success ? 'SUCCESS' : 'FAILED',
        paymentMethod: method,
        gateway: method,
        errorMessage: response.error
      });

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Refund processing failed'
      };
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(
    transactionId: string,
    method: string
  ): Promise<PaymentStatus> {
    const gateway = this.getGateway(method);
    
    if (!gateway) {
      return {
        status: 'FAILED',
        error: `Unsupported payment method: ${method}`
      };
    }

    try {
      return await gateway.getPaymentStatus(transactionId);
    } catch (error: any) {
      return {
        status: 'FAILED',
        error: error.message || 'Failed to get payment status'
      };
    }
  }

  /**
   * Get gateway instance
   */
  private getGateway(method: string): IPaymentGateway | undefined {
    // Normalize method name
    const normalizedMethod = method.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    
    // Try exact match first
    if (this.gateways.has(normalizedMethod)) {
      return this.gateways.get(normalizedMethod);
    }

    // Try alternative names
    const methodMap: Record<string, string> = {
      'CREDIT_CARD': 'PAYTODAY',
      'DEBIT_CARD': 'PAYTODAY',
      'CARD': 'PAYTODAY',
      'MOBILE': 'MOBILE_MONEY',
      'BANK': 'BANK_TRANSFER'
    };

    const mappedMethod = methodMap[normalizedMethod];
    if (mappedMethod && this.gateways.has(mappedMethod)) {
      return this.gateways.get(mappedMethod);
    }

    return undefined;
  }

  /**
   * Get available payment methods
   */
  getAvailablePaymentMethods(): string[] {
    return Array.from(this.gateways.keys());
  }
}

// Export singleton instance
export const paymentService = new PaymentService();

