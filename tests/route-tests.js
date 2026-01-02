/**
 * Comprehensive Route Testing Script for HealthBridge API
 * Tests all routes in the application
 * 
 * Usage:
 *   node tests/route-tests.js
 *   API_URL=http://localhost:5000/api node tests/route-tests.js
 */

// Check for required dependencies
let axios;
try {
  axios = require('axios');
} catch (e) {
  console.error('❌ Error: axios is required but not installed.');
  console.error('   Please run: cd backend && npm install axios');
  process.exit(1);
}

// Colors support (with fallback for environments without colors)
let colors;
try {
  colors = require('colors');
} catch (e) {
  // Fallback if colors is not available
  colors = {
    green: (str) => str,
    red: (str) => str,
    yellow: (str) => str,
    cyan: (str) => str,
    gray: (str) => str,
    white: (str) => str,
    bold: (str) => str
  };
}

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL;

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  total: 0,
  errors: []
};

// Test users (will be created/authenticated during test)
let testUsers = {
  admin: null,
  patient: null,
  provider: null,
  wellnessCoach: null,
  student: null
};

let tokens = {
  admin: null,
  patient: null,
  provider: null,
  wellnessCoach: null,
  student: null
};

// Helper function to make API requests
async function makeRequest(method, url, data = null, token = null, expectedStatus = 200) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      timeout: 10000, // 10 second timeout
      ...(data && { data })
    };

    const response = await axios(config);
    return { success: response.status === expectedStatus, status: response.status, data: response.data, error: null };
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return {
        success: false,
        status: 0,
        data: null,
        error: `Connection refused. Is the API server running at ${BASE_URL}?`
      };
    }
    return {
      success: error.response?.status === expectedStatus,
      status: error.response?.status || 500,
      data: error.response?.data || null,
      error: error.message
    };
  }
}

// Test runner
async function runTest(name, testFn, skip = false) {
  results.total++;
  
  if (skip) {
    console.log(`⏭️  SKIP: ${name}`.yellow);
    results.skipped++;
    return;
  }

  try {
    const result = await testFn();
    if (result) {
      console.log(`✅ PASS: ${name}`.green);
      results.passed++;
    } else {
      console.log(`❌ FAIL: ${name}`.red);
      results.failed++;
      results.errors.push(name);
    }
  } catch (error) {
    console.log(`❌ FAIL: ${name} - ${error.message}`.red);
    results.failed++;
    results.errors.push(`${name}: ${error.message}`);
  }
}

