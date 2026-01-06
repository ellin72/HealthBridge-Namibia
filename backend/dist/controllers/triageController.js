"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTriageHistory = exports.assessSymptoms = void 0;
const prisma_1 = require("../utils/prisma");
// AI Triage Assessment
const assessSymptoms = async (req, res) => {
    try {
        const { symptoms, description } = req.body;
        const userId = req.user.id;
        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            return res.status(400).json({ message: 'Symptoms array is required' });
        }
        // AI-powered triage logic (can be integrated with OpenAI, Anthropic, or local LLM)
        const urgency = determineUrgency(symptoms, description);
        const recommendation = generateRecommendation(symptoms, description, urgency);
        const confidence = calculateConfidence(symptoms, description);
        // Save triage assessment
        const assessment = await prisma_1.prisma.triageAssessment.create({
            data: {
                userId,
                symptoms: JSON.stringify(symptoms),
                description: description || null,
                urgency,
                aiRecommendation: recommendation.recommendation,
                aiConfidence: confidence,
                recommendedAction: recommendation.action,
                followUpDate: recommendation.followUpDate || null,
            },
        });
        res.status(201).json({
            message: 'Triage assessment completed',
            assessment: {
                ...assessment,
                symptoms: JSON.parse(assessment.symptoms),
            },
        });
    }
    catch (error) {
        console.error('Triage assessment error:', error);
        res.status(500).json({ message: 'Triage assessment failed', error: error.message });
    }
};
exports.assessSymptoms = assessSymptoms;
// Get user's triage history
const getTriageHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const assessments = await prisma_1.prisma.triageAssessment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        const formattedAssessments = assessments.map((a) => ({
            ...a,
            symptoms: JSON.parse(a.symptoms),
        }));
        res.json({ assessments: formattedAssessments });
    }
    catch (error) {
        console.error('Get triage history error:', error);
        res.status(500).json({ message: 'Failed to fetch triage history', error: error.message });
    }
};
exports.getTriageHistory = getTriageHistory;
// Helper functions for AI triage logic
function determineUrgency(symptoms, description) {
    const symptomText = symptoms.join(' ').toLowerCase() + ' ' + (description || '').toLowerCase();
    // Emergency keywords
    const emergencyKeywords = ['chest pain', 'difficulty breathing', 'unconscious', 'severe bleeding', 'stroke', 'heart attack'];
    if (emergencyKeywords.some(keyword => symptomText.includes(keyword))) {
        return 'EMERGENCY';
    }
    // Urgent keywords
    const urgentKeywords = ['severe pain', 'high fever', 'vomiting blood', 'severe headache', 'abdominal pain'];
    if (urgentKeywords.some(keyword => symptomText.includes(keyword))) {
        return 'URGENT';
    }
    // High priority keywords
    const highKeywords = ['fever', 'persistent pain', 'infection', 'rash', 'dizziness'];
    if (highKeywords.some(keyword => symptomText.includes(keyword))) {
        return 'HIGH';
    }
    // Medium priority keywords
    const mediumKeywords = ['mild pain', 'cough', 'fatigue', 'nausea'];
    if (mediumKeywords.some(keyword => symptomText.includes(keyword))) {
        return 'MEDIUM';
    }
    return 'LOW';
}
function generateRecommendation(symptoms, description, urgency) {
    const now = new Date();
    switch (urgency) {
        case 'EMERGENCY':
            return {
                recommendation: 'Seek immediate emergency medical attention. Call emergency services or go to the nearest emergency room.',
                action: 'Go to Emergency Room immediately',
            };
        case 'URGENT':
            const urgentDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
            return {
                recommendation: 'You should see a healthcare provider within 24 hours. Consider urgent care or emergency services if symptoms worsen.',
                action: 'See doctor within 24 hours',
                followUpDate: urgentDate,
            };
        case 'HIGH':
            const highDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
            return {
                recommendation: 'Schedule an appointment with a healthcare provider within the next few days.',
                action: 'Schedule appointment within 3 days',
                followUpDate: highDate,
            };
        case 'MEDIUM':
            const mediumDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
            return {
                recommendation: 'Consider scheduling an appointment if symptoms persist or worsen.',
                action: 'Monitor symptoms, schedule if needed',
                followUpDate: mediumDate,
            };
        default:
            return {
                recommendation: 'Continue monitoring your symptoms. Rest and self-care may be sufficient.',
                action: 'Self-care and monitoring',
            };
    }
}
function calculateConfidence(symptoms, description) {
    // Simple confidence calculation based on symptom count and description length
    let confidence = 0.5; // Base confidence
    if (symptoms.length >= 3)
        confidence += 0.2;
    if (symptoms.length >= 5)
        confidence += 0.1;
    if (description && description.length > 50)
        confidence += 0.2;
    return Math.min(confidence, 0.95); // Cap at 95%
}
//# sourceMappingURL=triageController.js.map