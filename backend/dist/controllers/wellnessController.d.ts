import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createWellnessContent: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getWellnessContent: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getWellnessContentById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateWellnessContent: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteWellnessContent: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=wellnessController.d.ts.map