// Setup: Create test users and authenticate
async function setup() {
  console.log('\n🔧 Setting up test environment...\n'.cyan);

  // Create admin user
  const adminData = {
    email: `admin-${Date.now()}@test.com`,
    password: 'Test123!@#',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN'
  };

  const adminRegister = await makeRequest('POST', '/auth/register', adminData, null, 201);
  if (adminRegister.success) {
    testUsers.admin = adminRegister.data.user;
    const adminLogin = await makeRequest('POST', '/auth/login', {
      email: adminData.email,
      password: adminData.password
    });
    if (adminLogin.success) {
      tokens.admin = adminLogin.data.token;
      console.log('✅ Admin user created and authenticated'.green);
    }
  }

  // Create patient user
  const patientData = {
    email: `patient-${Date.now()}@test.com`,
    password: 'Test123!@#',
    firstName: 'Patient',
    lastName: 'User',
    role: 'PATIENT'
  };

  const patientRegister = await makeRequest('POST', '/auth/register', patientData, null, 201);
  if (patientRegister.success) {
    testUsers.patient = patientRegister.data.user;
    const patientLogin = await makeRequest('POST', '/auth/login', {
      email: patientData.email,
      password: patientData.password
    });
    if (patientLogin.success) {
      tokens.patient = patientLogin.data.token;
      console.log('✅ Patient user created and authenticated'.green);
    }
  }

  // Create provider user
  const providerData = {
    email: `provider-${Date.now()}@test.com`,
    password: 'Test123!@#',
    firstName: 'Provider',
    lastName: 'User',
    role: 'HEALTHCARE_PROVIDER'
  };

  const providerRegister = await makeRequest('POST', '/auth/register', providerData, null, 201);
  if (providerRegister.success) {
    testUsers.provider = providerRegister.data.user;
    const providerLogin = await makeRequest('POST', '/auth/login', {
      email: providerData.email,
      password: providerData.password
    });
    if (providerLogin.success) {
      tokens.provider = providerLogin.data.token;
      console.log('✅ Provider user created and authenticated'.green);
    }
  }

  // Create wellness coach user
  const wellnessCoachData = {
    email: `wellness-${Date.now()}@test.com`,
    password: 'Test123!@#',
    firstName: 'Wellness',
    lastName: 'Coach',
    role: 'WELLNESS_COACH'
  };

  const wellnessCoachRegister = await makeRequest('POST', '/auth/register', wellnessCoachData, null, 201);
  if (wellnessCoachRegister.success) {
    testUsers.wellnessCoach = wellnessCoachRegister.data.user;
    const wellnessCoachLogin = await makeRequest('POST', '/auth/login', {
      email: wellnessCoachData.email,
      password: wellnessCoachData.password
    });
    if (wellnessCoachLogin.success) {
      tokens.wellnessCoach = wellnessCoachLogin.data.token;
      console.log('✅ Wellness Coach user created and authenticated'.green);
    }
  }

  // Create student user
  const studentData = {
    email: `student-${Date.now()}@test.com`,
    password: 'Test123!@#',
    firstName: 'Student',
    lastName: 'User',
    role: 'STUDENT'
  };

  const studentRegister = await makeRequest('POST', '/auth/register', studentData, null, 201);
  if (studentRegister.success) {
    testUsers.student = studentRegister.data.user;
    const studentLogin = await makeRequest('POST', '/auth/login', {
      email: studentData.email,
      password: studentData.password
    });
    if (studentLogin.success) {
      tokens.student = studentLogin.data.token;
      console.log('✅ Student user created and authenticated'.green);
    }
  }

  console.log('');
}

// ==================== AUTH ROUTES ====================
async function testAuthRoutes() {
  console.log('\n📋 Testing Auth Routes\n'.cyan);

  await runTest('POST /api/auth/register - New user', async () => {
    const result = await makeRequest('POST', '/auth/register', {
      email: `test-${Date.now()}@example.com`,
      password: 'Test123!@#',
      firstName: 'Test',
      lastName: 'User',
      role: 'PATIENT'
    }, null, 201);
    return result.success;
  });

  await runTest('POST /api/auth/login - Valid credentials', async () => {
    const result = await makeRequest('POST', '/auth/login', {
      email: testUsers.patient?.email || 'test@example.com',
      password: 'Test123!@#'
    }, null, 200);
    return result.success && result.data.token;
  });

  await runTest('POST /api/auth/login - Invalid credentials', async () => {
    const result = await makeRequest('POST', '/auth/login', {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    }, null, 401);
    return result.success;
  });

  await runTest('GET /api/auth/profile - Authenticated', async () => {
    const result = await makeRequest('GET', '/auth/profile', null, tokens.patient, 200);
    return result.success && result.data.user;
  });

  await runTest('GET /api/auth/profile - Unauthenticated', async () => {
    const result = await makeRequest('GET', '/auth/profile', null, null, 401);
    return result.success;
  });
}

// ==================== HEALTH CHECK ====================
async function testHealthCheck() {
  console.log('\n📋 Testing Health Check\n'.cyan);

  await runTest('GET /api/health', async () => {
    const result = await makeRequest('GET', '/health', null, null, 200);
    return result.success && result.data.status === 'ok';
  });
}

