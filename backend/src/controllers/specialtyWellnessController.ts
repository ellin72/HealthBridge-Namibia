import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { SpecialtyType, ConsultationStatus } from '@prisma/client';

// Create specialty consultation
export const createSpecialtyConsultation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      providerId,
      specialtyType,
      appointmentId,
      chiefComplaint,
      medicalHistory,
      images,
      secondOpinionRequested,
    } = req.body;

    if (!specialtyType || !chiefComplaint) {
      return res.status(400).json({
        message: 'Specialty type and chief complaint are required',
      });
    }

    const consultation = await prisma.specialtyConsultation.create({
      data: {
        patientId: userId,
        providerId,
        specialtyType: specialtyType as SpecialtyType,
        appointmentId,
        chiefComplaint,
        medicalHistory: medicalHistory ? JSON.stringify(medicalHistory) : null,
        images: images ? JSON.stringify(images) : null,
        secondOpinionRequested: secondOpinionRequested || false,
        status: 'REQUESTED',
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

    res.status(201).json(consultation);
  } catch (error: any) {
    console.error('Create specialty consultation error:', error);
    res.status(500).json({ message: 'Failed to create specialty consultation', error: error.message });
  }
};

// Get patient's specialty consultations
export const getSpecialtyConsultations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { specialtyType, status } = req.query;

    const where: any = { patientId: userId };
    if (specialtyType) {
      where.specialtyType = specialtyType;
    }
    if (status) {
      where.status = status;
    }

    const consultations = await prisma.specialtyConsultation.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(consultations);
  } catch (error: any) {
    console.error('Get specialty consultations error:', error);
    res.status(500).json({ message: 'Failed to fetch specialty consultations', error: error.message });
  }
};

// Get specialty consultation by ID
export const getSpecialtyConsultationById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const consultation = await prisma.specialtyConsultation.findFirst({
      where: {
        id,
        patientId: userId,
      },
    });

    if (!consultation) {
      return res.status(404).json({ message: 'Specialty consultation not found' });
    }

    res.json(consultation);
  } catch (error: any) {
    console.error('Get specialty consultation error:', error);
    res.status(500).json({ message: 'Failed to fetch specialty consultation', error: error.message });
  }
};

// Update specialty consultation (provider can update diagnosis, treatment plan, etc.)
export const updateSpecialtyConsultation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const {
      diagnosis,
      treatmentPlan,
      prescription,
      followUpDate,
      expertOpinion,
      status,
    } = req.body;

    const consultation = await prisma.specialtyConsultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      return res.status(404).json({ message: 'Specialty consultation not found' });
    }

    // Check if user is the provider or patient
    const isProvider = consultation.providerId === userId;
    const isPatient = consultation.patientId === userId;

    if (!isProvider && !isPatient) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updateData: any = {};
    if (diagnosis !== undefined && isProvider) updateData.diagnosis = diagnosis;
    if (treatmentPlan !== undefined && isProvider) updateData.treatmentPlan = treatmentPlan ? JSON.stringify(treatmentPlan) : null;
    if (prescription !== undefined && isProvider) updateData.prescription = prescription ? JSON.stringify(prescription) : null;
    if (expertOpinion !== undefined && isProvider) updateData.expertOpinion = expertOpinion;
    if (followUpDate !== undefined && isProvider) updateData.followUpDate = followUpDate ? new Date(followUpDate) : null;
    if (status !== undefined && isProvider) updateData.status = status as ConsultationStatus;

    const updated = await prisma.specialtyConsultation.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Update specialty consultation error:', error);
    res.status(500).json({ message: 'Failed to update specialty consultation', error: error.message });
  }
};

