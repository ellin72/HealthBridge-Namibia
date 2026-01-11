# CI/CD Setup Guide

This document explains how the CI/CD pipeline is configured and how to ensure the server starts before running tests.

## Overview

The CI/CD pipeline uses GitHub Actions and includes the following jobs:

1. **Quality Checks** - Linting and type checking
2. **Security Scanning** - Security vulnerability scanning
3. **Tests** - Integration tests with server startup
4. **Build** - Application build
5. **Deploy** - Deployment to staging/production

## Test Job Configuration

The test job is configured to:

1. **Set up PostgreSQL service** - Creates a test database automatically
2. **Install dependencies** - Installs npm packages
3. **Generate Prisma Client** - Generates Prisma client for database access
4. **Run database migrations** - Applies schema to test database
5. **Build backend** - Compiles TypeScript to JavaScript
6. **Start server** - Starts the backend server in the background
7. **Wait for readiness** - Waits for server to respond to health check
8. **Run tests** - Executes the test suite
9. **Stop server** - Cleans up by stopping the server

## Server Startup Process

The server startup follows these steps:

```yaml
- name: Start backend server and wait for readiness
  run: |
    cd backend
    export DATABASE_URL="postgresql://healthbridge:healthbridge123@localhost:5432/healthbridge_test?schema=public"
    # Start server in background with nohup to prevent termination when step ends
    nohup npm start > /tmp/backend.log 2>&1 &
    echo $! > /tmp/backend.pid
    # Wait for server to be ready (check /api/health endpoint)
    echo "Waiting for server to start..."
    timeout 60 bash -c 'until curl -f http://localhost:5000/api/health > /dev/null 2>&1; do sleep 2; echo "Waiting..."; done'
    echo "Server is ready!"
    # Show server logs for debugging
    tail -n 20 /tmp/backend.log || true
```

### Key Points:

- **Background Process**: Server runs in background using `nohup` and `&`
- **Process ID Tracking**: PID is saved to `/tmp/backend.pid` for cleanup
- **Health Check**: Waits for `/api/health` endpoint to respond
- **Timeout**: Maximum 60 seconds wait time
- **Logging**: Server logs are captured for debugging

## Environment Variables

The test job sets these environment variables:

```yaml
env:
  DATABASE_URL: postgresql://healthbridge:healthbridge123@localhost:5432/healthbridge_test?schema=public
  TEST_DATABASE_URL: postgresql://healthbridge:healthbridge123@localhost:5432/healthbridge_test?schema=public
  API_URL: http://localhost:5000/api
  JWT_SECRET: test-secret-key-for-ci
  NODE_ENV: test
  PORT: 5000
```

## Database Setup

The PostgreSQL service is automatically configured:

```yaml
services:
  postgres:
    image: postgres:14
    env:
      POSTGRES_USER: healthbridge
      POSTGRES_PASSWORD: healthbridge123
      POSTGRES_DB: healthbridge_test
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
    ports:
      - 5432:5432
```

The database is automatically created when the service starts.

## Running Tests Locally

To replicate the CI/CD environment locally:

```bash
# 1. Start PostgreSQL (if not running)
# Using Docker:
docker run -d \
  --name postgres-test \
  -e POSTGRES_USER=healthbridge \
  -e POSTGRES_PASSWORD=healthbridge123 \
  -e POSTGRES_DB=healthbridge_test \
  -p 5432:5432 \
  postgres:14

# 2. Set up database
cd backend
export DATABASE_URL="postgresql://healthbridge:healthbridge123@localhost:5432/healthbridge_test?schema=public"
npx prisma migrate deploy || npx prisma db push --accept-data-loss

# 3. Build backend
npm run build

# 4. Start server in background
export DATABASE_URL="postgresql://healthbridge:healthbridge123@localhost:5432/healthbridge_test?schema=public"
export PORT=5000
export JWT_SECRET=test-secret-key
export NODE_ENV=test
nohup npm start > /tmp/backend.log 2>&1 &
echo $! > /tmp/backend.pid

# 5. Wait for server
until curl -f http://localhost:5000/api/health; do sleep 2; done

# 6. Run tests
cd ..
export DATABASE_URL="postgresql://healthbridge:healthbridge123@localhost:5432/healthbridge_test?schema=public"
export API_URL="http://localhost:5000/api"
npm test

# 7. Stop server
kill $(cat /tmp/backend.pid)
rm /tmp/backend.pid
```

## Troubleshooting

### Server doesn't start

- Check server logs: `cat /tmp/backend.log`
- Verify database connection
- Check if port 5000 is available
- Ensure all environment variables are set

### Tests fail with connection refused

- Verify server is running: `curl http://localhost:5000/api/health`
- Check `API_URL` environment variable
- Ensure server started before tests run
- Check server logs for errors

### Database connection errors

- Verify PostgreSQL service is running
- Check `DATABASE_URL` is correct
- Ensure migrations ran successfully
- Verify database exists: `psql -U healthbridge -d healthbridge_test -c "\dt"`

## CI/CD Workflow File

The complete workflow is defined in `.github/workflows/ci-cd.yml`.

## Best Practices

1. **Always use `if: always()`** for cleanup steps to ensure server stops even if tests fail
2. **Capture server logs** for debugging failed tests
3. **Use health check endpoint** to verify server readiness
4. **Set appropriate timeouts** to prevent hanging builds
5. **Use environment variables** for configuration instead of hardcoding
6. **Clean up resources** in `if: always()` blocks

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
