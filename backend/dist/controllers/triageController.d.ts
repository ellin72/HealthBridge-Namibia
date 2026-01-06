import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const assessSymptoms: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTriageHistory: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=triageController.d.ts.map