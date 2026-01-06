import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getTransactionMonitoring: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getFraudAlerts: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const reconcileTransactions: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=adminMonitoringController.d.ts.map