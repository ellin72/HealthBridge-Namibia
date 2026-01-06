"use strict";
/**
 * API Monitoring Middleware
 * Monitors API performance, errors, and implements fallback workflows
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fallbackMiddleware = exports.asyncHandler = exports.apiMonitoring = void 0;
exports.getAPIMetrics = getAPIMetrics;
exports.getHealthCheckData = getHealthCheckData;
// In-memory metrics (in production, use Redis or time-series database)
const metrics = [];
const MAX_METRICS = 10000; // Keep last 10k requests
/**
 * API Monitoring Middleware
 */
const apiMonitoring = (req, res, next) => {
    const startTime = Date.now();
    const requestId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    // Add request ID to request object
    req.requestId = requestId;
    // Capture original end function
    const originalEnd = res.end.bind(res);
    // Override end function to capture metrics
    // Handle all possible signatures: end(), end(cb), end(chunk, cb), end(chunk, encoding, cb)
    res.end = function (chunk, encoding, cb) {
        const responseTime = Date.now() - startTime;
        const userId = req.user?.id;
        const metric = {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            responseTime,
            timestamp: new Date(),
            userId,
            ipAddress: req.ip || req.socket.remoteAddress,
            userAgent: req.get('user-agent')
        };
        // Log errors
        if (res.statusCode >= 400) {
            metric.error = `HTTP ${res.statusCode}`;
        }
        // Store metric
        metrics.push(metric);
        // Keep only last MAX_METRICS
        if (metrics.length > MAX_METRICS) {
            metrics.shift();
        }
        // Alert on high error rate or slow responses
        checkAlerts(metric);
        // Handle different calling patterns correctly
        // Pattern 1: end(callback) - chunk is a function, encoding is undefined
        if (typeof chunk === 'function' && encoding === undefined && cb === undefined) {
            return originalEnd(chunk);
        }
        // Pattern 2: end(chunk, callback) - encoding is a function
        if (typeof encoding === 'function') {
            return originalEnd(chunk, encoding);
        }
        // Pattern 3: end() or end(chunk) or end(chunk, encoding) or end(chunk, encoding, cb)
        return originalEnd(chunk, encoding, cb);
    };
    next();
};
exports.apiMonitoring = apiMonitoring;
/**
 * Check for alerts
 */
function checkAlerts(metric) {
    // Check for slow responses (> 1 second)
    if (metric.responseTime > 1000) {
        console.warn(`Slow API response: ${metric.method} ${metric.path} took ${metric.responseTime}ms`);
    }
    // Check for errors
    if (metric.statusCode >= 500) {
        console.error(`API error: ${metric.method} ${metric.path} returned ${metric.statusCode}`);
    }
    // Check error rate (last 100 requests)
    const recentMetrics = metrics.slice(-100);
    const errorCount = recentMetrics.filter(m => m.statusCode >= 500).length;
    const errorRate = errorCount / recentMetrics.length;
    if (errorRate > 0.05) { // 5% error rate
        console.error(`High error rate detected: ${(errorRate * 100).toFixed(2)}%`);
    }
}
/**
 * Get API metrics
 */
async function getAPIMetrics(filters) {
    let filtered = [...metrics];
    if (filters) {
        if (filters.startDate) {
            filtered = filtered.filter(m => m.timestamp >= filters.startDate);
        }
        if (filters.endDate) {
            filtered = filtered.filter(m => m.timestamp <= filters.endDate);
        }
        if (filters.path) {
            filtered = filtered.filter(m => m.path.includes(filters.path));
        }
        if (filters.method) {
            filtered = filtered.filter(m => m.method === filters.method);
        }
        if (filters.statusCode) {
            filtered = filtered.filter(m => m.statusCode === filters.statusCode);
        }
    }
    const total = filtered.length;
    const errors = filtered.filter(m => m.statusCode >= 400).length;
    const serverErrors = filtered.filter(m => m.statusCode >= 500).length;
    const avgResponseTime = filtered.length > 0
        ? filtered.reduce((sum, m) => sum + m.responseTime, 0) / filtered.length
        : 0;
    const p95ResponseTime = calculatePercentile(filtered.map(m => m.responseTime), 95);
    const p99ResponseTime = calculatePercentile(filtered.map(m => m.responseTime), 99);
    return {
        total,
        errors,
        serverErrors,
        errorRate: total > 0 ? (errors / total) * 100 : 0,
        avgResponseTime,
        p95ResponseTime,
        p99ResponseTime,
        requestsByMethod: groupBy(filtered, 'method'),
        requestsByPath: groupBy(filtered, 'path'),
        requestsByStatusCode: groupBy(filtered, 'statusCode')
    };
}
/**
 * Calculate percentile
 */
function calculatePercentile(values, percentile) {
    if (values.length === 0)
        return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
}
/**
 * Group by property
 */
function groupBy(array, key) {
    return array.reduce((acc, item) => {
        const value = String(item[key]);
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});
}
/**
 * Async handler wrapper to catch errors from async route handlers
 * Use this to wrap async route handlers to properly catch and forward errors
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch((error) => {
            // Pass error to next() so it can be caught by error-handling middleware
            next(error);
        });
    };
};
exports.asyncHandler = asyncHandler;
/**
 * Fallback error-handling middleware for critical endpoints
 * This is an Express error-handling middleware (4 parameters) that catches errors
 * passed via next(error) from route handlers
 */
const fallbackMiddleware = (fallbackHandler) => {
    return (err, req, res, next) => {
        console.error('Error in request, using fallback:', err);
        // Only use fallback if response hasn't been sent
        if (!res.headersSent) {
            fallbackHandler(req, res);
        }
        else {
            // If response already sent, pass to next error handler
            next(err);
        }
    };
};
exports.fallbackMiddleware = fallbackMiddleware;
/**
 * Health check endpoint data
 */
function getHealthCheckData() {
    const recentMetrics = metrics.slice(-100);
    const errorRate = recentMetrics.length > 0
        ? (recentMetrics.filter(m => m.statusCode >= 500).length / recentMetrics.length) * 100
        : 0;
    const avgResponseTime = recentMetrics.length > 0
        ? recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length
        : 0;
    return {
        status: errorRate < 5 && avgResponseTime < 1000 ? 'healthy' : 'degraded',
        errorRate,
        avgResponseTime,
        timestamp: new Date()
    };
}
//# sourceMappingURL=apiMonitoring.js.map