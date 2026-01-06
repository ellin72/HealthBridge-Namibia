"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProviderEarnings = exports.requestPayout = exports.getProviderEarnings = void 0;
const prisma_1 = require("../utils/prisma");
// Get provider earnings
const getProviderEarnings = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { startDate, endDate } = req.query;
        // Only providers can view their own earnings, or admins can view any provider's earnings
        const providerId = req.query.providerId || (userRole === 'HEALTHCARE_PROVIDER' ? userId : null);
        if (!providerId) {
            return res.status(400).json({ message: 'Provider ID is required' });
        }
        // Check permissions
        if (userRole !== 'ADMIN' && userId !== providerId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const dateFilter = {};
        if (startDate)
            dateFilter.gte = new Date(startDate);
        if (endDate)
            dateFilter.lte = new Date(endDate);
        // Get paid invoices for provider
        const paidInvoices = await prisma_1.prisma.billingInvoice.findMany({
            where: {
                providerId,
                status: 'PAID',
                paidDate: Object.keys(dateFilter).length > 0 ? dateFilter : undefined
            },
            include: {
                patient: {
                    select: { id: true, firstName: true, lastName: true }
                }
            },
            orderBy: { paidDate: 'desc' }
        });
        // Calculate earnings
        const totalEarnings = paidInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
        const platformFeeRate = 0.15; // 15% platform fee
        const platformFee = totalEarnings * platformFeeRate;
        const netEarnings = totalEarnings - platformFee;
        // Get or create earnings record for period
        const periodStart = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const periodEnd = endDate ? new Date(endDate) : new Date();
        let earnings = await prisma_1.prisma.providerEarnings.findFirst({
            where: {
                providerId,
                periodStart,
                periodEnd
            }
        });
        if (!earnings) {
            earnings = await prisma_1.prisma.providerEarnings.create({
                data: {
                    providerId,
                    periodStart,
                    periodEnd,
                    totalEarnings,
                    platformFee,
                    netEarnings,
                    currency: 'NAD',
                    payoutStatus: 'PENDING'
                }
            });
        }
        else {
            // Update earnings
            earnings = await prisma_1.prisma.providerEarnings.update({
                where: { id: earnings.id },
                data: {
                    totalEarnings,
                    platformFee,
                    netEarnings
                }
            });
        }
        res.json({
            earnings: {
                ...earnings,
                invoices: paidInvoices.map(inv => ({
                    id: inv.id,
                    invoiceNumber: inv.invoiceNumber,
                    patient: inv.patient,
                    amount: inv.total,
                    paidDate: inv.paidDate
                }))
            },
            summary: {
                totalEarnings,
                platformFee,
                netEarnings,
                invoiceCount: paidInvoices.length
            }
        });
    }
    catch (error) {
        console.error('Get provider earnings error:', error);
        res.status(500).json({ message: 'Failed to fetch provider earnings', error: error.message });
    }
};
exports.getProviderEarnings = getProviderEarnings;
// Request payout
const requestPayout = async (req, res) => {
    try {
        const userId = req.user.id;
        const { earningsId } = req.body;
        if (!earningsId) {
            return res.status(400).json({ message: 'Earnings ID is required' });
        }
        const earnings = await prisma_1.prisma.providerEarnings.findFirst({
            where: { id: earningsId, providerId: userId }
        });
        if (!earnings) {
            return res.status(404).json({ message: 'Earnings record not found' });
        }
        if (earnings.payoutStatus !== 'PENDING') {
            return res.status(400).json({ message: 'Payout already processed' });
        }
        // Update payout status to processing
        const updated = await prisma_1.prisma.providerEarnings.update({
            where: { id: earningsId },
            data: { payoutStatus: 'PROCESSING' }
        });
        // In production, initiate actual payout to provider's bank account
        // For now, we'll just update the status
        res.json({
            message: 'Payout request submitted',
            earnings: updated
        });
    }
    catch (error) {
        console.error('Request payout error:', error);
        res.status(500).json({ message: 'Failed to request payout', error: error.message });
    }
};
exports.requestPayout = requestPayout;
// Get all provider earnings (admin only)
const getAllProviderEarnings = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const { providerId, status, startDate, endDate } = req.query;
        const where = {};
        if (providerId)
            where.providerId = providerId;
        if (status)
            where.payoutStatus = status;
        if (startDate)
            where.periodStart = { gte: new Date(startDate) };
        if (endDate)
            where.periodEnd = { lte: new Date(endDate) };
        const earnings = await prisma_1.prisma.providerEarnings.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.json({ earnings });
    }
    catch (error) {
        console.error('Get all provider earnings error:', error);
        res.status(500).json({ message: 'Failed to fetch provider earnings', error: error.message });
    }
};
exports.getAllProviderEarnings = getAllProviderEarnings;
//# sourceMappingURL=providerEarningsController.js.map