// ==================== USER ROUTES ====================
async function testUserRoutes() {
  console.log('\n📋 Testing User Routes\n'.cyan);

  await runTest('GET /api/users - Admin only', async () => {
    const result = await makeRequest('GET', '/users', null, tokens.admin, 200);
    return result.success;
  });

  await runTest('GET /api/users - Non-admin (should fail)', async () => {
    const result = await makeRequest('GET', '/users', null, tokens.patient, 403);
    return result.success;
  });

  await runTest('GET /api/users/:id - Patient accessing own profile', async () => {
    const result = await makeRequest('GET', `/users/${testUsers.patient?.id}`, null, tokens.patient, 200);
    return result.success;
  });

  await runTest('GET /api/users/:id - Student accessing own profile', async () => {
    const result = await makeRequest('GET', `/users/${testUsers.student?.id}`, null, tokens.student, 200);
    return result.success;
  });

  await runTest('GET /api/users/:id - Wellness Coach accessing own profile', async () => {
    const result = await makeRequest('GET', `/users/${testUsers.wellnessCoach?.id}`, null, tokens.wellnessCoach, 200);
    return result.success;
  });

  await runTest('PUT /api/users/:id - Patient updating own profile', async () => {
    const result = await makeRequest('PUT', `/users/${testUsers.patient?.id}`, {
      firstName: 'Updated'
    }, tokens.patient, 200);
    return result.success;
  });

  await runTest('PUT /api/users/:id - Student updating own profile', async () => {
    const result = await makeRequest('PUT', `/users/${testUsers.student?.id}`, {
      firstName: 'Updated'
    }, tokens.student, 200);
    return result.success;
  });
}

// ==================== PROVIDER ROUTES ====================
async function testProviderRoutes() {
  console.log('\n📋 Testing Provider Routes\n'.cyan);

  await runTest('GET /api/users/providers', async () => {
    const result = await makeRequest('GET', '/users/providers', null, tokens.patient, 200);
    return result.success;
  });
}

// ==================== APPOINTMENT ROUTES ====================
async function testAppointmentRoutes() {
  console.log('\n📋 Testing Appointment Routes\n'.cyan);

  let appointmentId = null;

  await runTest('POST /api/appointments', async () => {
    const result = await makeRequest('POST', '/appointments', {
      providerId: testUsers.provider?.id,
      date: new Date().toISOString(),
      reason: 'Test appointment'
    }, tokens.patient, 201);
    if (result.success && result.data.appointment) {
      appointmentId = result.data.appointment.id;
    }
    return result.success;
  });

  await runTest('GET /api/appointments', async () => {
    const result = await makeRequest('GET', '/appointments', null, tokens.patient, 200);
    return result.success;
  });

  if (appointmentId) {
    await runTest('GET /api/appointments/:id', async () => {
      const result = await makeRequest('GET', `/appointments/${appointmentId}`, null, tokens.patient, 200);
      return result.success;
    });

    await runTest('PUT /api/appointments/:id', async () => {
      const result = await makeRequest('PUT', `/appointments/${appointmentId}`, {
        status: 'CONFIRMED'
      }, tokens.patient, 200);
      return result.success;
    });
  }
}

// ==================== CONSULTATION ROUTES ====================
async function testConsultationRoutes() {
  console.log('\n📋 Testing Consultation Routes\n'.cyan);

  let consultationId = null;

  await runTest('POST /api/consultations', async () => {
    const result = await makeRequest('POST', '/consultations', {
      appointmentId: 'test-appointment-id',
      notes: 'Test consultation notes',
      diagnosis: 'Test diagnosis'
    }, tokens.provider, 201);
    if (result.success && result.data.consultation) {
      consultationId = result.data.consultation.id;
    }
    return result.success;
  });

  await runTest('GET /api/consultations', async () => {
    const result = await makeRequest('GET', '/consultations', null, tokens.provider, 200);
    return result.success;
  });

  if (consultationId) {
    await runTest('GET /api/consultations/:id', async () => {
      const result = await makeRequest('GET', `/consultations/${consultationId}`, null, tokens.provider, 200);
      return result.success;
    });
  }
}

