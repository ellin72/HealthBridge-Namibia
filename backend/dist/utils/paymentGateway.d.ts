/**
 * Payment Gateway Integration Service
 * Supports PayToday, SnapScan, Mobile Money, and Bank Transfers
 */
export interface PaymentGatewayConfig {
    paytodayApiKey?: string;
    paytodayApiSecret?: string;
    snapscanApiKey?: string;
    snapscanApiSecret?: string;
    mobileMoneyProvider?: string;
    bankTransferDetails?: {
        accountName: string;
        accountNumber: string;
        bankName: string;
        branchCode: string;
    };
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
}
export interface PaymentResponse {
    success: boolean;
    transactionId?: string;
    paymentUrl?: string;
    qrCode?: string;
    instructions?: string;
    error?: string;
}
declare class PaymentGatewayService {
    private config;
    constructor(config: PaymentGatewayConfig);
    /**
     * Process payment through appropriate gateway
     */
    processPayment(request: PaymentRequest): Promise<PaymentResponse>;
    /**
     * PayToday Payment Processing
     */
    private processPayToday;
    /**
     * SnapScan Payment Processing
     */
    private processSnapScan;
    /**
     * Mobile Money Payment Processing
     */
    private processMobileMoney;
    /**
     * Bank Transfer Processing
     */
    private processBankTransfer;
    /**
     * Card Payment Processing (PCI-DSS compliant)
     */
    private processCardPayment;
    /**
     * Verify payment status from gateway
     */
    verifyPayment(transactionId: string, method: string): Promise<{
        verified: boolean;
        status?: string;
        error?: string;
    }>;
}
export declare const paymentGateway: PaymentGatewayService;
export {};
//# sourceMappingURL=paymentGateway.d.ts.map