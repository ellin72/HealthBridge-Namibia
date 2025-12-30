import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient, AppointmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { providerId, appointmentDate, notes } = req.body;
    const patientId = req.user!.id;

    if (!providerId || !appointmentDate) {
      return res.status(400).json({ message: 'Provider ID and appointment date are required' });
    }

    // Verify provider exists and is a healthcare provider
    const provider = await prisma.user.findUnique({
      where: { id: providerId }
    });

    if (!provider || provider.role !== 'HEALTHCARE_PROVIDER') {
      return res.status(400).json({ message: 'Invalid provider' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        providerId,
        appointmentDate: new Date(appointmentDate),
        notes,
        status: 'PENDING'
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      }
    });

    res.status(201).json({ message: 'Appointment created successfully', appointment });
  } catch (error: any) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Failed to create appointment', error: error.message });
  }
};

export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const { status, startDate, endDate } = req.query;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const where: any = {};

    // Appointments are only visible to:
    // 1. The patient who created the appointment
    // 2. The provider assigned to the appointment
    // All other users (including admins) cannot see appointments
    if (userRole === 'PATIENT') {
      // Patients can only see appointments they created
      where.patientId = userId;
    } else if (userRole === 'HEALTHCARE_PROVIDER') {
      // Providers can only see appointments assigned to them
      where.providerId = userId;
    } else {
      // For any other role (ADMIN, STUDENT, WELLNESS_COACH, etc.), return empty result
      // by setting an impossible condition that will never match
      where.id = '00000000-0000-0000-0000-000000000000';
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.appointmentDate = {};
      if (startDate) where.appointmentDate.gte = new Date(startDate as string);
      if (endDate) where.appointmentDate.lte = new Date(endDate as string);
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        consultationNotes: {
          select: {
            id: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { appointmentDate: 'desc' }
    });

    res.json(appointments);
  } catch (error: any) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Failed to get appointments', error: error.message });
  }
};

export const getAppointmentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        consultationNotes: true
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check access permissions - only patient and provider can access
    // Appointments are only visible to the patient who created it and the provider assigned to it
    const normalizedUserId = String(userId).trim();
    const normalizedPatientId = String(appointment.patientId).trim();
    const normalizedProviderId = String(appointment.providerId).trim();
    
    const isPatient = normalizedPatientId === normalizedUserId;
    const isProvider = normalizedProviderId === normalizedUserId;

    if (!isPatient && !isProvider) {
      return res.status(403).json({ message: 'Access denied. You can only view your own appointments or appointments assigned to you.' });
    }

    res.json(appointment);
  } catch (error: any) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Failed to get appointment', error: error.message });
  }
};

export const updateAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { appointmentDate, status, notes } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    console.log('Update appointment request:', {
      appointmentId: id,
      userId,
      userRole,
      body: req.body
    });

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    console.log('Appointment found:', {
      patientId: appointment.patientId,
      providerId: appointment.providerId,
      status: appointment.status
    });

    // Check permissions - only patient and provider can update
    // Normalize IDs to strings and trim any whitespace
    const normalizedUserId = String(userId).trim();
    const normalizedPatientId = String(appointment.patientId).trim();
    const normalizedProviderId = String(appointment.providerId).trim();
    
    const isPatient = normalizedPatientId === normalizedUserId;
    const isProvider = normalizedProviderId === normalizedUserId;

    console.log('Permission check:', {
      isPatient,
      isProvider,
      userId: normalizedUserId,
      patientId: normalizedPatientId,
      providerId: normalizedProviderId,
      patientIdMatch: normalizedPatientId === normalizedUserId,
      providerIdMatch: normalizedProviderId === normalizedUserId,
      userIdType: typeof userId,
      patientIdType: typeof appointment.patientId,
      providerIdType: typeof appointment.providerId
    });

    if (!isPatient && !isProvider) {
      console.error('Access denied - permission check failed:', {
        userRole,
        normalizedUserId,
        normalizedPatientId,
        normalizedProviderId,
        isPatient,
        isProvider
      });
      return res.status(403).json({ 
        message: 'Access denied. You can only update your own appointments or appointments assigned to you.',
        details: {
          userRole,
          appointmentPatientId: appointment.patientId,
          appointmentProviderId: appointment.providerId,
          userId
        }
      });
    }

    // Only providers can change status, except patients can cancel their own appointments
    if (status && userRole !== 'HEALTHCARE_PROVIDER') {
      if (status === 'CANCELLED' && normalizedPatientId === normalizedUserId) {
        // Patients can cancel their own appointments
        console.log('Patient canceling own appointment - allowed');
      } else {
        console.log('Status change denied:', {
          status,
          userRole,
          isPatient,
          isProvider
        });
        return res.status(403).json({ message: 'Only providers can change appointment status' });
      }
    }

    const updateData: any = {};
    if (appointmentDate) updateData.appointmentDate = new Date(appointmentDate);
    if (status) updateData.status = status as AppointmentStatus;
    if (notes !== undefined) updateData.notes = notes;

    // Ensure at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    console.log('Updating appointment with data:', updateData);

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
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
    });

    res.json({ message: 'Appointment updated successfully', appointment: updatedAppointment });
  } catch (error: any) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
};

export const deleteAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only patients can delete their own appointments
    const normalizedUserId = String(userId).trim();
    const normalizedPatientId = String(appointment.patientId).trim();
    
    if (normalizedPatientId !== normalizedUserId) {
      return res.status(403).json({ message: 'Access denied. You can only delete your own appointments.' });
    }

    await prisma.appointment.delete({
      where: { id }
    });

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error: any) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: 'Failed to delete appointment', error: error.message });
  }
};

