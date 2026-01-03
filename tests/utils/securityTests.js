/**
 * Security Testing Utilities
 * Tests for SQL injection, XSS, authentication bypass, etc.
 */

const { makeRequest } = require('./testHelpers');

/**
 * Test SQL injection vulnerabilities
 */
async function testSQLInjection(endpoint, method = 'GET', token = null) {
  const sqlPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "' UNION SELECT * FROM users --",
    "1' OR '1'='1",
    "admin'--",
    "' OR 1=1--"
  ];

  const results = [];
  
  for (const payload of sqlPayloads) {
    try {
      const response = await makeRequest(
        method,
        endpoint.replace(':id', payload),
        method !== 'GET' ? { id: payload, name: payload } : null,
        token
      );
      
      // Check if response indicates SQL injection vulnerability
      const isVulnerable = 
        response.data?.error?.toLowerCase().includes('sql') ||
        response.data?.error?.toLowerCase().includes('syntax') ||
        response.status === 500 && response.data?.message?.toLowerCase().includes('database');
      
      results.push({
        payload,
        vulnerable: isVulnerable,
        status: response.status,
        error: response.error
      });
    } catch (error) {
      results.push({
        payload,
        vulnerable: false,
        error: error.message
      });
    }
  }
  
  return results;
}

/**
 * Test XSS vulnerabilities
 */
async function testXSS(endpoint, method = 'POST', token = null) {
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    'javascript:alert("XSS")',
    '<svg onload=alert("XSS")>',
    '"><script>alert("XSS")</script>'
  ];

  const results = [];
  
  for (const payload of xssPayloads) {
    try {
      const response = await makeRequest(
        method,
        endpoint,
        { 
          name: payload,
          description: payload,
          title: payload 
        },
        token
      );
      
      // Check if payload is reflected in response without sanitization
      const responseStr = JSON.stringify(response.data || {});
      const isVulnerable = responseStr.includes(payload) && !responseStr.includes('&lt;');
      
      results.push({
        payload,
        vulnerable: isVulnerable,
        status: response.status
      });
    } catch (error) {
      results.push({
        payload,
        vulnerable: false,
        error: error.message
      });
    }
  }
  
  return results;
}

/**
 * Test authentication bypass
 */
async function testAuthBypass(endpoints, validToken = null) {
  const results = [];
  
  const invalidTokens = [
    null,
    'invalid-token',
    'Bearer invalid',
    'expired-token',
    'malformed.token.here'
  ];
  
  for (const endpoint of endpoints) {
    for (const token of invalidTokens) {
      try {
        const response = await makeRequest(
          endpoint.method || 'GET',
          endpoint.path,
          endpoint.data || null,
          token
        );
        
        // Should return 401/403 for protected endpoints
        const isVulnerable = response.status === 200 && endpoint.protected;
        
        results.push({
          endpoint: endpoint.path,
          token: token || 'none',
          vulnerable: isVulnerable,
          status: response.status
        });
      } catch (error) {
        results.push({
          endpoint: endpoint.path,
          token: token || 'none',
          vulnerable: false,
          error: error.message
        });
      }
    }
  }
  
  return results;
}

/**
 * Test rate limiting
 */
async function testRateLimit(endpoint, method = 'GET', token = null, maxRequests = 100) {
  const results = [];
  let successCount = 0;
  let rateLimitedCount = 0;
  
  for (let i = 0; i < maxRequests; i++) {
    try {
      const response = await makeRequest(method, endpoint, null, token);
      
      if (response.status === 200 || response.status === 201) {
        successCount++;
      } else if (response.status === 429) {
        rateLimitedCount++;
      }
      
      // Small delay to avoid overwhelming the server
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      // Ignore errors for rate limit testing
    }
  }
  
  return {
    totalRequests: maxRequests,
    successful: successCount,
    rateLimited: rateLimitedCount,
    hasRateLimit: rateLimitedCount > 0
  };
}

/**
 * Test input validation
 */
async function testInputValidation(endpoint, method = 'POST', token = null, field = 'email') {
  const invalidInputs = {
    email: [
      'not-an-email',
      'test@',
      '@test.com',
      'test..test@test.com',
      'test@test',
      '<script>alert("xss")</script>@test.com'
    ],
    phone: [
      'not-a-phone',
      '123',
      'abc123',
      '<script>alert("xss")</script>'
    ],
    uuid: [
      'not-a-uuid',
      '123',
      'invalid-uuid-format',
      "' OR '1'='1"
    ],
    number: [
      'not-a-number',
      'abc',
      '1.2.3',
      'infinity',
      'NaN'
    ]
  };
  
  const inputs = invalidInputs[field] || invalidInputs.email;
  const results = [];
  
  for (const input of inputs) {
    try {
      const response = await makeRequest(
        method,
        endpoint,
        { [field]: input },
        token
      );
      
      // Should return 400 for invalid input
      const isValidated = response.status === 400;
      
      results.push({
        input,
        validated: isValidated,
        status: response.status,
        message: response.data?.message
      });
    } catch (error) {
      results.push({
        input,
        validated: false,
        error: error.message
      });
    }
  }
  
  return results;
}

module.exports = {
  testSQLInjection,
  testXSS,
  testAuthBypass,
  testRateLimit,
  testInputValidation
};