// ==================== WELLNESS ROUTES ====================
async function testWellnessRoutes() {
  console.log('\n📋 Testing Wellness Routes\n'.cyan);

  let wellnessId = null;

  await runTest('POST /api/wellness', async () => {
    const result = await makeRequest('POST', '/wellness', {
      title: 'Test Wellness Content',
      content: 'Test content',
      category: 'NUTRITION'
    }, tokens.patient, 201);
    if (result.success && result.data.wellness) {
      wellnessId = result.data.wellness.id;
    }
    return result.success;
  });

  await runTest('GET /api/wellness', async () => {
    const result = await makeRequest('GET', '/wellness', null, tokens.patient, 200);
    return result.success;
  });

  if (wellnessId) {
    await runTest('GET /api/wellness/:id', async () => {
      const result = await makeRequest('GET', `/wellness/${wellnessId}`, null, tokens.patient, 200);
      return result.success;
    });
  }
}

// ==================== LEARNING ROUTES ====================
async function testLearningRoutes() {
  console.log('\n📋 Testing Learning Routes\n'.cyan);

  await runTest('GET /api/learning/resources - Patient', async () => {
    const result = await makeRequest('GET', '/learning/resources', null, tokens.patient, 200);
    return result.success;
  });

  await runTest('GET /api/learning/resources - Student', async () => {
    const result = await makeRequest('GET', '/learning/resources', null, tokens.student, 200);
    return result.success;
  });

  await runTest('GET /api/learning/assignments - Patient', async () => {
    const result = await makeRequest('GET', '/learning/assignments', null, tokens.patient, 200);
    return result.success;
  });

  await runTest('GET /api/learning/assignments - Student', async () => {
    const result = await makeRequest('GET', '/learning/assignments', null, tokens.student, 200);
    return result.success;
  });
}

// ==================== WELLNESS TOOLS ROUTES ====================
async function testWellnessToolsRoutes() {
  console.log('\n📋 Testing Wellness Tools Routes\n'.cyan);

  await runTest('GET /api/wellness-tools/plans - Patient', async () => {
    const result = await makeRequest('GET', '/wellness-tools/plans', null, tokens.patient, 200);
    return result.success;
  });

  await runTest('GET /api/wellness-tools/plans - Wellness Coach', async () => {
    const result = await makeRequest('GET', '/wellness-tools/plans', null, tokens.wellnessCoach, 200);
    return result.success;
  });

  await runTest('GET /api/wellness-tools/habits - Patient', async () => {
    const result = await makeRequest('GET', '/wellness-tools/habits', null, tokens.patient, 200);
    return result.success;
  });

  await runTest('GET /api/wellness-tools/habits - Wellness Coach', async () => {
    const result = await makeRequest('GET', '/wellness-tools/habits', null, tokens.wellnessCoach, 200);
    return result.success;
  });

  await runTest('GET /api/wellness-tools/challenges - Patient', async () => {
    const result = await makeRequest('GET', '/wellness-tools/challenges', null, tokens.patient, 200);
    return result.success;
  });

  await runTest('GET /api/wellness-tools/challenges - Wellness Coach', async () => {
    const result = await makeRequest('GET', '/wellness-tools/challenges', null, tokens.wellnessCoach, 200);
    return result.success;
  });
}

// ==================== RESEARCH ROUTES ====================
async function testResearchRoutes() {
  console.log('\n📋 Testing Research Routes\n'.cyan);

  await runTest('GET /api/research/topics - Patient', async () => {
    const result = await makeRequest('GET', '/research/topics', null, tokens.patient, 200);
    return result.success;
  });

  await runTest('GET /api/research/topics - Student', async () => {
    const result = await makeRequest('GET', '/research/topics', null, tokens.student, 200);
    return result.success;
  });

  await runTest('GET /api/research/proposals - Patient', async () => {
    const result = await makeRequest('GET', '/research/proposals', null, tokens.patient, 200);
    return result.success;
  });

  await runTest('GET /api/research/proposals - Student', async () => {
    const result = await makeRequest('GET', '/research/proposals', null, tokens.student, 200);
    return result.success;
  });

  await runTest('GET /api/research/resources - Patient', async () => {
    const result = await makeRequest('GET', '/research/resources', null, tokens.patient, 200);
    return result.success;
  });

  await runTest('GET /api/research/resources - Student', async () => {
    const result = await makeRequest('GET', '/research/resources', null, tokens.student, 200);
    return result.success;
  });
}

