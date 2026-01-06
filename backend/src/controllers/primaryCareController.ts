import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';

// Create primary care record
export const createPrimaryCareRecord = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      providerId,
      appointmentId,
      visitType,
      chiefComplaint,
      history,
      physicalExam,
      assessment,
      plan,
      prescriptions,
      referrals,
      labOrders,
      followUpDate,
      preventiveCare,
    } = req.body;

    if (!providerId || !visitType) {
      return res.status(400).json({ message: 'Provider ID and visit type are required' });
    }

    // Verify provider exists
    const provider = await prisma.user.findUnique({
      where: { id: providerId },
    });

    if (!provider || provider.role !== 'HEALTHCARE_PROVIDER') {
      return res.status(400).json({ message: 'Invalid provider' });
    }

    const record = await prisma.primaryCareRecord.create({
      data: {
        patientId: userId,
        providerId,
        appointmentId,
        visitType,
        chiefComplaint,
        history: history ? JSON.stringify(history) : null,
        physicalExam: physicalExam ? JSON.stringify(physicalExam) : null,
        assessment,
        plan: plan ? JSON.stringify(plan) : null,
        prescriptions: prescriptions ? JSON.stringify(prescriptions) : null,
        referrals: referrals ? JSON.stringify(referrals) : null,
        labOrders: labOrders ? JSON.stringify(labOrders) : null,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        preventiveCare: preventiveCare ? JSON.stringify(preventiveCare) : null,
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(record);
  } catch (error: any) {
    console.error('Create primary care record error:', error);
    res.status(500).json({ message: 'Failed to create primary care record', error: error.message });
  }
};

// Get patient's primary care records
export const getPrimaryCareRecords = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { visitType, providerId, limit = 50, offset = 0 } = req.query;

    const where: any = { patientId: userId };
    if (visitType) {
      where.visitType = visitType;
    }
    if (providerId) {
      where.providerId = providerId;
    }

    const records = await prisma.primaryCareRecord.findMany({
      where,
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: Number(limit),
      skip: Number(offset),
    });

    res.json(records);
  } catch (error: any) {
    console.error('Get primary care records error:', error);
    res.status(500).json({ message: 'Failed to fetch primary care records', error: error.message });
  }
};

// Get primary care record by ID
export const getPrimaryCareRecordById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const record = await prisma.primaryCareRecord.findFirst({
      where: {
        id,
        patientId: userId,
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

    if (!record) {
      return res.status(404).json({ message: 'Primary care record not found' });
    }

    res.json(record);
  } catch (error: any) {
    console.error('Get primary care record error:', error);
    res.status(500).json({ message: 'Failed to fetch primary care record', error: error.message });
  }
};

// Update primary care record (provider only)
export const updatePrimaryCareRecord = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const {
      history,
      physicalExam,
      assessment,
      plan,
      prescriptions,
      referrals,
      labOrders,
      followUpDate,
      preventiveCare,
    } = req.body;

    const record = await prisma.primaryCareRecord.findUnique({
      where: { id },
    });

    if (!record) {
      return res.status(404).json({ message: 'Primary care record not found' });
    }

    // Only provider can update
    if (record.providerId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updated = await prisma.primaryCareRecord.update({
      where: { id },
      data: {
        history: history ? JSON.stringify(history) : undefined,
        physicalExam: physicalExam ? JSON.stringify(physicalExam) : undefined,
        assessment,
        plan: plan ? JSON.stringify(plan) : undefined,
        prescriptions: prescriptions ? JSON.stringify(prescriptions) : undefined,
        referrals: referrals ? JSON.stringify(referrals) : undefined,
        labOrders: labOrders ? JSON.stringify(labOrders) : undefined,
        followUpDate: followUpDate ? new Date(followUpDate) : undefined,
        preventiveCare: preventiveCare ? JSON.stringify(preventiveCare) : undefined,
      },
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Update primary care record error:', error);
    res.status(500).json({ message: 'Failed to update primary care record', error: error.message });
  }
};

// Get primary care summary for patient
export const getPrimaryCareSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const records = await prisma.primaryCareRecord.findMany({
      where: { patientId: userId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const summary = {
      totalVisits: records.length,
      lastVisit: records[0] || null,
      visitTypes: records.reduce((acc: any, record) => {
        acc[record.visitType] = (acc[record.visitType] || 0) + 1;
        return acc;
      }, {}),
      providers: [...new Set(records.map((r) => r.providerId))].length,
      upcomingFollowUps: records.filter(
        (r) => r.followUpDate && new Date(r.followUpDate) > new Date()
      ).length,
    };

    res.json(summary);
  } catch (error: any) {
    console.error('Get primary care summary error:', error);
    res.status(500).json({ message: 'Failed to fetch primary care summary', error: error.message });
  }
};

