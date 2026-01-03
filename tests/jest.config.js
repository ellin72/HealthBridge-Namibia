module.exports = {
  rootDir: '..',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.spec.js'],
  collectCoverageFrom: [
    'backend/src/**/*.{js,ts}',
    '!backend/src/**/*.d.ts',
    '!backend/src/server.ts',
    '!backend/src/**/*.config.{js,ts}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/backend/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  // Watch mode configuration for Windows compatibility
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/.git/',
    '/backend/node_modules/',
    '/frontend/node_modules/',
    '/mobile/node_modules/',
  ],
  // Disable watchman on Windows to avoid permission issues
  watchman: process.platform !== 'win32',
};

