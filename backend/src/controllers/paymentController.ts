import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Create payment
export const createPayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { appointmentId, amount, method, currency = 'NAD' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    if (!method) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // Generate payment reference
    const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const payment = await prisma.payment.create({
      data: {
        userId,
        appointmentId: appointmentId || null,
        amount,
        currency,
        method,
        status: 'PENDING',
        paymentReference,
      },
    });

    // In a real implementation, this would initiate payment with the gateway
    // For now, we'll return the payment object for frontend to handle
    res.status(201).json({
      message: 'Payment initiated',
      payment,
      // Payment gateway URL or instructions would be returned here
      gatewayUrl: getPaymentGatewayUrl(method, paymentReference, amount),
    });
  } catch (error: any) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Failed to create payment', error: error.message });
  }
};

// Process payment callback (from payment gateway)
export const processPaymentCallback = async (req: Request, res: Response) => {
  try {
    const { paymentReference, transactionId, status, metadata } = req.body;

    if (!paymentReference) {
      return res.status(400).json({ message: 'Payment reference is required' });
    }

    const payment = await prisma.payment.findFirst({
      where: { paymentReference },
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: status === 'success' ? 'COMPLETED' : status === 'failed' ? 'FAILED' : 'PENDING',
        transactionId: transactionId || payment.transactionId,
        metadata: metadata ? JSON.stringify(metadata) : payment.metadata,
        completedAt: status === 'success' ? new Date() : null,
      },
    });

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

    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ payments });
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
      where: {
        id,
        userId,
      },
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ payment });
  } catch (error: any) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Failed to fetch payment', error: error.message });
  }
};

// Helper function to get payment gateway URL
function getPaymentGatewayUrl(method: string, reference: string, amount: number): string | null {
  switch (method) {
    case 'PAYTODAY':
      // In production, this would return the PayToday payment URL
      return `https://paytoday.com.na/pay?ref=${reference}&amount=${amount}`;
    case 'SNAPSCAN':
      // In production, this would return the SnapScan payment URL
      return `https://snapscan.co.za/pay?ref=${reference}&amount=${amount}`;
    case 'CREDIT_CARD':
      // In production, this would return the credit card payment gateway URL
      return `https://payment-gateway.com/pay?ref=${reference}&amount=${amount}`;
    default:
      return null;
  }
}

