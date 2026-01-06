"use strict";
/**
 * Feedback Controller
 * Handles user feedback collection and management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeedbackStats = exports.updateFeedbackStatus = exports.getFeedbackById = exports.getFeedback = exports.submitFeedback = void 0;
const prisma_1 = require("../utils/prisma");
/**
 * Submit feedback
 */
const submitFeedback = async (req, res) => {
    try {
        const { feedbackType, category, title, description, rating, metadata } = req.body;
        const userId = req.user?.id;
        // Validate required fields
        if (!feedbackType) {
            return res.status(400).json({
                success: false,
                message: 'Feedback type is required'
            });
        }
        if (!description) {
            return res.status(400).json({
                success: false,
                message: 'Description is required'
            });
        }
        // Generate title from description if not provided
        const feedbackTitle = title || (description.length > 50 ? description.substring(0, 50) + '...' : description);
        // Validate rating if provided
        if (rating !== undefined && (isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5)) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be a number between 1 and 5'
            });
        }
        // Validate metadata is valid JSON if provided
        if (metadata) {
            try {
                JSON.stringify(metadata);
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid metadata format - must be valid JSON'
                });
            }
        }
        const feedback = await prisma_1.prisma.userFeedback.create({
            data: {
                userId: userId || null,
                feedbackType,
                category,
                title: feedbackTitle,
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback',
            error: error.message
        });
    }
};
exports.submitFeedback = submitFeedback;
/**
 * Get all feedback
 */
const getFeedback = async (req, res) => {
    try {
        const { status, feedbackType, priority, limit = 50, offset = 0 } = req.query;
        const where = {};
        if (status)
            where.status = status;
        if (feedbackType)
            where.feedbackType = feedbackType;
        if (priority)
            where.priority = priority;
        const feedback = await prisma_1.prisma.userFeedback.findMany({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback',
            error: error.message
        });
    }
};
exports.getFeedback = getFeedback;
/**
 * Get feedback by ID
 */
const getFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await prisma_1.prisma.userFeedback.findUnique({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback',
            error: error.message
        });
    }
};
exports.getFeedbackById = getFeedbackById;
/**
 * Update feedback status
 */
const updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, resolution, priority, assignedTo } = req.body;
        const updateData = {};
        if (status)
            updateData.status = status;
        if (resolution)
            updateData.resolution = resolution;
        if (priority)
            updateData.priority = priority;
        if (assignedTo)
            updateData.assignedTo = assignedTo;
        if (status === 'RESOLVED' || status === 'CLOSED') {
            updateData.resolvedAt = new Date();
        }
        const feedback = await prisma_1.prisma.userFeedback.update({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update feedback',
            error: error.message
        });
    }
};
exports.updateFeedbackStatus = updateFeedbackStatus;
/**
 * Get feedback statistics
 */
const getFeedbackStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter = {};
        if (startDate)
            dateFilter.gte = new Date(startDate);
        if (endDate)
            dateFilter.lte = new Date(endDate);
        const where = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};
        const [total, open, resolved, closed, byType, byPriority] = await Promise.all([
            prisma_1.prisma.userFeedback.count({ where }),
            prisma_1.prisma.userFeedback.count({ where: { ...where, status: 'OPEN' } }),
            prisma_1.prisma.userFeedback.count({ where: { ...where, status: 'RESOLVED' } }),
            prisma_1.prisma.userFeedback.count({ where: { ...where, status: 'CLOSED' } }),
            prisma_1.prisma.userFeedback.groupBy({
                by: ['feedbackType'],
                where,
                _count: true
            }),
            prisma_1.prisma.userFeedback.groupBy({
                by: ['priority'],
                where,
                _count: true
            })
        ]);
        // Calculate average rating
        const ratingFeedback = await prisma_1.prisma.userFeedback.findMany({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback statistics',
            error: error.message
        });
    }
};
exports.getFeedbackStats = getFeedbackStats;
//# sourceMappingURL=feedbackController.js.map