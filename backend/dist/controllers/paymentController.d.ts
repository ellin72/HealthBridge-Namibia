import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createPayment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verify2FAAndCompletePayment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const processPaymentCallback: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPayments: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPayment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=paymentController.d.ts.map