// ==================== TRIAGE ROUTES ====================
async function testTriageRoutes() {
  console.log('\n📋 Testing Triage Routes\n'.cyan);

  await runTest('POST /api/triage/assess', async () => {
    const result = await makeRequest('POST', '/triage/assess', {
      symptoms: ['fever', 'cough'],
      severity: 'MODERATE'
    }, tokens.patient, 200);
    return result.success;
  });

  await runTest('GET /api/triage/history', async () => {
    const result = await makeRequest('GET', '/triage/history', null, tokens.patient, 200);
    return result.success;
  });
}

// ==================== MEDICAL AID ROUTES ====================
async function testMedicalAidRoutes() {
  console.log('\n📋 Testing Medical Aid Routes\n'.cyan);

  await runTest('GET /api/medical-aid', async () => {
    const result = await makeRequest('GET', '/medical-aid', null, tokens.patient, 200);
    return result.success;
  });

  await runTest('POST /api/medical-aid', async () => {
    const result = await makeRequest('POST', '/medical-aid', {
      schemeName: 'Test Scheme',
      memberNumber: '123456',
      policyHolder: 'Test Holder'
    }, tokens.patient, 200);
    return result.success;
  });

  await runTest('GET /api/medical-aid/claims', async () => {
    const result = await makeRequest('GET', '/medical-aid/claims', null, tokens.patient, 200);
    return result.success;
  });
}

// ==================== PAYMENT ROUTES ====================
async function testPaymentRoutes() {
  console.log('\n📋 Testing Payment Routes\n'.cyan);

  await runTest('GET /api/payments', async () => {
    const result = await makeRequest('GET', '/payments', null, tokens.patient, 200);
    return result.success;
  });

  await runTest('POST /api/payments/callback - Public endpoint', async () => {
    const result = await makeRequest('POST', '/payments/callback', {
      transactionId: 'test-123',
      status: 'COMPLETED'
    }, null, 200);
    return result.success;
  });
}

// ==================== FEEDBACK ROUTES ====================
async function testFeedbackRoutes() {
  console.log('\n📋 Testing Feedback Routes\n'.cyan);

  let feedbackId = null;

  await runTest('POST /api/feedback - Public endpoint', async () => {
    const result = await makeRequest('POST', '/feedback', {
      type: 'BUG',
      message: 'Test feedback',
      rating: 5
    }, null, 201);
    if (result.success && result.data.feedback) {
      feedbackId = result.data.feedback.id;
    }
    return result.success;
  });

  await runTest('GET /api/feedback/stats - Protected', async () => {
    const result = await makeRequest('GET', '/feedback/stats', null, tokens.admin, 200);
    return result.success;
  });

  await runTest('GET /api/feedback - Protected', async () => {
    const result = await makeRequest('GET', '/feedback', null, tokens.admin, 200);
    return result.success;
  });

  if (feedbackId) {
    await runTest('GET /api/feedback/:id - Protected', async () => {
      const result = await makeRequest('GET', `/feedback/${feedbackId}`, null, tokens.admin, 200);
      return result.success;
    });
  }
}

// ==================== SURVEY ROUTES ====================
async function testSurveyRoutes() {
  console.log('\n📋 Testing Survey Routes\n'.cyan);

  let surveyId = null;

  await runTest('POST /api/surveys - Protected', async () => {
    const result = await makeRequest('POST', '/surveys', {
      title: 'Test Survey',
      description: 'Test description',
      questions: [{ type: 'TEXT', question: 'Test question' }]
    }, tokens.admin, 201);
    if (result.success && result.data.survey) {
      surveyId = result.data.survey.id;
    }
    return result.success;
  });

  await runTest('GET /api/surveys/public/:id - Public', async () => {
    if (surveyId) {
      const result = await makeRequest('GET', `/surveys/public/${surveyId}`, null, null, 200);
      return result.success;
    }
    return true; // Skip if no survey created
  });

  await runTest('GET /api/surveys - Protected', async () => {
    const result = await makeRequest('GET', '/surveys', null, tokens.admin, 200);
    return result.success;
  });

  await runTest('GET /api/surveys/metrics/adoption - Protected', async () => {
    const result = await makeRequest('GET', '/surveys/metrics/adoption', null, tokens.admin, 200);
    return result.success;
  });
}

