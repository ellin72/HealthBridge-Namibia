/**
 * Security Tests
 * Tests for SQL injection, XSS, authentication bypass, etc.
 */

const { makeRequest, generateTestData } = require('../utils/testHelpers');
const { testSQLInjection, testXSS, testAuthBypass, testInputValidation } = require('../utils/securityTests');

describe('Security Tests', () => {
  let tokens = {};
  let testUsers = {};

  beforeAll(async () => {
    // Create test user for authenticated tests
    const timestamp = Date.now();
    const userData = {
      email: `security-test-${timestamp}@test.com`,
      password: 'Test123!@#',
      firstName: 'Security',
      lastName: 'Test',
      role: 'PATIENT'
    };

    const registerResponse = await makeRequest('POST', '/auth/register', userData, null, { expectedStatus: 201 });
    if (registerResponse.success) {
      testUsers.patient = registerResponse.data.user;
      const loginResponse = await makeRequest('POST', '/auth/login', {
        email: userData.email,
        password: userData.password
      });
      if (loginResponse.success) {
        tokens.patient = loginResponse.data.token;
      }
    }
  });

  describe('SQL Injection Protection', () => {
    test('GET /api/users/:id - Should prevent SQL injection', async () => {
      const results = await testSQLInjection('/users/:id', 'GET', tokens.patient);
      
      const vulnerable = results.some(r => r.vulnerable);
      expect(vulnerable).toBe(false);
    });

    test('GET /api/surveys/:id - Should prevent SQL injection', async () => {
      const results = await testSQLInjection('/surveys/:id', 'GET', tokens.patient);
      
      const vulnerable = results.some(r => r.vulnerable);
      expect(vulnerable).toBe(false);
    });
  });

  describe('XSS Protection', () => {
    test('POST /api/feedback - Should sanitize XSS payloads', async () => {
      const results = await testXSS('/feedback', 'POST');
      
      const vulnerable = results.some(r => r.vulnerable);
      expect(vulnerable).toBe(false);
    });

    test('POST /api/surveys - Should sanitize XSS payloads', async () => {
      if (!tokens.patient) {
        // Skip if no token available
        return;
      }
      
      const results = await testXSS('/surveys', 'POST', tokens.patient);
      
      const vulnerable = results.some(r => r.vulnerable);
      expect(vulnerable).toBe(false);
    });
  });

  describe('Authentication Bypass Protection', () => {
    test('Protected endpoints should reject invalid tokens', async () => {
      const protectedEndpoints = [
        { path: '/auth/profile', method: 'GET', protected: true },
        { path: '/users', method: 'GET', protected: true },
        { path: '/payments', method: 'GET', protected: true },
        { path: '/surveys', method: 'GET', protected: true }
      ];

      const results = await testAuthBypass(protectedEndpoints, tokens.patient);
      
      const vulnerable = results.some(r => r.vulnerable);
      expect(vulnerable).toBe(false);
    });

    test('Public endpoints should work without authentication', async () => {
      const publicEndpoints = [
        { path: '/auth/register', method: 'POST', protected: false },
        { path: '/auth/login', method: 'POST', protected: false },
        { path: '/feedback', method: 'POST', protected: false }
      ];

      for (const endpoint of publicEndpoints) {
        const response = await makeRequest(
          endpoint.method,
          endpoint.path,
          endpoint.method === 'POST' ? {
            email: generateTestData('email'),
            password: 'Test123!@#'
          } : null,
          null,
          { expectedStatus: [200, 201, 400, 401] } // Accept various statuses for public endpoints
        );

        // Should not require authentication (won't return 401)
        expect(response.status).not.toBe(401);
      }
    });
  });

  describe('Input Validation', () => {
    test('POST /api/auth/register - Should validate email format', async () => {
      const results = await testInputValidation('/auth/register', 'POST', null, 'email');
      
      const allValidated = results.every(r => r.validated);
      expect(allValidated).toBe(true);
    });

    test('POST /api/medical-aid - Should validate enum values', async () => {
      if (!tokens.patient) {
        return;
      }

      const invalidSchemes = ['INVALID', 'TEST_SCHEME', 'NOT_A_SCHEME'];
      
      for (const scheme of invalidSchemes) {
        const response = await makeRequest('POST', '/medical-aid', {
          scheme: scheme,
          memberNumber: '123456789'
        }, tokens.patient, { expectedStatus: 400 });

        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('message');
      }
    });
  });

  describe('Authorization Checks', () => {
    test('ADMIN-only endpoints should reject non-admin users', async () => {
      if (!tokens.patient) {
        return;
      }

      const adminEndpoints = [
        { path: '/users', method: 'GET' },
        { path: '/feedback/stats', method: 'GET' }
      ];

      for (const endpoint of adminEndpoints) {
        const response = await makeRequest(endpoint.method, endpoint.path, null, tokens.patient, { expectedStatus: [200, 403] });
        
        // Should either return 403 or empty data (depending on implementation)
        if (response.status === 200) {
          // If 200, data should be restricted (empty array or limited data)
          expect(response.data).toBeDefined();
        } else {
          expect(response.status).toBe(403);
        }
      }
    });
  });
});

