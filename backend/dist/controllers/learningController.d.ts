import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const uploadLearningResource: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getLearningResources: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteLearningResource: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createAssignment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAssignments: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAssignmentById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const submitAssignment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const gradeAssignment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=learningController.d.ts.map