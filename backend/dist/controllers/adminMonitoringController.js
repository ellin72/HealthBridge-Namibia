"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconcileTransactions = exports.getFraudAlerts = exports.getTransactionMonitoring = void 0;
const prisma_1 = require("../utils/prisma");
// Get transaction monitoring dashboard data
const getTransactionMonitoring = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const { startDate, endDate, status, method } = req.query;
        const where = {};
        if (startDate)
            where.createdAt = { ...where.createdAt, gte: new Date(startDate) };
        if (endDate)
            where.createdAt = { ...where.createdAt, lte: new Date(endDate) };
        if (status)
            where.status = status;
        if (method)
            where.method = method;
        const [payments, totalRevenue, totalTransactions, flaggedPayments] = await Promise.all([
            prisma_1.prisma.payment.findMany({
                where,
                include: {
                    user: {
                        select: { id: true, firstName: true, lastName: true, email: true }
                    },
                    invoice: {
                        select: { id: true, invoiceNumber: true, total: true }
                    },
                    auditLogs: {
                        where: { flagged: true },
                        take: 5
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 100
            }),
            prisma_1.prisma.payment.aggregate({
                where: { ...where, status: 'COMPLETED' },
                _sum: { amount: true }
            }),
            prisma_1.prisma.payment.count({ where }),
            prisma_1.prisma.paymentAuditLog.count({
                where: { flagged: true, createdAt: startDate || endDate ? {
                        ...(startDate ? { gte: new Date(startDate) } : {}),
                        ...(endDate ? { lte: new Date(endDate) } : {})
                    } : undefined }
            })
        ]);
        // Get payment method breakdown
        const methodBreakdown = await prisma_1.prisma.payment.groupBy({
            by: ['method'],
            where: { ...where, status: 'COMPLETED' },
            _sum: { amount: true },
            _count: true
        });
        // Get status breakdown
        const statusBreakdown = await prisma_1.prisma.payment.groupBy({
            by: ['status'],
            where,
            _count: true,
            _sum: { amount: true }
        });
        res.json({
            summary: {
                totalRevenue: totalRevenue._sum.amount || 0,
                totalTransactions,
                flaggedPayments,
                averageTransactionValue: totalTransactions > 0 ? (totalRevenue._sum.amount || 0) / totalTransactions : 0
            },
            payments,
            methodBreakdown,
            statusBreakdown
        });
    }
    catch (error) {
        console.error('Get transaction monitoring error:', error);
        res.status(500).json({ message: 'Failed to fetch transaction monitoring data', error: error.message });
    }
};
exports.getTransactionMonitoring = getTransactionMonitoring;
// Get fraud detection alerts
const getFraudAlerts = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const { limit = 50 } = req.query;
        const flaggedLogs = await prisma_1.prisma.paymentAuditLog.findMany({
            where: { flagged: true },
            include: {
                payment: {
                    include: {
                        user: {
                            select: { id: true, firstName: true, lastName: true, email: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: Number(limit)
        });
        res.json({ alerts: flaggedLogs });
    }
    catch (error) {
        console.error('Get fraud alerts error:', error);
        res.status(500).json({ message: 'Failed to fetch fraud alerts', error: error.message });
    }
};
exports.getFraudAlerts = getFraudAlerts;
// Reconcile transactions
const reconcileTransactions = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const { startDate, endDate } = req.body;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }
        // Get all completed payments in period
        const payments = await prisma_1.prisma.payment.findMany({
            where: {
                status: 'COMPLETED',
                completedAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            },
            include: {
                invoice: true
            }
        });
        // Calculate totals
        const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
        const totalInvoices = payments
            .filter(p => p.invoice)
            .reduce((sum, p) => sum + (p.invoice?.total || 0), 0);
        // Check for discrepancies
        const discrepancies = payments.filter(p => {
            if (!p.invoice)
                return false;
            return Math.abs(p.amount - p.invoice.total) > 0.01;
        });
        res.json({
            reconciliation: {
                period: { startDate, endDate },
                totalPayments,
                totalInvoices,
                paymentCount: payments.length,
                discrepancies: discrepancies.length,
                discrepancyDetails: discrepancies.map(d => ({
                    paymentId: d.id,
                    paymentAmount: d.amount,
                    invoiceAmount: d.invoice?.total,
                    difference: d.amount - (d.invoice?.total || 0)
                }))
            }
        });
    }
    catch (error) {
        console.error('Reconcile transactions error:', error);
        res.status(500).json({ message: 'Failed to reconcile transactions', error: error.message });
    }
};
exports.reconcileTransactions = reconcileTransactions;
//# sourceMappingURL=adminMonitoringController.js.map