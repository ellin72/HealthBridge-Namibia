/**
 * Survey Controller
 * Handles survey creation, responses, and adoption metrics
 */
import { Request, Response } from 'express';
/**
 * Create a new survey
 */
export declare const createSurvey: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get all surveys
 */
export declare const getSurveys: (req: Request, res: Response) => Promise<void>;
/**
 * Get survey by ID (public access - validates survey is ACTIVE)
 * Used for unauthenticated access to published surveys
 */
export declare const getPublicSurveyById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get survey by ID (authenticated access - allows all statuses)
 * Used for authenticated users who may need to view DRAFT surveys
 */
export declare const getSurveyById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Submit survey response
 */
export declare const submitSurveyResponse: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get survey responses
 */
export declare const getSurveyResponses: (req: Request, res: Response) => Promise<void>;
/**
 * Get adoption metrics
 */
export declare const getAdoptionMetrics: (req: Request, res: Response) => Promise<void>;
/**
 * Update survey status
 */
export declare const updateSurveyStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=surveyController.d.ts.map