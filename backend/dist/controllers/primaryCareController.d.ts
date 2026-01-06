import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createPrimaryCareRecord: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPrimaryCareRecords: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPrimaryCareRecordById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePrimaryCareRecord: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPrimaryCareSummary: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=primaryCareController.d.ts.map