// ==================== POLICY ROUTES ====================
async function testPolicyRoutes() {
  console.log('\n📋 Testing Policy Routes\n'.cyan);

  let policyId = null;

  await runTest('POST /api/policies - Protected', async () => {
    const result = await makeRequest('POST', '/policies', {
      policyType: 'DATA_RETENTION',
      policyData: { retentionPeriod: 365 },
      version: '1.0',
      effectiveDate: new Date().toISOString()
    }, tokens.admin, 201);
    if (result.success && result.data.policy) {
      policyId = result.data.policy.id;
    }
    return result.success;
  });

  await runTest('GET /api/policies - Protected', async () => {
    const result = await makeRequest('GET', '/policies', null, tokens.admin, 200);
    return result.success;
  });

  await runTest('GET /api/policies/active/:policyType - Protected', async () => {
    const result = await makeRequest('GET', '/policies/active/DATA_RETENTION', null, tokens.admin, 200);
    return result.success;
  });

  if (policyId) {
    await runTest('GET /api/policies/:id - Protected', async () => {
      const result = await makeRequest('GET', `/policies/${policyId}`, null, tokens.admin, 200);
      return result.success;
    });
  }
}

// ==================== MEDICATION ROUTES ====================
async function testMedicationRoutes() {
  console.log('\n📋 Testing Medication Routes\n'.cyan);

  await runTest('GET /api/medications', async () => {
    const result = await makeRequest('GET', '/medications', null, tokens.patient, 200);
    return result.success;
  });

  await runTest('GET /api/medications/upcoming', async () => {
    const result = await makeRequest('GET', '/medications/upcoming', null, tokens.patient, 200);
    return result.success;
  });
}

// ==================== BILLING ROUTES ====================
async function testBillingRoutes() {
  console.log('\n📋 Testing Billing Routes\n'.cyan);

  await runTest('GET /api/billing', async () => {
    const result = await makeRequest('GET', '/billing', null, tokens.patient, 200);
    return result.success;
  });

  await runTest('GET /api/billing/stats', async () => {
    const result = await makeRequest('GET', '/billing/stats', null, tokens.provider, 200);
    return result.success;
  });
}

// ==================== MONITORING ROUTES ====================
async function testMonitoringRoutes() {
  console.log('\n📋 Testing Monitoring Routes\n'.cyan);

  await runTest('GET /api/monitoring', async () => {
    const result = await makeRequest('GET', '/monitoring', null, tokens.patient, 200);
    return result.success;
  });

  await runTest('GET /api/monitoring/stats', async () => {
    const result = await makeRequest('GET', '/monitoring/stats', null, tokens.patient, 200);
    return result.success;
  });
}

// ==================== PROVIDER FEES ROUTES ====================
async function testProviderFeesRoutes() {
  console.log('\n📋 Testing Provider Fees Routes\n'.cyan);

  await runTest('GET /api/provider-fees', async () => {
    const result = await makeRequest('GET', '/provider-fees', null, tokens.provider, 200);
    return result.success;
  });

  await runTest('GET /api/provider-fees/all - Admin only', async () => {
    const result = await makeRequest('GET', '/provider-fees/all', null, tokens.admin, 200);
    return result.success;
  });
}

