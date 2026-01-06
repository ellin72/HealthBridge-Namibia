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
    return result.success && result.data && result.data.user;
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
      appointmentDate: new Date().toISOString(),
      notes: 'Test appointment'
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
        status: 'CANCELLED'
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
    // First create an appointment for the consultation
    let testAppointmentId = null;
    if (testUsers.provider?.id && testUsers.patient?.id) {
      const appointmentResult = await makeRequest('POST', '/appointments', {
        providerId: testUsers.provider.id,
        appointmentDate: new Date().toISOString(),
        notes: 'Test appointment for consultation'
      }, tokens.patient, 201);
      if (appointmentResult.success && appointmentResult.data.appointment) {
        testAppointmentId = appointmentResult.data.appointment.id;
      }
    }
    
    if (!testAppointmentId) {
      return false; // Skip if we couldn't create an appointment
    }
    
    const result = await makeRequest('POST', '/consultations', {
      appointmentId: testAppointmentId,
      notes: 'Test consultation notes',
      diagnosis: 'Test diagnosis'
    }, tokens.provider, 201);
    if (result.success && result.data.consultationNote) {
      consultationId = result.data.consultationNote.id;
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
      description: 'Test description',
      content: 'Test content',
      category: 'NUTRITION'
    }, tokens.wellnessCoach, 201);
    if (result.success && result.data.wellnessContent) {
      wellnessId = result.data.wellnessContent.id;
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
    }, tokens.patient, 201);
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
      scheme: 'NAMMED',
      schemeName: 'Test Scheme',
      memberNumber: '123456',
      policyNumber: 'POL-123456'
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
    // Test callback for non-existent payment - should return 202 Accepted
    // This tests the race condition handling where callback arrives before payment record
    const result = await makeRequest('POST', '/payments/callback', {
      paymentReference: `PAY-${Date.now()}-TEST`,
      transactionId: 'test-123',
      status: 'success'
    }, null, 202); // Expect 202 Accepted when payment doesn't exist yet
    return result.success;
  });
}

