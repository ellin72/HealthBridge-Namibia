# HealthBridge API Test Suite

Comprehensive test suite for the HealthBridge Namibia API using Jest framework.

## Features

✅ **Jest Framework Integration** - Modern test framework with CI/CD support  
✅ **Schema Validation** - Validates API responses against JSON schemas  
✅ **Database Cleanup** - Automatic cleanup of test data after tests  
✅ **Automated Route Discovery** - Dynamically discovers and tests all routes  
✅ **Enhanced Assertions** - Validates response bodies, not just status codes  
✅ **Security Testing** - Tests for SQL injection, XSS, auth bypass, etc.  
✅ **Performance Testing** - Load and stress testing capabilities  

## Structure

```
tests/
├── jest.config.js          # Jest configuration
├── setup.js                # Test environment setup
├── utils/                  # Test utilities
│   ├── schemaValidator.js  # JSON schema validation
│   ├── testHelpers.js      # Request helpers and assertions
│   ├── routeDiscovery.js   # Automated route discovery
│   ├── dbCleanup.js        # Database cleanup utilities
│   └── securityTests.js    # Security testing utilities
├── routes/                 # Route tests
│   └── api.test.js        # Main API route tests
└── security/               # Security tests
    └── security.test.js    # Security vulnerability tests
```

## Installation

```bash
# Install test dependencies
npm install --save-dev jest ajv ajv-formats axios

# Or install all dependencies
npm run install:all
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run only route tests
npm run test:routes

# Run only security tests
npm run test:security

# Run legacy test script (original)
npm run test:legacy
```

## Configuration

### Environment Variables

```bash
# API URL (default: http://localhost:5000/api)
API_URL=http://localhost:5000/api

# Test database URL (optional, uses DATABASE_URL if not set)
TEST_DATABASE_URL=postgresql://user:pass@localhost:5432/testdb

# JWT Secret for testing
JWT_SECRET=test-jwt-secret-key
```

### Jest Configuration

See `tests/jest.config.js` for Jest settings including:
- Test environment
- Coverage collection
- Timeout settings
- Module mapping

## Test Utilities

### Schema Validation

```javascript
const { validateSchema, schemas } = require('./utils/schemaValidator');

const validation = validateSchema(response.data, schemas.user);
expect(validation.valid).toBe(true);
```

### Test Helpers

```javascript
const { makeRequest, assertResponse } = require('./utils/testHelpers');

// Make API request
const response = await makeRequest('GET', '/users', null, token);

// Assert response
assertResponse(response, {
  expectedStatus: 200,
  expectedFields: ['id', 'email'],
  schema: schemas.user,
  validateSchema: validateSchema
});
```

### Database Cleanup

```javascript
const { getTracker } = require('./utils/dbCleanup');

// Track created entity
getTracker().track('users', userId);

// Cleanup happens automatically in afterAll hook
```

### Security Testing

```javascript
const { testSQLInjection, testXSS } = require('./utils/securityTests');

// Test SQL injection
const results = await testSQLInjection('/users/:id', 'GET', token);
expect(results.some(r => r.vulnerable)).toBe(false);

// Test XSS
const results = await testXSS('/feedback', 'POST');
expect(results.some(r => r.vulnerable)).toBe(false);
```

## Writing Tests

### Basic Test Structure

```javascript
describe('Feature Name', () => {
  let tokens = {};
  let testData = {};

  beforeAll(async () => {
    // Setup: Create test users, authenticate
  });

  afterAll(async () => {
    // Cleanup: Remove test data
  });

  test('Test description', async () => {
    const response = await makeRequest('GET', '/endpoint', null, tokens.user);
    
    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
  });
});
```

### Schema Validation

```javascript
test('Response matches schema', async () => {
  const response = await makeRequest('GET', '/users/me', null, token);
  
  const validation = validateSchema(response.data, schemas.user);
  expect(validation.valid).toBe(true);
  
  if (!validation.valid) {
    console.error('Schema errors:', validation.errors);
  }
});
```

### Testing Protected Endpoints

```javascript
test('Requires authentication', async () => {
  const response = await makeRequest('GET', '/protected', null, null, {
    expectedStatus: 401
  });
  
  expect(response.status).toBe(401);
});
```

## Coverage

The test suite aims for comprehensive coverage including:

- ✅ All API endpoints
- ✅ Authentication and authorization
- ✅ Input validation
- ✅ Error handling
- ✅ Security vulnerabilities
- ✅ Response schemas
- ✅ Edge cases

## CI/CD Integration

The test suite is designed for CI/CD integration:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Best Practices

1. **Always track test data** - Use `getTracker().track()` to ensure cleanup
2. **Validate schemas** - Use schema validation for all API responses
3. **Test edge cases** - Include boundary conditions and error cases
4. **Clean up after tests** - Use `afterAll` hooks for cleanup
5. **Use descriptive test names** - Make it clear what each test validates
6. **Test security** - Include security tests for all user inputs
7. **Keep tests independent** - Each test should be able to run in isolation

## Troubleshooting

### Connection Refused

If you see "Connection refused" errors:
- Ensure the API server is running: `cd backend && npm run dev`
- Check the `API_URL` environment variable

### Database Errors

If you see database errors:
- Ensure the database is running and accessible
- Check `DATABASE_URL` or `TEST_DATABASE_URL`
- Verify Prisma migrations are applied

### Timeout Errors

If tests timeout:
- Increase timeout in `jest.config.js`
- Check for slow database queries
- Verify network connectivity

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Add schema validation for new endpoints
3. Include security tests for user inputs
4. Track all test data for cleanup
5. Update this README if adding new utilities

## Legacy Tests

The original test script (`route-tests.js`) is still available:

```bash
npm run test:legacy
```

This is maintained for backward compatibility but new tests should use the Jest framework.
