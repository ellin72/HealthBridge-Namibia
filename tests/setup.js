/**
 * Jest Setup File
 * Runs before all tests to configure the test environment
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-for-testing-only';

// Set DATABASE_URL for tests - use TEST_DATABASE_URL if provided, otherwise use DATABASE_URL,
// or provide a default for local testing (cleanup will gracefully skip if database is not available)
// Note: The default assumes a local PostgreSQL database. If you don't have one, cleanup will be skipped.
// IMPORTANT: For tests to work, you need:
// 1. A test database created: CREATE DATABASE healthbridge_test;
// 2. Database migrations run: cd backend && npx prisma migrate deploy (or npx prisma db push)
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL ||
    process.env.DATABASE_URL ||
    'postgresql://postgres:elcorpnamibia@localhost:5432/healthbridge_test?schema=public';

// Increase timeout for async operations
jest.setTimeout(30000);

// Global test utilities
global.API_URL = process.env.API_URL || 'http://localhost:5000/api';

// Suppress console logs during tests (uncomment if needed)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

