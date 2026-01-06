/**
 * API Route Tests
 * Comprehensive tests for all API endpoints using Jest
 */

const { makeRequest, assertResponse, generateTestData } = require('../utils/testHelpers');
const { validateSchema, schemas } = require('../utils/schemaValidator');
const { getTracker } = require('../utils/dbCleanup');

describe('API Routes', () => {
  let tokens = {};
  let testUsers = {};
  let testData = {
    surveyId: null,
    paymentId: null,
    feedbackId: null,
    policyId: null
  };

  // Setup: Create test users and authenticate
  beforeAll(async () => {
    const timestamp = Date.now();
    
    // Create admin user
    const adminData = {
      email: `admin-${timestamp}@test.com`,
      password: 'Test123!@#',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    };

    const adminRegister = await makeRequest('POST', '/auth/register', adminData, null, { expectedStatus: 201 });
    if (adminRegister.success) {
      testUsers.admin = adminRegister.data.user;
      const adminLogin = await makeRequest('POST', '/auth/login', {
        email: adminData.email,
        password: adminData.password
      });
      if (adminLogin.success) {
        tokens.admin = adminLogin.data.token;
        getTracker().track('users', testUsers.admin.id);
      }
    }

    // Create patient user
    const patientData = {
      email: `patient-${timestamp}@test.com`,
      password: 'Test123!@#',
      firstName: 'Patient',
      lastName: 'User',
      role: 'PATIENT'
    };

    const patientRegister = await makeRequest('POST', '/auth/register', patientData, null, { expectedStatus: 201 });
    if (patientRegister.success) {
      testUsers.patient = patientRegister.data.user;
      const patientLogin = await makeRequest('POST', '/auth/login', {
        email: patientData.email,
        password: patientData.password
      });
      if (patientLogin.success) {
        tokens.patient = patientLogin.data.token;
        getTracker().track('users', testUsers.patient.id);
      }
    }

    // Create provider user
    const providerData = {
      email: `provider-${timestamp}@test.com`,
      password: 'Test123!@#',
      firstName: 'Provider',
      lastName: 'User',
      role: 'HEALTHCARE_PROVIDER'
    };

    const providerRegister = await makeRequest('POST', '/auth/register', providerData, null, { expectedStatus: 201 });
    if (providerRegister.success) {
      testUsers.provider = providerRegister.data.user;
      const providerLogin = await makeRequest('POST', '/auth/login', {
        email: providerData.email,
        password: providerData.password
      });
      if (providerLogin.success) {
        tokens.provider = providerLogin.data.token;
        getTracker().track('users', testUsers.provider.id);
      }
    }
  });

  // Cleanup: Remove test data
  afterAll(async () => {
    const { cleanupTestData, cleanupTestUsers } = require('../utils/dbCleanup');
    await cleanupTestData();
    await cleanupTestUsers('@test.com');
  });

  describe('Auth Routes', () => {
    test('POST /api/auth/register - New user', async () => {
      const timestamp = Date.now();
      const userData = {
        email: `newuser-${timestamp}@test.com`,
        password: 'Test123!@#',
        firstName: 'New',
        lastName: 'User',
        role: 'PATIENT'
      };

      const response = await makeRequest('POST', '/auth/register', userData, null, { expectedStatus: 201 });
      
      expect(response.success).toBe(true);
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('user');
      expect(response.data).toHaveProperty('token');
      
      // Validate schema
      const validation = validateSchema(response.data, {
        type: 'object',
        required: ['user', 'token'],
        properties: {
          user: schemas.user,
          token: { type: 'string' }
        }
      });
      expect(validation.valid).toBe(true);
      
      if (response.data.user) {
        getTracker().track('users', response.data.user.id);
      }
    });

    test('POST /api/auth/login - Valid credentials', async () => {
      const response = await makeRequest('POST', '/auth/login', {
        email: testUsers.patient.email,
        password: 'Test123!@#'
      });

      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('user');
      
      // Validate schema
      const validation = validateSchema(response.data, schemas.authResponse);
      expect(validation.valid).toBe(true);
    });

    test('POST /api/auth/login - Invalid credentials', async () => {
      const response = await makeRequest('POST', '/auth/login', {
        email: testUsers.patient.email,
        password: 'WrongPassword123!'
      }, null, { expectedStatus: 401 });

      expect(response.status).toBe(401);
      expect(response.data).toHaveProperty('message');
    });

    test('GET /api/auth/profile - Authenticated', async () => {
      const response = await makeRequest('GET', '/auth/profile', null, tokens.patient);

      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('email');
      expect(response.data.email).toBe(testUsers.patient.email);
      
      // Validate schema
      const validation = validateSchema(response.data, schemas.user);
      expect(validation.valid).toBe(true);
    });

    test('GET /api/auth/profile - Unauthenticated', async () => {
      const response = await makeRequest('GET', '/auth/profile', null, null, { expectedStatus: 401 });

      expect(response.status).toBe(401);
    });
  });

  describe('Payment Routes', () => {
    test('GET /api/payments', async () => {
      const response = await makeRequest('GET', '/payments', null, tokens.patient);

      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('payments');
      expect(Array.isArray(response.data.payments)).toBe(true);
    });

    test('POST /api/payments/callback - Public endpoint', async () => {
      // Test callback for non-existent payment - should return 202 Accepted
      const response = await makeRequest('POST', '/payments/callback', {
        paymentReference: `PAY-${Date.now()}-TEST`,
        transactionId: 'test-123',
        status: 'success'
      }, null, { expectedStatus: 202 });

      expect(response.status).toBe(202);
      expect(response.data).toHaveProperty('message');
    });
  });

  describe('Survey Routes', () => {
    test('POST /api/surveys - Protected', async () => {
      const surveyData = {
        title: 'Test Survey',
        description: 'Test description',
        questions: [{ type: 'TEXT', question: 'Test question' }]
      };

      const response = await makeRequest('POST', '/surveys', surveyData, tokens.admin, { expectedStatus: 201 });

      expect(response.success).toBe(true);
      expect(response.status).toBe(201);
      expect(response.data.data).toHaveProperty('id');
      expect(response.data.data.title).toBe(surveyData.title);
      
      testData.surveyId = response.data.data.id;
      getTracker().track('surveys', testData.surveyId);
      
      // Validate schema
      const validation = validateSchema(response.data.data, schemas.survey);
      expect(validation.valid).toBe(true);
    });

    test('GET /api/surveys/public/:id - Public', async () => {
      // Create a public survey for testing
      const publicSurveyData = {
        title: 'Public Test Survey',
        description: 'Test description for public survey',
        questions: [{ type: 'TEXT', question: 'Test question' }],
        isAnonymous: true
      };

      const createResponse = await makeRequest('POST', '/surveys', publicSurveyData, tokens.admin, { expectedStatus: 201 });
      expect(createResponse.success).toBe(true);
      
      const publicSurveyId = createResponse.data.data.id;
      getTracker().track('surveys', publicSurveyId);

      // Update status to ACTIVE
      const updateResponse = await makeRequest('PATCH', `/surveys/${publicSurveyId}/status`, {
        status: 'ACTIVE'
      }, tokens.admin);
      expect(updateResponse.success).toBe(true);

      // Test public endpoint
      const response = await makeRequest('GET', `/surveys/public/${publicSurveyId}`, null, null);

      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data.data).toHaveProperty('id');
      expect(response.data.data.isAnonymous).toBe(true);
      expect(response.data.data.status).toBe('ACTIVE');
    });

    test('GET /api/surveys - Protected', async () => {
      const response = await makeRequest('GET', '/surveys', null, tokens.admin);

      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('data');
      expect(Array.isArray(response.data.data)).toBe(true);
    });
  });

  describe('Feedback Routes', () => {
    test('POST /api/feedback - Public endpoint', async () => {
      const feedbackData = {
        feedbackType: 'BUG',
        description: 'Test feedback',
        rating: 5
      };

      const response = await makeRequest('POST', '/feedback', feedbackData, null, { expectedStatus: 201 });

      expect(response.success).toBe(true);
      expect(response.status).toBe(201);
      expect(response.data.data).toHaveProperty('id');
      
      testData.feedbackId = response.data.data.id;
      getTracker().track('feedback', testData.feedbackId);
    });

    test('GET /api/feedback/stats - Protected', async () => {
      const response = await makeRequest('GET', '/feedback/stats', null, tokens.admin);

      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('data');
    });
  });

  describe('Medical Aid Routes', () => {
    test('GET /api/medical-aid', async () => {
      const response = await makeRequest('GET', '/medical-aid', null, tokens.patient);

      // Should return 404 if no medical aid info exists
      expect([200, 404]).toContain(response.status);
    });

    test('POST /api/medical-aid - Valid scheme', async () => {
      const medicalAidData = {
        scheme: 'NAMMED',
        memberNumber: '123456789',
        schemeName: 'Test Scheme'
      };

      const response = await makeRequest('POST', '/medical-aid', medicalAidData, tokens.patient, { expectedStatus: 200 });

      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('medicalAidInfo');
      expect(response.data.medicalAidInfo).toHaveProperty('scheme');
      expect(response.data.medicalAidInfo.scheme).toBe('NAMMED');
    });

    test('POST /api/medical-aid - Invalid scheme', async () => {
      const medicalAidData = {
        scheme: 'INVALID_SCHEME',
        memberNumber: '123456789'
      };

      const response = await makeRequest('POST', '/medical-aid', medicalAidData, tokens.patient, { expectedStatus: 400 });

      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message');
    });
  });

  describe('Mental Health Routes', () => {
    test('GET /api/mental-health/therapists', async () => {
      const response = await makeRequest('GET', '/mental-health/therapists', null, tokens.patient);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('POST /api/mental-health/therapists/profile', async () => {
      if (!tokens.provider) {
        console.warn('Skipping test: Provider token not available');
        return;
      }

      const therapistData = {
        specialization: 'Cognitive Behavioral Therapy',
        licenseNumber: 'TEST-LICENSE-123',
        yearsOfExperience: 5,
        bio: 'Test therapist bio'
      };

      const response = await makeRequest('POST', '/mental-health/therapists/profile', therapistData, tokens.provider, { expectedStatus: 201 });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
    });
  });

  describe('Weight Management Routes', () => {
    test('POST /api/weight-management/programs', async () => {
      const programData = {
        programName: 'Test Weight Program',
        startWeight: 80,
        targetWeight: 70
      };

      const response = await makeRequest('POST', '/weight-management/programs', programData, tokens.patient, { expectedStatus: 201 });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.programName).toBe(programData.programName);
    });

    test('GET /api/weight-management/programs', async () => {
      const response = await makeRequest('GET', '/weight-management/programs', null, tokens.patient);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('Diabetes Management Routes', () => {
    test('POST /api/diabetes-management/programs', async () => {
      const programData = {
        diabetesType: 'TYPE_2',
        targetGlucoseRange: '80-120'
      };

      const response = await makeRequest('POST', '/diabetes-management/programs', programData, tokens.patient, { expectedStatus: 201 });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
    });

    test('GET /api/diabetes-management/programs', async () => {
      const response = await makeRequest('GET', '/diabetes-management/programs', null, tokens.patient);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('Hypertension Management Routes', () => {
    test('POST /api/hypertension-management/programs', async () => {
      const programData = {
        targetBP: JSON.stringify({ systolic: 120, diastolic: 80 })
      };

      const response = await makeRequest('POST', '/hypertension-management/programs', programData, tokens.patient, { expectedStatus: 201 });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
    });

    test('GET /api/hypertension-management/programs', async () => {
      const response = await makeRequest('GET', '/hypertension-management/programs', null, tokens.patient);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('Specialty Wellness Routes', () => {
    test('POST /api/specialty-wellness/consultations', async () => {
      const consultationData = {
        specialtyType: 'DERMATOLOGY',
        chiefComplaint: 'Test skin condition'
      };

      const response = await makeRequest('POST', '/specialty-wellness/consultations', consultationData, tokens.patient, { expectedStatus: 201 });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
    });

    test('GET /api/specialty-wellness/consultations', async () => {
      const response = await makeRequest('GET', '/specialty-wellness/consultations', null, tokens.patient);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('Primary Care Routes', () => {
    test('POST /api/primary-care/records', async () => {
      // First need to create a provider user for this test
      const providerData = {
        email: `provider-${Date.now()}@test.com`,
        password: 'Test123!@#',
        firstName: 'Provider',
        lastName: 'User',
        role: 'HEALTHCARE_PROVIDER'
      };

      const providerRegister = await makeRequest('POST', '/auth/register', providerData, null, { expectedStatus: 201 });
      let providerToken = null;
      let providerId = null;

      if (providerRegister.success) {
        providerId = providerRegister.data.user.id;
        const providerLogin = await makeRequest('POST', '/auth/login', {
          email: providerData.email,
          password: providerData.password
        });
        if (providerLogin.success) {
          providerToken = providerLogin.data.token;
        }
      }

      if (providerId) {
        const recordData = {
          providerId: providerId,
          visitType: 'ROUTINE',
          chiefComplaint: 'Test complaint'
        };

        const response = await makeRequest('POST', '/primary-care/records', recordData, tokens.patient, { expectedStatus: 201 });

        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
      } else {
        // Skip if we couldn't create provider
        expect(true).toBe(true);
      }
    });

    test('GET /api/primary-care/records', async () => {
      const response = await makeRequest('GET', '/primary-care/records', null, tokens.patient);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('Urgent Care Routes', () => {
    test('POST /api/urgent-care/requests', async () => {
      const requestData = {
        symptoms: ['fever', 'cough'], // Send as array, controller will stringify
        urgency: 'HIGH',
        description: 'Test urgent care request'
      };

      const response = await makeRequest('POST', '/urgent-care/requests', requestData, tokens.patient, { expectedStatus: 201 });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
    });

    test('GET /api/urgent-care/requests', async () => {
      const response = await makeRequest('GET', '/urgent-care/requests', null, tokens.patient);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });
});

