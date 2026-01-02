/**
 * Feedback Controller
 * Handles user feedback collection and management
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Submit feedback
 */
export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { feedbackType, category, title, description, rating, metadata } = req.body;
    const userId = (req as any).user?.id;

    const feedback = await prisma.userFeedback.create({
      data: {
        userId: userId || null,
        feedbackType,
        category,
        title,
        description,
        rating: rating ? Number(rating) : null,
        status: 'OPEN',
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });

    res.status(201).json({
      success: true,
      data: {
        ...feedback,
        metadata: feedback.metadata ? JSON.parse(feedback.metadata) : null
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
};

/**
 * Get all feedback
 */
export const getFeedback = async (req: Request, res: Response) => {
  try {
    const { status, feedbackType, priority, limit = 50, offset = 0 } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (feedbackType) where.feedbackType = feedbackType;
    if (priority) where.priority = priority;

    const feedback = await prisma.userFeedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset)
    });

    res.json({
      success: true,
      data: feedback.map(item => ({
        ...item,
        metadata: item.metadata ? JSON.parse(item.metadata) : null
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};

/**
 * Get feedback by ID
 */
export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const feedback = await prisma.userFeedback.findUnique({
      where: { id }
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...feedback,
        metadata: feedback.metadata ? JSON.parse(feedback.metadata) : null
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};

/**
 * Update feedback status
 */
export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, resolution, priority, assignedTo } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (resolution) updateData.resolution = resolution;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (status === 'RESOLVED' || status === 'CLOSED') {
      updateData.resolvedAt = new Date();
    }

    const feedback = await prisma.userFeedback.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      data: {
        ...feedback,
        metadata: feedback.metadata ? JSON.parse(feedback.metadata) : null
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback',
      error: error.message
    });
  }
};

/**
 * Get feedback statistics
 */
export const getFeedbackStats = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate as string);
    if (endDate) dateFilter.lte = new Date(endDate as string);

    const where = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    const [total, open, resolved, closed, byType, byPriority] = await Promise.all([
      prisma.userFeedback.count({ where }),
      prisma.userFeedback.count({ where: { ...where, status: 'OPEN' } }),
      prisma.userFeedback.count({ where: { ...where, status: 'RESOLVED' } }),
      prisma.userFeedback.count({ where: { ...where, status: 'CLOSED' } }),
      prisma.userFeedback.groupBy({
        by: ['feedbackType'],
        where,
        _count: true
      }),
      prisma.userFeedback.groupBy({
        by: ['priority'],
        where,
        _count: true
      })
    ]);

    // Calculate average rating
    const ratingFeedback = await prisma.userFeedback.findMany({
      where: { ...where, rating: { not: null } },
      select: { rating: true }
    });

    const averageRating = ratingFeedback.length > 0
      ? ratingFeedback.reduce((sum, f) => sum + (f.rating || 0), 0) / ratingFeedback.length
      : null;

    res.json({
      success: true,
      data: {
        total,
        open,
        resolved,
        closed,
        averageRating,
        byType: byType.map(item => ({
          type: item.feedbackType,
          count: item._count
        })),
        byPriority: byPriority.map(item => ({
          priority: item.priority,
          count: item._count
        })),
        period: {
          startDate: startDate || null,
          endDate: endDate || null
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback statistics',
      error: error.message
    });
  }
};

