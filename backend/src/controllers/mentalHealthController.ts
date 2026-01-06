import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { TherapyType, TherapySessionStatus } from '@prisma/client';

// Get all therapists
export const getTherapists = async (req: AuthRequest, res: Response) => {
  try {
    const { specialization, language, isActive } = req.query;

    const where: any = {
      isActive: isActive !== 'false',
    };

    if (specialization) {
      where.specialization = {
        contains: specialization as string,
      };
    }

    if (language) {
      where.languages = {
        contains: language as string,
      };
    }

    const therapists = await prisma.therapist.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
    });

    res.json(therapists);
  } catch (error: any) {
    console.error('Get therapists error:', error);
    res.status(500).json({ message: 'Failed to fetch therapists', error: error.message });
  }
};

// Get therapist by ID
export const getTherapistById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const therapist = await prisma.therapist.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    res.json(therapist);
  } catch (error: any) {
    console.error('Get therapist error:', error);
    res.status(500).json({ message: 'Failed to fetch therapist', error: error.message });
  }
};

// Create therapist profile
export const createTherapistProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Check if user is already a therapist
    const existing = await prisma.therapist.findUnique({
      where: { userId },
    });

    if (existing) {
      return res.status(400).json({ message: 'Therapist profile already exists' });
    }

    const {
      specialization,
      licenseNumber,
      yearsOfExperience,
      bio,
      languages,
      availability,
    } = req.body;

    const therapist = await prisma.therapist.create({
      data: {
        userId,
        specialization: specialization ? JSON.stringify(specialization) : null,
        licenseNumber,
        yearsOfExperience,
        bio,
        languages: languages ? JSON.stringify(languages) : null,
        availability: availability ? JSON.stringify(availability) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(therapist);
  } catch (error: any) {
    console.error('Create therapist profile error:', error);
    res.status(500).json({ message: 'Failed to create therapist profile', error: error.message });
  }
};

// Update therapist profile
export const updateTherapistProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      specialization,
      licenseNumber,
      yearsOfExperience,
      bio,
      languages,
      availability,
      isActive,
    } = req.body;

    const therapist = await prisma.therapist.findUnique({
      where: { userId },
    });

    if (!therapist) {
      return res.status(404).json({ message: 'Therapist profile not found' });
    }

    const updated = await prisma.therapist.update({
      where: { id: therapist.id },
      data: {
        specialization: specialization ? JSON.stringify(specialization) : undefined,
        licenseNumber,
        yearsOfExperience,
        bio,
        languages: languages ? JSON.stringify(languages) : undefined,
        availability: availability ? JSON.stringify(availability) : undefined,
        isActive,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Update therapist profile error:', error);
    res.status(500).json({ message: 'Failed to update therapist profile', error: error.message });
  }
};

// Create therapy session
export const createTherapySession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { therapistId, appointmentId, therapyType, sessionDate, duration, notes } = req.body;

    if (!therapistId || !therapyType || !sessionDate) {
      return res.status(400).json({ message: 'Therapist ID, therapy type, and session date are required' });
    }

    // Verify therapist exists
    const therapist = await prisma.therapist.findUnique({
      where: { id: therapistId },
    });

    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    const session = await prisma.therapySession.create({
      data: {
        patientId: userId,
        therapistId,
        appointmentId,
        therapyType: therapyType as TherapyType,
        sessionDate: new Date(sessionDate),
        duration: duration || 60,
        notes,
        status: 'SCHEDULED',
      },
      include: {
        therapist: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(session);
  } catch (error: any) {
    console.error('Create therapy session error:', error);
    res.status(500).json({ message: 'Failed to create therapy session', error: error.message });
  }
};

// Get patient's therapy sessions
export const getPatientTherapySessions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, limit = 50, offset = 0 } = req.query;

    const where: any = { patientId: userId };
    if (status) {
      where.status = status;
    }

    const sessions = await prisma.therapySession.findMany({
      where,
      include: {
        therapist: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        sessionDate: 'desc',
      },
      take: Number(limit),
      skip: Number(offset),
    });

    res.json(sessions);
  } catch (error: any) {
    console.error('Get therapy sessions error:', error);
    res.status(500).json({ message: 'Failed to fetch therapy sessions', error: error.message });
  }
};

// Update therapy session (therapist can update notes, diagnosis, etc.)
export const updateTherapySession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { notes, diagnosis, medicationPrescribed, followUpDate, status, patientNotes } = req.body;

    const session = await prisma.therapySession.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({ message: 'Therapy session not found' });
    }

    // Check if user is the therapist or patient
    const isTherapist = session.therapistId && await prisma.therapist.findFirst({
      where: { id: session.therapistId, userId },
    });

    const isPatient = session.patientId === userId;

    if (!isTherapist && !isPatient) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updateData: any = {};
    if (notes && isTherapist) updateData.notes = notes;
    if (patientNotes && isPatient) updateData.patientNotes = patientNotes;
    if (diagnosis && isTherapist) updateData.diagnosis = diagnosis ? JSON.stringify(diagnosis) : null;
    if (medicationPrescribed && isTherapist) updateData.medicationPrescribed = medicationPrescribed ? JSON.stringify(medicationPrescribed) : null;
    if (followUpDate) updateData.followUpDate = followUpDate ? new Date(followUpDate) : null;
    if (status) updateData.status = status as TherapySessionStatus;

    const updated = await prisma.therapySession.update({
      where: { id },
      data: updateData,
      include: {
        therapist: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Update therapy session error:', error);
    res.status(500).json({ message: 'Failed to update therapy session', error: error.message });
  }
};

// Match patient with therapist
export const matchTherapist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { therapistId, preferences } = req.body;

    if (!therapistId) {
      return res.status(400).json({ message: 'Therapist ID is required' });
    }

    // Check if match already exists
    const existing = await prisma.therapistMatch.findUnique({
      where: {
        patientId_therapistId: {
          patientId: userId,
          therapistId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ message: 'Match already exists' });
    }

    const match = await prisma.therapistMatch.create({
      data: {
        patientId: userId,
        therapistId,
        patientPreferences: preferences ? JSON.stringify(preferences) : null,
        status: 'PENDING',
      },
      include: {
        therapist: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(match);
  } catch (error: any) {
    console.error('Match therapist error:', error);
    res.status(500).json({ message: 'Failed to match therapist', error: error.message });
  }
};

// Get patient's therapist matches
export const getTherapistMatches = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status } = req.query;

    const where: any = { patientId: userId };
    if (status) {
      where.status = status;
    }

    const matches = await prisma.therapistMatch.findMany({
      where,
      include: {
        therapist: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(matches);
  } catch (error: any) {
    console.error('Get therapist matches error:', error);
    res.status(500).json({ message: 'Failed to fetch therapist matches', error: error.message });
  }
};

// Update match status
export const updateMatchStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const match = await prisma.therapistMatch.findUnique({
      where: { id },
    });

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const updated = await prisma.therapistMatch.update({
      where: { id },
      data: {
        status,
        matchedAt: status === 'ACCEPTED' ? new Date() : undefined,
      },
      include: {
        therapist: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Update match status error:', error);
    res.status(500).json({ message: 'Failed to update match status', error: error.message });
  }
};

