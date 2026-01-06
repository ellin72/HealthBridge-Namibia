import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createUrgentCareRequest: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUrgentCareRequests: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUrgentCareRequestById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateUrgentCareRequest: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllUrgentCareRequests: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUrgentCareStatistics: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=urgentCareController.d.ts.map