// Sleep Program Management
export const createSleepProgram = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      providerId,
      programName,
      targetSleepHours = 8,
      bedtime,
      wakeTime,
      sleepGoals,
    } = req.body;

    if (!programName) {
      return res.status(400).json({ message: 'Program name is required' });
    }

    const program = await prisma.sleepProgram.create({
      data: {
        patientId: userId,
        providerId,
        programName,
        targetSleepHours,
        bedtime,
        wakeTime,
        sleepGoals: sleepGoals ? JSON.stringify(sleepGoals) : null,
        status: 'ACTIVE',
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json(program);
  } catch (error: any) {
    console.error('Create sleep program error:', error);
    res.status(500).json({ message: 'Failed to create sleep program', error: error.message });
  }
};

// Get patient's sleep programs
export const getSleepPrograms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status } = req.query;

    const where: any = { patientId: userId };
    if (status) {
      where.status = status;
    }

    const programs = await prisma.sleepProgram.findMany({
      where,
      include: {
        _count: {
          select: {
            sleepLogs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(programs);
  } catch (error: any) {
    console.error('Get sleep programs error:', error);
    res.status(500).json({ message: 'Failed to fetch sleep programs', error: error.message });
  }
};

// Get sleep program by ID
export const getSleepProgramById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const program = await prisma.sleepProgram.findFirst({
      where: {
        id,
        patientId: userId,
      },
      include: {
        sleepLogs: {
          orderBy: {
            sleepDate: 'desc',
          },
          take: 30,
        },
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Sleep program not found' });
    }

    res.json(program);
  } catch (error: any) {
    console.error('Get sleep program error:', error);
    res.status(500).json({ message: 'Failed to fetch sleep program', error: error.message });
  }
};

// Add sleep log
export const addSleepLog = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      programId,
      sleepDate,
      bedtime,
      wakeTime,
      sleepDuration,
      sleepQuality,
      awakenings,
      sleepNotes,
      mood,
      activities,
    } = req.body;

    if (!programId || !sleepDate) {
      return res.status(400).json({ message: 'Program ID and sleep date are required' });
    }

    // Verify program belongs to user
    const program = await prisma.sleepProgram.findFirst({
      where: {
        id: programId,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Sleep program not found' });
    }

    const log = await prisma.sleepLog.create({
      data: {
        programId,
        sleepDate: new Date(sleepDate),
        bedtime: bedtime ? new Date(bedtime) : null,
        wakeTime: wakeTime ? new Date(wakeTime) : null,
        sleepDuration,
        sleepQuality,
        awakenings,
        sleepNotes,
        mood: mood ? JSON.stringify(mood) : null,
        activities: activities ? JSON.stringify(activities) : null,
      },
    });

    res.status(201).json(log);
  } catch (error: any) {
    console.error('Add sleep log error:', error);
    res.status(500).json({ message: 'Failed to add sleep log', error: error.message });
  }
};

// Get sleep logs
export const getSleepLogs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { programId, limit = 100, offset = 0 } = req.query;

    if (!programId) {
      return res.status(400).json({ message: 'Program ID is required' });
    }

    // Verify program belongs to user
    const program = await prisma.sleepProgram.findFirst({
      where: {
        id: programId as string,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Sleep program not found' });
    }

    const logs = await prisma.sleepLog.findMany({
      where: { programId: programId as string },
      orderBy: {
        sleepDate: 'desc',
      },
      take: Number(limit),
      skip: Number(offset),
    });

    res.json(logs);
  } catch (error: any) {
    console.error('Get sleep logs error:', error);
    res.status(500).json({ message: 'Failed to fetch sleep logs', error: error.message });
  }
};

// Get sleep statistics
export const getSleepStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { programId, days = 30 } = req.query;

    if (!programId) {
      return res.status(400).json({ message: 'Program ID is required' });
    }

    const program = await prisma.sleepProgram.findFirst({
      where: {
        id: programId as string,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Sleep program not found' });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const logs = await prisma.sleepLog.findMany({
      where: {
        programId: programId as string,
        sleepDate: {
          gte: startDate,
        },
      },
      orderBy: {
        sleepDate: 'asc',
      },
    });

    const stats = {
      totalLogs: logs.length,
      averageSleepDuration: logs.filter((l) => l.sleepDuration).length > 0
        ? logs
            .filter((l) => l.sleepDuration)
            .reduce((sum, l) => sum + (l.sleepDuration || 0), 0) /
          logs.filter((l) => l.sleepDuration).length
        : null,
      averageSleepQuality: logs.filter((l) => l.sleepQuality).length > 0
        ? logs
            .filter((l) => l.sleepQuality)
            .reduce((sum, l) => sum + (l.sleepQuality || 0), 0) /
          logs.filter((l) => l.sleepQuality).length
        : null,
      averageAwakenings: logs.filter((l) => l.awakenings).length > 0
        ? logs
            .filter((l) => l.awakenings)
            .reduce((sum, l) => sum + (l.awakenings || 0), 0) /
          logs.filter((l) => l.awakenings).length
        : null,
      targetSleepHours: program.targetSleepHours,
      onTargetDays: logs.filter(
        (l) => l.sleepDuration && Math.abs(l.sleepDuration - program.targetSleepHours) <= 1
      ).length,
    };

    res.json(stats);
  } catch (error: any) {
    console.error('Get sleep statistics error:', error);
    res.status(500).json({ message: 'Failed to fetch sleep statistics', error: error.message });
  }
};

