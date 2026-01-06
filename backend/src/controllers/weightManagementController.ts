import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { WeightProgramStatus } from '@prisma/client';

// Create weight management program
export const createWeightProgram = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      providerId,
      programName,
      startWeight,
      targetWeight,
      goals,
      nutritionPlan,
      exercisePlan,
    } = req.body;

    if (!programName || !startWeight) {
      return res.status(400).json({ message: 'Program name and start weight are required' });
    }

    const program = await prisma.weightManagementProgram.create({
      data: {
        patientId: userId,
        providerId,
        programName,
        startWeight,
        targetWeight,
        currentWeight: startWeight,
        goals: goals ? JSON.stringify(goals) : null,
        nutritionPlan: nutritionPlan ? JSON.stringify(nutritionPlan) : null,
        exercisePlan: exercisePlan ? JSON.stringify(exercisePlan) : null,
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
    console.error('Create weight program error:', error);
    res.status(500).json({ message: 'Failed to create weight program', error: error.message });
  }
};

// Get patient's weight programs
export const getWeightPrograms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status } = req.query;

    const where: any = { patientId: userId };
    if (status) {
      where.status = status;
    }

    const programs = await prisma.weightManagementProgram.findMany({
      where,
      include: {
        _count: {
          select: {
            entries: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(programs);
  } catch (error: any) {
    console.error('Get weight programs error:', error);
    res.status(500).json({ message: 'Failed to fetch weight programs', error: error.message });
  }
};

// Get weight program by ID
export const getWeightProgramById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const program = await prisma.weightManagementProgram.findFirst({
      where: {
        id,
        patientId: userId,
      },
      include: {
        entries: {
          orderBy: {
            recordedAt: 'desc',
          },
          take: 30,
        },
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Weight program not found' });
    }

    res.json(program);
  } catch (error: any) {
    console.error('Get weight program error:', error);
    res.status(500).json({ message: 'Failed to fetch weight program', error: error.message });
  }
};

// Update weight program
export const updateWeightProgram = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const {
      programName,
      targetWeight,
      goals,
      nutritionPlan,
      exercisePlan,
      status,
    } = req.body;

    const program = await prisma.weightManagementProgram.findFirst({
      where: {
        id,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Weight program not found' });
    }

    const updated = await prisma.weightManagementProgram.update({
      where: { id },
      data: {
        programName,
        targetWeight,
        goals: goals ? JSON.stringify(goals) : undefined,
        nutritionPlan: nutritionPlan ? JSON.stringify(nutritionPlan) : undefined,
        exercisePlan: exercisePlan ? JSON.stringify(exercisePlan) : undefined,
        status: status as WeightProgramStatus,
      },
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Update weight program error:', error);
    res.status(500).json({ message: 'Failed to update weight program', error: error.message });
  }
};

// Add weight entry
export const addWeightEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { programId, weight, bodyFat, muscleMass, measurements, notes } = req.body;

    if (!programId || !weight) {
      return res.status(400).json({ message: 'Program ID and weight are required' });
    }

    // Verify program belongs to user
    const program = await prisma.weightManagementProgram.findFirst({
      where: {
        id: programId,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Weight program not found' });
    }

    const entry = await prisma.weightEntry.create({
      data: {
        programId,
        weight,
        bodyFat,
        muscleMass,
        measurements: measurements ? JSON.stringify(measurements) : null,
        notes,
      },
    });

    // Update program's current weight
    await prisma.weightManagementProgram.update({
      where: { id: programId },
      data: { currentWeight: weight },
    });

    res.status(201).json(entry);
  } catch (error: any) {
    console.error('Add weight entry error:', error);
    res.status(500).json({ message: 'Failed to add weight entry', error: error.message });
  }
};

// Get weight entries
export const getWeightEntries = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { programId, limit = 100, offset = 0 } = req.query;

    if (!programId) {
      return res.status(400).json({ message: 'Program ID is required' });
    }

    // Verify program belongs to user
    const program = await prisma.weightManagementProgram.findFirst({
      where: {
        id: programId as string,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Weight program not found' });
    }

    const entries = await prisma.weightEntry.findMany({
      where: { programId: programId as string },
      orderBy: {
        recordedAt: 'desc',
      },
      take: Number(limit),
      skip: Number(offset),
    });

    res.json(entries);
  } catch (error: any) {
    console.error('Get weight entries error:', error);
    res.status(500).json({ message: 'Failed to fetch weight entries', error: error.message });
  }
};

// Get weight progress statistics
export const getWeightProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { programId } = req.params;

    const program = await prisma.weightManagementProgram.findFirst({
      where: {
        id: programId,
        patientId: userId,
      },
      include: {
        entries: {
          orderBy: {
            recordedAt: 'asc',
          },
        },
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Weight program not found' });
    }

    const entries = program.entries;
    const totalWeightLoss = program.startWeight - (program.currentWeight || program.startWeight);
    const targetProgress = program.targetWeight
      ? ((program.startWeight - (program.currentWeight || program.startWeight)) /
          (program.startWeight - program.targetWeight)) *
        100
      : null;

    const stats = {
      startWeight: program.startWeight,
      currentWeight: program.currentWeight,
      targetWeight: program.targetWeight,
      totalWeightLoss,
      targetProgress,
      totalEntries: entries.length,
      averageWeight: entries.length > 0
        ? entries.reduce((sum, e) => sum + e.weight, 0) / entries.length
        : null,
      weightLossPerWeek: entries.length > 1
        ? (entries[0].weight - entries[entries.length - 1].weight) / (entries.length / 7)
        : null,
    };

    res.json(stats);
  } catch (error: any) {
    console.error('Get weight progress error:', error);
    res.status(500).json({ message: 'Failed to fetch weight progress', error: error.message });
  }
};

