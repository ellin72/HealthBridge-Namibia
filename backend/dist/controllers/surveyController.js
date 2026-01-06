"use strict";
/**
 * Survey Controller
 * Handles survey creation, responses, and adoption metrics
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSurveyStatus = exports.getAdoptionMetrics = exports.getSurveyResponses = exports.submitSurveyResponse = exports.getSurveyById = exports.getPublicSurveyById = exports.getSurveys = exports.createSurvey = void 0;
const prisma_1 = require("../utils/prisma");
/**
 * Create a new survey
 */
const createSurvey = async (req, res) => {
    try {
        const { title, description, surveyType, questions, targetAudience, startDate, endDate, isAnonymous } = req.body;
        // Validate required fields
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }
        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Questions array is required and must not be empty'
            });
        }
        // Default surveyType if not provided
        const defaultSurveyType = surveyType || 'USER_SATISFACTION';
        const survey = await prisma_1.prisma.survey.create({
            data: {
                title,
                description,
                surveyType: defaultSurveyType,
                questions: JSON.stringify(questions),
                targetAudience: targetAudience ? JSON.stringify(targetAudience) : null,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                isAnonymous: isAnonymous || false,
                status: 'DRAFT'
            }
        });
        res.status(201).json({
            success: true,
            data: {
                ...survey,
                questions: JSON.parse(survey.questions),
                targetAudience: survey.targetAudience ? JSON.parse(survey.targetAudience) : null
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create survey',
            error: error.message
        });
    }
};
exports.createSurvey = createSurvey;
/**
 * Get all surveys
 */
const getSurveys = async (req, res) => {
    try {
        const { status, surveyType } = req.query;
        const where = {};
        if (status)
            where.status = status;
        if (surveyType)
            where.surveyType = surveyType;
        const surveys = await prisma_1.prisma.survey.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { responses: true }
                }
            }
        });
        res.json({
            success: true,
            data: surveys.map(survey => ({
                ...survey,
                questions: JSON.parse(survey.questions),
                targetAudience: survey.targetAudience ? JSON.parse(survey.targetAudience) : null,
                responseCount: survey._count.responses
            }))
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch surveys',
            error: error.message
        });
    }
};
exports.getSurveys = getSurveys;
/**
 * Get survey by ID (public access - validates survey is ACTIVE)
 * Used for unauthenticated access to published surveys
 */
const getPublicSurveyById = async (req, res) => {
    try {
        const { id } = req.params;
        const survey = await prisma_1.prisma.survey.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { responses: true }
                }
            }
        });
        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }
        // CRITICAL: Public access should only allow ACTIVE surveys
        // DRAFT and other statuses should remain private
        if (survey.status !== 'ACTIVE') {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }
        // Check if survey has ended
        if (survey.endDate && new Date(survey.endDate) < new Date()) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }
        // CRITICAL SECURITY: Public endpoint should only allow access to anonymous surveys
        // Non-anonymous surveys require authentication and should use the protected endpoint
        // Return 404 (not 403) to prevent information leakage through status code enumeration
        if (!survey.isAnonymous) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }
        res.json({
            success: true,
            data: {
                ...survey,
                questions: JSON.parse(survey.questions),
                targetAudience: survey.targetAudience ? JSON.parse(survey.targetAudience) : null,
                responseCount: survey._count.responses
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch survey',
            error: error.message
        });
    }
};
exports.getPublicSurveyById = getPublicSurveyById;
/**
 * Get survey by ID (authenticated access - allows all statuses)
 * Used for authenticated users who may need to view DRAFT surveys
 */
const getSurveyById = async (req, res) => {
    try {
        const { id } = req.params;
        const survey = await prisma_1.prisma.survey.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { responses: true }
                }
            }
        });
        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }
        res.json({
            success: true,
            data: {
                ...survey,
                questions: JSON.parse(survey.questions),
                targetAudience: survey.targetAudience ? JSON.parse(survey.targetAudience) : null,
                responseCount: survey._count.responses
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch survey',
            error: error.message
        });
    }
};
exports.getSurveyById = getSurveyById;
/**
 * Submit survey response
 */
const submitSurveyResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { responses, metadata } = req.body;
        // Normalize userId to null if undefined (for public routes without authentication)
        const userId = req.user?.id ?? null;
        // Check if survey exists and is active
        const survey = await prisma_1.prisma.survey.findUnique({
            where: { id }
        });
        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }
        if (survey.status !== 'ACTIVE') {
            return res.status(400).json({
                success: false,
                message: 'Survey is not active'
            });
        }
        // Check if survey has ended
        if (survey.endDate && new Date(survey.endDate) < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Survey has ended'
            });
        }
        // CRITICAL SECURITY: Validate authentication requirements
        // If accessed via public route (no userId), survey MUST be anonymous
        // If survey is not anonymous, authentication is required
        if (!userId) {
            // Unauthenticated access - only allowed for anonymous surveys
            if (!survey.isAnonymous) {
                return res.status(403).json({
                    success: false,
                    message: 'This survey requires authentication. Anonymous responses are not allowed.'
                });
            }
        }
        else {
            // Authenticated access - allowed for both anonymous and non-anonymous surveys
            // (userId will be recorded for non-anonymous surveys)
        }
        // Validate JSON before database insertion
        let responsesJson;
        let metadataJson = null;
        try {
            // Validate that responses can be stringified (ensures it's valid JSON-serializable data)
            responsesJson = JSON.stringify(responses);
            // Verify it can be parsed back (double-check)
            JSON.parse(responsesJson);
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid responses format - must be valid JSON',
                error: error instanceof Error ? error.message : 'JSON validation failed'
            });
        }
        if (metadata) {
            try {
                metadataJson = JSON.stringify(metadata);
                JSON.parse(metadataJson);
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid metadata format - must be valid JSON',
                    error: error instanceof Error ? error.message : 'JSON validation failed'
                });
            }
        }
        // Create response (JSON is already validated)
        const response = await prisma_1.prisma.surveyResponse.create({
            data: {
                surveyId: id,
                userId: survey.isAnonymous ? null : userId,
                responses: responsesJson,
                metadata: metadataJson
            }
        });
        // Parse JSON responses and metadata (already validated, so this should never fail)
        const parsedResponses = JSON.parse(response.responses);
        const parsedMetadata = response.metadata ? JSON.parse(response.metadata) : null;
        res.status(201).json({
            success: true,
            data: {
                ...response,
                responses: parsedResponses,
                metadata: parsedMetadata
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to submit survey response',
            error: error.message
        });
    }
};
exports.submitSurveyResponse = submitSurveyResponse;
/**
 * Get survey responses
 */
const getSurveyResponses = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 100, offset = 0 } = req.query;
        const responses = await prisma_1.prisma.surveyResponse.findMany({
            where: { surveyId: id },
            orderBy: { completedAt: 'desc' },
            take: Number(limit),
            skip: Number(offset)
        });
        res.json({
            success: true,
            data: responses.map(response => {
                try {
                    return {
                        ...response,
                        responses: JSON.parse(response.responses),
                        metadata: response.metadata ? JSON.parse(response.metadata) : null
                    };
                }
                catch (error) {
                    // Return response with error indicator for malformed JSON
                    console.warn('Failed to parse survey response JSON:', error);
                    return {
                        ...response,
                        responses: null,
                        metadata: null,
                        parseError: 'Failed to parse response data'
                    };
                }
            })
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch survey responses',
            error: error.message
        });
    }
};
exports.getSurveyResponses = getSurveyResponses;
/**
 * Get adoption metrics
 */
const getAdoptionMetrics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter = {};
        if (startDate)
            dateFilter.gte = new Date(startDate);
        if (endDate)
            dateFilter.lte = new Date(endDate);
        const where = Object.keys(dateFilter).length > 0 ? { completedAt: dateFilter } : {};
        // Get total responses
        const totalResponses = await prisma_1.prisma.surveyResponse.count({ where });
        // Get responses by survey type
        const responsesByType = await prisma_1.prisma.surveyResponse.groupBy({
            by: ['surveyId'],
            where,
            _count: true
        });
        // Get user engagement
        const uniqueUsers = await prisma_1.prisma.surveyResponse.findMany({
            where,
            select: { userId: true },
            distinct: ['userId']
        });
        // Get average rating (if applicable)
        const ratingResponses = await prisma_1.prisma.surveyResponse.findMany({
            where,
            select: { responses: true }
        });
        let totalRating = 0;
        let ratingCount = 0;
        ratingResponses.forEach(response => {
            try {
                const data = JSON.parse(response.responses);
                // Explicitly check for null/undefined to handle numeric zero values correctly
                // A rating of 0 is a valid rating and should be included in the average
                if (data.rating !== undefined && data.rating !== null) {
                    totalRating += Number(data.rating);
                    ratingCount++;
                }
            }
            catch (error) {
                // Skip malformed JSON responses - log error but don't fail the entire request
                console.warn('Failed to parse survey response JSON:', error);
            }
        });
        res.json({
            success: true,
            data: {
                totalResponses,
                uniqueUsers: uniqueUsers.length,
                averageRating: ratingCount > 0 ? totalRating / ratingCount : null,
                responsesBySurvey: responsesByType.length,
                period: {
                    startDate: startDate || null,
                    endDate: endDate || null
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch adoption metrics',
            error: error.message
        });
    }
};
exports.getAdoptionMetrics = getAdoptionMetrics;
/**
 * Update survey status
 */
const updateSurveyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const survey = await prisma_1.prisma.survey.update({
            where: { id },
            data: { status }
        });
        res.json({
            success: true,
            data: {
                ...survey,
                questions: JSON.parse(survey.questions),
                targetAudience: survey.targetAudience ? JSON.parse(survey.targetAudience) : null
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update survey status',
            error: error.message
        });
    }
};
exports.updateSurveyStatus = updateSurveyStatus;
//# sourceMappingURL=surveyController.js.map