import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createConsultationNote: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getConsultationNotes: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getConsultationNoteById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateConsultationNote: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=consultationController.d.ts.map