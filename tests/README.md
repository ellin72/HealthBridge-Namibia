# HealthBridge API Test Suite

This directory contains comprehensive test scripts for the HealthBridge API.

## Route Tests

The `route-tests.js` script tests all API routes in the application.

### Prerequisites

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Ensure the API server is running:
   ```bash
   npm run dev
   # or
   docker-compose up
   ```

### Running Route Tests

From the project root:

```bash
# Using npm script
cd backend
npm run test:routes

# Or directly
node tests/route-tests.js

# With custom API URL
API_URL=http://localhost:5000/api node tests/route-tests.js
```

### What Gets Tested

The route test script covers:

#### Authentication Routes
- User registration
- User login (valid and invalid credentials)
- Profile retrieval (authenticated and unauthenticated)

#### Core Routes
- Health check
- User management (CRUD operations)
- Provider listing
- Appointments (create, read, update)
- Consultations
- Wellness content
- Learning resources and assignments
- Wellness tools (plans, habits, challenges)
- Research features
- Triage assessment
- Medical aid management
- Payment processing
- Feedback submission (public) and management (protected)
- Surveys (public and protected)
- Policy management
- Medication tracking
- Billing and invoices
- Health monitoring
- Provider fees and earnings
- Admin monitoring
- Offline sync
- Telehealth Pro features
- Clinical templates

### Test Features

- **Automatic User Creation**: Creates test users (admin, patient, provider) automatically
- **Authentication Testing**: Tests both public and protected routes
- **Role-Based Testing**: Verifies role-based access control (admin-only, provider-only routes)
- **Comprehensive Coverage**: Tests all major endpoints in the application
- **Clear Output**: Color-coded results showing passed/failed/skipped tests
- **Summary Report**: Provides a detailed summary at the end

### Test Output

The script provides:
- ✅ Green checkmarks for passed tests
- ❌ Red X marks for failed tests
- ⏭️ Yellow indicators for skipped tests
- Summary statistics (total, passed, failed, success rate)
- List of failed tests with error messages

### Exit Codes

- `0`: All tests passed
- `1`: One or more tests failed

This makes it suitable for CI/CD integration.

### Customization

You can modify the test script to:
- Add more test cases
- Test specific routes only
- Adjust test data
- Add performance benchmarks
- Integrate with other testing frameworks

### Example Output

```
🚀 Starting HealthBridge API Route Tests

📍 API URL: http://localhost:5000/api

🔧 Setting up test environment...

✅ Admin user created and authenticated
✅ Patient user created and authenticated
✅ Provider user created and authenticated

📋 Testing Health Check

✅ PASS: GET /api/health

📋 Testing Auth Routes

✅ PASS: POST /api/auth/register - New user
✅ PASS: POST /api/auth/login - Valid credentials
...

============================================================
📊 TEST SUMMARY
============================================================
Total Tests: 150
✅ Passed: 145
❌ Failed: 5
⏭️  Skipped: 0
Success Rate: 96.67%
```

## Load Tests

See `load/README.md` for information about load testing with k6.

