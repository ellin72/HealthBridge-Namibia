/**
 * Feedback Controller
 * Handles user feedback collection and management
 */
import { Request, Response } from 'express';
/**
 * Submit feedback
 */
export declare const submitFeedback: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get all feedback
 */
export declare const getFeedback: (req: Request, res: Response) => Promise<void>;
/**
 * Get feedback by ID
 */
export declare const getFeedbackById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Update feedback status
 */
export declare const updateFeedbackStatus: (req: Request, res: Response) => Promise<void>;
/**
 * Get feedback statistics
 */
export declare const getFeedbackStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=feedbackController.d.ts.map