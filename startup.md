# HealthBridge Namibia - Startup Guide

This guide will help you get the HealthBridge Namibia project up and running from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Mobile Setup (Optional)](#mobile-setup-optional)
7. [Running the Application](#running-the-application)
8. [Verification](#verification)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version` and `npm --version`

2. **Docker Desktop**
   - Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
   - Required for PostgreSQL database
   - Verify: `docker --version` and `docker-compose --version`

3. **Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify: `git --version`

### Optional (for Mobile Development)

4. **Expo CLI** (for mobile app)
   - Install: `npm install -g expo-cli`
   - Verify: `expo --version`

5. **VS Code** (recommended IDE)
   - Download from [code.visualstudio.com](https://code.visualstudio.com/)

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd HealthBridge-Namibia
```

### 2. Verify Project Structure

You should see the following structure:

```
HealthBridge-Namibia/
├── backend/          # Node.js/Express API
├── frontend/         # React web application
├── mobile/           # React Native mobile app
├── docs/             # Documentation
├── docker-compose.yml
└── README.md
```

## Database Setup

### Option 1: Docker (Recommended)

The easiest way to set up the database is using Docker:

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Verify it's running
docker-compose ps
```

The database will be available at:
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `healthbridge`
- **Username**: `healthbridge`
- **Password**: `healthbridge123`

### Option 2: Local PostgreSQL

If you prefer a local PostgreSQL installation:

1. Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
2. Create a database:
   ```sql
   CREATE DATABASE healthbridge;
   CREATE USER healthbridge WITH PASSWORD 'healthbridge123';
   GRANT ALL PRIVILEGES ON DATABASE healthbridge TO healthbridge;
   ```

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL="postgresql://healthbridge:healthbridge123@localhost:5432/healthbridge?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Mobile URL (for CORS)
MOBILE_URL=http://localhost:8081

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### 4. Run Database Migrations

**Windows (PowerShell):**
```powershell
npm run migrate:docker
```

**Linux/Mac:**
```bash
npm run migrate:docker
```

Or manually:
```bash
# From project root
docker-compose exec backend sh -c "cd /app; npx prisma db push"
```

### 5. Seed Database (Optional)

To populate the database with sample data:

**Windows:**
```powershell
npm run seed:docker
```

**Linux/Mac:**
```bash
npm run seed:docker
```

### 6. Start Backend Server

**Option A: Docker (Recommended for Windows)**
```bash
# From project root
docker-compose up -d backend
# Or from backend directory
npm run dev:docker
```

**Option B: Local Development**
```bash
npm run dev
```

The backend API will be available at: `http://localhost:5000`

### 7. Verify Backend

- Check logs: `docker-compose logs backend` (if using Docker)
- Test endpoint: `http://localhost:5000/api/health` (if implemented)
- API documentation: `http://localhost:5000/api/docs` (if implemented)

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Server

```bash
npm run dev
```

The frontend will be available at: `http://localhost:3000`

### 5. Verify Frontend

- Open browser: `http://localhost:3000`
- You should see the HealthBridge landing page
- Try registering a new user

## Mobile Setup (Optional)

### 1. Navigate to Mobile Directory

```bash
cd mobile
```

### 2. Install Dependencies

```bash
npm install
npx expo install --fix
```

### 3. Configure API URL

Update `mobile/src/services/api.ts` with your backend URL:
```typescript
const API_URL = 'http://localhost:5000/api';
```

### 4. Start Expo Development Server

```bash
npm start
```

### 5. Run on Device

- Install Expo Go app on your phone
- Scan the QR code from the terminal
- Or press `i` for iOS simulator, `a` for Android emulator

## Running the Application

### Complete Startup Sequence

1. **Start Database:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Start Backend:**
   ```bash
   cd backend
   npm run dev:docker  # or npm run dev
   ```

3. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Start Mobile (Optional):**
   ```bash
   cd mobile
   npm start
   ```

### Using Docker Compose (All Services)

From the project root:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Verification

### 1. Check All Services

```bash
# Check Docker containers
docker-compose ps

# Should show:
# - healthbridge-db (postgres) - Running
# - healthbridge-api (backend) - Running
# - healthbridge-web (frontend) - Running (if using Docker)
```

### 2. Test Backend API

```bash
# Test health endpoint (if available)
curl http://localhost:5000/api/health

# Test registration endpoint
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","firstName":"Test","lastName":"User","role":"PATIENT"}'
```

### 3. Test Frontend

- Open `http://localhost:3000`
- Register a new account
- Login with your credentials
- Navigate through the dashboard

### 4. Test Database Connection

```bash
# Using Prisma Studio
cd backend
npx prisma studio

# Or using Docker
docker-compose exec backend npx prisma studio
```

Prisma Studio will open at `http://localhost:5555`

## Troubleshooting

### Database Connection Issues

**Problem**: Cannot connect to database

**Solutions**:
1. Verify PostgreSQL is running:
   ```bash
   docker-compose ps postgres
   ```

2. Check database logs:
   ```bash
   docker-compose logs postgres
   ```

3. Restart database:
   ```bash
   docker-compose restart postgres
   ```

4. Verify connection string in `.env` file

### Migration Issues

**Problem**: Migrations fail or schema is out of sync

**Solutions**:
1. Reset database (⚠️ **WARNING**: Deletes all data):
   ```bash
   cd backend
   npm run migrate:docker
   ```

2. Push schema directly (development only):
   ```bash
   docker-compose exec backend sh -c "cd /app; npx prisma db push"
   ```

3. Check Prisma schema:
   ```bash
   cd backend
   npx prisma validate
   ```

### Backend Not Starting

**Problem**: Backend server fails to start

**Solutions**:
1. Check for port conflicts:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Linux/Mac
   lsof -i :5000
   ```

2. Verify environment variables:
   ```bash
   cd backend
   cat .env
   ```

3. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

4. Rebuild Docker container:
   ```bash
   docker-compose build backend
   docker-compose up -d backend
   ```

### Frontend Not Connecting to Backend

**Problem**: Frontend shows API errors

**Solutions**:
1. Verify backend is running:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. Check CORS configuration in backend
3. Verify `VITE_API_URL` in frontend `.env`
4. Check browser console for errors
5. Verify backend CORS allows `http://localhost:3000`

### Docker Issues

**Problem**: Docker commands fail

**Solutions**:
1. Verify Docker Desktop is running
2. Check Docker version:
   ```bash
   docker --version
   docker-compose --version
   ```

3. Restart Docker Desktop
4. Check Docker logs:
   ```bash
   docker-compose logs
   ```

### Port Already in Use

**Problem**: Port 3000, 5000, or 5432 already in use

**Solutions**:
1. Find process using port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Linux/Mac
   lsof -i :5000
   ```

2. Kill the process or change port in configuration
3. Update `.env` files with new ports

## Next Steps

Once everything is running:

1. **Read the Documentation**:
   - [README.md](./README.md) - Project overview
   - [docs/SETUP_GUIDE.md](./docs/SETUP_GUIDE.md) - Detailed setup
   - [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) - API reference
   - [docs/USER_GUIDE.md](./docs/USER_GUIDE.md) - User features

2. **Explore the Codebase**:
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`
   - Database schema: `backend/prisma/schema.prisma`

3. **Create Test Accounts**:
   - Register as different user roles (Patient, Provider, etc.)
   - Test different features

4. **Development Workflow**:
   - Make changes to code
   - Test locally
   - Run migrations for schema changes
   - Commit changes

## Quick Reference Commands

```bash
# Database
docker-compose up -d postgres          # Start database
docker-compose logs postgres           # View database logs
docker-compose exec postgres psql -U healthbridge -d healthbridge  # Connect to DB

# Backend
cd backend
npm install                            # Install dependencies
npm run migrate:docker                 # Run migrations
npm run dev:docker                     # Start in Docker
npm run dev                            # Start locally
npx prisma studio                      # Open Prisma Studio

# Frontend
cd frontend
npm install                            # Install dependencies
npm run dev                            # Start dev server
npm run build                          # Build for production

# All Services
docker-compose up -d                   # Start all services
docker-compose down                    # Stop all services
docker-compose logs -f                 # View all logs
docker-compose ps                      # Check service status
```

## Getting Help

- Check the [docs](./docs/) directory for detailed documentation
- Review [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) if available
- Check GitHub issues (if applicable)
- Contact the development team

---

**Happy Coding! 🚀**

