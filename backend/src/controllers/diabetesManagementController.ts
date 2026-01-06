import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { DiabetesType } from '@prisma/client';

// Create diabetes management program
export const createDiabetesProgram = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      providerId,
      diabetesType,
      diagnosisDate,
      targetGlucoseRange,
      medications,
      insulinRegimen,
      mealPlan,
      exercisePlan,
      goals,
    } = req.body;

    if (!diabetesType) {
      return res.status(400).json({ message: 'Diabetes type is required' });
    }

    const program = await prisma.diabetesManagementProgram.create({
      data: {
        patientId: userId,
        providerId,
        diabetesType: diabetesType as DiabetesType,
        diagnosisDate: diagnosisDate ? new Date(diagnosisDate) : null,
        targetGlucoseRange: targetGlucoseRange ? JSON.stringify(targetGlucoseRange) : null,
        medications: medications ? JSON.stringify(medications) : null,
        insulinRegimen: insulinRegimen ? JSON.stringify(insulinRegimen) : null,
        mealPlan: mealPlan ? JSON.stringify(mealPlan) : null,
        exercisePlan: exercisePlan ? JSON.stringify(exercisePlan) : null,
        goals: goals ? JSON.stringify(goals) : null,
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
    console.error('Create diabetes program error:', error);
    res.status(500).json({ message: 'Failed to create diabetes program', error: error.message });
  }
};

// Get patient's diabetes programs
export const getDiabetesPrograms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status } = req.query;

    const where: any = { patientId: userId };
    if (status) {
      where.status = status;
    }

    const programs = await prisma.diabetesManagementProgram.findMany({
      where,
      include: {
        _count: {
          select: {
            glucoseReadings: true,
            medicationLogs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(programs);
  } catch (error: any) {
    console.error('Get diabetes programs error:', error);
    res.status(500).json({ message: 'Failed to fetch diabetes programs', error: error.message });
  }
};

// Get diabetes program by ID
export const getDiabetesProgramById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const program = await prisma.diabetesManagementProgram.findFirst({
      where: {
        id,
        patientId: userId,
      },
      include: {
        glucoseReadings: {
          orderBy: {
            recordedAt: 'desc',
          },
          take: 30,
        },
        medicationLogs: {
          orderBy: {
            time: 'desc',
          },
          take: 30,
        },
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Diabetes program not found' });
    }

    res.json(program);
  } catch (error: any) {
    console.error('Get diabetes program error:', error);
    res.status(500).json({ message: 'Failed to fetch diabetes program', error: error.message });
  }
};

// Update diabetes program
export const updateDiabetesProgram = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const {
      targetGlucoseRange,
      medications,
      insulinRegimen,
      mealPlan,
      exercisePlan,
      goals,
      status,
    } = req.body;

    const program = await prisma.diabetesManagementProgram.findFirst({
      where: {
        id,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Diabetes program not found' });
    }

    const updated = await prisma.diabetesManagementProgram.update({
      where: { id },
      data: {
        targetGlucoseRange: targetGlucoseRange ? JSON.stringify(targetGlucoseRange) : undefined,
        medications: medications ? JSON.stringify(medications) : undefined,
        insulinRegimen: insulinRegimen ? JSON.stringify(insulinRegimen) : undefined,
        mealPlan: mealPlan ? JSON.stringify(mealPlan) : undefined,
        exercisePlan: exercisePlan ? JSON.stringify(exercisePlan) : undefined,
        goals: goals ? JSON.stringify(goals) : undefined,
        status,
      },
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Update diabetes program error:', error);
    res.status(500).json({ message: 'Failed to update diabetes program', error: error.message });
  }
};

// Add glucose reading
export const addGlucoseReading = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      programId,
      glucoseLevel,
      readingType,
      unit = 'mg/dL',
      mealContext,
      medicationTaken,
      notes,
    } = req.body;

    if (!programId || !glucoseLevel || !readingType) {
      return res.status(400).json({
        message: 'Program ID, glucose level, and reading type are required',
      });
    }

    // Verify program belongs to user
    const program = await prisma.diabetesManagementProgram.findFirst({
      where: {
        id: programId,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Diabetes program not found' });
    }

    const reading = await prisma.glucoseReading.create({
      data: {
        programId,
        glucoseLevel,
        readingType,
        unit,
        mealContext,
        medicationTaken,
        notes,
      },
    });

    res.status(201).json(reading);
  } catch (error: any) {
    console.error('Add glucose reading error:', error);
    res.status(500).json({ message: 'Failed to add glucose reading', error: error.message });
  }
};

// Get glucose readings
export const getGlucoseReadings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { programId, readingType, limit = 100, offset = 0 } = req.query;

    if (!programId) {
      return res.status(400).json({ message: 'Program ID is required' });
    }

    // Verify program belongs to user
    const program = await prisma.diabetesManagementProgram.findFirst({
      where: {
        id: programId as string,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Diabetes program not found' });
    }

    const where: any = { programId: programId as string };
    if (readingType) {
      where.readingType = readingType;
    }

    const readings = await prisma.glucoseReading.findMany({
      where,
      orderBy: {
        recordedAt: 'desc',
      },
      take: Number(limit),
      skip: Number(offset),
    });

    res.json(readings);
  } catch (error: any) {
    console.error('Get glucose readings error:', error);
    res.status(500).json({ message: 'Failed to fetch glucose readings', error: error.message });
  }
};

// Add medication log
export const addMedicationLog = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { programId, medicationName, dosage, time, taken, notes } = req.body;

    if (!programId || !medicationName || !dosage || !time) {
      return res.status(400).json({
        message: 'Program ID, medication name, dosage, and time are required',
      });
    }

    // Verify program belongs to user
    const program = await prisma.diabetesManagementProgram.findFirst({
      where: {
        id: programId,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Diabetes program not found' });
    }

    const log = await prisma.diabetesMedicationLog.create({
      data: {
        programId,
        medicationName,
        dosage,
        time: new Date(time),
        taken: taken !== undefined ? taken : false,
        notes,
      },
    });

    res.status(201).json(log);
  } catch (error: any) {
    console.error('Add medication log error:', error);
    res.status(500).json({ message: 'Failed to add medication log', error: error.message });
  }
};

// Get glucose statistics
export const getGlucoseStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { programId, days = 30 } = req.query;

    if (!programId) {
      return res.status(400).json({ message: 'Program ID is required' });
    }

    const program = await prisma.diabetesManagementProgram.findFirst({
      where: {
        id: programId as string,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Diabetes program not found' });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const readings = await prisma.glucoseReading.findMany({
      where: {
        programId: programId as string,
        recordedAt: {
          gte: startDate,
        },
      },
      orderBy: {
        recordedAt: 'asc',
      },
    });

    const targetRange = program.targetGlucoseRange
      ? JSON.parse(program.targetGlucoseRange)
      : null;

    const stats = {
      totalReadings: readings.length,
      averageGlucose: readings.length > 0
        ? readings.reduce((sum, r) => sum + r.glucoseLevel, 0) / readings.length
        : null,
      minGlucose: readings.length > 0
        ? Math.min(...readings.map((r) => r.glucoseLevel))
        : null,
      maxGlucose: readings.length > 0
        ? Math.max(...readings.map((r) => r.glucoseLevel))
        : null,
      inRangeCount: targetRange
        ? readings.filter(
            (r) =>
              r.glucoseLevel >= targetRange.min &&
              r.glucoseLevel <= targetRange.max
          ).length
        : null,
      outOfRangeCount: targetRange
        ? readings.filter(
            (r) =>
              r.glucoseLevel < targetRange.min ||
              r.glucoseLevel > targetRange.max
          ).length
        : null,
      targetRange,
    };

    res.json(stats);
  } catch (error: any) {
    console.error('Get glucose statistics error:', error);
    res.status(500).json({ message: 'Failed to fetch glucose statistics', error: error.message });
  }
};

