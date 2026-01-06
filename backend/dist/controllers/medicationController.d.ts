import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getMedications: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createMedication: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateMedication: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const logMedication: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUpcomingReminders: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=medicationController.d.ts.map