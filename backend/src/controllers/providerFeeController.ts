import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Get provider fee settings
export const getProviderFee = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can view their own fees, or admins can view any provider's fees
    const providerId = req.query.providerId as string || (userRole === 'HEALTHCARE_PROVIDER' ? userId : null);

    if (!providerId) {
      return res.status(400).json({ message: 'Provider ID is required' });
    }

    // Check permissions
    if (userRole !== 'ADMIN' && userId !== providerId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let providerFee = await prisma.providerFee.findUnique({
      where: { providerId },
      include: {
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

    // Create default fee if doesn't exist
    if (!providerFee) {
      providerFee = await prisma.providerFee.create({
        data: {
          providerId,
          consultationFee: 500, // Default NAD 500
          currency: 'NAD',
          isActive: true
        },
        include: {
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
    }

    res.json({
      ...providerFee,
      serviceFees: providerFee.serviceFees ? JSON.parse(providerFee.serviceFees) : null
    });
  } catch (error: any) {
    console.error('Get provider fee error:', error);
    res.status(500).json({ message: 'Failed to fetch provider fee', error: error.message });
  }
};

// Update provider fee settings
export const updateProviderFee = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { consultationFee, serviceFees, currency, isActive } = req.body;
    const providerId = req.params.providerId || userId;

    // Only providers can update their own fees, or admins can update any
    if (userRole !== 'ADMIN' && userId !== providerId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Verify provider exists and is a healthcare provider
    const provider = await prisma.user.findUnique({
      where: { id: providerId }
    });

    if (!provider || provider.role !== 'HEALTHCARE_PROVIDER') {
      return res.status(400).json({ message: 'Invalid provider' });
    }

    const updateData: any = {};
    if (consultationFee !== undefined) updateData.consultationFee = consultationFee;
    if (serviceFees !== undefined) updateData.serviceFees = JSON.stringify(serviceFees);
    if (currency !== undefined) updateData.currency = currency;
    if (isActive !== undefined) updateData.isActive = isActive;

    const providerFee = await prisma.providerFee.upsert({
      where: { providerId },
      create: {
        providerId,
        consultationFee: consultationFee || 500,
        serviceFees: serviceFees ? JSON.stringify(serviceFees) : null,
        currency: currency || 'NAD',
        isActive: isActive !== undefined ? isActive : true
      },
      update: updateData,
      include: {
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

    res.json({
      message: 'Provider fee updated successfully',
      providerFee: {
        ...providerFee,
        serviceFees: providerFee.serviceFees ? JSON.parse(providerFee.serviceFees) : null
      }
    });
  } catch (error: any) {
    console.error('Update provider fee error:', error);
    res.status(500).json({ message: 'Failed to update provider fee', error: error.message });
  }
};

// Get all provider fees (admin only)
export const getAllProviderFees = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const providerFees = await prisma.providerFee.findMany({
      include: {
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({
      providerFees: providerFees.map(fee => ({
        ...fee,
        serviceFees: fee.serviceFees ? JSON.parse(fee.serviceFees) : null
      }))
    });
  } catch (error: any) {
    console.error('Get all provider fees error:', error);
    res.status(500).json({ message: 'Failed to fetch provider fees', error: error.message });
  }
};

