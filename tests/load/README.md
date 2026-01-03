# Load Testing Scripts

This directory contains load testing scripts for HealthBridge Namibia.

## Prerequisites

Install k6:
- **Windows:** `choco install k6` or download from https://k6.io/docs/getting-started/installation/
- **macOS:** `brew install k6`
- **Linux:** Follow instructions at https://k6.io/docs/getting-started/installation/

## Running Load Tests

### Basic Load Test

```bash
k6 run load-test.js
```

### With Custom API URL

```bash
k6 run --env API_URL=http://localhost:5000/api load-test.js
```

### With Custom Load Profile

Edit `load-test.js` to modify the `options.stages` configuration.

## Test Scenarios

1. **Health Check:** Tests API availability
2. **User Registration:** Tests user registration endpoint
3. **User Login:** Tests authentication
4. **Authenticated Requests:** Tests protected endpoints

## Metrics

The load test measures:
- Response time (p50, p95, p99)
- Error rate
- Request rate
- Throughput

## Results

Results are saved to `load-test-results.json` after each run.

## Continuous Load Testing

For CI/CD integration, add to your pipeline:

```yaml
- name: Run Load Tests
  run: k6 run tests/load/load-test.js
```

