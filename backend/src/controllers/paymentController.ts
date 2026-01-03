import { Request, Response } from 'express';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { paymentGateway } from '../utils/paymentGateway';
import { analyzePaymentForFraud, logFraudCheck } from '../utils/fraudDetection';
import { is2FAEnabled, verify2FAToken } from '../utils/twoFactorAuth';
import { encryptCardToken, maskCardNumber } from '../utils/financialEncryption';
import { sendPaymentConfirmation, sendReceiptEmail, sendReceiptSMS } from '../utils/notificationService';
import { generateReceipt } from '../utils/receiptGenerator';
import { 
  storePendingCallback, 
  getPendingCallback, 
  removePendingCallback 
} from '../utils/pendingPaymentCallbacks';

/**
 * Process a pending callback for an existing payment record
 * This is called when a payment record is created and a pending callback exists
 */
async function processPendingCallback(
  paymentId: string, 
  callback: { status: string; metadata?: any; transactionId?: string }
): Promise<void> {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { invoice: { include: { patient: true, provider: true } } }
    });

    if (!payment) {
      console.error(`Payment not found when processing pending callback: ${paymentId}`);
      return;
    }

    // Handle different status formats
    let paymentStatus: PaymentStatus = 'PENDING';
    if (callback.status === 'success' || callback.status === 'COMPLETED' || callback.status === 'completed') {
      paymentStatus = 'COMPLETED';
    } else if (callback.status === 'failed' || callback.status === 'FAILED' || callback.status === 'rejected') {
      paymentStatus = 'FAILED';
    } else if (callback.status === 'PENDING' || callback.status === 'pending') {
      paymentStatus = 'PENDING';
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: paymentStatus as PaymentStatus,
        transactionId: callback.transactionId || payment.transactionId,
        metadata: callback.metadata ? JSON.stringify(callback.metadata) : payment.metadata,
        completedAt: paymentStatus === 'COMPLETED' ? new Date() : null,
      },
    });

    // Update invoice if payment completed
    if (payment.invoice && paymentStatus === 'COMPLETED') {
      await prisma.billingInvoice.update({
        where: { id: payment.invoice.id },
        data: {
          status: 'PAID',
          paidDate: new Date()
        }
      });

      // Generate receipt and send notifications
      if (payment.invoice) {
        const receipt = await generateReceipt(payment.invoice, updatedPayment);
        
        await sendReceiptEmail({
          invoiceNumber: payment.invoice.invoiceNumber,
          receiptNumber: receipt.receiptNumber,
          patientName: `${payment.invoice.patient.firstName} ${payment.invoice.patient.lastName}`,
          patientEmail: payment.invoice.patient.email,
          patientPhone: payment.invoice.patient.phone || undefined,
          amount: updatedPayment.amount,
          currency: updatedPayment.currency,
          paymentMethod: updatedPayment.method,
          transactionId: updatedPayment.transactionId || undefined,
          items: JSON.parse(payment.invoice.items),
          subtotal: payment.invoice.subtotal,
          tax: payment.invoice.tax,
          discount: payment.invoice.discount,
          total: payment.invoice.total,
          pdfUrl: receipt.pdfUrl
        });

        if (payment.invoice.patient.phone) {
          await sendReceiptSMS({
            invoiceNumber: payment.invoice.invoiceNumber,
            receiptNumber: receipt.receiptNumber,
            patientName: `${payment.invoice.patient.firstName} ${payment.invoice.patient.lastName}`,
            patientPhone: payment.invoice.patient.phone,
            amount: updatedPayment.amount,
            currency: updatedPayment.currency,
            paymentMethod: updatedPayment.method,
            transactionId: updatedPayment.transactionId || undefined
          });
        }
      }
    }

    // Remove pending callback after successful processing
    removePendingCallback(payment.paymentReference || undefined, payment.transactionId || undefined);

    console.log(`Successfully processed pending callback for payment: ${paymentId}`, {
      status: paymentStatus,
      paymentReference: payment.paymentReference,
      transactionId: payment.transactionId
    });
  } catch (error: any) {
    console.error(`Error processing pending callback for payment ${paymentId}:`, error);
    throw error;
  }
}

