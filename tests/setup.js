/**
 * Jest Setup File
 * Runs before all tests to configure the test environment
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-for-testing-only';

// Set DATABASE_URL for tests - use TEST_DATABASE_URL if provided, otherwise use DATABASE_URL
// IMPORTANT: Never hardcode credentials in source files. Always use environment variables.
// For local testing, set TEST_DATABASE_URL or DATABASE_URL environment variable.
// Example: export TEST_DATABASE_URL="postgresql://user:password@localhost:5432/healthbridge_test?schema=public"
// If neither is set, database cleanup will be skipped gracefully.
// IMPORTANT: For tests to work, you need:
// 1. A test database created: CREATE DATABASE healthbridge_test;
// 2. Database migrations run: cd backend && npx prisma migrate deploy (or npx prisma db push)
//3. TEST_DATABASE_URL or DATABASE_URL environment variable set with valid credentials
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

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

