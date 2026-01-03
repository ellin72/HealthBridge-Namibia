/**
 * Receipt Generation Service
 * Generates digital receipts for payments
 */

import { BillingInvoice, Payment } from '@prisma/client';
import { prisma } from './prisma';
import crypto from 'crypto';

export interface Receipt {
  receiptNumber: string;
  pdfUrl?: string;
}

/**
 * Generate receipt for paid invoice
 */
export async function generateReceipt(
  invoice: BillingInvoice,
  payment: Payment
): Promise<Receipt> {
  // Generate unique receipt number
  const receiptNumber = `RCP-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  // In production, generate PDF using a library like pdfkit or puppeteer
  // For now, we'll create a record and return the receipt number
  const pdfUrl = `${process.env.API_URL}/receipts/${receiptNumber}/pdf`;

  // Create receipt record
  await prisma.receipt.create({
    data: {
      invoiceId: invoice.id,
      receiptNumber,
      pdfUrl,
      emailSent: false,
      smsSent: false
    }
  });

  return {
    receiptNumber,
    pdfUrl
  };
}

/**
 * Get receipt by number
 */
export async function getReceipt(receiptNumber: string) {
  return await prisma.receipt.findUnique({
    where: { receiptNumber },
    include: {
      invoice: {
        include: {
          patient: true,
          provider: true
        }
      }
    }
  });
}

