import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getProviderEarnings: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const requestPayout: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllProviderEarnings: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=providerEarningsController.d.ts.map