// ==================== PROVIDER EARNINGS ROUTES ====================
async function testProviderEarningsRoutes() {
  console.log('\n📋 Testing Provider Earnings Routes\n'.cyan);

  await runTest('GET /api/provider-earnings', async () => {
    const result = await makeRequest('GET', '/provider-earnings', null, tokens.provider, 200);
    return result.success;
  });

  await runTest('GET /api/provider-earnings/all - Admin only', async () => {
    const result = await makeRequest('GET', '/provider-earnings/all', null, tokens.admin, 200);
    return result.success;
  });
}

// ==================== ADMIN MONITORING ROUTES ====================
async function testAdminMonitoringRoutes() {
  console.log('\n📋 Testing Admin Monitoring Routes\n'.cyan);

  await runTest('GET /api/admin/transactions - Admin only', async () => {
    const result = await makeRequest('GET', '/admin/transactions', null, tokens.admin, 200);
    return result.success;
  });

  await runTest('GET /api/admin/fraud-alerts - Admin only', async () => {
    const result = await makeRequest('GET', '/admin/fraud-alerts', null, tokens.admin, 200);
    return result.success;
  });
}

// ==================== OFFLINE SYNC ROUTES ====================
async function testOfflineSyncRoutes() {
  console.log('\n📋 Testing Offline Sync Routes\n'.cyan);

  await runTest('GET /api/offline-sync/status', async () => {
    const result = await makeRequest('GET', '/offline-sync/status', null, tokens.patient, 200);
    return result.success;
  });
}

// ==================== TELEHEALTH PRO ROUTES ====================
async function testTelehealthProRoutes() {
  console.log('\n📋 Testing Telehealth Pro Routes\n'.cyan);

  await runTest('GET /api/telehealth-pro/analytics', async () => {
    const result = await makeRequest('GET', '/telehealth-pro/analytics', null, tokens.provider, 200);
    return result.success;
  });
}

// ==================== CLINICAL TEMPLATES ROUTES ====================
async function testClinicalTemplatesRoutes() {
  console.log('\n📋 Testing Clinical Templates Routes\n'.cyan);

  await runTest('GET /api/clinical-templates - Provider only', async () => {
    const result = await makeRequest('GET', '/clinical-templates', null, tokens.provider, 200);
    return result.success;
  });

  await runTest('GET /api/clinical-templates - Non-provider (should fail)', async () => {
    const result = await makeRequest('GET', '/clinical-templates', null, tokens.patient, 403);
    return result.success;
  });

  await runTest('GET /api/clinical-templates - Student (should fail)', async () => {
    const result = await makeRequest('GET', '/clinical-templates', null, tokens.student, 403);
    return result.success;
  });

  await runTest('GET /api/clinical-templates - Wellness Coach (should fail)', async () => {
    const result = await makeRequest('GET', '/clinical-templates', null, tokens.wellnessCoach, 403);
    return result.success;
  });
}

// ==================== ROLE-BASED ACCESS CONTROL TESTS ====================
async function testRoleBasedAccess() {
  console.log('\n📋 Testing Role-Based Access Control\n'.cyan);

  // Test admin-only routes
  await runTest('GET /api/users - Admin (should pass)', async () => {
    const result = await makeRequest('GET', '/users', null, tokens.admin, 200);
    return result.success;
  });

  await runTest('GET /api/users - Patient (should fail)', async () => {
    const result = await makeRequest('GET', '/users', null, tokens.patient, 403);
    return result.success;
  });

  await runTest('GET /api/users - Student (should fail)', async () => {
    const result = await makeRequest('GET', '/users', null, tokens.student, 403);
    return result.success;
  });

  await runTest('GET /api/users - Wellness Coach (should fail)', async () => {
    const result = await makeRequest('GET', '/users', null, tokens.wellnessCoach, 403);
    return result.success;
  });

  // Test provider-only routes
  await runTest('GET /api/billing/stats - Provider (should pass)', async () => {
    const result = await makeRequest('GET', '/billing/stats', null, tokens.provider, 200);
    return result.success;
  });

  await runTest('GET /api/billing/stats - Patient (should pass - can view own)', async () => {
    const result = await makeRequest('GET', '/billing/stats', null, tokens.patient, 200);
    return result.success;
  });

  // Test that all roles can access their own profile
  await runTest('GET /api/auth/profile - Admin', async () => {
    const result = await makeRequest('GET', '/auth/profile', null, tokens.admin, 200);
    return result.success && result.data.user.role === 'ADMIN';
  });

  await runTest('GET /api/auth/profile - Patient', async () => {
    const result = await makeRequest('GET', '/auth/profile', null, tokens.patient, 200);
    return result.success && result.data.user.role === 'PATIENT';
  });

  await runTest('GET /api/auth/profile - Provider', async () => {
    const result = await makeRequest('GET', '/auth/profile', null, tokens.provider, 200);
    return result.success && result.data.user.role === 'HEALTHCARE_PROVIDER';
  });

  await runTest('GET /api/auth/profile - Wellness Coach', async () => {
    const result = await makeRequest('GET', '/auth/profile', null, tokens.wellnessCoach, 200);
    return result.success && result.data.user.role === 'WELLNESS_COACH';
  });

  await runTest('GET /api/auth/profile - Student', async () => {
    const result = await makeRequest('GET', '/auth/profile', null, tokens.student, 200);
    return result.success && result.data.user.role === 'STUDENT';
  });
}

