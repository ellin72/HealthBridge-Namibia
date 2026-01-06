"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConsultationNote = exports.getConsultationNoteById = exports.getConsultationNotes = exports.createConsultationNote = void 0;
const prisma_1 = require("../utils/prisma");
const billingController_1 = require("./billingController");
const createConsultationNote = async (req, res) => {
    try {
        const { appointmentId, notes, diagnosis, prescription, followUpDate } = req.body;
        const providerId = req.user.id;
        if (!appointmentId || !notes) {
            return res.status(400).json({ message: 'Appointment ID and notes are required' });
        }
        // Verify appointment exists and belongs to this provider
        const appointment = await prisma_1.prisma.appointment.findUnique({
            where: { id: appointmentId }
        });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        if (appointment.providerId !== providerId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const consultationNote = await prisma_1.prisma.consultationNote.create({
            data: {
                appointmentId,
                providerId,
                patientId: appointment.patientId,
                notes,
                diagnosis,
                prescription,
                followUpDate: followUpDate ? new Date(followUpDate) : null
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
                        }
                    }
                },
                provider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
        // Update appointment status to completed
        await prisma_1.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'COMPLETED' }
        });
        // Automatically generate invoice after consultation
        try {
            const invoice = await (0, billingController_1.generateInvoiceAfterConsultation)(appointmentId, providerId, appointment.patientId);
            console.log(`Invoice ${invoice.invoiceNumber} generated for consultation`);
        }
        catch (invoiceError) {
            console.error('Error generating invoice after consultation:', invoiceError);
            // Don't fail the consultation if invoice generation fails
        }
        res.status(201).json({ message: 'Consultation note created successfully', consultationNote });
    }
    catch (error) {
        console.error('Create consultation note error:', error);
        res.status(500).json({ message: 'Failed to create consultation note', error: error.message });
    }
};
exports.createConsultationNote = createConsultationNote;
const getConsultationNotes = async (req, res) => {
    try {
        const { appointmentId, patientId } = req.query;
        const userId = req.user.id;
        const userRole = req.user.role;
        const where = {};
        if (appointmentId) {
            where.appointmentId = appointmentId;
        }
        if (patientId) {
            where.patientId = patientId;
        }
        // Patients can only see their own notes
        if (userRole === 'PATIENT') {
            where.patientId = userId;
        }
        // Providers can only see their own notes
        else if (userRole === 'HEALTHCARE_PROVIDER') {
            where.providerId = userId;
        }
        const consultationNotes = await prisma_1.prisma.consultationNote.findMany({
            where,
            include: {
                appointment: {
                    select: {
                        id: true,
                        appointmentDate: true,
                        status: true
                    }
                },
                provider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(consultationNotes);
    }
    catch (error) {
        console.error('Get consultation notes error:', error);
        res.status(500).json({ message: 'Failed to get consultation notes', error: error.message });
    }
};
exports.getConsultationNotes = getConsultationNotes;
const getConsultationNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const consultationNote = await prisma_1.prisma.consultationNote.findUnique({
            where: { id },
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
                                lastName: true
                            }
                        }
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
        if (!consultationNote) {
            return res.status(404).json({ message: 'Consultation note not found' });
        }
        // Check access permissions - only patient and provider can access
        const normalizedUserId = String(userId).trim();
        const normalizedPatientId = String(consultationNote.patientId).trim();
        const normalizedProviderId = String(consultationNote.providerId).trim();
        const isPatient = normalizedPatientId === normalizedUserId;
        const isProvider = normalizedProviderId === normalizedUserId;
        if (!isPatient && !isProvider) {
            return res.status(403).json({ message: 'Access denied. You can only view consultation notes for your own appointments or appointments assigned to you.' });
        }
        res.json(consultationNote);
    }
    catch (error) {
        console.error('Get consultation note error:', error);
        res.status(500).json({ message: 'Failed to get consultation note', error: error.message });
    }
};
exports.getConsultationNoteById = getConsultationNoteById;
const updateConsultationNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes, diagnosis, prescription, followUpDate } = req.body;
        const providerId = req.user.id;
        const userRole = req.user.role;
        const consultationNote = await prisma_1.prisma.consultationNote.findUnique({
            where: { id }
        });
        if (!consultationNote) {
            return res.status(404).json({ message: 'Consultation note not found' });
        }
        // Only the provider who created it can update
        const normalizedProviderId = String(providerId).trim();
        const normalizedNoteProviderId = String(consultationNote.providerId).trim();
        if (normalizedNoteProviderId !== normalizedProviderId) {
            return res.status(403).json({ message: 'Access denied. You can only update consultation notes you created.' });
        }
        const updateData = {};
        if (notes)
            updateData.notes = notes;
        if (diagnosis !== undefined)
            updateData.diagnosis = diagnosis;
        if (prescription !== undefined)
            updateData.prescription = prescription;
        if (followUpDate !== undefined) {
            updateData.followUpDate = followUpDate ? new Date(followUpDate) : null;
        }
        const updatedNote = await prisma_1.prisma.consultationNote.update({
            where: { id },
            data: updateData,
            include: {
                appointment: true,
                provider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
        res.json({ message: 'Consultation note updated successfully', consultationNote: updatedNote });
    }
    catch (error) {
        console.error('Update consultation note error:', error);
        res.status(500).json({ message: 'Failed to update consultation note', error: error.message });
    }
};
exports.updateConsultationNote = updateConsultationNote;
//# sourceMappingURL=consultationController.js.map