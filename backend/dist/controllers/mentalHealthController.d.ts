import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getTherapists: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTherapistById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createTherapistProfile: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTherapistProfile: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createTherapySession: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPatientTherapySessions: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTherapySession: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const matchTherapist: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTherapistMatches: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateMatchStatus: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=mentalHealthController.d.ts.map