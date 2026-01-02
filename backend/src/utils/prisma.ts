/**
 * Shared Prisma Client Instance
 * Singleton pattern to avoid multiple database connections
 */

import { PrismaClient } from '@prisma/client';

// Prevent multiple instances across all environments (including production)
// This ensures a single PrismaClient instance is shared across all module imports
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Cache the instance in all environments to ensure singleton pattern
// In production, this prevents multiple PrismaClient instances from being created
// when different modules import from this file
globalForPrisma.prisma = prisma;

