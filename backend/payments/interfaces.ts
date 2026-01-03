/**
 * Payment Gateway Interfaces
 * Common interfaces for payment gateway implementations
 */

export interface IPaymentGateway {
  /**
   * Process a payment
   */
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;

  /**
   * Verify payment status
   */
  verifyPayment(transactionId: string): Promise<PaymentVerification>;

  /**
   * Refund a payment
   */
  refundPayment(transactionId: string, amount?: number): Promise<RefundResponse>;

  /**
   * Get payment status
   */
  getPaymentStatus(transactionId: string): Promise<PaymentStatus>;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  method: string;
  reference: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
  returnUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  qrCode?: string;
  instructions?: string;
  error?: string;
  gateway?: string;
  metadata?: Record<string, any>;
}

export interface PaymentVerification {
  verified: boolean;
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  amount?: number;
  currency?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  amount?: number;
  status?: string;
  error?: string;
}

export interface PaymentStatus {
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  amount?: number;
  currency?: string;
  completedAt?: Date;
  error?: string;
}

export interface PaymentGatewayConfig {
  apiKey?: string;
  apiSecret?: string;
  merchantId?: string;
  environment?: 'sandbox' | 'production';
  webhookSecret?: string;
  [key: string]: any;
}

