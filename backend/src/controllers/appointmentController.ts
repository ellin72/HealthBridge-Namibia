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

    if (userRole === 'PATIENT') {
      where.patientId = userId;
    } else if (userRole === 'HEALTHCARE_PROVIDER') {
      where.providerId = userId;
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

    // Check access permissions
    if (userRole !== 'ADMIN' && appointment.patientId !== userId && appointment.providerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
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

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    if (userRole !== 'ADMIN' && appointment.patientId !== userId && appointment.providerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only providers and admins can change status
    if (status && userRole !== 'HEALTHCARE_PROVIDER' && userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Only providers can change appointment status' });
    }

    const updateData: any = {};
    if (appointmentDate) updateData.appointmentDate = new Date(appointmentDate);
    if (status) updateData.status = status as AppointmentStatus;
    if (notes !== undefined) updateData.notes = notes;

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

    // Only patients can cancel their own appointments, or admins
    if (userRole !== 'ADMIN' && appointment.patientId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
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

