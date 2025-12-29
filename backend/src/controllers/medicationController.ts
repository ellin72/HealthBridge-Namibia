import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Get patient's medication reminders
export const getMedications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, activeOnly } = req.query;

    const where: any = { patientId: userId };
    if (status) where.status = status;
    if (activeOnly === 'true') where.isActive = true;

    const medications = await prisma.medicationReminder.findMany({
      where,
      include: {
        logs: {
          orderBy: { scheduledTime: 'desc' },
          take: 10,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ medications });
  } catch (error: any) {
    console.error('Get medications error:', error);
    res.status(500).json({ message: 'Failed to fetch medications', error: error.message });
  }
};

// Create medication reminder
export const createMedication = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { medicationName, dosage, frequency, times, startDate, endDate, notes } = req.body;

    if (!medicationName || !dosage || !frequency || !times || !startDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const medication = await prisma.medicationReminder.create({
      data: {
        patientId: userId,
        medicationName,
        dosage,
        frequency,
        times: JSON.stringify(times),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        notes: notes || null,
        status: 'ACTIVE',
        isActive: true,
      },
    });

    res.status(201).json({
      message: 'Medication reminder created successfully',
      medication: {
        ...medication,
        times: JSON.parse(medication.times),
      },
    });
  } catch (error: any) {
    console.error('Create medication error:', error);
    res.status(500).json({ message: 'Failed to create medication reminder', error: error.message });
  }
};

// Update medication reminder
export const updateMedication = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { medicationName, dosage, frequency, times, startDate, endDate, notes, status, isActive } = req.body;

    const medication = await prisma.medicationReminder.findFirst({
      where: { id, patientId: userId },
    });

    if (!medication) {
      return res.status(404).json({ message: 'Medication reminder not found' });
    }

    const updated = await prisma.medicationReminder.update({
      where: { id },
      data: {
        medicationName,
        dosage,
        frequency,
        times: times ? JSON.stringify(times) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
        notes,
        status,
        isActive,
      },
    });

    res.json({
      message: 'Medication reminder updated successfully',
      medication: {
        ...updated,
        times: JSON.parse(updated.times),
      },
    });
  } catch (error: any) {
    console.error('Update medication error:', error);
    res.status(500).json({ message: 'Failed to update medication reminder', error: error.message });
  }
};

// Log medication taken
export const logMedication = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { reminderId, scheduledTime, takenTime, status, notes } = req.body;

    if (!reminderId || !scheduledTime || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify reminder belongs to patient
    const reminder = await prisma.medicationReminder.findFirst({
      where: { id: reminderId, patientId: userId },
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Medication reminder not found' });
    }

    const log = await prisma.medicationLog.create({
      data: {
        reminderId,
        scheduledTime: new Date(scheduledTime),
        takenTime: takenTime ? new Date(takenTime) : null,
        status,
        notes: notes || null,
      },
    });

    res.status(201).json({
      message: 'Medication logged successfully',
      log,
    });
  } catch (error: any) {
    console.error('Log medication error:', error);
    res.status(500).json({ message: 'Failed to log medication', error: error.message });
  }
};

// Get upcoming reminders for today
export const getUpcomingReminders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const medications = await prisma.medicationReminder.findMany({
      where: {
        patientId: userId,
        isActive: true,
        status: 'ACTIVE',
        startDate: { lte: tomorrow },
        OR: [
          { endDate: null },
          { endDate: { gte: today } },
        ],
      },
    });

    // Generate upcoming reminders for today
    const upcomingReminders: any[] = [];
    medications.forEach((med) => {
      const times = JSON.parse(med.times);
      times.forEach((time: string) => {
        const [hours, minutes] = time.split(':');
        const reminderTime = new Date();
        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        if (reminderTime >= new Date()) {
          upcomingReminders.push({
            id: med.id,
            medicationName: med.medicationName,
            dosage: med.dosage,
            time: time,
            reminderTime: reminderTime.toISOString(),
          });
        }
      });
    });

    // Sort by time
    upcomingReminders.sort((a, b) => 
      new Date(a.reminderTime).getTime() - new Date(b.reminderTime).getTime()
    );

    res.json({ reminders: upcomingReminders });
  } catch (error: any) {
    console.error('Get upcoming reminders error:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming reminders', error: error.message });
  }
};

