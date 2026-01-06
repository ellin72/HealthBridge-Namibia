/**
 * API Monitoring Middleware
 * Monitors API performance, errors, and implements fallback workflows
 */
import { Request, Response, NextFunction } from 'express';
/**
 * API Monitoring Middleware
 */
export declare const apiMonitoring: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Get API metrics
 */
export declare function getAPIMetrics(filters?: {
    startDate?: Date;
    endDate?: Date;
    path?: string;
    method?: string;
    statusCode?: number;
}): Promise<{
    total: number;
    errors: number;
    serverErrors: number;
    errorRate: number;
    avgResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    requestsByMethod: Record<string, number>;
    requestsByPath: Record<string, number>;
    requestsByStatusCode: Record<string, number>;
}>;
/**
 * Async handler wrapper to catch errors from async route handlers
 * Use this to wrap async route handlers to properly catch and forward errors
 */
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Fallback error-handling middleware for critical endpoints
 * This is an Express error-handling middleware (4 parameters) that catches errors
 * passed via next(error) from route handlers
 */
export declare const fallbackMiddleware: (fallbackHandler: (req: Request, res: Response) => void) => (err: any, req: Request, res: Response, next: NextFunction) => void;
/**
 * Health check endpoint data
 */
export declare function getHealthCheckData(): {
    status: string;
    errorRate: number;
    avgResponseTime: number;
    timestamp: Date;
};
//# sourceMappingURL=apiMonitoring.d.ts.map