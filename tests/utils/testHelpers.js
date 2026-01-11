/**
 * Test Helper Utilities
 * Common functions for making API requests and assertions
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

/**
 * Make an API request with proper error handling
 */
async function makeRequest(method, url, data = null, token = null, options = {}) {
  const {
    expectedStatus = 200,
    timeout = 10000,
    validateStatus = null,
    headers = {},
    expectedStatusArray = null // Support array of acceptable statuses
  } = options;

  // Handle both expectedStatus as array and expectedStatusArray parameter
  // If expectedStatus is an array, use it; otherwise use expectedStatusArray if provided
  const statusArray = Array.isArray(expectedStatus) 
    ? expectedStatus 
    : (expectedStatusArray || null);
  const statusValue = Array.isArray(expectedStatus) ? null : expectedStatus;

  try {
    const config = {
      method,
      url: `${API_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...headers
      },
      timeout,
      ...(data && { data }),
      ...(validateStatus && { validateStatus })
    };

    const response = await axios(config);
    const isExpected = statusArray
      ? statusArray.includes(response.status)
      : response.status === statusValue;
    
    return {
      success: isExpected,
      status: response.status,
      data: response.data,
      headers: response.headers,
      error: null
    };
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      const errorMsg = `Connection refused. Is the API server running at ${API_URL}?\n` +
        `To start the server:\n` +
        `  1. cd backend\n` +
        `  2. npm run dev\n` +
        `Or in CI/CD, ensure the server is started before running tests.`;
      throw new Error(errorMsg);
    }
    
    const status = error.response?.status || 500;
    const isExpected = statusArray
      ? statusArray.includes(status)
      : status === statusValue;
    
    return {
      success: isExpected,
      status: status,
      data: error.response?.data || null,
      headers: error.response?.headers || {},
      error: error.message
    };
  }
}

/**
 * Enhanced assertion helper
 */
function assertResponse(response, options = {}) {
  const {
    expectedStatus = 200,
    expectedFields = [],
    schema = null,
    validateSchema = null
  } = options;

  // Check status code
  expect(response.status).toBe(expectedStatus);

  // Check response structure
  if (expectedStatus >= 200 && expectedStatus < 300) {
    expect(response.data).toBeDefined();
    
    // Validate specific fields exist
    expectedFields.forEach(field => {
      expect(response.data).toHaveProperty(field);
    });

    // Validate against schema if provided
    if (schema && validateSchema) {
      const validation = validateSchema(response.data, schema);
      expect(validation.valid).toBe(true);
      if (!validation.valid) {
        console.error('Schema validation errors:', validation.errors);
      }
    }
  }
}

/**
 * Wait for a condition to be true (useful for async operations)
 */
async function waitFor(condition, timeout = 5000, interval = 100) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Generate test data
 */
function generateTestData(type) {
  const timestamp = Date.now();
  
  const generators = {
    email: () => `test-${timestamp}@test.com`,
    phone: () => `+264${Math.floor(Math.random() * 1000000000)}`,
    name: () => `Test${timestamp}`,
    uuid: () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  };
  
  return generators[type] ? generators[type]() : null;
}

module.exports = {
  makeRequest,
  assertResponse,
  waitFor,
  generateTestData,
  API_URL
};

