import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { NotificationType, NotificationStatus } from '@prisma/client';
import { prisma } from '../utils/prisma';

/**
 * Get all notifications for the authenticated user
 */
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, limit = 50, offset = 0 } = req.query;

    const where: any = { userId };
    if (status) {
      where.status = status as NotificationStatus;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        skip: Number(offset),
      }),
      prisma.notification.count({ where }),
    ]);

    res.json({
      notifications,
      total,
      unreadCount: await prisma.notification.count({
        where: { userId, status: 'UNREAD' },
      }),
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const count = await prisma.notification.count({
      where: {
        userId,
        status: 'UNREAD',
      },
    });

    res.json({ count });
  } catch (error: any) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Failed to fetch unread count' });
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: {
        status: 'READ',
        readAt: new Date(),
      },
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        status: 'UNREAD',
      },
      data: {
        status: 'READ',
        readAt: new Date(),
      },
    });

    res.json({ updated: result.count });
  } catch (error: any) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark all notifications as read' });
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await prisma.notification.delete({
      where: { id },
    });

    res.json({ message: 'Notification deleted' });
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};

/**
 * Create a notification (internal use)
 * Exported for use in other services
 */
export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  link?: string,
  metadata?: any
) => {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
        metadata: metadata ? JSON.stringify(metadata) : null,
        status: 'UNREAD',
      },
    });
  } catch (error: any) {
    console.error('Error creating notification:', error);
    throw error;
  }
};
