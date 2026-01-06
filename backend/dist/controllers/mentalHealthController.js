"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMatchStatus = exports.getTherapistMatches = exports.matchTherapist = exports.updateTherapySession = exports.getPatientTherapySessions = exports.createTherapySession = exports.updateTherapistProfile = exports.createTherapistProfile = exports.getTherapistById = exports.getTherapists = void 0;
const prisma_1 = require("../utils/prisma");
// Get all therapists
const getTherapists = async (req, res) => {
    try {
        const { specialization, language, isActive } = req.query;
        const where = {
            isActive: isActive !== 'false',
        };
        if (specialization) {
            where.specialization = {
                contains: specialization,
            };
        }
        if (language) {
            where.languages = {
                contains: language,
            };
        }
        const therapists = await prisma_1.prisma.therapist.findMany({
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
    }
    catch (error) {
        console.error('Get therapists error:', error);
        res.status(500).json({ message: 'Failed to fetch therapists', error: error.message });
    }
};
exports.getTherapists = getTherapists;
// Get therapist by ID
const getTherapistById = async (req, res) => {
    try {
        const { id } = req.params;
        const therapist = await prisma_1.prisma.therapist.findUnique({
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
    }
    catch (error) {
        console.error('Get therapist error:', error);
        res.status(500).json({ message: 'Failed to fetch therapist', error: error.message });
    }
};
exports.getTherapistById = getTherapistById;
// Create therapist profile
const createTherapistProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        // Check if user is already a therapist
        const existing = await prisma_1.prisma.therapist.findUnique({
            where: { userId },
        });
        if (existing) {
            return res.status(400).json({ message: 'Therapist profile already exists' });
        }
        const { specialization, licenseNumber, yearsOfExperience, bio, languages, availability, } = req.body;
        const therapist = await prisma_1.prisma.therapist.create({
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
    }
    catch (error) {
        console.error('Create therapist profile error:', error);
        res.status(500).json({ message: 'Failed to create therapist profile', error: error.message });
    }
};
exports.createTherapistProfile = createTherapistProfile;
// Update therapist profile
const updateTherapistProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { specialization, licenseNumber, yearsOfExperience, bio, languages, availability, isActive, } = req.body;
        const therapist = await prisma_1.prisma.therapist.findUnique({
            where: { userId },
        });
        if (!therapist) {
            return res.status(404).json({ message: 'Therapist profile not found' });
        }
        const updated = await prisma_1.prisma.therapist.update({
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
    }
    catch (error) {
        console.error('Update therapist profile error:', error);
        res.status(500).json({ message: 'Failed to update therapist profile', error: error.message });
    }
};
exports.updateTherapistProfile = updateTherapistProfile;
// Create therapy session
const createTherapySession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { therapistId, appointmentId, therapyType, sessionDate, duration, notes } = req.body;
        if (!therapistId || !therapyType || !sessionDate) {
            return res.status(400).json({ message: 'Therapist ID, therapy type, and session date are required' });
        }
        // Verify therapist exists
        const therapist = await prisma_1.prisma.therapist.findUnique({
            where: { id: therapistId },
        });
        if (!therapist) {
            return res.status(404).json({ message: 'Therapist not found' });
        }
        const session = await prisma_1.prisma.therapySession.create({
            data: {
                patientId: userId,
                therapistId,
                appointmentId,
                therapyType: therapyType,
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
    }
    catch (error) {
        console.error('Create therapy session error:', error);
        res.status(500).json({ message: 'Failed to create therapy session', error: error.message });
    }
};
exports.createTherapySession = createTherapySession;
// Get patient's therapy sessions
const getPatientTherapySessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, limit = 50, offset = 0 } = req.query;
        const where = { patientId: userId };
        if (status) {
            where.status = status;
        }
        const sessions = await prisma_1.prisma.therapySession.findMany({
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
    }
    catch (error) {
        console.error('Get therapy sessions error:', error);
        res.status(500).json({ message: 'Failed to fetch therapy sessions', error: error.message });
    }
};
exports.getPatientTherapySessions = getPatientTherapySessions;
// Update therapy session (therapist can update notes, diagnosis, etc.)
const updateTherapySession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { notes, diagnosis, medicationPrescribed, followUpDate, status, patientNotes } = req.body;
        const session = await prisma_1.prisma.therapySession.findUnique({
            where: { id },
        });
        if (!session) {
            return res.status(404).json({ message: 'Therapy session not found' });
        }
        // Check if user is the therapist or patient
        const therapist = session.therapistId ? await prisma_1.prisma.therapist.findFirst({
            where: { id: session.therapistId, userId },
        }) : null;
        const isTherapist = !!therapist;
        const isPatient = session.patientId === userId;
        if (!isTherapist && !isPatient) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const updateData = {};
        if (notes !== undefined && isTherapist)
            updateData.notes = notes;
        if (patientNotes !== undefined && isPatient)
            updateData.patientNotes = patientNotes;
        if (diagnosis !== undefined && isTherapist)
            updateData.diagnosis = diagnosis ? JSON.stringify(diagnosis) : null;
        if (medicationPrescribed !== undefined && isTherapist)
            updateData.medicationPrescribed = medicationPrescribed ? JSON.stringify(medicationPrescribed) : null;
        if (followUpDate !== undefined && isTherapist)
            updateData.followUpDate = followUpDate ? new Date(followUpDate) : null;
        if (status !== undefined && isTherapist)
            updateData.status = status;
        const updated = await prisma_1.prisma.therapySession.update({
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
    }
    catch (error) {
        console.error('Update therapy session error:', error);
        res.status(500).json({ message: 'Failed to update therapy session', error: error.message });
    }
};
exports.updateTherapySession = updateTherapySession;
// Match patient with therapist
const matchTherapist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { therapistId, preferences } = req.body;
        if (!therapistId) {
            return res.status(400).json({ message: 'Therapist ID is required' });
        }
        // Check if match already exists
        const existing = await prisma_1.prisma.therapistMatch.findUnique({
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
        const match = await prisma_1.prisma.therapistMatch.create({
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
    }
    catch (error) {
        console.error('Match therapist error:', error);
        res.status(500).json({ message: 'Failed to match therapist', error: error.message });
    }
};
exports.matchTherapist = matchTherapist;
// Get patient's therapist matches
const getTherapistMatches = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;
        const where = { patientId: userId };
        if (status) {
            where.status = status;
        }
        const matches = await prisma_1.prisma.therapistMatch.findMany({
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
    }
    catch (error) {
        console.error('Get therapist matches error:', error);
        res.status(500).json({ message: 'Failed to fetch therapist matches', error: error.message });
    }
};
exports.getTherapistMatches = getTherapistMatches;
// Update match status
const updateMatchStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }
        const match = await prisma_1.prisma.therapistMatch.findUnique({
            where: { id },
        });
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        // Verify user is the patient who owns this match
        if (match.patientId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const updated = await prisma_1.prisma.therapistMatch.update({
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
    }
    catch (error) {
        console.error('Update match status error:', error);
        res.status(500).json({ message: 'Failed to update match status', error: error.message });
    }
};
exports.updateMatchStatus = updateMatchStatus;
//# sourceMappingURL=mentalHealthController.js.map