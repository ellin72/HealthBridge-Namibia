"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayment = exports.getPayments = exports.processPaymentCallback = exports.verify2FAAndCompletePayment = exports.createPayment = void 0;
const prisma_1 = require("../utils/prisma");
const paymentGateway_1 = require("../utils/paymentGateway");
const fraudDetection_1 = require("../utils/fraudDetection");
const twoFactorAuth_1 = require("../utils/twoFactorAuth");
const financialEncryption_1 = require("../utils/financialEncryption");
const notificationService_1 = require("../utils/notificationService");
const receiptGenerator_1 = require("../utils/receiptGenerator");
const pendingPaymentCallbacks_1 = require("../utils/pendingPaymentCallbacks");
/**
 * Process a pending callback for an existing payment record
 * This is called when a payment record is created and a pending callback exists
 */
async function processPendingCallback(paymentId, callback) {
    try {
        const payment = await prisma_1.prisma.payment.findUnique({
            where: { id: paymentId },
            include: { invoice: { include: { patient: true, provider: true } } }
        });
        if (!payment) {
            console.error(`Payment not found when processing pending callback: ${paymentId}`);
            return;
        }
        // Handle different status formats
        let paymentStatus = 'PENDING';
        if (callback.status === 'success' || callback.status === 'COMPLETED' || callback.status === 'completed') {
            paymentStatus = 'COMPLETED';
        }
        else if (callback.status === 'failed' || callback.status === 'FAILED' || callback.status === 'rejected') {
            paymentStatus = 'FAILED';
        }
        else if (callback.status === 'PENDING' || callback.status === 'pending') {
            paymentStatus = 'PENDING';
        }
        const updatedPayment = await prisma_1.prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: paymentStatus,
                transactionId: callback.transactionId || payment.transactionId,
                metadata: callback.metadata ? JSON.stringify(callback.metadata) : payment.metadata,
                completedAt: paymentStatus === 'COMPLETED' ? new Date() : null,
            },
        });
        // Update invoice if payment completed
        if (payment.invoice && paymentStatus === 'COMPLETED') {
            await prisma_1.prisma.billingInvoice.update({
                where: { id: payment.invoice.id },
                data: {
                    status: 'PAID',
                    paidDate: new Date()
                }
            });
            // Generate receipt and send notifications
            if (payment.invoice) {
                const receipt = await (0, receiptGenerator_1.generateReceipt)(payment.invoice, updatedPayment);
                await (0, notificationService_1.sendReceiptEmail)({
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
                if (payment.invoice.patient.phone) {
                    await (0, notificationService_1.sendReceiptSMS)({
                        invoiceNumber: payment.invoice.invoiceNumber,
                        receiptNumber: receipt.receiptNumber,
                        patientName: `${payment.invoice.patient.firstName} ${payment.invoice.patient.lastName}`,
                        patientEmail: payment.invoice.patient.email,
                        patientPhone: payment.invoice.patient.phone,
                        amount: updatedPayment.amount,
                        currency: updatedPayment.currency,
                        paymentMethod: updatedPayment.method,
                        transactionId: updatedPayment.transactionId || undefined,
                        items: JSON.parse(payment.invoice.items),
                        subtotal: payment.invoice.subtotal,
                        tax: payment.invoice.tax,
                        discount: payment.invoice.discount,
                        total: payment.invoice.total,
                        paidDate: updatedPayment.completedAt || new Date()
                    });
                }
            }
        }
        // Remove callback from map after successful processing
        // This ensures the callback is only removed after successful completion
        // If processing fails, the callback remains in the map for retry
        (0, pendingPaymentCallbacks_1.removePendingCallback)(payment.paymentReference || undefined, payment.transactionId || undefined);
        console.log(`Successfully processed pending callback for payment: ${paymentId}`, {
            status: paymentStatus,
            paymentReference: payment.paymentReference,
            transactionId: payment.transactionId
        });
    }
    catch (error) {
        console.error(`Error processing pending callback for payment ${paymentId}:`, error);
        throw error;
    }
}
// Create payment with fraud detection and 2FA
const createPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { invoiceId, appointmentId, amount, method, currency = 'NAD', cardToken, twoFactorToken } = req.body;
        const ipAddress = req.ip || req.headers['x-forwarded-for'];
        const userAgent = req.headers['user-agent'];
        console.log('Payment request received:', {
            userId,
            invoiceId,
            appointmentId,
            amount,
            method,
            currency
        });
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Valid amount is required' });
        }
        if (!method) {
            return res.status(400).json({ message: 'Payment method is required' });
        }
        // Check if invoice exists and get details
        let invoice = null;
        let finalAmount = amount; // Default to provided amount
        if (invoiceId) {
            invoice = await prisma_1.prisma.billingInvoice.findFirst({
                where: { id: invoiceId, patientId: userId },
                include: { patient: true, provider: true }
            });
            if (!invoice) {
                console.error('Invoice not found:', { invoiceId, userId });
                return res.status(404).json({
                    message: 'Invoice not found',
                    details: 'The invoice ID provided does not exist or does not belong to you'
                });
            }
            if (invoice.status === 'PAID') {
                return res.status(400).json({ message: 'Invoice already paid' });
            }
            // Use invoice amount if provided - allow small rounding differences
            const amountDifference = Math.abs(amount - invoice.total);
            if (amountDifference > 0.01) {
                console.error('Amount mismatch:', {
                    providedAmount: amount,
                    invoiceTotal: invoice.total,
                    difference: amountDifference
                });
                return res.status(400).json({
                    message: 'Payment amount does not match invoice total',
                    details: `Expected ${invoice.currency} ${invoice.total.toFixed(2)}, but received ${amount.toFixed(2)}`
                });
            }
            // Use invoice amount to ensure exact match
            finalAmount = invoice.total;
        }
        else if (appointmentId) {
            // If no invoiceId but appointmentId is provided, try to find the invoice for this appointment
            invoice = await prisma_1.prisma.billingInvoice.findFirst({
                where: {
                    appointmentId: appointmentId,
                    patientId: userId,
                    status: { not: 'PAID' }
                },
                include: { patient: true, provider: true }
            });
            if (invoice) {
                // Use invoice amount if found
                const amountDifference = Math.abs(amount - invoice.total);
                if (amountDifference > 0.01) {
                    console.warn('Amount mismatch with appointment invoice:', {
                        providedAmount: amount,
                        invoiceTotal: invoice.total,
                        difference: amountDifference
                    });
                }
                // Use invoice amount to ensure exact match
                finalAmount = invoice.total;
            }
        }
        // Fraud detection
        const fraudCheck = await (0, fraudDetection_1.analyzePaymentForFraud)(userId, amount, method, ipAddress, userAgent);
        if (fraudCheck.recommendation === 'REJECT') {
            await (0, fraudDetection_1.logFraudCheck)('', fraudCheck, ipAddress, userAgent);
            return res.status(403).json({
                message: 'Payment rejected due to security concerns',
                reason: fraudCheck.reasons
            });
        }
        // Check if 2FA is required (use finalAmount for threshold check)
        const requires2FA = await (0, twoFactorAuth_1.is2FAEnabled)(userId) || finalAmount > 5000 || fraudCheck.flagged;
        if (requires2FA) {
            if (!twoFactorToken) {
                // Create payment with requires2FA flag
                const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
                const payment = await prisma_1.prisma.payment.create({
                    data: {
                        userId,
                        invoiceId: invoice?.id || invoiceId || null,
                        appointmentId: appointmentId || null,
                        amount: finalAmount,
                        currency,
                        method: method,
                        status: 'PENDING',
                        paymentReference,
                        requires2FA: true,
                        metadata: JSON.stringify({ fraudCheck: fraudCheck.reasons })
                    }
                });
                await (0, fraudDetection_1.logFraudCheck)(payment.id, fraudCheck, ipAddress, userAgent);
                return res.status(200).json({
                    message: 'Two-factor authentication required',
                    paymentId: payment.id,
                    requires2FA: true
                });
            }
            // Verify 2FA token
            const verified = await (0, twoFactorAuth_1.verify2FAToken)(userId, twoFactorToken);
            if (!verified) {
                return res.status(401).json({ message: 'Invalid 2FA token' });
            }
        }
        // Encrypt card data if provided (PCI-DSS compliance)
        let encryptedCardData = null;
        if (cardToken && (method === 'CREDIT_CARD' || method === 'DEBIT_CARD')) {
            encryptedCardData = (0, financialEncryption_1.encryptCardToken)(cardToken);
        }
        // Generate payment reference
        const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        // Get user details for payment gateway
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, phone: true, firstName: true, lastName: true }
        });
        // Process payment through gateway (finalAmount is already set above)
        const gatewayResponse = await paymentGateway_1.paymentGateway.processPayment({
            amount: finalAmount,
            currency,
            method,
            reference: paymentReference,
            customerEmail: user?.email,
            customerPhone: user?.phone || undefined,
            description: invoice ? `Invoice ${invoice.invoiceNumber}` : 'Payment',
            returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`,
            cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel`
        });
        if (!gatewayResponse.success) {
            console.error('Payment gateway error:', {
                method,
                amount: finalAmount,
                currency,
                error: gatewayResponse.error
            });
            return res.status(400).json({
                message: 'Payment gateway error',
                error: gatewayResponse.error || 'Failed to process payment. Please check payment method configuration.',
                details: `The ${method} payment gateway is not properly configured or returned an error.`
            });
        }
        // Create payment record - use finalAmount (invoice total if available)
        const payment = await prisma_1.prisma.payment.create({
            data: {
                userId,
                invoiceId: invoice?.id || invoiceId || null,
                appointmentId: appointmentId || null,
                amount: finalAmount,
                currency,
                method: method,
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
        await (0, fraudDetection_1.logFraudCheck)(payment.id, fraudCheck, ipAddress, userAgent);
        // Check for pending callbacks that may have arrived before payment record creation
        // Process them asynchronously to update the payment status
        // Use peekPendingCallback first to check if callback exists without removing it
        const pendingCallback = (0, pendingPaymentCallbacks_1.peekPendingCallback)(payment.paymentReference || undefined, payment.transactionId || undefined);
        if (pendingCallback) {
            console.log(`Found pending callback for newly created payment: ${payment.id}`, {
                paymentReference: payment.paymentReference,
                transactionId: payment.transactionId
            });
            // Get and remove the callback atomically to prevent duplicate processing
            // This ensures only one process can retrieve and process the callback
            const callbackToProcess = (0, pendingPaymentCallbacks_1.getPendingCallback)(payment.paymentReference || undefined, payment.transactionId || undefined);
            if (callbackToProcess) {
                // Process the pending callback asynchronously (don't block the response)
                // Use setImmediate to ensure it runs after the response is sent, but still track errors
                // Wrap in Promise.resolve().catch() to handle unhandled promise rejections
                setImmediate(() => {
                    Promise.resolve(processPendingCallback(payment.id, callbackToProcess)).catch((error) => {
                        // Log error with payment context for debugging
                        console.error(`Error processing pending callback for payment ${payment.id}:`, {
                            error: error.message,
                            stack: error.stack,
                            paymentReference: payment.paymentReference,
                            transactionId: payment.transactionId,
                            callbackStatus: callbackToProcess.status
                        });
                        // If processing fails, re-store the callback so it can be retried
                        // This prevents the callback from being permanently lost
                        (0, pendingPaymentCallbacks_1.storePendingCallback)(callbackToProcess.paymentReference, callbackToProcess.transactionId, callbackToProcess.status, callbackToProcess.metadata);
                        console.log(`Re-stored pending callback after processing failure for payment ${payment.id}`);
                    });
                });
            }
        }
        // Update invoice if payment completed
        if (invoice && gatewayResponse.transactionId) {
            await prisma_1.prisma.billingInvoice.update({
                where: { id: invoice.id },
                data: {
                    status: 'PAID',
                    paidDate: new Date()
                }
            });
            // Generate receipt
            const receipt = await (0, receiptGenerator_1.generateReceipt)(invoice, payment);
            // Send notifications
            await (0, notificationService_1.sendReceiptEmail)({
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
                await (0, notificationService_1.sendReceiptSMS)({
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
            await (0, notificationService_1.sendPaymentConfirmation)(userId, amount, currency, method, gatewayResponse.transactionId);
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
    }
    catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({ message: 'Failed to create payment', error: error.message });
    }
};
exports.createPayment = createPayment;
// Verify 2FA and complete payment
const verify2FAAndCompletePayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { paymentId, twoFactorToken } = req.body;
        if (!paymentId || !twoFactorToken) {
            return res.status(400).json({ message: 'Payment ID and 2FA token are required' });
        }
        const payment = await prisma_1.prisma.payment.findFirst({
            where: { id: paymentId, userId, requires2FA: true, twoFactorVerified: false }
        });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found or 2FA not required' });
        }
        // Verify 2FA token
        const verified = await (0, twoFactorAuth_1.verify2FAToken)(userId, twoFactorToken);
        if (!verified) {
            return res.status(401).json({ message: 'Invalid 2FA token' });
        }
        // Process payment through gateway
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, phone: true }
        });
        const gatewayResponse = await paymentGateway_1.paymentGateway.processPayment({
            amount: payment.amount,
            currency: payment.currency,
            method: payment.method,
            reference: payment.paymentReference || '',
            customerEmail: user?.email,
            customerPhone: user?.phone || undefined
        });
        // Update payment
        const updatedPayment = await prisma_1.prisma.payment.update({
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
    }
    catch (error) {
        console.error('Verify 2FA payment error:', error);
        res.status(500).json({ message: 'Failed to verify payment', error: error.message });
    }
};
exports.verify2FAAndCompletePayment = verify2FAAndCompletePayment;
// Process payment callback (from payment gateway)
const processPaymentCallback = async (req, res) => {
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
            payment = await prisma_1.prisma.payment.findFirst({
                where: { paymentReference },
                include: { invoice: { include: { patient: true, provider: true } } }
            });
        }
        else if (transactionId) {
            payment = await prisma_1.prisma.payment.findFirst({
                where: { transactionId },
                include: { invoice: { include: { patient: true, provider: true } } }
            });
        }
        if (!payment) {
            // Payment not found - store callback for later processing
            // This handles race conditions where callback arrives before payment record is created
            (0, pendingPaymentCallbacks_1.storePendingCallback)(paymentReference, transactionId, status, metadata);
            console.warn(`Payment callback received for non-existent payment, stored for later processing:`, {
                paymentReference,
                transactionId,
                status,
                metadata,
                timestamp: new Date().toISOString()
            });
            // Try to find payment again after a short delay (in case it was just created)
            // This handles the race condition where payment is created between our check and now
            // Use setImmediate + setTimeout to ensure proper async handling
            // Wrap in Promise.resolve().catch() to handle unhandled promise rejections
            setImmediate(() => {
                setTimeout(() => {
                    Promise.resolve((async () => {
                        try {
                            let retryPayment = null;
                            if (paymentReference) {
                                retryPayment = await prisma_1.prisma.payment.findFirst({
                                    where: { paymentReference },
                                    include: { invoice: { include: { patient: true, provider: true } } }
                                });
                            }
                            else if (transactionId) {
                                retryPayment = await prisma_1.prisma.payment.findFirst({
                                    where: { transactionId },
                                    include: { invoice: { include: { patient: true, provider: true } } }
                                });
                            }
                            if (retryPayment) {
                                console.log(`Found payment on retry, checking for pending callback: ${retryPayment.id}`);
                                // Use peekPendingCallback to check if callback exists without removing it
                                // This prevents race conditions where createPayment already retrieved it
                                const pendingCallbackExists = (0, pendingPaymentCallbacks_1.peekPendingCallback)(paymentReference, transactionId);
                                if (pendingCallbackExists) {
                                    // Get and remove the callback atomically to prevent duplicate processing
                                    const pendingCallback = (0, pendingPaymentCallbacks_1.getPendingCallback)(paymentReference, transactionId);
                                    if (pendingCallback) {
                                        try {
                                            await processPendingCallback(retryPayment.id, pendingCallback);
                                        }
                                        catch (error) {
                                            // If processing fails, re-store the callback so it can be retried
                                            // This prevents the callback from being permanently lost
                                            console.error(`Error processing pending callback in retry logic for payment ${retryPayment.id}:`, {
                                                error: error.message,
                                                stack: error.stack,
                                                paymentReference,
                                                transactionId
                                            });
                                            (0, pendingPaymentCallbacks_1.storePendingCallback)(pendingCallback.paymentReference, pendingCallback.transactionId, pendingCallback.status, pendingCallback.metadata);
                                            console.log(`Re-stored pending callback after processing failure in retry logic for payment ${retryPayment.id}`);
                                            throw error; // Re-throw to be caught by outer catch
                                        }
                                    }
                                }
                                else {
                                    console.log(`No pending callback found for payment ${retryPayment.id} - may have been processed by createPayment`);
                                }
                            }
                        }
                        catch (error) {
                            console.error('Error retrying payment callback lookup:', {
                                error: error.message,
                                stack: error.stack,
                                paymentReference,
                                transactionId
                            });
                            // Don't throw - let gateway retry mechanism handle it
                        }
                    })()).catch((error) => {
                        console.error('Unhandled error in payment callback retry:', {
                            error: error.message,
                            stack: error.stack,
                            paymentReference,
                            transactionId
                        });
                    });
                }, 2000); // Wait 2 seconds before retry
            });
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
        let paymentStatus = 'PENDING';
        if (status === 'success' || status === 'COMPLETED' || status === 'completed') {
            paymentStatus = 'COMPLETED';
        }
        else if (status === 'failed' || status === 'FAILED' || status === 'rejected') {
            paymentStatus = 'FAILED';
        }
        else if (status === 'PENDING' || status === 'pending') {
            paymentStatus = 'PENDING';
        }
        const updatedPayment = await prisma_1.prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: paymentStatus,
                transactionId: transactionId || payment.transactionId,
                metadata: metadata ? JSON.stringify(metadata) : payment.metadata,
                completedAt: paymentStatus === 'COMPLETED' ? new Date() : null,
            },
        });
        // Remove pending callback since we've successfully processed it
        (0, pendingPaymentCallbacks_1.removePendingCallback)(payment.paymentReference || undefined, payment.transactionId || undefined);
        // Update invoice if payment completed
        if (payment.invoice && paymentStatus === 'COMPLETED') {
            await prisma_1.prisma.billingInvoice.update({
                where: { id: payment.invoice.id },
                data: {
                    status: 'PAID',
                    paidDate: new Date()
                }
            });
            // Generate receipt and send notifications
            if (payment.invoice) {
                const receipt = await (0, receiptGenerator_1.generateReceipt)(payment.invoice, updatedPayment);
                await (0, notificationService_1.sendReceiptEmail)({
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
    }
    catch (error) {
        console.error('Process payment callback error:', error);
        res.status(500).json({ message: 'Failed to process payment callback', error: error.message });
    }
};
exports.processPaymentCallback = processPaymentCallback;
// Get payment history
const getPayments = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, method, limit = 50, offset = 0 } = req.query;
        const where = { userId };
        if (status)
            where.status = status;
        if (method)
            where.method = method;
        const [payments, total] = await Promise.all([
            prisma_1.prisma.payment.findMany({
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
            prisma_1.prisma.payment.count({ where })
        ]);
        res.json({
            payments: payments.map(p => ({
                ...p,
                // Don't expose encrypted card data
                encryptedCardData: p.encryptedCardData ? (0, financialEncryption_1.maskCardNumber)('****') : null
            })),
            total,
            limit: Number(limit),
            offset: Number(offset)
        });
    }
    catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
    }
};
exports.getPayments = getPayments;
// Get payment by ID
const getPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const payment = await prisma_1.prisma.payment.findFirst({
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
            encryptedCardData: payment.encryptedCardData ? (0, financialEncryption_1.maskCardNumber)('****') : null
        });
    }
    catch (error) {
        console.error('Get payment error:', error);
        res.status(500).json({ message: 'Failed to fetch payment', error: error.message });
    }
};
exports.getPayment = getPayment;
//# sourceMappingURL=paymentController.js.map