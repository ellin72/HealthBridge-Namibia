"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSleepStatistics = exports.getSleepLogs = exports.addSleepLog = exports.getSleepProgramById = exports.getSleepPrograms = exports.createSleepProgram = exports.updateSpecialtyConsultation = exports.getSpecialtyConsultationById = exports.getSpecialtyConsultations = exports.createSpecialtyConsultation = void 0;
const prisma_1 = require("../utils/prisma");
// Create specialty consultation
const createSpecialtyConsultation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { providerId, specialtyType, appointmentId, chiefComplaint, medicalHistory, images, secondOpinionRequested, } = req.body;
        if (!specialtyType || !chiefComplaint) {
            return res.status(400).json({
                message: 'Specialty type and chief complaint are required',
            });
        }
        const consultation = await prisma_1.prisma.specialtyConsultation.create({
            data: {
                patientId: userId,
                providerId,
                specialtyType: specialtyType,
                appointmentId,
                chiefComplaint,
                medicalHistory: medicalHistory ? JSON.stringify(medicalHistory) : null,
                images: images ? JSON.stringify(images) : null,
                secondOpinionRequested: secondOpinionRequested || false,
                status: 'REQUESTED',
            },
            include: {
                patient: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        res.status(201).json(consultation);
    }
    catch (error) {
        console.error('Create specialty consultation error:', error);
        res.status(500).json({ message: 'Failed to create specialty consultation', error: error.message });
    }
};
exports.createSpecialtyConsultation = createSpecialtyConsultation;
// Get patient's specialty consultations
const getSpecialtyConsultations = async (req, res) => {
    try {
        const userId = req.user.id;
        const { specialtyType, status } = req.query;
        const where = { patientId: userId };
        if (specialtyType) {
            where.specialtyType = specialtyType;
        }
        if (status) {
            where.status = status;
        }
        const consultations = await prisma_1.prisma.specialtyConsultation.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(consultations);
    }
    catch (error) {
        console.error('Get specialty consultations error:', error);
        res.status(500).json({ message: 'Failed to fetch specialty consultations', error: error.message });
    }
};
exports.getSpecialtyConsultations = getSpecialtyConsultations;
// Get specialty consultation by ID
const getSpecialtyConsultationById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const consultation = await prisma_1.prisma.specialtyConsultation.findFirst({
            where: {
                id,
                patientId: userId,
            },
        });
        if (!consultation) {
            return res.status(404).json({ message: 'Specialty consultation not found' });
        }
        res.json(consultation);
    }
    catch (error) {
        console.error('Get specialty consultation error:', error);
        res.status(500).json({ message: 'Failed to fetch specialty consultation', error: error.message });
    }
};
exports.getSpecialtyConsultationById = getSpecialtyConsultationById;
// Update specialty consultation (provider can update diagnosis, treatment plan, etc.)
const updateSpecialtyConsultation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { diagnosis, treatmentPlan, prescription, followUpDate, expertOpinion, status, } = req.body;
        const consultation = await prisma_1.prisma.specialtyConsultation.findUnique({
            where: { id },
        });
        if (!consultation) {
            return res.status(404).json({ message: 'Specialty consultation not found' });
        }
        // Check if user is the provider or patient
        const isProvider = consultation.providerId === userId;
        const isPatient = consultation.patientId === userId;
        if (!isProvider && !isPatient) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const updateData = {};
        if (diagnosis !== undefined && isProvider)
            updateData.diagnosis = diagnosis;
        if (treatmentPlan !== undefined && isProvider)
            updateData.treatmentPlan = treatmentPlan ? JSON.stringify(treatmentPlan) : null;
        if (prescription !== undefined && isProvider)
            updateData.prescription = prescription ? JSON.stringify(prescription) : null;
        if (expertOpinion !== undefined && isProvider)
            updateData.expertOpinion = expertOpinion;
        if (followUpDate !== undefined && isProvider)
            updateData.followUpDate = followUpDate ? new Date(followUpDate) : null;
        if (status !== undefined && isProvider)
            updateData.status = status;
        const updated = await prisma_1.prisma.specialtyConsultation.update({
            where: { id },
            data: updateData,
        });
        res.json(updated);
    }
    catch (error) {
        console.error('Update specialty consultation error:', error);
        res.status(500).json({ message: 'Failed to update specialty consultation', error: error.message });
    }
};
exports.updateSpecialtyConsultation = updateSpecialtyConsultation;
// Sleep Program Management
const createSleepProgram = async (req, res) => {
    try {
        const userId = req.user.id;
        const { providerId, programName, targetSleepHours = 8, bedtime, wakeTime, sleepGoals, } = req.body;
        if (!programName) {
            return res.status(400).json({ message: 'Program name is required' });
        }
        const program = await prisma_1.prisma.sleepProgram.create({
            data: {
                patientId: userId,
                providerId,
                programName,
                targetSleepHours,
                bedtime,
                wakeTime,
                sleepGoals: sleepGoals ? JSON.stringify(sleepGoals) : null,
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
    }
    catch (error) {
        console.error('Create sleep program error:', error);
        res.status(500).json({ message: 'Failed to create sleep program', error: error.message });
    }
};
exports.createSleepProgram = createSleepProgram;
// Get patient's sleep programs
const getSleepPrograms = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;
        const where = { patientId: userId };
        if (status) {
            where.status = status;
        }
        const programs = await prisma_1.prisma.sleepProgram.findMany({
            where,
            include: {
                _count: {
                    select: {
                        sleepLogs: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(programs);
    }
    catch (error) {
        console.error('Get sleep programs error:', error);
        res.status(500).json({ message: 'Failed to fetch sleep programs', error: error.message });
    }
};
exports.getSleepPrograms = getSleepPrograms;
// Get sleep program by ID
const getSleepProgramById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const program = await prisma_1.prisma.sleepProgram.findFirst({
            where: {
                id,
                patientId: userId,
            },
            include: {
                sleepLogs: {
                    orderBy: {
                        sleepDate: 'desc',
                    },
                    take: 30,
                },
            },
        });
        if (!program) {
            return res.status(404).json({ message: 'Sleep program not found' });
        }
        res.json(program);
    }
    catch (error) {
        console.error('Get sleep program error:', error);
        res.status(500).json({ message: 'Failed to fetch sleep program', error: error.message });
    }
};
exports.getSleepProgramById = getSleepProgramById;
// Add sleep log
const addSleepLog = async (req, res) => {
    try {
        const userId = req.user.id;
        const { programId, sleepDate, bedtime, wakeTime, sleepDuration, sleepQuality, awakenings, sleepNotes, mood, activities, } = req.body;
        if (!programId || !sleepDate) {
            return res.status(400).json({ message: 'Program ID and sleep date are required' });
        }
        // Verify program belongs to user
        const program = await prisma_1.prisma.sleepProgram.findFirst({
            where: {
                id: programId,
                patientId: userId,
            },
        });
        if (!program) {
            return res.status(404).json({ message: 'Sleep program not found' });
        }
        const log = await prisma_1.prisma.sleepLog.create({
            data: {
                programId,
                sleepDate: new Date(sleepDate),
                bedtime: bedtime ? new Date(bedtime) : null,
                wakeTime: wakeTime ? new Date(wakeTime) : null,
                sleepDuration,
                sleepQuality,
                awakenings,
                sleepNotes,
                mood: mood ? JSON.stringify(mood) : null,
                activities: activities ? JSON.stringify(activities) : null,
            },
        });
        res.status(201).json(log);
    }
    catch (error) {
        console.error('Add sleep log error:', error);
        res.status(500).json({ message: 'Failed to add sleep log', error: error.message });
    }
};
exports.addSleepLog = addSleepLog;
// Get sleep logs
const getSleepLogs = async (req, res) => {
    try {
        const userId = req.user.id;
        const { programId, limit = 100, offset = 0 } = req.query;
        if (!programId) {
            return res.status(400).json({ message: 'Program ID is required' });
        }
        // Verify program belongs to user
        const program = await prisma_1.prisma.sleepProgram.findFirst({
            where: {
                id: programId,
                patientId: userId,
            },
        });
        if (!program) {
            return res.status(404).json({ message: 'Sleep program not found' });
        }
        const logs = await prisma_1.prisma.sleepLog.findMany({
            where: { programId: programId },
            orderBy: {
                sleepDate: 'desc',
            },
            take: Number(limit),
            skip: Number(offset),
        });
        res.json(logs);
    }
    catch (error) {
        console.error('Get sleep logs error:', error);
        res.status(500).json({ message: 'Failed to fetch sleep logs', error: error.message });
    }
};
exports.getSleepLogs = getSleepLogs;
// Get sleep statistics
const getSleepStatistics = async (req, res) => {
    try {
        const userId = req.user.id;
        const { programId, days = 30 } = req.query;
        if (!programId) {
            return res.status(400).json({ message: 'Program ID is required' });
        }
        const program = await prisma_1.prisma.sleepProgram.findFirst({
            where: {
                id: programId,
                patientId: userId,
            },
        });
        if (!program) {
            return res.status(404).json({ message: 'Sleep program not found' });
        }
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Number(days));
        const logs = await prisma_1.prisma.sleepLog.findMany({
            where: {
                programId: programId,
                sleepDate: {
                    gte: startDate,
                },
            },
            orderBy: {
                sleepDate: 'asc',
            },
        });
        const stats = {
            totalLogs: logs.length,
            averageSleepDuration: logs.filter((l) => l.sleepDuration).length > 0
                ? logs
                    .filter((l) => l.sleepDuration)
                    .reduce((sum, l) => sum + (l.sleepDuration || 0), 0) /
                    logs.filter((l) => l.sleepDuration).length
                : null,
            averageSleepQuality: logs.filter((l) => l.sleepQuality).length > 0
                ? logs
                    .filter((l) => l.sleepQuality)
                    .reduce((sum, l) => sum + (l.sleepQuality || 0), 0) /
                    logs.filter((l) => l.sleepQuality).length
                : null,
            averageAwakenings: logs.filter((l) => l.awakenings).length > 0
                ? logs
                    .filter((l) => l.awakenings)
                    .reduce((sum, l) => sum + (l.awakenings || 0), 0) /
                    logs.filter((l) => l.awakenings).length
                : null,
            targetSleepHours: program.targetSleepHours,
            onTargetDays: logs.filter((l) => l.sleepDuration && Math.abs(l.sleepDuration - program.targetSleepHours) <= 1).length,
        };
        res.json(stats);
    }
    catch (error) {
        console.error('Get sleep statistics error:', error);
        res.status(500).json({ message: 'Failed to fetch sleep statistics', error: error.message });
    }
};
exports.getSleepStatistics = getSleepStatistics;
//# sourceMappingURL=specialtyWellnessController.js.map