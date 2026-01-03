/**
 * Schema Validation Utility
 * Uses ajv for JSON schema validation
 */

const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

/**
 * Validate response data against a JSON schema
 * @param {Object} data - The data to validate
 * @param {Object} schema - JSON schema object
 * @returns {Object} - { valid: boolean, errors: Array }
 */
function validateSchema(data, schema) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  
  return {
    valid,
    errors: validate.errors || []
  };
}

/**
 * Common response schemas for API endpoints
 */
const schemas = {
  user: {
    type: 'object',
    required: ['id', 'email', 'firstName', 'lastName', 'role'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      email: { type: 'string', format: 'email' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      role: { 
        type: 'string',
        enum: ['ADMIN', 'PATIENT', 'HEALTHCARE_PROVIDER', 'WELLNESS_COACH', 'STUDENT']
      },
      phone: { type: ['string', 'null'] },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },
  
  authResponse: {
    type: 'object',
    required: ['token', 'user'],
    properties: {
      token: { type: 'string' },
      user: {
        type: 'object',
        required: ['id', 'email', 'firstName', 'lastName', 'role'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { 
            type: 'string',
            enum: ['ADMIN', 'PATIENT', 'HEALTHCARE_PROVIDER', 'WELLNESS_COACH', 'STUDENT']
          }
        }
      }
    }
  },
  
  payment: {
    type: 'object',
    required: ['id', 'amount', 'currency', 'status', 'method'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      amount: { type: 'number', minimum: 0 },
      currency: { type: 'string', enum: ['NAD', 'USD', 'ZAR'] },
      status: { 
        type: 'string',
        enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']
      },
      method: { type: 'string' },
      paymentReference: { type: ['string', 'null'] },
      transactionId: { type: ['string', 'null'] }
    }
  },
  
  survey: {
    type: 'object',
    required: ['id', 'title', 'status', 'surveyType', 'questions'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      title: { type: 'string' },
      description: { type: ['string', 'null'] },
      status: { 
        type: 'string',
        enum: ['DRAFT', 'ACTIVE', 'CLOSED']
      },
      surveyType: { type: 'string' },
      questions: { type: 'array' },
      isAnonymous: { type: 'boolean' }
    }
  },
  
  appointment: {
    type: 'object',
    required: ['id', 'patientId', 'providerId', 'status', 'appointmentDate'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      providerId: { type: 'string', format: 'uuid' },
      status: { type: 'string' },
      appointmentDate: { type: 'string', format: 'date-time' }
    }
  },
  
  apiResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      data: {}
    }
  }
};

module.exports = {
  validateSchema,
  schemas
};