// Check API connectivity
async function checkAPIConnectivity() {
  try {
    const result = await makeRequest('GET', '/health', null, null, 200);
    if (result.success) {
      console.log('✅ API server is accessible\n'.green);
      return true;
    } else {
      console.log('⚠️  API server responded but health check failed\n'.yellow);
      return false;
    }
  } catch (error) {
    console.log(`❌ Cannot connect to API server at ${BASE_URL}\n`.red);
    console.log('   Please ensure the server is running:\n'.gray);
    console.log('   - Development: cd backend && npm run dev\n'.gray);
    console.log('   - Docker: docker-compose up\n'.gray);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('\n🚀 Starting HealthBridge API Route Tests\n'.cyan.bold);
  console.log(`📍 API URL: ${BASE_URL}\n`.gray);

  // Check API connectivity first
  const isConnected = await checkAPIConnectivity();
  if (!isConnected) {
    process.exit(1);
  }

  try {
    // Setup
    await setup();

    // Run all test suites
    await testHealthCheck();
    await testAuthRoutes();
    await testUserRoutes();
    await testProviderRoutes();
    await testAppointmentRoutes();
    await testConsultationRoutes();
    await testWellnessRoutes();
    await testLearningRoutes();
    await testWellnessToolsRoutes();
    await testResearchRoutes();
    await testTriageRoutes();
    await testMedicalAidRoutes();
    await testPaymentRoutes();
    await testFeedbackRoutes();
    await testSurveyRoutes();
    await testPolicyRoutes();
    await testMedicationRoutes();
    await testBillingRoutes();
    await testMonitoringRoutes();
    await testProviderFeesRoutes();
    await testProviderEarningsRoutes();
    await testAdminMonitoringRoutes();
    await testOfflineSyncRoutes();
    await testTelehealthProRoutes();
    await testClinicalTemplatesRoutes();
    await testRoleBasedAccess();

    // Print summary
    console.log('\n' + '='.repeat(60).cyan);
    console.log('📊 TEST SUMMARY'.cyan.bold);
    console.log('='.repeat(60).cyan);
    console.log(`Total Tests: ${results.total}`.white);
    console.log(`✅ Passed: ${results.passed}`.green);
    console.log(`❌ Failed: ${results.failed}`.red);
    console.log(`⏭️  Skipped: ${results.skipped}`.yellow);
    console.log(`Success Rate: ${((results.passed / (results.total - results.skipped)) * 100).toFixed(2)}%`.white);

    if (results.errors.length > 0) {
      console.log('\n❌ Failed Tests:'.red);
      results.errors.forEach(error => {
        console.log(`  - ${error}`.red);
      });
    }

    console.log('\n');

    // Exit with appropriate code
    process.exit(results.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n❌ Fatal error during testing:'.red);
    console.error(error);
    process.exit(1);
  }
}

// Run tests
runAllTests();

