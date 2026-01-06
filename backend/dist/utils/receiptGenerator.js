"use strict";
/**
 * Receipt Generation Service
 * Generates digital receipts for payments
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReceipt = generateReceipt;
exports.getReceipt = getReceipt;
const prisma_1 = require("./prisma");
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generate receipt for paid invoice
 */
async function generateReceipt(invoice, payment) {
    // Generate unique receipt number
    const receiptNumber = `RCP-${Date.now()}-${crypto_1.default.randomBytes(4).toString('hex').toUpperCase()}`;
    // In production, generate PDF using a library like pdfkit or puppeteer
    // For now, we'll create a record and return the receipt number
    const pdfUrl = `${process.env.API_URL}/receipts/${receiptNumber}/pdf`;
    // Create receipt record
    await prisma_1.prisma.receipt.create({
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
async function getReceipt(receiptNumber) {
    return await prisma_1.prisma.receipt.findUnique({
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
//# sourceMappingURL=receiptGenerator.js.map