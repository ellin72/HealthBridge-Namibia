import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createSpecialtyConsultation: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSpecialtyConsultations: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSpecialtyConsultationById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSpecialtyConsultation: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createSleepProgram: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSleepPrograms: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSleepProgramById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addSleepLog: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSleepLogs: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSleepStatistics: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=specialtyWellnessController.d.ts.map