// ==================== FEEDBACK ROUTES ====================
async function testFeedbackRoutes() {
  console.log('\n📋 Testing Feedback Routes\n'.cyan);

  let feedbackId = null;

  await runTest('POST /api/feedback - Public endpoint', async () => {
    const result = await makeRequest('POST', '/feedback', {
      feedbackType: 'BUG',
      description: 'Test feedback',
      rating: 5
    }, null, 201);
    if (result.success && result.data.data && result.data.data.id) {
      feedbackId = result.data.data.id;
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
    if (result.success && result.data.data && result.data.data.id) {
      surveyId = result.data.data.id;
    }
    return result.success;
  });

  await runTest('GET /api/surveys/public/:id - Public', async () => {
    // Create a new survey specifically for public access testing
    // Public surveys must be ACTIVE and anonymous
    const publicSurveyResult = await makeRequest('POST', '/surveys', {
      title: 'Public Test Survey',
      description: 'Test description for public survey',
      questions: [{ type: 'TEXT', question: 'Test question' }],
      isAnonymous: true  // Set anonymous during creation
    }, tokens.admin, 201);
    
    if (publicSurveyResult.success && publicSurveyResult.data.data && publicSurveyResult.data.data.id) {
      const publicSurveyId = publicSurveyResult.data.data.id;
      
      // Update status to ACTIVE (createSurvey always defaults to DRAFT)
      const updateResult = await makeRequest('PATCH', `/surveys/${publicSurveyId}/status`, {
        status: 'ACTIVE'
      }, tokens.admin, 200);
      
      if (updateResult.success) {
        // Now test the public endpoint - should work since survey is ACTIVE and anonymous
        const result = await makeRequest('GET', `/surveys/public/${publicSurveyId}`, null, null, 200);
        return result.success;
      }
      return false; // Failed to update survey status
    }
    return false; // Failed to create public survey
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
      name: 'Test Policy',
      description: 'Test policy description',
      effectiveDate: new Date().toISOString()
    }, tokens.admin, 201);
    if (result.success && result.data.id) {
      policyId = result.data.id;
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

// ==================== MENTAL HEALTH ROUTES ====================
async function testMentalHealthRoutes() {
  console.log('\n📋 Testing Mental Health Routes\n'.cyan);

  let therapistId = null;
  let sessionId = null;
  let matchId = null;

  await runTest('GET /api/mental-health/therapists', async () => {
    const result = await makeRequest('GET', '/mental-health/therapists', null, tokens.patient, 200);
    return result.success;
  });

  await runTest('POST /api/mental-health/therapists/profile - Provider creates therapist profile', async () => {
    const result = await makeRequest('POST', '/mental-health/therapists/profile', {
      specialization: 'Cognitive Behavioral Therapy',
      licenseNumber: 'TEST-LICENSE-123',
      yearsOfExperience: 5,
      bio: 'Test therapist bio',
      languages: 'English, Afrikaans',
      availability: 'Weekdays 9-5'
    }, tokens.provider, 201);
    if (result.success && result.data) {
      therapistId = result.data.id;
    }
    return result.success;
  });

  await runTest('GET /api/mental-health/therapists/:id', async () => {
    if (!therapistId) {
      // Try to get any therapist
      const therapistsResult = await makeRequest('GET', '/mental-health/therapists', null, tokens.patient, 200);
      if (therapistsResult.success && therapistsResult.data && therapistsResult.data.length > 0) {
        therapistId = therapistsResult.data[0].id;
      }
    }
    if (therapistId) {
      const result = await makeRequest('GET', `/mental-health/therapists/${therapistId}`, null, tokens.patient, 200);
      return result.success;
    }
    return false;
  });

  await runTest('POST /api/mental-health/sessions', async () => {
    if (!therapistId) {
      const therapistsResult = await makeRequest('GET', '/mental-health/therapists', null, tokens.patient, 200);
      if (therapistsResult.success && therapistsResult.data && therapistsResult.data.length > 0) {
        therapistId = therapistsResult.data[0].id;
      }
    }
    if (therapistId) {
      const result = await makeRequest('POST', '/mental-health/sessions', {
        therapistId: therapistId,
        therapyType: 'TALK_THERAPY',
        sessionDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        duration: 60
      }, tokens.patient, 201);
      if (result.success && result.data) {
        sessionId = result.data.id;
      }
      return result.success;
    }
    return false;
  });

  await runTest('GET /api/mental-health/sessions', async () => {
    const result = await makeRequest('GET', '/mental-health/sessions', null, tokens.patient, 200);
    return result.success;
  });

  if (sessionId) {
    await runTest('PUT /api/mental-health/sessions/:id', async () => {
      const result = await makeRequest('PUT', `/mental-health/sessions/${sessionId}`, {
        notes: 'Test session notes'
      }, tokens.patient, 200);
      return result.success;
    });
  }

  await runTest('POST /api/mental-health/matches', async () => {
    if (!therapistId) {
      const therapistsResult = await makeRequest('GET', '/mental-health/therapists', null, tokens.patient, 200);
      if (therapistsResult.success && therapistsResult.data && therapistsResult.data.length > 0) {
        therapistId = therapistsResult.data[0].id;
      }
    }
    if (therapistId) {
      const result = await makeRequest('POST', '/mental-health/matches', {
        therapistId: therapistId,
        patientPreferences: JSON.stringify({ language: 'English' })
      }, tokens.patient, 201);
      if (result.success && result.data) {
        matchId = result.data.id;
      }
      return result.success;
    }
    return false;
  });

  await runTest('GET /api/mental-health/matches', async () => {
    const result = await makeRequest('GET', '/mental-health/matches', null, tokens.patient, 200);
    return result.success;
  });

  if (matchId) {
    await runTest('PUT /api/mental-health/matches/:id', async () => {
      const result = await makeRequest('PUT', `/mental-health/matches/${matchId}`, {
        status: 'ACCEPTED'
      }, tokens.patient, 200);
      return result.success;
    });
  }
}

// ==================== WEIGHT MANAGEMENT ROUTES ====================
async function testWeightManagementRoutes() {
  console.log('\n📋 Testing Weight Management Routes\n'.cyan);

  let programId = null;
  let entryId = null;

  await runTest('POST /api/weight-management/programs', async () => {
    const result = await makeRequest('POST', '/weight-management/programs', {
      programName: 'Test Weight Program',
      startWeight: 80,
      targetWeight: 70,
      providerId: testUsers.provider?.id
    }, tokens.patient, 201);
    if (result.success && result.data) {
      programId = result.data.id;
    }
    return result.success;
  });

  await runTest('GET /api/weight-management/programs', async () => {
    const result = await makeRequest('GET', '/weight-management/programs', null, tokens.patient, 200);
    return result.success;
  });

  if (programId) {
    await runTest('GET /api/weight-management/programs/:id', async () => {
      const result = await makeRequest('GET', `/weight-management/programs/${programId}`, null, tokens.patient, 200);
      return result.success;
    });

    await runTest('PUT /api/weight-management/programs/:id', async () => {
      const result = await makeRequest('PUT', `/weight-management/programs/${programId}`, {
        targetWeight: 65
      }, tokens.patient, 200);
      return result.success;
    });

    await runTest('GET /api/weight-management/programs/:id/progress', async () => {
      const result = await makeRequest('GET', `/weight-management/programs/${programId}/progress`, null, tokens.patient, 200);
      return result.success;
    });

    await runTest('POST /api/weight-management/entries', async () => {
      const result = await makeRequest('POST', '/weight-management/entries', {
        programId: programId,
        weight: 78,
        notes: 'Test weight entry'
      }, tokens.patient, 201);
      if (result.success && result.data) {
        entryId = result.data.id;
      }
      return result.success;
    });

    await runTest('GET /api/weight-management/entries', async () => {
      const result = await makeRequest('GET', `/weight-management/entries?programId=${programId}`, null, tokens.patient, 200);
      return result.success;
    });
  }
}

// ==================== DIABETES MANAGEMENT ROUTES ====================
async function testDiabetesManagementRoutes() {
  console.log('\n📋 Testing Diabetes Management Routes\n'.cyan);

  let programId = null;

  await runTest('POST /api/diabetes-management/programs', async () => {
    const result = await makeRequest('POST', '/diabetes-management/programs', {
      diabetesType: 'TYPE_2',
      targetGlucoseRange: '80-120',
      providerId: testUsers.provider?.id
    }, tokens.patient, 201);
    if (result.success && result.data) {
      programId = result.data.id;
    }
    return result.success;
  });

  await runTest('GET /api/diabetes-management/programs', async () => {
    const result = await makeRequest('GET', '/diabetes-management/programs', null, tokens.patient, 200);
    return result.success;
  });

  if (programId) {
    await runTest('GET /api/diabetes-management/programs/:id', async () => {
      const result = await makeRequest('GET', `/diabetes-management/programs/${programId}`, null, tokens.patient, 200);
      return result.success;
    });

    await runTest('GET /api/diabetes-management/programs/:id/statistics', async () => {
      const result = await makeRequest('GET', `/diabetes-management/programs/${programId}/statistics`, null, tokens.patient, 200);
      return result.success;
    });

    await runTest('POST /api/diabetes-management/glucose-readings', async () => {
      const result = await makeRequest('POST', '/diabetes-management/glucose-readings', {
        programId: programId,
        glucoseLevel: 100,
        readingType: 'FASTING',
        unit: 'mg/dL'
      }, tokens.patient, 201);
      return result.success;
    });

    await runTest('GET /api/diabetes-management/glucose-readings', async () => {
      const result = await makeRequest('GET', `/diabetes-management/glucose-readings?programId=${programId}`, null, tokens.patient, 200);
      return result.success;
    });

    await runTest('POST /api/diabetes-management/medication-logs', async () => {
      const result = await makeRequest('POST', '/diabetes-management/medication-logs', {
        programId: programId,
        medicationName: 'Metformin',
        dosage: '500mg',
        time: new Date().toISOString(),
        taken: true
      }, tokens.patient, 201);
      return result.success;
    });
  }
}

// ==================== HYPERTENSION MANAGEMENT ROUTES ====================
async function testHypertensionManagementRoutes() {
  console.log('\n📋 Testing Hypertension Management Routes\n'.cyan);

  let programId = null;

  await runTest('POST /api/hypertension-management/programs', async () => {
    const result = await makeRequest('POST', '/hypertension-management/programs', {
      targetBP: JSON.stringify({ systolic: 120, diastolic: 80 }),
      providerId: testUsers.provider?.id
    }, tokens.patient, 201);
    if (result.success && result.data) {
      programId = result.data.id;
    }
    return result.success;
  });

  await runTest('GET /api/hypertension-management/programs', async () => {
    const result = await makeRequest('GET', '/hypertension-management/programs', null, tokens.patient, 200);
    return result.success;
  });

  if (programId) {
    await runTest('GET /api/hypertension-management/programs/:id', async () => {
      const result = await makeRequest('GET', `/hypertension-management/programs/${programId}`, null, tokens.patient, 200);
      return result.success;
    });

    await runTest('GET /api/hypertension-management/programs/:id/statistics', async () => {
      const result = await makeRequest('GET', `/hypertension-management/programs/${programId}/statistics`, null, tokens.patient, 200);
      return result.success;
    });

    await runTest('POST /api/hypertension-management/bp-readings', async () => {
      const result = await makeRequest('POST', '/hypertension-management/bp-readings', {
        programId: programId,
        systolic: 120,
        diastolic: 80,
        heartRate: 72
      }, tokens.patient, 201);
      return result.success;
    });

    await runTest('GET /api/hypertension-management/bp-readings', async () => {
      const result = await makeRequest('GET', `/hypertension-management/bp-readings?programId=${programId}`, null, tokens.patient, 200);
      return result.success;
    });

    await runTest('POST /api/hypertension-management/medication-logs', async () => {
      const result = await makeRequest('POST', '/hypertension-management/medication-logs', {
        programId: programId,
        medicationName: 'Lisinopril',
        dosage: '10mg',
        time: new Date().toISOString(),
        taken: true
      }, tokens.patient, 201);
      return result.success;
    });
  }
}

// ==================== SPECIALTY WELLNESS ROUTES ====================
async function testSpecialtyWellnessRoutes() {
  console.log('\n📋 Testing Specialty Wellness Routes\n'.cyan);

  let consultationId = null;
  let sleepProgramId = null;

  await runTest('POST /api/specialty-wellness/consultations', async () => {
    const result = await makeRequest('POST', '/specialty-wellness/consultations', {
      specialtyType: 'DERMATOLOGY',
      chiefComplaint: 'Test skin condition',
      providerId: testUsers.provider?.id
    }, tokens.patient, 201);
    if (result.success && result.data) {
      consultationId = result.data.id;
    }
    return result.success;
  });

  await runTest('GET /api/specialty-wellness/consultations', async () => {
    const result = await makeRequest('GET', '/specialty-wellness/consultations', null, tokens.patient, 200);
    return result.success;
  });

  if (consultationId) {
    await runTest('GET /api/specialty-wellness/consultations/:id', async () => {
      const result = await makeRequest('GET', `/specialty-wellness/consultations/${consultationId}`, null, tokens.patient, 200);
      return result.success;
    });

    await runTest('PUT /api/specialty-wellness/consultations/:id - Provider update', async () => {
      const result = await makeRequest('PUT', `/specialty-wellness/consultations/${consultationId}`, {
        diagnosis: 'Test diagnosis',
        status: 'COMPLETED'
      }, tokens.provider, 200);
      return result.success;
    });
  }

  await runTest('POST /api/specialty-wellness/sleep/programs', async () => {
    const result = await makeRequest('POST', '/specialty-wellness/sleep/programs', {
      programName: 'Test Sleep Program',
      targetSleepHours: 8,
      providerId: testUsers.provider?.id
    }, tokens.patient, 201);
    if (result.success && result.data) {
      sleepProgramId = result.data.id;
    }
    return result.success;
  });

  await runTest('GET /api/specialty-wellness/sleep/programs', async () => {
    const result = await makeRequest('GET', '/specialty-wellness/sleep/programs', null, tokens.patient, 200);
    return result.success;
  });

  if (sleepProgramId) {
    await runTest('GET /api/specialty-wellness/sleep/programs/:id', async () => {
      const result = await makeRequest('GET', `/specialty-wellness/sleep/programs/${sleepProgramId}`, null, tokens.patient, 200);
      return result.success;
    });

    await runTest('GET /api/specialty-wellness/sleep/programs/:id/statistics', async () => {
      const result = await makeRequest('GET', `/specialty-wellness/sleep/programs/${sleepProgramId}/statistics`, null, tokens.patient, 200);
      return result.success;
    });

    await runTest('POST /api/specialty-wellness/sleep/logs', async () => {
      const result = await makeRequest('POST', '/specialty-wellness/sleep/logs', {
        programId: sleepProgramId,
        sleepDate: new Date().toISOString().split('T')[0], // Today's date
        sleepDuration: 7.5,
        sleepQuality: 4
      }, tokens.patient, 201);
      return result.success;
    });

    await runTest('GET /api/specialty-wellness/sleep/logs', async () => {
      const result = await makeRequest('GET', `/specialty-wellness/sleep/logs?programId=${sleepProgramId}`, null, tokens.patient, 200);
      return result.success;
    });
  }
}

// ==================== PRIMARY CARE ROUTES ====================
async function testPrimaryCareRoutes() {
  console.log('\n📋 Testing Primary Care Routes\n'.cyan);

  let recordId = null;

  await runTest('POST /api/primary-care/records', async () => {
    const result = await makeRequest('POST', '/primary-care/records', {
      providerId: testUsers.provider?.id,
      visitType: 'ROUTINE',
      chiefComplaint: 'Test complaint'
    }, tokens.patient, 201);
    if (result.success && result.data) {
      recordId = result.data.id;
    }
    return result.success;
  });

  await runTest('GET /api/primary-care/records', async () => {
    const result = await makeRequest('GET', '/primary-care/records', null, tokens.patient, 200);
    return result.success;
  });

  if (recordId) {
    await runTest('GET /api/primary-care/records/:id', async () => {
      const result = await makeRequest('GET', `/primary-care/records/${recordId}`, null, tokens.patient, 200);
      return result.success;
    });

    await runTest('PUT /api/primary-care/records/:id - Provider only', async () => {
      const result = await makeRequest('PUT', `/primary-care/records/${recordId}`, {
        assessment: 'Test assessment',
        plan: JSON.stringify({ followUp: 'In 2 weeks' })
      }, tokens.provider, 200);
      return result.success;
    });
  }

  await runTest('GET /api/primary-care/summary', async () => {
    const result = await makeRequest('GET', '/primary-care/summary', null, tokens.patient, 200);
    return result.success;
  });
}

// ==================== URGENT CARE ROUTES ====================
async function testUrgentCareRoutes() {
  console.log('\n📋 Testing Urgent Care Routes\n'.cyan);

  let requestId = null;

  await runTest('POST /api/urgent-care/requests', async () => {
    const result = await makeRequest('POST', '/urgent-care/requests', {
      symptoms: JSON.stringify(['fever', 'cough']),
      urgency: 'HIGH',
      description: 'Test urgent care request'
    }, tokens.patient, 201);
    if (result.success && result.data) {
      requestId = result.data.id;
    }
    return result.success;
  });

  await runTest('GET /api/urgent-care/requests', async () => {
    const result = await makeRequest('GET', '/urgent-care/requests', null, tokens.patient, 200);
    return result.success;
  });

  await runTest('GET /api/urgent-care/requests/all - Provider/Admin only', async () => {
    const result = await makeRequest('GET', '/urgent-care/requests/all', null, tokens.provider, 200);
    return result.success;
  });

  if (requestId) {
    await runTest('GET /api/urgent-care/requests/:id', async () => {
      const result = await makeRequest('GET', `/urgent-care/requests/${requestId}`, null, tokens.patient, 200);
      return result.success;
    });

    await runTest('PUT /api/urgent-care/requests/:id - Provider update', async () => {
      const result = await makeRequest('PUT', `/urgent-care/requests/${requestId}`, {
        providerId: testUsers.provider?.id,
        status: 'ASSIGNED'
      }, tokens.provider, 200);
      return result.success;
    });
  }

  await runTest('GET /api/urgent-care/statistics - Admin only', async () => {
    const result = await makeRequest('GET', '/urgent-care/statistics', null, tokens.admin, 200);
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
    return result.success && result.data && result.data.user && result.data.user.role === 'ADMIN';
  });

  await runTest('GET /api/auth/profile - Patient', async () => {
    const result = await makeRequest('GET', '/auth/profile', null, tokens.patient, 200);
    return result.success && result.data && result.data.user && result.data.user.role === 'PATIENT';
  });

  await runTest('GET /api/auth/profile - Provider', async () => {
    const result = await makeRequest('GET', '/auth/profile', null, tokens.provider, 200);
    return result.success && result.data && result.data.user && result.data.user.role === 'HEALTHCARE_PROVIDER';
  });

  await runTest('GET /api/auth/profile - Wellness Coach', async () => {
    const result = await makeRequest('GET', '/auth/profile', null, tokens.wellnessCoach, 200);
    return result.success && result.data && result.data.user && result.data.user.role === 'WELLNESS_COACH';
  });

  await runTest('GET /api/auth/profile - Student', async () => {
    const result = await makeRequest('GET', '/auth/profile', null, tokens.student, 200);
    return result.success && result.data && result.data.user && result.data.user.role === 'STUDENT';
  });
}

// Check API connectivity
async function checkAPIConnectivity() {
  try {
    const result = await makeRequest('GET', '/health', null, null, 200);
    
    // Check if we got a connection error
    if (result.status === 0 || result.error?.includes('Connection refused') || result.error?.includes('ECONNREFUSED')) {
      console.log(`❌ Cannot connect to API server at ${BASE_URL}\n`.red);
      console.log('   The server is not running or not accessible.\n'.gray);
      console.log('   Please start the server:\n'.gray);
      console.log('   - Development: cd backend && npm run dev\n'.gray);
      console.log('   - Docker: docker-compose up --profile local\n'.gray);
      console.log('   - Production: docker-compose up --profile production\n'.gray);
      return false;
    }
    
    // Check if we got a successful response with correct format
    if (result.success && result.data) {
      if (result.data.status === 'ok') {
        console.log('✅ API server is accessible and healthy\n'.green);
        return true;
      } else {
        // Server responded but format is unexpected
        console.log('⚠️  API server responded but health check format is unexpected\n'.yellow);
        console.log(`   Expected: { status: 'ok', ... }\n`.gray);
        console.log(`   Received: ${JSON.stringify(result.data)}\n`.gray);
        console.log('   Continuing with tests anyway...\n'.yellow);
        return true; // Still allow tests to run
      }
    } else {
      // Got a response but status code doesn't match
      console.log('⚠️  API server responded but with unexpected status\n'.yellow);
      console.log(`   Status Code: ${result.status}\n`.gray);
      if (result.data) {
        console.log(`   Response: ${JSON.stringify(result.data)}\n`.gray);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}\n`.gray);
      }
      console.log('   Continuing with tests anyway...\n'.yellow);
      return true; // Still allow tests to run
    }
  } catch (error) {
    console.log(`❌ Error checking API connectivity: ${error.message}\n`.red);
    console.log(`   Please ensure the server is running at ${BASE_URL}\n`.gray);
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
    await testMentalHealthRoutes();
    await testWeightManagementRoutes();
    await testDiabetesManagementRoutes();
    await testHypertensionManagementRoutes();
    await testSpecialtyWellnessRoutes();
    await testPrimaryCareRoutes();
    await testUrgentCareRoutes();
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

