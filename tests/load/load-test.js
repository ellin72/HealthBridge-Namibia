/**
 * Load Testing Scripts for HealthBridge
 * Uses k6 for load testing (install: https://k6.io/docs/getting-started/installation/)
 * 
 * Run with: k6 run load-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% of requests < 500ms, 99% < 1s
    http_req_failed: ['rate<0.01'], // Error rate < 1%
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:5000/api';

export default function () {
  // Health check
  let res = http.get(`${BASE_URL}/health`);
  check(res, {
    'health check status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);
  responseTime.add(res.timings.duration);
  sleep(1);

  // Simulate user registration
  const registerData = JSON.stringify({
    email: `test${Date.now()}@example.com`,
    password: 'Test123!@#',
    firstName: 'Test',
    lastName: 'User',
    role: 'PATIENT'
  });

  res = http.post(`${BASE_URL}/auth/register`, registerData, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, {
    'registration status is 201': (r) => r.status === 201,
  }) || errorRate.add(1);
  responseTime.add(res.timings.duration);
  sleep(1);

  // Simulate login
  const loginData = JSON.stringify({
    email: 'test@example.com',
    password: 'Test123!@#'
  });

  res = http.post(`${BASE_URL}/auth/login`, loginData, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, {
    'login status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);
  responseTime.add(res.timings.duration);
  
  const token = res.json('token');
  sleep(1);

  // Simulate authenticated requests
  if (token) {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Get user profile
    res = http.get(`${BASE_URL}/users/me`, { headers });
    check(res, {
      'get profile status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    responseTime.add(res.timings.duration);
    sleep(1);

    // Get appointments
    res = http.get(`${BASE_URL}/appointments`, { headers });
    check(res, {
      'get appointments status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    responseTime.add(res.timings.duration);
    sleep(1);
  }
}

export function handleSummary(data) {
  return {
    'stdout': JSON.stringify(data, null, 2),
    'load-test-results.json': JSON.stringify(data, null, 2),
  };
}

