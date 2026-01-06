/**
 * Notification Service for Receipts and Payment Confirmations
 * Supports Email, SMS, and In-App notifications
 */
export interface ReceiptData {
    invoiceNumber: string;
    receiptNumber: string;
    patientName: string;
    patientEmail: string;
    patientPhone?: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    transactionId?: string;
    items: Array<{
        description: string;
        quantity: number;
        price: number;
    }>;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    paidDate: Date;
    pdfUrl?: string;
}
/**
 * Send receipt via email
 */
export declare function sendReceiptEmail(receiptData: ReceiptData): Promise<boolean>;
/**
 * Send receipt via SMS
 */
export declare function sendReceiptSMS(receiptData: ReceiptData): Promise<boolean>;
/**
 * Send payment confirmation notification
 */
export declare function sendPaymentConfirmation(userId: string, amount: number, currency: string, method: string, transactionId?: string): Promise<void>;
//# sourceMappingURL=notificationService.d.ts.map