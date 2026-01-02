/**
 * Transaction Logger
 * Logs all payment transactions for audit trails
 */

import { prisma } from '../src/utils/prisma';

export interface TransactionLogData {
  transactionType: string;
  transactionId?: string;
  userId?: string;
  amount?: number;
  currency?: string;
  status: string;
  paymentMethod?: string;
  gateway?: string;
  gatewayTransactionId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  errorMessage?: string;
}

export class TransactionLogger {
  /**
   * Log a transaction
   */
  static async logTransaction(data: TransactionLogData): Promise<void> {
    try {
      await prisma.transactionLog.create({
        data: {
          transactionType: data.transactionType,
          transactionId: data.transactionId || null,
          userId: data.userId || null,
          amount: data.amount || null,
          currency: data.currency || 'NAD',
          status: data.status,
          paymentMethod: data.paymentMethod || null,
          gateway: data.gateway || null,
          gatewayTransactionId: data.gatewayTransactionId || null,
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
          errorMessage: data.errorMessage || null
        }
      });
    } catch (error) {
      console.error('Failed to log transaction:', error);
      // Don't throw - logging failures shouldn't break payment processing
    }
  }

  /**
   * Get transaction logs
   */
  static async getTransactionLogs(filters: {
    userId?: string;
    transactionType?: string;
    status?: string;
    gateway?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.transactionType) where.transactionType = filters.transactionType;
    if (filters.status) where.status = filters.status;
    if (filters.gateway) where.gateway = filters.gateway;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    return await prisma.transactionLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 100,
      skip: filters.offset || 0
    });
  }

  /**
   * Get transaction statistics
   */
  static async getTransactionStats(filters: {
    startDate?: Date;
    endDate?: Date;
    gateway?: string;
  }) {
    const where: any = {};

    if (filters.gateway) where.gateway = filters.gateway;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [total, successful, failed, totalAmount] = await Promise.all([
      prisma.transactionLog.count({ where }),
      prisma.transactionLog.count({ where: { ...where, status: 'SUCCESS' } }),
      prisma.transactionLog.count({ where: { ...where, status: 'FAILED' } }),
      prisma.transactionLog.aggregate({
        where: { ...where, status: 'SUCCESS' },
        _sum: { amount: true }
      })
    ]);

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      totalAmount: totalAmount._sum.amount || 0
    };
  }
}

