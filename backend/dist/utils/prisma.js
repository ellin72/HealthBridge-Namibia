"use strict";
/**
 * Shared Prisma Client Instance
 * Singleton pattern to avoid multiple database connections
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Prevent multiple instances across all environments (including production)
// This ensures a single PrismaClient instance is shared across all module imports
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ?? new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
// Cache the instance in all environments to ensure singleton pattern
// In production, this prevents multiple PrismaClient instances from being created
// when different modules import from this file
globalForPrisma.prisma = exports.prisma;
//# sourceMappingURL=prisma.js.map