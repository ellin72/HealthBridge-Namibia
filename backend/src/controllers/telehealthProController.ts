import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient, VideoProvider } from '@prisma/client';

const prisma = new PrismaClient();

// ========== VIDEO CONSULTATIONS ==========

export const createVideoConsultation = async (req: AuthRequest, res: Response) => {
  try {
    const { appointmentId, provider, meetingUrl, meetingId, meetingPassword } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (!appointmentId || !meetingUrl) {
      return res.status(400).json({ message: 'Appointment ID and meeting URL are required' });
    }

    // Verify appointment exists and user has access
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only provider or admin can create video consultation
    if (userRole !== 'ADMIN' && appointment.providerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const videoConsultation = await prisma.videoConsultation.create({
      data: {
        appointmentId,
        provider: provider || 'ZOOM',
        meetingUrl,
        meetingId,
        meetingPassword
      },
      include: {
        appointment: {
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            provider: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({ message: 'Video consultation created successfully', videoConsultation });
  } catch (error: any) {
    console.error('Create video consultation error:', error);
    res.status(500).json({ message: 'Failed to create video consultation', error: error.message });
  }
};

export const getVideoConsultation = async (req: AuthRequest, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check access permissions - only patient and provider can access
    const normalizedUserId = String(userId).trim();
    const normalizedPatientId = String(appointment.patientId).trim();
    const normalizedProviderId = String(appointment.providerId).trim();
    
    const isPatient = normalizedPatientId === normalizedUserId;
    const isProvider = normalizedProviderId === normalizedUserId;

    if (!isPatient && !isProvider) {
      return res.status(403).json({ message: 'Access denied. You can only view video consultations for your own appointments or appointments assigned to you.' });
    }

    const videoConsultation = await prisma.videoConsultation.findUnique({
      where: { appointmentId },
      include: {
        appointment: {
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            provider: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!videoConsultation) {
      return res.status(404).json({ message: 'Video consultation not found' });
    }

    res.json(videoConsultation);
  } catch (error: any) {
    console.error('Get video consultation error:', error);
    res.status(500).json({ message: 'Failed to get video consultation', error: error.message });
  }
};

export const updateVideoConsultation = async (req: AuthRequest, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { startTime, endTime, duration, recordingUrl } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only provider assigned to the appointment can update
    const normalizedUserId = String(userId).trim();
    const normalizedProviderId = String(appointment.providerId).trim();
    
    if (normalizedProviderId !== normalizedUserId) {
      return res.status(403).json({ message: 'Access denied. You can only update video consultations for appointments assigned to you.' });
    }

    const updateData: any = {};
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (duration) updateData.duration = duration;
    if (recordingUrl) updateData.recordingUrl = recordingUrl;

    const updated = await prisma.videoConsultation.update({
      where: { appointmentId },
      data: updateData
    });

    res.json({ message: 'Video consultation updated successfully', videoConsultation: updated });
  } catch (error: any) {
    console.error('Update video consultation error:', error);
    res.status(500).json({ message: 'Failed to update video consultation', error: error.message });
  }
};

// ========== PATIENT HISTORY ==========

export const createPatientHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { patientId, medicalHistory, allergies, medications, vitalSigns, labResults, notes } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    // Only providers with relationship to patient, or the patient themselves can create history
    const normalizedUserId = String(userId).trim();
    const normalizedPatientId = String(patientId).trim();
    
    const isPatient = normalizedPatientId === normalizedUserId;
    
    // Check if provider has relationship with patient
    let isProvider = false;
    if (userRole === 'HEALTHCARE_PROVIDER') {
      const hasRelationship = await prisma.appointment.findFirst({
        where: {
          providerId: userId,
          patientId: patientId
        }
      });
      isProvider = !!hasRelationship;
    }

    if (!isPatient && !isProvider) {
      return res.status(403).json({ message: 'Access denied. You can only create patient history for your own records or for patients assigned to you.' });
    }

    const history = await prisma.patientHistory.create({
      data: {
        patientId,
        providerId: userRole === 'HEALTHCARE_PROVIDER' ? userId : undefined,
        medicalHistory: medicalHistory ? JSON.stringify(medicalHistory) : null,
        allergies: allergies ? JSON.stringify(allergies) : null,
        medications: medications ? JSON.stringify(medications) : null,
        vitalSigns: vitalSigns ? JSON.stringify(vitalSigns) : null,
        labResults: labResults ? JSON.stringify(labResults) : null,
        notes
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({ message: 'Patient history created successfully', history });
  } catch (error: any) {
    console.error('Create patient history error:', error);
    res.status(500).json({ message: 'Failed to create patient history', error: error.message });
  }
};

export const getPatientHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { patientId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check access permissions - only patient and their provider can access
    const normalizedUserId = String(userId).trim();
    const normalizedPatientId = String(patientId).trim();
    
    const isPatient = normalizedPatientId === normalizedUserId;
    
    // Check if provider has relationship with patient
    let isProvider = false;
    if (userRole === 'HEALTHCARE_PROVIDER') {
      const hasRelationship = await prisma.appointment.findFirst({
        where: {
          providerId: userId,
          patientId: patientId
        }
      });
      isProvider = !!hasRelationship;
    }

    if (!isPatient && !isProvider) {
      return res.status(403).json({ message: 'Access denied. You can only view patient history for your own records or for patients assigned to you.' });
    }

    const histories = await prisma.patientHistory.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Parse JSON fields
    const parsedHistories = histories.map(h => ({
      ...h,
      medicalHistory: h.medicalHistory ? JSON.parse(h.medicalHistory) : null,
      allergies: h.allergies ? JSON.parse(h.allergies) : null,
      medications: h.medications ? JSON.parse(h.medications) : null,
      vitalSigns: h.vitalSigns ? JSON.parse(h.vitalSigns) : null,
      labResults: h.labResults ? JSON.parse(h.labResults) : null
    }));

    res.json(parsedHistories);
  } catch (error: any) {
    console.error('Get patient history error:', error);
    res.status(500).json({ message: 'Failed to get patient history', error: error.message });
  }
};

export const updatePatientHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { medicalHistory, allergies, medications, vitalSigns, labResults, notes } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const history = await prisma.patientHistory.findUnique({
      where: { id }
    });

    if (!history) {
      return res.status(404).json({ message: 'Patient history not found' });
    }

    // Check permissions - only patient and their provider can update
    const normalizedUserId = String(userId).trim();
    const normalizedPatientId = String(history.patientId).trim();
    
    const isPatient = normalizedPatientId === normalizedUserId;
    
    // Check if provider has relationship with patient
    let isProvider = false;
    if (userRole === 'HEALTHCARE_PROVIDER') {
      const hasRelationship = await prisma.appointment.findFirst({
        where: {
          providerId: userId,
          patientId: history.patientId
        }
      });
      isProvider = !!hasRelationship;
    }

    if (!isPatient && !isProvider) {
      return res.status(403).json({ message: 'Access denied. You can only update patient history for your own records or for patients assigned to you.' });
    }

    const updateData: any = {};
    if (medicalHistory !== undefined) updateData.medicalHistory = medicalHistory ? JSON.stringify(medicalHistory) : null;
    if (allergies !== undefined) updateData.allergies = allergies ? JSON.stringify(allergies) : null;
    if (medications !== undefined) updateData.medications = medications ? JSON.stringify(medications) : null;
    if (vitalSigns !== undefined) updateData.vitalSigns = vitalSigns ? JSON.stringify(vitalSigns) : null;
    if (labResults !== undefined) updateData.labResults = labResults ? JSON.stringify(labResults) : null;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.patientHistory.update({
      where: { id },
      data: updateData
    });

    res.json({ message: 'Patient history updated successfully', history: updated });
  } catch (error: any) {
    console.error('Update patient history error:', error);
    res.status(500).json({ message: 'Failed to update patient history', error: error.message });
  }
};

// ========== PROVIDER ANALYTICS ==========

export const getProviderAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can access analytics
    if (userRole !== 'HEALTHCARE_PROVIDER') {
      return res.status(403).json({ message: 'Access denied. Only healthcare providers can access analytics.' });
    }

    const where: any = {
      providerId: userId
    };

    if (startDate || endDate) {
      where.appointmentDate = {};
      if (startDate) where.appointmentDate.gte = new Date(startDate as string);
      if (endDate) where.appointmentDate.lte = new Date(endDate as string);
    }

    // Get appointment statistics
    const totalAppointments = await prisma.appointment.count({ where });
    const confirmedAppointments = await prisma.appointment.count({
      where: { ...where, status: 'CONFIRMED' }
    });
    const completedAppointments = await prisma.appointment.count({
      where: { ...where, status: 'COMPLETED' }
    });
    const cancelledAppointments = await prisma.appointment.count({
      where: { ...where, status: 'CANCELLED' }
    });

    // Get video consultation statistics
    const videoConsultations = await prisma.videoConsultation.count({
      where: {
        appointment: where
      }
    });

    // Get consultation notes count
    const consultationNotes = await prisma.consultationNote.count({
      where: {
        providerId: userRole === 'HEALTHCARE_PROVIDER' ? userId : undefined,
        appointment: where
      }
    });

    // Get unique patients count
    const uniquePatients = await prisma.appointment.findMany({
      where,
      select: { patientId: true },
      distinct: ['patientId']
    });

    // Calculate average appointments per patient
    const avgAppointmentsPerPatient = uniquePatients.length > 0
      ? (totalAppointments / uniquePatients.length).toFixed(2)
      : '0';

    const analytics = {
      totalAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      videoConsultations,
      consultationNotes,
      uniquePatients: uniquePatients.length,
      avgAppointmentsPerPatient: parseFloat(avgAppointmentsPerPatient),
      completionRate: totalAppointments > 0
        ? ((completedAppointments / totalAppointments) * 100).toFixed(2) + '%'
        : '0%',
      cancellationRate: totalAppointments > 0
        ? ((cancelledAppointments / totalAppointments) * 100).toFixed(2) + '%'
        : '0%'
    };

    res.json(analytics);
  } catch (error: any) {
    console.error('Get provider analytics error:', error);
    res.status(500).json({ message: 'Failed to get provider analytics', error: error.message });
  }
};

