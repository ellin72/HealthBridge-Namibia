import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { UrgencyLevel } from '@prisma/client';

// Create urgent care request
export const createUrgentCareRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      symptoms,
      urgency,
      description,
      triageAssessmentId,
    } = req.body;

    if (!symptoms || !urgency) {
      return res.status(400).json({ message: 'Symptoms and urgency level are required' });
    }

    const request = await prisma.urgentCareRequest.create({
      data: {
        patientId: userId,
        symptoms: JSON.stringify(symptoms),
        urgency: urgency as UrgencyLevel,
        description,
        triageAssessmentId,
        status: 'PENDING',
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Auto-assign provider based on urgency (in a real system, this would use a matching algorithm)
    // For now, we'll leave it unassigned and let admin/provider assign manually

    res.status(201).json(request);
  } catch (error: any) {
    console.error('Create urgent care request error:', error);
    res.status(500).json({ message: 'Failed to create urgent care request', error: error.message });
  }
};

// Get patient's urgent care requests
export const getUrgentCareRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, urgency, limit = 50, offset = 0 } = req.query;

    const where: any = { patientId: userId };
    if (status) {
      where.status = status;
    }
    if (urgency) {
      where.urgency = urgency;
    }

    const requests = await prisma.urgentCareRequest.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: Number(limit),
      skip: Number(offset),
    });

    res.json(requests);
  } catch (error: any) {
    console.error('Get urgent care requests error:', error);
    res.status(500).json({ message: 'Failed to fetch urgent care requests', error: error.message });
  }
};

// Get urgent care request by ID
export const getUrgentCareRequestById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const request = await prisma.urgentCareRequest.findFirst({
      where: {
        id,
        patientId: userId,
      },
    });

    if (!request) {
      return res.status(404).json({ message: 'Urgent care request not found' });
    }

    res.json(request);
  } catch (error: any) {
    console.error('Get urgent care request error:', error);
    res.status(500).json({ message: 'Failed to fetch urgent care request', error: error.message });
  }
};

// Update urgent care request status (provider/admin only)
export const updateUrgentCareRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { providerId, status, appointmentId } = req.body;

    const request = await prisma.urgentCareRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return res.status(404).json({ message: 'Urgent care request not found' });
    }

    // Check if user is provider, admin, or the patient
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const isProvider = user?.role === 'HEALTHCARE_PROVIDER' || user?.role === 'ADMIN';
    const isPatient = request.patientId === userId;

    if (!isProvider && !isPatient) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updateData: any = {};
    if (providerId && isProvider) {
      updateData.providerId = providerId;
      const assignedAt = new Date();
      updateData.assignedAt = assignedAt;
      // Calculate response time from request creation to assignment
      if (request.createdAt) {
        const responseTime = Math.floor(
          (assignedAt.getTime() - request.createdAt.getTime()) / 60000
        );
        updateData.responseTime = responseTime;
      }
    }
    if (status && isProvider) {
      updateData.status = status;
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date();
      }
    }
    if (appointmentId && isProvider) {
      updateData.appointmentId = appointmentId;
    }

    const updated = await prisma.urgentCareRequest.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Update urgent care request error:', error);
    res.status(500).json({ message: 'Failed to update urgent care request', error: error.message });
  }
};

// Get all urgent care requests (provider/admin only)
export const getAllUrgentCareRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== 'HEALTHCARE_PROVIDER' && user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { status, urgency, providerId, limit = 100, offset = 0 } = req.query;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (urgency) {
      where.urgency = urgency;
    }
    if (providerId) {
      where.providerId = providerId;
    }

    const requests = await prisma.urgentCareRequest.findMany({
      where,
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: [
        { urgency: 'asc' }, // Emergency first
        { createdAt: 'asc' }, // Then by time
      ],
      take: Number(limit),
      skip: Number(offset),
    });

    res.json(requests);
  } catch (error: any) {
    console.error('Get all urgent care requests error:', error);
    res.status(500).json({ message: 'Failed to fetch urgent care requests', error: error.message });
  }
};

// Get urgent care statistics
export const getUrgentCareStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const totalRequests = await prisma.urgentCareRequest.count();
    const pendingRequests = await prisma.urgentCareRequest.count({
      where: { status: 'PENDING' },
    });
    const completedRequests = await prisma.urgentCareRequest.count({
      where: { status: 'COMPLETED' },
    });

    const urgencyBreakdown = await prisma.urgentCareRequest.groupBy({
      by: ['urgency'],
      _count: {
        id: true,
      },
    });

    const avgResponseTime = await prisma.urgentCareRequest.aggregate({
      where: {
        responseTime: { not: null },
      },
      _avg: {
        responseTime: true,
      },
    });

    const stats = {
      totalRequests,
      pendingRequests,
      completedRequests,
      urgencyBreakdown: urgencyBreakdown.reduce((acc: any, item) => {
        acc[item.urgency] = item._count.id;
        return acc;
      }, {}),
      averageResponseTime: avgResponseTime._avg.responseTime,
    };

    res.json(stats);
  } catch (error: any) {
    console.error('Get urgent care statistics error:', error);
    res.status(500).json({ message: 'Failed to fetch urgent care statistics', error: error.message });
  }
};

