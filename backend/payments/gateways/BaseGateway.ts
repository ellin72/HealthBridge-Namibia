/**
 * Base Payment Gateway
 * Abstract base class for all payment gateway implementations
 */

import { IPaymentGateway, PaymentRequest, PaymentResponse, PaymentVerification, RefundResponse, PaymentStatus, PaymentGatewayConfig } from '../interfaces';

export abstract class BaseGateway implements IPaymentGateway {
  protected config: PaymentGatewayConfig;
  protected gatewayName: string;

  constructor(config: PaymentGatewayConfig, gatewayName: string) {
    this.config = config;
    this.gatewayName = gatewayName;
  }

  /**
   * Process payment - must be implemented by subclasses
   */
  abstract processPayment(request: PaymentRequest): Promise<PaymentResponse>;

  /**
   * Verify payment - must be implemented by subclasses
   */
  abstract verifyPayment(transactionId: string): Promise<PaymentVerification>;

  /**
   * Refund payment - must be implemented by subclasses
   */
  abstract refundPayment(transactionId: string, amount?: number): Promise<RefundResponse>;

  /**
   * Get payment status - must be implemented by subclasses
   */
  abstract getPaymentStatus(transactionId: string): Promise<PaymentStatus>;

  /**
   * Validate configuration
   */
  protected validateConfig(): boolean {
    if (!this.config.apiKey) {
      throw new Error(`${this.gatewayName} API key not configured`);
    }
    return true;
  }

  /**
   * Generate transaction ID
   */
  protected generateTransactionId(prefix: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Get gateway name
   */
  getGatewayName(): string {
    return this.gatewayName;
  }
}

