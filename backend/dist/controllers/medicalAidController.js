"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClaims = exports.submitClaim = exports.verifyMedicalAid = exports.upsertMedicalAidInfo = exports.getMedicalAidInfo = void 0;
const prisma_1 = require("../utils/prisma");
// Get or create medical aid info
const getMedicalAidInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        let medicalAidInfo = await prisma_1.prisma.medicalAidInfo.findUnique({
            where: { userId },
            include: {
                claims: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
        // Return 200 with null if no medical aid info exists (instead of 404)
        // This allows the frontend to handle the empty state gracefully
        res.json({ medicalAidInfo: medicalAidInfo || null });
    }
    catch (error) {
        console.error('Get medical aid info error:', error);
        res.status(500).json({ message: 'Failed to fetch medical aid information', error: error.message });
    }
};
exports.getMedicalAidInfo = getMedicalAidInfo;
// Create or update medical aid info
const upsertMedicalAidInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const { scheme, schemeName, memberNumber, policyNumber } = req.body;
        if (!scheme || !memberNumber) {
            return res.status(400).json({ message: 'Scheme and member number are required' });
        }
        // Validate scheme enum value - return error if invalid instead of silently converting
        const validSchemes = ['NAMMED', 'MEDICAL_AID_FUND', 'PROSANA', 'OTHER'];
        if (!validSchemes.includes(scheme)) {
            return res.status(400).json({
                message: 'Invalid medical aid scheme',
                error: `Scheme must be one of: ${validSchemes.join(', ')}`,
                provided: scheme
            });
        }
        const normalizedScheme = scheme;
        const medicalAidInfo = await prisma_1.prisma.medicalAidInfo.upsert({
            where: { userId },
            update: {
                scheme: normalizedScheme,
                schemeName: schemeName || null,
                memberNumber,
                policyNumber: policyNumber || null,
                updatedAt: new Date(),
            },
            create: {
                userId,
                scheme: normalizedScheme,
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
    }
    catch (error) {
        console.error('Upsert medical aid info error:', error);
        res.status(500).json({ message: 'Failed to save medical aid information', error: error.message });
    }
};
exports.upsertMedicalAidInfo = upsertMedicalAidInfo;
// Verify medical aid membership
const verifyMedicalAid = async (req, res) => {
    try {
        const userId = req.user.id;
        const medicalAidInfo = await prisma_1.prisma.medicalAidInfo.findUnique({
            where: { userId },
        });
        if (!medicalAidInfo) {
            return res.status(404).json({ message: 'No medical aid information found' });
        }
        // In a real implementation, this would call the medical aid scheme's API
        // For now, we'll simulate verification
        const isVerified = await simulateMedicalAidVerification(medicalAidInfo);
        if (isVerified) {
            await prisma_1.prisma.medicalAidInfo.update({
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
    }
    catch (error) {
        console.error('Verify medical aid error:', error);
        res.status(500).json({ message: 'Medical aid verification failed', error: error.message });
    }
};
exports.verifyMedicalAid = verifyMedicalAid;
// Submit medical aid claim
const submitClaim = async (req, res) => {
    try {
        const userId = req.user.id;
        const { appointmentId, amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Valid amount is required' });
        }
        const medicalAidInfo = await prisma_1.prisma.medicalAidInfo.findUnique({
            where: { userId },
        });
        if (!medicalAidInfo || !medicalAidInfo.isActive) {
            return res.status(400).json({ message: 'Active medical aid information is required' });
        }
        // Generate claim number
        const claimNumber = `CLAIM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const claim = await prisma_1.prisma.medicalAidClaim.create({
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
    }
    catch (error) {
        console.error('Submit claim error:', error);
        res.status(500).json({ message: 'Failed to submit claim', error: error.message });
    }
};
exports.submitClaim = submitClaim;
// Get claims history
const getClaims = async (req, res) => {
    try {
        const userId = req.user.id;
        const medicalAidInfo = await prisma_1.prisma.medicalAidInfo.findUnique({
            where: { userId },
        });
        // Return empty array if no medical aid info exists (instead of 404)
        // This allows the frontend to handle the empty state gracefully
        if (!medicalAidInfo) {
            return res.json({ claims: [] });
        }
        const claims = await prisma_1.prisma.medicalAidClaim.findMany({
            where: { medicalAidInfoId: medicalAidInfo.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ claims });
    }
    catch (error) {
        console.error('Get claims error:', error);
        res.status(500).json({ message: 'Failed to fetch claims', error: error.message });
    }
};
exports.getClaims = getClaims;
// Helper function to simulate medical aid verification
async function simulateMedicalAidVerification(medicalAidInfo) {
    // In production, this would make an API call to the medical aid scheme
    // For now, we'll simulate a successful verification
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate verification logic
            resolve(medicalAidInfo.memberNumber.length >= 6);
        }, 1000);
    });
}
//# sourceMappingURL=medicalAidController.js.map