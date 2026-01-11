/**
 * Notification Service for Receipts and Payment Confirmations
 * Supports Email, SMS, and In-App notifications
 */

import { prisma } from './prisma';
import { NotificationType } from '@prisma/client';
import { createNotification } from '../controllers/notificationController';

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
export async function sendReceiptEmail(receiptData: ReceiptData): Promise<boolean> {
  try {
    // In production, use a service like SendGrid, AWS SES, or Nodemailer
    const emailContent = generateReceiptEmail(receiptData);
    
    // Mock email sending - replace with actual email service
    console.log(`Sending receipt email to ${receiptData.patientEmail}`);
    console.log('Email content:', emailContent);
    
    // Update receipt record
    await prisma.receipt.updateMany({
      where: { receiptNumber: receiptData.receiptNumber },
      data: {
        emailSent: true,
        emailSentAt: new Date()
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error sending receipt email:', error);
    return false;
  }
}

/**
 * Send receipt via SMS
 */
export async function sendReceiptSMS(receiptData: ReceiptData): Promise<boolean> {
  try {
    if (!receiptData.patientPhone) {
      return false;
    }

    // In production, use a service like Twilio, AWS SNS, or local SMS gateway
    const smsContent = generateReceiptSMS(receiptData);
    
    console.log(`Sending receipt SMS to ${receiptData.patientPhone}`);
    console.log('SMS content:', smsContent);
    
    // Update receipt record
    await prisma.receipt.updateMany({
      where: { receiptNumber: receiptData.receiptNumber },
      data: {
        smsSent: true,
        smsSentAt: new Date()
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error sending receipt SMS:', error);
    return false;
  }
}

/**
 * Send payment confirmation notification
 */
export async function sendPaymentConfirmation(
  userId: string,
  amount: number,
  currency: string,
  method: string,
  transactionId?: string
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, phone: true, firstName: true }
    });

    if (!user) return;

    // Send email notification
    if (user.email) {
      const emailContent = `
        Dear ${user.firstName},
        
        Your payment of ${currency} ${amount.toFixed(2)} has been successfully processed.
        
        Payment Method: ${method}
        Transaction ID: ${transactionId || 'N/A'}
        
        Thank you for using HealthBridge Namibia!
      `;
      console.log(`Sending payment confirmation email to ${user.email}`);
    }

    // Send SMS notification
    if (user.phone) {
      const smsContent = `HealthBridge: Payment of ${currency} ${amount.toFixed(2)} confirmed. Ref: ${transactionId || 'N/A'}`;
      console.log(`Sending payment confirmation SMS to ${user.phone}`);
    }
  } catch (error) {
    console.error('Error sending payment confirmation:', error);
  }
}

/**
 * Generate receipt email content
 */
function generateReceiptEmail(data: ReceiptData): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Payment Receipt - HealthBridge Namibia</h2>
        <p>Dear ${data.patientName},</p>
        <p>Thank you for your payment. Please find your receipt details below:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Receipt Number:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.receiptNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Invoice Number:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.invoiceNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Payment Method:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.paymentMethod}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Transaction ID:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.transactionId || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.paidDate.toLocaleDateString()}</td>
          </tr>
        </table>

        <h3>Items:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 8px; text-align: left;">Description</th>
              <th style="padding: 8px; text-align: right;">Quantity</th>
              <th style="padding: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td style="padding: 8px;">${item.description}</td>
                <td style="padding: 8px; text-align: right;">${item.quantity}</td>
                <td style="padding: 8px; text-align: right;">${data.currency} ${item.price.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <table style="width: 100%; margin-top: 20px;">
          <tr>
            <td style="padding: 8px; text-align: right;"><strong>Subtotal:</strong></td>
            <td style="padding: 8px; text-align: right;">${data.currency} ${data.subtotal.toFixed(2)}</td>
          </tr>
          ${data.tax > 0 ? `
            <tr>
              <td style="padding: 8px; text-align: right;"><strong>Tax:</strong></td>
              <td style="padding: 8px; text-align: right;">${data.currency} ${data.tax.toFixed(2)}</td>
            </tr>
          ` : ''}
          ${data.discount > 0 ? `
            <tr>
              <td style="padding: 8px; text-align: right;"><strong>Discount:</strong></td>
              <td style="padding: 8px; text-align: right;">-${data.currency} ${data.discount.toFixed(2)}</td>
            </tr>
          ` : ''}
          <tr style="border-top: 2px solid #000;">
            <td style="padding: 8px; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 8px; text-align: right;"><strong>${data.currency} ${data.total.toFixed(2)}</strong></td>
          </tr>
        </table>

        <p style="margin-top: 30px;">This is an automated receipt. Please keep this for your records.</p>
        <p>Thank you for choosing HealthBridge Namibia!</p>
      </body>
    </html>
  `;
}

/**
 * Generate receipt SMS content
 */
function generateReceiptSMS(data: ReceiptData): string {
  return `HealthBridge Receipt: ${data.receiptNumber}\nAmount: ${data.currency} ${data.total.toFixed(2)}\nPayment: ${data.paymentMethod}\nDate: ${data.paidDate.toLocaleDateString()}\nThank you!`;
}

/**
 * Create in-app notification
 */
export async function createInAppNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  link?: string,
  metadata?: any
): Promise<void> {
  try {
    await createNotification(userId, type, title, message, link, metadata);
  } catch (error) {
    console.error('Error creating in-app notification:', error);
  }
}

/**
 * Create appointment notification
 */
export async function notifyAppointmentCreated(
  userId: string,
  appointmentId: string,
  providerName: string,
  appointmentDate: Date
): Promise<void> {
  await createInAppNotification(
    userId,
    'APPOINTMENT',
    'Appointment Scheduled',
    `Your appointment with ${providerName} is scheduled for ${appointmentDate.toLocaleString()}`,
    `/appointments/${appointmentId}`,
    { appointmentId, providerName, appointmentDate: appointmentDate.toISOString() }
  );
}

/**
 * Create appointment reminder notification
 */
export async function notifyAppointmentReminder(
  userId: string,
  appointmentId: string,
  providerName: string,
  appointmentDate: Date
): Promise<void> {
  await createInAppNotification(
    userId,
    'APPOINTMENT_REMINDER',
    'Appointment Reminder',
    `Reminder: You have an appointment with ${providerName} in 24 hours`,
    `/appointments/${appointmentId}`,
    { appointmentId, providerName, appointmentDate: appointmentDate.toISOString() }
  );
}

/**
 * Create payment success notification
 */
export async function notifyPaymentSuccess(
  userId: string,
  amount: number,
  currency: string,
  invoiceId?: string
): Promise<void> {
  await createInAppNotification(
    userId,
    'PAYMENT_SUCCESS',
    'Payment Successful',
    `Your payment of ${currency} ${amount.toFixed(2)} has been processed successfully`,
    invoiceId ? `/billing` : undefined,
    { amount, currency, invoiceId }
  );
}

/**
 * Create prescription notification
 */
export async function notifyPrescriptionReady(
  userId: string,
  prescriptionId: string,
  providerName: string
): Promise<void> {
  await createInAppNotification(
    userId,
    'PRESCRIPTION',
    'New Prescription Available',
    `Dr. ${providerName} has prescribed new medication for you`,
    `/prescriptions/${prescriptionId}`,
    { prescriptionId, providerName }
  );
}

/**
 * Create assignment graded notification
 */
export async function notifyAssignmentGraded(
  userId: string,
  assignmentId: string,
  grade: number,
  assignmentTitle: string
): Promise<void> {
  await createInAppNotification(
    userId,
    'ASSIGNMENT_GRADED',
    'Assignment Graded',
    `Your assignment "${assignmentTitle}" has been graded: ${grade}%`,
    `/learning/assignments/${assignmentId}`,
    { assignmentId, grade, assignmentTitle }
  );
}