// Create payment with fraud detection and 2FA
export const createPayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { invoiceId, appointmentId, amount, method, currency = 'NAD', cardToken, twoFactorToken } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] as string;
    const userAgent = req.headers['user-agent'];

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    if (!method) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // Check if invoice exists and get details
    let invoice = null;
    if (invoiceId) {
      invoice = await prisma.billingInvoice.findFirst({
        where: { id: invoiceId, patientId: userId },
        include: { patient: true, provider: true }
      });

      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

      if (invoice.status === 'PAID') {
        return res.status(400).json({ message: 'Invoice already paid' });
      }

      // Use invoice amount if provided
      if (Math.abs(amount - invoice.total) > 0.01) {
        return res.status(400).json({ message: 'Payment amount does not match invoice total' });
      }
    }

    // Fraud detection
    const fraudCheck = await analyzePaymentForFraud(userId, amount, method, ipAddress, userAgent);
    
    if (fraudCheck.recommendation === 'REJECT') {
      await logFraudCheck('', fraudCheck, ipAddress, userAgent);
      return res.status(403).json({
        message: 'Payment rejected due to security concerns',
        reason: fraudCheck.reasons
      });
    }

    // Check if 2FA is required
    const requires2FA = await is2FAEnabled(userId) || amount > 5000 || fraudCheck.flagged;
    
    if (requires2FA) {
      if (!twoFactorToken) {
        // Create payment with requires2FA flag
        const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        const payment = await prisma.payment.create({
          data: {
            userId,
            invoiceId: invoiceId || null,
            appointmentId: appointmentId || null,
            amount,
            currency,
            method: method as PaymentMethod,
            status: 'PENDING',
            paymentReference,
            requires2FA: true,
            metadata: JSON.stringify({ fraudCheck: fraudCheck.reasons })
          }
        });

        await logFraudCheck(payment.id, fraudCheck, ipAddress, userAgent);

        return res.status(200).json({
          message: 'Two-factor authentication required',
          paymentId: payment.id,
          requires2FA: true
        });
      }

      // Verify 2FA token
      const verified = await verify2FAToken(userId, twoFactorToken);
      if (!verified) {
        return res.status(401).json({ message: 'Invalid 2FA token' });
      }
    }

    // Encrypt card data if provided (PCI-DSS compliance)
    let encryptedCardData = null;
    if (cardToken && (method === 'CREDIT_CARD' || method === 'DEBIT_CARD')) {
      encryptedCardData = encryptCardToken(cardToken);
    }

    // Generate payment reference
    const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Get user details for payment gateway
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, phone: true, firstName: true, lastName: true }
    });

    // Process payment through gateway
    const gatewayResponse = await paymentGateway.processPayment({
      amount,
      currency,
      method,
      reference: paymentReference,
      customerEmail: user?.email,
      customerPhone: user?.phone || undefined,
      description: invoice ? `Invoice ${invoice.invoiceNumber}` : 'Payment',
      returnUrl: `${process.env.FRONTEND_URL}/payment/success`,
      cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel`
    });

    if (!gatewayResponse.success) {
      return res.status(400).json({
        message: 'Payment gateway error',
        error: gatewayResponse.error
      });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        invoiceId: invoiceId || null,
        appointmentId: appointmentId || null,
        amount,
        currency,
        method: method as PaymentMethod,
        status: gatewayResponse.transactionId ? 'COMPLETED' : 'PENDING',
        transactionId: gatewayResponse.transactionId,
        paymentReference,
        requires2FA: requires2FA,
        twoFactorVerified: requires2FA,
        encryptedCardData,
        completedAt: gatewayResponse.transactionId ? new Date() : null,
        metadata: JSON.stringify({
          fraudCheck: fraudCheck.reasons,
          gatewayResponse: gatewayResponse
        })
      }
    });

    // Log audit
    await logFraudCheck(payment.id, fraudCheck, ipAddress, userAgent);

    // Check for pending callbacks that may have arrived before payment record creation
    // Process them asynchronously to update the payment status
    const pendingCallback = getPendingCallback(payment.paymentReference || undefined, payment.transactionId || undefined);
    if (pendingCallback) {
      console.log(`Found pending callback for newly created payment: ${payment.id}`, {
        paymentReference: payment.paymentReference,
        transactionId: payment.transactionId
      });
      
      // Process the pending callback asynchronously (don't block the response)
      processPendingCallback(payment.id, pendingCallback).catch(error => {
        console.error('Error processing pending callback:', error);
      });
    }

    // Update invoice if payment completed
    if (invoice && gatewayResponse.transactionId) {
      await prisma.billingInvoice.update({
        where: { id: invoice.id },
        data: {
          status: 'PAID',
          paidDate: new Date()
        }
      });

      // Generate receipt
      const receipt = await generateReceipt(invoice, payment);
      
      // Send notifications
      await sendReceiptEmail({
        invoiceNumber: invoice.invoiceNumber,
        receiptNumber: receipt.receiptNumber,
        patientName: `${invoice.patient.firstName} ${invoice.patient.lastName}`,
        patientEmail: invoice.patient.email,
        patientPhone: invoice.patient.phone || undefined,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.method,
        transactionId: payment.transactionId || undefined,
        items: JSON.parse(invoice.items),
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        discount: invoice.discount,
        total: invoice.total,
        paidDate: payment.completedAt || new Date(),
        pdfUrl: receipt.pdfUrl
      });

      if (invoice.patient.phone) {
        await sendReceiptSMS({
          invoiceNumber: invoice.invoiceNumber,
          receiptNumber: receipt.receiptNumber,
          patientName: `${invoice.patient.firstName} ${invoice.patient.lastName}`,
          patientEmail: invoice.patient.email,
          patientPhone: invoice.patient.phone,
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.method,
          transactionId: payment.transactionId || undefined,
          items: JSON.parse(invoice.items),
          subtotal: invoice.subtotal,
          tax: invoice.tax,
          discount: invoice.discount,
          total: invoice.total,
          paidDate: payment.completedAt || new Date()
        });
      }
    }

    // Send payment confirmation
    if (gatewayResponse.transactionId && user) {
      await sendPaymentConfirmation(
        userId,
        amount,
        currency,
        method,
        gatewayResponse.transactionId
      );
    }

    res.status(201).json({
      message: 'Payment processed successfully',
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        status: payment.status,
        transactionId: payment.transactionId,
        paymentReference: payment.paymentReference,
        requires2FA: payment.requires2FA
      },
      gatewayUrl: gatewayResponse.paymentUrl,
      qrCode: gatewayResponse.qrCode,
      instructions: gatewayResponse.instructions,
      fraudCheck: fraudCheck.flagged ? {
        flagged: true,
        reasons: fraudCheck.reasons
      } : undefined
    });
  } catch (error: any) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Failed to create payment', error: error.message });
  }
};

// Verify 2FA and complete payment
export const verify2FAAndCompletePayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { paymentId, twoFactorToken } = req.body;

    if (!paymentId || !twoFactorToken) {
      return res.status(400).json({ message: 'Payment ID and 2FA token are required' });
    }

    const payment = await prisma.payment.findFirst({
      where: { id: paymentId, userId, requires2FA: true, twoFactorVerified: false }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found or 2FA not required' });
    }

    // Verify 2FA token
    const verified = await verify2FAToken(userId, twoFactorToken);
    if (!verified) {
      return res.status(401).json({ message: 'Invalid 2FA token' });
    }

    // Process payment through gateway
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, phone: true }
    });

    const gatewayResponse = await paymentGateway.processPayment({
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      reference: payment.paymentReference || '',
      customerEmail: user?.email,
      customerPhone: user?.phone || undefined
    });

    // Update payment
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        twoFactorVerified: true,
        status: gatewayResponse.success ? 'COMPLETED' : 'PENDING',
        transactionId: gatewayResponse.transactionId || payment.transactionId,
        completedAt: gatewayResponse.success ? new Date() : null
      }
    });

    res.json({
      message: 'Payment verified and processed',
      payment: updatedPayment,
      gatewayUrl: gatewayResponse.paymentUrl
    });
  } catch (error: any) {
    console.error('Verify 2FA payment error:', error);
    res.status(500).json({ message: 'Failed to verify payment', error: error.message });
  }
};

// Process payment callback (from payment gateway)
export const processPaymentCallback = async (req: Request, res: Response) => {
  try {
    const { paymentReference, transactionId, status, metadata } = req.body;

    // Validate that at least one identifier is provided
    if (!paymentReference && !transactionId) {
      return res.status(400).json({ 
        message: 'Invalid callback: paymentReference or transactionId is required',
        error: 'Missing payment identifier'
      });
    }

    // Try to find payment by paymentReference or transactionId
    let payment = null;
    if (paymentReference) {
      payment = await prisma.payment.findFirst({
        where: { paymentReference },
        include: { invoice: { include: { patient: true, provider: true } } }
      });
    } else if (transactionId) {
      payment = await prisma.payment.findFirst({
        where: { transactionId },
        include: { invoice: { include: { patient: true, provider: true } } }
      });
    }

    if (!payment) {
      // Payment not found - store callback for later processing
      // This handles race conditions where callback arrives before payment record is created
      storePendingCallback(paymentReference, transactionId, status, metadata);
      
      console.warn(`Payment callback received for non-existent payment, stored for later processing:`, { 
        paymentReference, 
        transactionId,
        status,
        metadata,
        timestamp: new Date().toISOString()
      });
      
      // Try to find payment again after a short delay (in case it was just created)
      // This handles the race condition where payment is created between our check and now
      setTimeout(async () => {
        try {
          let retryPayment = null;
          if (paymentReference) {
            retryPayment = await prisma.payment.findFirst({
              where: { paymentReference },
              include: { invoice: { include: { patient: true, provider: true } } }
            });
          } else if (transactionId) {
            retryPayment = await prisma.payment.findFirst({
              where: { transactionId },
              include: { invoice: { include: { patient: true, provider: true } } }
            });
          }

          if (retryPayment) {
            console.log(`Found payment on retry, processing pending callback: ${retryPayment.id}`);
            const pendingCallback = getPendingCallback(paymentReference, transactionId);
            if (pendingCallback) {
              await processPendingCallback(retryPayment.id, pendingCallback);
            }
          }
        } catch (error) {
          console.error('Error retrying payment callback:', error);
        }
      }, 2000); // Wait 2 seconds before retry
      
      // Return 202 Accepted to indicate we received the callback and will process it
      // Gateway will retry, and we'll also process it when payment record is created
      return res.status(202).json({ 
        message: 'Payment callback received, processing',
        error: 'Payment record not yet available, will be processed when available',
        paymentReference: paymentReference || null,
        transactionId: transactionId || null
      });
    }

    // Handle different status formats
    let paymentStatus: PaymentStatus = 'PENDING';
    if (status === 'success' || status === 'COMPLETED' || status === 'completed') {
      paymentStatus = 'COMPLETED';
    } else if (status === 'failed' || status === 'FAILED' || status === 'rejected') {
      paymentStatus = 'FAILED';
    } else if (status === 'PENDING' || status === 'pending') {
      paymentStatus = 'PENDING';
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: paymentStatus as PaymentStatus,
        transactionId: transactionId || payment.transactionId,
        metadata: metadata ? JSON.stringify(metadata) : payment.metadata,
        completedAt: paymentStatus === 'COMPLETED' ? new Date() : null,
      },
    });

    // Remove pending callback since we've successfully processed it
    removePendingCallback(payment.paymentReference || undefined, payment.transactionId || undefined);

    // Update invoice if payment completed
    if (payment.invoice && paymentStatus === 'COMPLETED') {
      await prisma.billingInvoice.update({
        where: { id: payment.invoice.id },
        data: {
          status: 'PAID',
          paidDate: new Date()
        }
      });

      // Generate receipt and send notifications
      if (payment.invoice) {
        const receipt = await generateReceipt(payment.invoice, updatedPayment);
        
        await sendReceiptEmail({
          invoiceNumber: payment.invoice.invoiceNumber,
          receiptNumber: receipt.receiptNumber,
          patientName: `${payment.invoice.patient.firstName} ${payment.invoice.patient.lastName}`,
          patientEmail: payment.invoice.patient.email,
          patientPhone: payment.invoice.patient.phone || undefined,
          amount: updatedPayment.amount,
          currency: updatedPayment.currency,
          paymentMethod: updatedPayment.method,
          transactionId: updatedPayment.transactionId || undefined,
          items: JSON.parse(payment.invoice.items),
          subtotal: payment.invoice.subtotal,
          tax: payment.invoice.tax,
          discount: payment.invoice.discount,
          total: payment.invoice.total,
          paidDate: updatedPayment.completedAt || new Date(),
          pdfUrl: receipt.pdfUrl
        });
      }
    }

    res.json({
      message: 'Payment status updated',
      payment: updatedPayment,
    });
  } catch (error: any) {
    console.error('Process payment callback error:', error);
    res.status(500).json({ message: 'Failed to process payment callback', error: error.message });
  }
};

// Get payment history
export const getPayments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, method, limit = 50, offset = 0 } = req.query;

    const where: any = { userId };
    if (status) where.status = status;
    if (method) where.method = method;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        skip: Number(offset),
        include: {
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
              total: true
            }
          }
        }
      }),
      prisma.payment.count({ where })
    ]);

    res.json({
      payments: payments.map(p => ({
        ...p,
        // Don't expose encrypted card data
        encryptedCardData: p.encryptedCardData ? maskCardNumber('****') : null
      })),
      total,
      limit: Number(limit),
      offset: Number(offset)
    });
  } catch (error: any) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
  }
};

// Get payment by ID
export const getPayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const payment = await prisma.payment.findFirst({
      where: { id, userId },
      include: {
        invoice: {
          include: {
            patient: { select: { id: true, firstName: true, lastName: true, email: true } },
            provider: { select: { id: true, firstName: true, lastName: true } }
          }
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      ...payment,
      encryptedCardData: payment.encryptedCardData ? maskCardNumber('****') : null
    });
  } catch (error: any) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Failed to fetch payment', error: error.message });
  }
};
