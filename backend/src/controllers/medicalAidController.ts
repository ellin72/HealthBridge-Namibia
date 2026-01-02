import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

// Get or create medical aid info
export const getMedicalAidInfo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    let medicalAidInfo = await prisma.medicalAidInfo.findUnique({
      where: { userId },
      include: {
        claims: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!medicalAidInfo) {
      return res.status(404).json({ message: 'No medical aid information found' });
    }

    res.json({ medicalAidInfo });
  } catch (error: any) {
    console.error('Get medical aid info error:', error);
    res.status(500).json({ message: 'Failed to fetch medical aid information', error: error.message });
  }
};

// Create or update medical aid info
export const upsertMedicalAidInfo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { scheme, schemeName, memberNumber, policyNumber } = req.body;

    if (!scheme || !memberNumber) {
      return res.status(400).json({ message: 'Scheme and member number are required' });
    }

    const medicalAidInfo = await prisma.medicalAidInfo.upsert({
      where: { userId },
      update: {
        scheme,
        schemeName: schemeName || null,
        memberNumber,
        policyNumber: policyNumber || null,
        updatedAt: new Date(),
      },
      create: {
        userId,
        scheme,
        schemeName: schemeName || null,
        memberNumber,
        policyNumber: policyNumber || null,
        isActive: true,
      },
    });

    res.json({
      message: 'Medical aid information saved successfully',
      medicalAidInfo,
    });
  } catch (error: any) {
    console.error('Upsert medical aid info error:', error);
    res.status(500).json({ message: 'Failed to save medical aid information', error: error.message });
  }
};

// Verify medical aid membership
export const verifyMedicalAid = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const medicalAidInfo = await prisma.medicalAidInfo.findUnique({
      where: { userId },
    });

    if (!medicalAidInfo) {
      return res.status(404).json({ message: 'No medical aid information found' });
    }

    // In a real implementation, this would call the medical aid scheme's API
    // For now, we'll simulate verification
    const isVerified = await simulateMedicalAidVerification(medicalAidInfo);

    if (isVerified) {
      await prisma.medicalAidInfo.update({
        where: { userId },
        data: {
          verifiedAt: new Date(),
          isActive: true,
        },
      });
    }

    res.json({
      message: isVerified ? 'Medical aid verified successfully' : 'Medical aid verification failed',
      verified: isVerified,
    });
  } catch (error: any) {
    console.error('Verify medical aid error:', error);
    res.status(500).json({ message: 'Medical aid verification failed', error: error.message });
  }
};

// Submit medical aid claim
export const submitClaim = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { appointmentId, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const medicalAidInfo = await prisma.medicalAidInfo.findUnique({
      where: { userId },
    });

    if (!medicalAidInfo || !medicalAidInfo.isActive) {
      return res.status(400).json({ message: 'Active medical aid information is required' });
    }

    // Generate claim number
    const claimNumber = `CLAIM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const claim = await prisma.medicalAidClaim.create({
      data: {
        medicalAidInfoId: medicalAidInfo.id,
        appointmentId: appointmentId || null,
        claimNumber,
        amount,
        status: 'PENDING',
      },
    });

    // In a real implementation, this would submit to the medical aid scheme's API
    // For now, we'll simulate submission
    // await submitToMedicalAidScheme(claim, medicalAidInfo);

    res.status(201).json({
      message: 'Claim submitted successfully',
      claim,
    });
  } catch (error: any) {
    console.error('Submit claim error:', error);
    res.status(500).json({ message: 'Failed to submit claim', error: error.message });
  }
};

// Get claims history
export const getClaims = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const medicalAidInfo = await prisma.medicalAidInfo.findUnique({
      where: { userId },
    });

    if (!medicalAidInfo) {
      return res.status(404).json({ message: 'No medical aid information found' });
    }

    const claims = await prisma.medicalAidClaim.findMany({
      where: { medicalAidInfoId: medicalAidInfo.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ claims });
  } catch (error: any) {
    console.error('Get claims error:', error);
    res.status(500).json({ message: 'Failed to fetch claims', error: error.message });
  }
};

// Helper function to simulate medical aid verification
async function simulateMedicalAidVerification(medicalAidInfo: any): Promise<boolean> {
  // In production, this would make an API call to the medical aid scheme
  // For now, we'll simulate a successful verification
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate verification logic
      resolve(medicalAidInfo.memberNumber.length >= 6);
    }, 1000);
  });
}

