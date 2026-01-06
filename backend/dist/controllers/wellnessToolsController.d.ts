import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createWellnessPlan: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getWellnessPlans: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateWellnessPlan: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteWellnessPlan: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createHabitTracker: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getHabitTrackers: (req: AuthRequest, res: Response) => Promise<void>;
export declare const addHabitEntry: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getHabitEntries: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createChallenge: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getChallenges: (req: AuthRequest, res: Response) => Promise<void>;
export declare const joinChallenge: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateChallengeProgress: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserChallenges: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=wellnessToolsController.d.ts.map