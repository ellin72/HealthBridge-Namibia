import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';

// Create hypertension management program
export const createHypertensionProgram = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      providerId,
      diagnosisDate,
      targetBP,
      medications,
      lifestyleGoals,
    } = req.body;

    const program = await prisma.hypertensionManagementProgram.create({
      data: {
        patientId: userId,
        providerId,
        diagnosisDate: diagnosisDate ? new Date(diagnosisDate) : null,
        targetBP: targetBP ? JSON.stringify(targetBP) : null,
        medications: medications ? JSON.stringify(medications) : null,
        lifestyleGoals: lifestyleGoals ? JSON.stringify(lifestyleGoals) : null,
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
    console.error('Create hypertension program error:', error);
    res.status(500).json({ message: 'Failed to create hypertension program', error: error.message });
  }
};

// Get patient's hypertension programs
export const getHypertensionPrograms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status } = req.query;

    const where: any = { patientId: userId };
    if (status) {
      where.status = status;
    }

    const programs = await prisma.hypertensionManagementProgram.findMany({
      where,
      include: {
        _count: {
          select: {
            bpReadings: true,
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
    console.error('Get hypertension programs error:', error);
    res.status(500).json({ message: 'Failed to fetch hypertension programs', error: error.message });
  }
};

// Get hypertension program by ID
export const getHypertensionProgramById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const program = await prisma.hypertensionManagementProgram.findFirst({
      where: {
        id,
        patientId: userId,
      },
      include: {
        bpReadings: {
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
      return res.status(404).json({ message: 'Hypertension program not found' });
    }

    res.json(program);
  } catch (error: any) {
    console.error('Get hypertension program error:', error);
    res.status(500).json({ message: 'Failed to fetch hypertension program', error: error.message });
  }
};

// Update hypertension program
export const updateHypertensionProgram = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const {
      targetBP,
      medications,
      lifestyleGoals,
      status,
    } = req.body;

    const program = await prisma.hypertensionManagementProgram.findFirst({
      where: {
        id,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Hypertension program not found' });
    }

    const updated = await prisma.hypertensionManagementProgram.update({
      where: { id },
      data: {
        targetBP: targetBP ? JSON.stringify(targetBP) : undefined,
        medications: medications ? JSON.stringify(medications) : undefined,
        lifestyleGoals: lifestyleGoals ? JSON.stringify(lifestyleGoals) : undefined,
        status,
      },
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Update hypertension program error:', error);
    res.status(500).json({ message: 'Failed to update hypertension program', error: error.message });
  }
};

// Add blood pressure reading
export const addBloodPressureReading = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      programId,
      systolic,
      diastolic,
      heartRate,
      readingContext,
      medicationTaken,
      notes,
    } = req.body;

    if (!programId || !systolic || !diastolic) {
      return res.status(400).json({
        message: 'Program ID, systolic, and diastolic values are required',
      });
    }

    // Verify program belongs to user
    const program = await prisma.hypertensionManagementProgram.findFirst({
      where: {
        id: programId,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Hypertension program not found' });
    }

    const reading = await prisma.bloodPressureReading.create({
      data: {
        programId,
        systolic,
        diastolic,
        heartRate,
        readingContext,
        medicationTaken: medicationTaken !== undefined ? medicationTaken : false,
        notes,
      },
    });

    res.status(201).json(reading);
  } catch (error: any) {
    console.error('Add blood pressure reading error:', error);
    res.status(500).json({ message: 'Failed to add blood pressure reading', error: error.message });
  }
};

// Get blood pressure readings
export const getBloodPressureReadings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { programId, limit = 100, offset = 0 } = req.query;

    if (!programId) {
      return res.status(400).json({ message: 'Program ID is required' });
    }

    // Verify program belongs to user
    const program = await prisma.hypertensionManagementProgram.findFirst({
      where: {
        id: programId as string,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Hypertension program not found' });
    }

    const readings = await prisma.bloodPressureReading.findMany({
      where: { programId: programId as string },
      orderBy: {
        recordedAt: 'desc',
      },
      take: Number(limit),
      skip: Number(offset),
    });

    res.json(readings);
  } catch (error: any) {
    console.error('Get blood pressure readings error:', error);
    res.status(500).json({ message: 'Failed to fetch blood pressure readings', error: error.message });
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
    const program = await prisma.hypertensionManagementProgram.findFirst({
      where: {
        id: programId,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Hypertension program not found' });
    }

    const log = await prisma.hypertensionMedicationLog.create({
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

// Get blood pressure statistics
export const getBloodPressureStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { programId, days = 30 } = req.query;

    if (!programId) {
      return res.status(400).json({ message: 'Program ID is required' });
    }

    const program = await prisma.hypertensionManagementProgram.findFirst({
      where: {
        id: programId as string,
        patientId: userId,
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Hypertension program not found' });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const readings = await prisma.bloodPressureReading.findMany({
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

    const targetBP = program.targetBP ? JSON.parse(program.targetBP) : null;

    // Calculate in-range count based on targetBP structure {systolic, diastolic}
    // Readings are considered "in range" if within ±10 mmHg of target values
    let inRangeCount: number | null = null;
    if (targetBP && targetBP.systolic !== undefined && targetBP.diastolic !== undefined) {
      const tolerance = 10; // ±10 mmHg tolerance
      inRangeCount = readings.filter(
        (r) =>
          Math.abs(r.systolic - targetBP.systolic) <= tolerance &&
          Math.abs(r.diastolic - targetBP.diastolic) <= tolerance
      ).length;
    } else if (targetBP && (targetBP.systolicMin !== undefined || targetBP.systolicMax !== undefined)) {
      // Support legacy range structure for backward compatibility
      inRangeCount = readings.filter(
        (r) =>
          (!targetBP.systolicMin || r.systolic >= targetBP.systolicMin) &&
          (!targetBP.systolicMax || r.systolic <= targetBP.systolicMax) &&
          (!targetBP.diastolicMin || r.diastolic >= targetBP.diastolicMin) &&
          (!targetBP.diastolicMax || r.diastolic <= targetBP.diastolicMax)
      ).length;
    }

    const stats = {
      totalReadings: readings.length,
      averageSystolic: readings.length > 0
        ? readings.reduce((sum, r) => sum + r.systolic, 0) / readings.length
        : null,
      averageDiastolic: readings.length > 0
        ? readings.reduce((sum, r) => sum + r.diastolic, 0) / readings.length
        : null,
      averageHeartRate: readings.filter((r) => r.heartRate).length > 0
        ? readings
            .filter((r) => r.heartRate)
            .reduce((sum, r) => sum + (r.heartRate || 0), 0) /
          readings.filter((r) => r.heartRate).length
        : null,
      minSystolic: readings.length > 0
        ? Math.min(...readings.map((r) => r.systolic))
        : null,
      maxSystolic: readings.length > 0
        ? Math.max(...readings.map((r) => r.systolic))
        : null,
      minDiastolic: readings.length > 0
        ? Math.min(...readings.map((r) => r.diastolic))
        : null,
      maxDiastolic: readings.length > 0
        ? Math.max(...readings.map((r) => r.diastolic))
        : null,
      inRangeCount,
      targetBP,
    };

    res.json(stats);
  } catch (error: any) {
    console.error('Get blood pressure statistics error:', error);
    res.status(500).json({ message: 'Failed to fetch blood pressure statistics', error: error.message });
  }
};

