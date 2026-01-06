import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createHypertensionProgram: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getHypertensionPrograms: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getHypertensionProgramById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateHypertensionProgram: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addBloodPressureReading: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBloodPressureReadings: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addMedicationLog: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBloodPressureStatistics: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=hypertensionManagementController.d.ts.map