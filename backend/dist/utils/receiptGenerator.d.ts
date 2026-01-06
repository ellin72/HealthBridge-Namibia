/**
 * Receipt Generation Service
 * Generates digital receipts for payments
 */
import { BillingInvoice, Payment } from '@prisma/client';
export interface Receipt {
    receiptNumber: string;
    pdfUrl?: string;
}
/**
 * Generate receipt for paid invoice
 */
export declare function generateReceipt(invoice: BillingInvoice, payment: Payment): Promise<Receipt>;
/**
 * Get receipt by number
 */
export declare function getReceipt(receiptNumber: string): Promise<({
    invoice: {
        patient: {
            id: string;
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            preferredLanguage: import(".prisma/client").$Enums.Language;
            createdAt: Date;
            updatedAt: Date;
        };
        provider: {
            id: string;
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            preferredLanguage: import(".prisma/client").$Enums.Language;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        providerId: string;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        notes: string | null;
        currency: string;
        appointmentId: string | null;
        invoiceNumber: string;
        items: string;
        subtotal: number;
        tax: number;
        discount: number;
        total: number;
        dueDate: Date;
        paidDate: Date | null;
    };
} & {
    id: string;
    createdAt: Date;
    receiptNumber: string;
    pdfUrl: string | null;
    emailSent: boolean;
    smsSent: boolean;
    emailSentAt: Date | null;
    smsSentAt: Date | null;
    invoiceId: string;
}) | null>;
//# sourceMappingURL=receiptGenerator.d.ts.map