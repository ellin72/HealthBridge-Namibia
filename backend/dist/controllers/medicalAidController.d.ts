import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getMedicalAidInfo: (req: AuthRequest, res: Response) => Promise<void>;
export declare const upsertMedicalAidInfo: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyMedicalAid: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const submitClaim: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getClaims: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=medicalAidController.d.ts.map