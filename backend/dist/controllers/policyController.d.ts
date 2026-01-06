/**
 * Policy Controller
 * Manages configurable policy engine
 */
import { Request, Response } from 'express';
/**
 * Create a new policy
 * Uses transaction with retry logic to handle race conditions
 */
export declare const createPolicy: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get all policies
 */
export declare const getPolicies: (req: Request, res: Response) => Promise<void>;
/**
 * Get active policy by type
 */
export declare const getActivePolicy: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Update policy
 */
export declare const updatePolicy: (req: Request, res: Response) => Promise<void>;
/**
 * Get policy by ID
 */
export declare const getPolicyById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=policyController.d.ts.map