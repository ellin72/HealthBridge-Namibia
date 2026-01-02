/**
 * Survey Controller
 * Handles survey creation, responses, and adoption metrics
 */

import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

/**
 * Create a new survey
 */
export const createSurvey = async (req: Request, res: Response) => {
  try {
    const { title, description, surveyType, questions, targetAudience, startDate, endDate, isAnonymous } = req.body;

    const survey = await prisma.survey.create({
      data: {
        title,
        description,
        surveyType,
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create survey',
      error: error.message
    });
  }
};

/**
 * Get all surveys
 */
export const getSurveys = async (req: Request, res: Response) => {
  try {
    const { status, surveyType } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (surveyType) where.surveyType = surveyType;

    const surveys = await prisma.survey.findMany({
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch surveys',
      error: error.message
    });
  }
};

/**
 * Get survey by ID
 */
export const getSurveyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const survey = await prisma.survey.findUnique({
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch survey',
      error: error.message
    });
  }
};

/**
 * Submit survey response
 */
export const submitSurveyResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { responses, metadata } = req.body;
    // Normalize userId to null if undefined (for public routes without authentication)
    const userId = (req as any).user?.id ?? null;

    // Check if survey exists and is active
    const survey = await prisma.survey.findUnique({
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

    // Validate: non-anonymous surveys require authentication
    if (!survey.isAnonymous && !userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for non-anonymous surveys'
      });
    }

    // Create response
    const response = await prisma.surveyResponse.create({
      data: {
        surveyId: id,
        userId: survey.isAnonymous ? null : userId,
        responses: JSON.stringify(responses),
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });

    // Parse JSON responses and metadata with error handling
    let parsedResponses;
    let parsedMetadata = null;
    try {
      parsedResponses = JSON.parse(response.responses);
    } catch (error) {
      console.error('Failed to parse survey response JSON:', error);
      throw new Error('Failed to parse response data - invalid JSON format');
    }
    
    if (response.metadata) {
      try {
        parsedMetadata = JSON.parse(response.metadata);
      } catch (error) {
        console.warn('Failed to parse survey response metadata JSON:', error);
        // Metadata is optional, so we continue without it
      }
    }

    res.status(201).json({
      success: true,
      data: {
        ...response,
        responses: parsedResponses,
        metadata: parsedMetadata
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit survey response',
      error: error.message
    });
  }
};

/**
 * Get survey responses
 */
export const getSurveyResponses = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    const responses = await prisma.surveyResponse.findMany({
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
        } catch (error) {
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch survey responses',
      error: error.message
    });
  }
};

/**
 * Get adoption metrics
 */
export const getAdoptionMetrics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate as string);
    if (endDate) dateFilter.lte = new Date(endDate as string);

    const where = Object.keys(dateFilter).length > 0 ? { completedAt: dateFilter } : {};

    // Get total responses
    const totalResponses = await prisma.surveyResponse.count({ where });

    // Get responses by survey type
    const responsesByType = await prisma.surveyResponse.groupBy({
      by: ['surveyId'],
      where,
      _count: true
    });

    // Get user engagement
    const uniqueUsers = await prisma.surveyResponse.findMany({
      where,
      select: { userId: true },
      distinct: ['userId']
    });

    // Get average rating (if applicable)
    const ratingResponses = await prisma.surveyResponse.findMany({
      where,
      select: { responses: true }
    });

    let totalRating = 0;
    let ratingCount = 0;
    ratingResponses.forEach(response => {
      try {
        const data = JSON.parse(response.responses);
        if (data.rating) {
          totalRating += Number(data.rating);
          ratingCount++;
        }
      } catch (error) {
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch adoption metrics',
      error: error.message
    });
  }
};

/**
 * Update survey status
 */
export const updateSurveyStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const survey = await prisma.survey.update({
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update survey status',
      error: error.message
    });
  }
};

