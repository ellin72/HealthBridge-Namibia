import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const generateInvoiceAfterConsultation: (appointmentId: string, providerId: string, patientId: string) => Promise<any>;
export declare const getInvoices: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createInvoice: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateInvoice: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBillingStats: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=billingController.d.ts.map