# HealthBridge Namibia - Complete Startup Guide

This guide will walk you through setting up and running the HealthBridge Namibia project from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Mobile Setup](#mobile-setup)
7. [Running the Project](#running-the-project)
8. [Troubleshooting](#troubleshooting)
9. [Quick Reference](#quick-reference)

---

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software

- **Node.js 18+** and npm
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version` and `npm --version`

- **Docker Desktop** (Recommended for database)
  - Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
  - Required for running PostgreSQL database
  - Verify: `docker --version`

- **Git**
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify: `git --version`

### Optional (for Mobile Development)

- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go app** on your mobile device (iOS/Android)

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd HealthBridge-Namibia
```

### 2. Verify Project Structure

You should see the following directories:
```
HealthBridge-Namibia/
├── backend/          # Node.js/Express API
├── frontend/         # React web application
├── mobile/           # React Native mobile app
├── docker-compose.yml # Docker configuration
└── docs/             # Documentation
```

---

## Database Setup

### Option 1: Using Docker (Recommended)

This is the easiest and most reliable method, especially on Windows.

#### Step 1: Start the Database Container

```bash
# From the project root directory
docker-compose up -d postgres
```

This will:
- Download PostgreSQL 14 image (if not already downloaded)
- Create a container named `healthbridge-db`
- Set up the database with:
  - Database name: `healthbridge`
  - Username: `healthbridge`
  - Password: `healthbridge123`
  - Port: `5432`

#### Step 2: Verify Database is Running

```bash
docker ps
```

You should see `healthbridge-db` in the list with status "Up" and "(healthy)".

#### Step 3: Test Database Connection

```bash
docker exec healthbridge-db psql -U healthbridge -d healthbridge -c "SELECT version();"
```

If you see PostgreSQL version information, the database is working correctly.

### Option 2: Local PostgreSQL Installation

If you prefer to install PostgreSQL directly on your machine:

1. Install PostgreSQL 14+ from [postgresql.org](https://www.postgresql.org/download/)
2. Create a database:
   ```sql
   CREATE DATABASE healthbridge;
   CREATE USER healthbridge WITH PASSWORD 'healthbridge123';
   GRANT ALL PRIVILEGES ON DATABASE healthbridge TO healthbridge;
   ```

**Note**: On Windows, using Docker is strongly recommended due to networking issues between the host and containers.

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# On Windows (PowerShell)
notepad .env

# On Mac/Linux or Git Bash
nano .env
```

Add the following content:

```env
# Database Configuration
# For Docker setup (recommended):
DATABASE_URL=postgresql://healthbridge:healthbridge123@localhost:5432/healthbridge?schema=public

# For local PostgreSQL:
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/healthbridge?schema=public

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS Configuration
FRONTEND_URL=http://localhost:3000
MOBILE_URL=http://localhost:8081
```

**Important**: 
- If using Docker, use `localhost:5432` (the port is forwarded from the container)
- If using local PostgreSQL, replace `YOUR_PASSWORD` with your actual PostgreSQL password

### Step 4: Set Up Database Schema

#### For Docker Setup (Recommended on Windows):

Due to Windows/Docker networking issues, use the Docker-based migration:

```bash
npm run migrate:docker
```

This will:
- Run Prisma migrations inside Docker
- Connect to the database using Docker's internal network
- Create all necessary tables

#### For Local PostgreSQL:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### Step 5: Generate Prisma Client

```bash
npx prisma generate
```

### Step 6: Start the Backend Server

#### Option A: Run in Docker (Recommended on Windows)

This avoids Windows/Docker networking issues:

```bash
npm run dev:docker
```

This will:
- Run the backend in a Docker container
- Connect to the database via Docker network
- Mount your code for live reloading
- Expose port 5000

#### Option B: Run Directly on Host

```bash
npm run dev
```

**Note**: On Windows, you may encounter database connection issues. If you see authentication errors, use Option A instead.

### Step 7: Verify Backend is Running

You should see:
```
🚀 HealthBridge API server running on port 5000
📊 Environment: development
```

Test the API:
```bash
curl http://localhost:5000/api/health
```

Or open in browser: `http://localhost:5000/api/health`

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd ../frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Verify TypeScript Configuration

The project should have:
- `tsconfig.json` - Main TypeScript config
- `tsconfig.node.json` - Config for Vite/Node tooling

If `tsconfig.node.json` is missing, create it:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "types": ["node"]
  },
  "include": ["vite.config.ts"]
}
```

### Step 5: Start the Development Server

```bash
npm run dev
```

The frontend should be available at:
- **Local**: http://localhost:3000
- **Network**: Check the terminal for the network URL

### Step 6: Verify Frontend is Running

You should see the Vite dev server running and be able to access the login page in your browser.

---

## Mobile Setup

### Step 1: Navigate to Mobile Directory

```bash
cd ../mobile
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Fix Dependency Versions

Expo requires specific versions. Run:

```bash
npx expo install --fix
```

This will update packages to versions compatible with your Expo SDK.

### Step 4: Verify Metro Configuration

The project includes `metro.config.js` to prevent Metro from watching backend/frontend directories. If you encounter file watching errors, ensure this file exists.

### Step 5: Start Expo Development Server

```bash
npm start
# or
npx expo start
```

### Step 6: Run on Device/Emulator

- **Android**: Press `a` or run `npm run android`
- **iOS**: Press `i` or run `npm run ios` (macOS only)
- **Web**: Press `w` or run `npm run web`
- **Expo Go**: Scan the QR code with Expo Go app on your phone

### Step 7: Configure API URL (if needed)

If your backend is running on a different machine or IP, update `mobile/src/services/authService.ts`:

```typescript
const API_URL = 'http://YOUR_IP:5000/api';
```

For local development, use:
- **Android Emulator**: `http://10.0.2.2:5000/api`
- **iOS Simulator**: `http://localhost:5000/api`
- **Physical Device**: `http://YOUR_COMPUTER_IP:5000/api`

---

## Running the Project

### Complete Startup Sequence

1. **Start Database** (in project root):
   ```bash
   docker-compose up -d postgres
   ```

2. **Start Backend** (in `backend/` directory):
   ```bash
   # Windows (recommended):
   npm run dev:docker
   
   # Mac/Linux or if Docker networking works:
   npm run dev
   ```

3. **Start Frontend** (in `frontend/` directory):
   ```bash
   npm run dev
   ```

4. **Start Mobile** (in `mobile/` directory, optional):
   ```bash
   npm start
   ```

### Access Points

- **Frontend Web App**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health
- **Prisma Studio** (database GUI): `cd backend && npx prisma studio`

### Default User Roles

The system supports these user roles:
- `PATIENT` - Can book appointments and access wellness content
- `HEALTHCARE_PROVIDER` - Can manage appointments and create consultation notes
- `WELLNESS_COACH` - Can manage wellness content
- `STUDENT` - Can access learning resources and submit assignments
- `ADMIN` - Full system access

---

## Troubleshooting

### Database Connection Issues

#### Problem: "Authentication failed against database server"

**Solution for Windows/Docker**:
1. Use the Docker-based migration: `npm run migrate:docker`
2. Run backend in Docker: `npm run dev:docker`
3. Ensure database container is running: `docker ps`

**Solution for Local PostgreSQL**:
1. Verify PostgreSQL is running
2. Check credentials in `.env` file
3. Ensure database exists: `psql -U postgres -c "\l"`

#### Problem: "Connection refused" or "Cannot connect"

**Solutions**:
1. Check if database container is running: `docker ps`
2. Restart database: `docker-compose restart postgres`
3. Check database logs: `docker logs healthbridge-db`
4. Verify port 5432 is not blocked by firewall

### Backend Issues

#### Problem: Backend can't connect to database on Windows

**Solution**: Use Docker approach:
```bash
npm run dev:docker
```

#### Problem: "Prisma Client not generated"

**Solution**:
```bash
npx prisma generate
```

#### Problem: Port 5000 already in use

**Solution**:
1. Find process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Mac/Linux
   lsof -i :5000
   ```
2. Kill the process or change PORT in `.env`

### Frontend Issues

#### Problem: "tsconfig.node.json not found"

**Solution**: Create the file as described in [Frontend Setup](#frontend-setup) Step 4.

#### Problem: "Cannot connect to API"

**Solution**:
1. Verify backend is running on port 5000
2. Check `VITE_API_URL` in frontend `.env`
3. Check browser console for CORS errors
4. Verify backend CORS configuration allows `http://localhost:3000`

### Mobile Issues

#### Problem: Metro bundler watching wrong directories

**Solution**: Ensure `metro.config.js` exists in `mobile/` directory (should be included in the project).

#### Problem: "Some dependencies are incompatible"

**Solution**:
```bash
npx expo install --fix
```

#### Problem: "EACCES: permission denied" when starting Expo

**Solution**: 
1. Ensure `metro.config.js` excludes backend/frontend directories
2. Clear Metro cache: `npx expo start --clear`
3. Restart terminal/command prompt

#### Problem: Cannot connect to API from mobile device

**Solution**:
1. Use your computer's IP address instead of `localhost`
2. Ensure backend allows connections from your device's IP
3. Check firewall settings
4. For Android emulator, use `10.0.2.2` instead of `localhost`

### Docker Issues

#### Problem: "Cannot connect to Docker daemon"

**Solution**:
1. Ensure Docker Desktop is running
2. Restart Docker Desktop
3. Verify Docker is in PATH: `docker --version`

#### Problem: "Port already allocated"

**Solution**:
1. Stop conflicting containers: `docker ps` then `docker stop <container-id>`
2. Or change ports in `docker-compose.yml`

#### Problem: "Volume mount issues on Windows"

**Solution**:
1. Use Git Bash instead of PowerShell/CMD for Docker commands
2. Use absolute paths in volume mounts
3. Enable WSL 2 backend in Docker Desktop settings

---

## Quick Reference

### Essential Commands

```bash
# Database
docker-compose up -d postgres          # Start database
docker-compose down                    # Stop all services
docker exec healthbridge-db psql -U healthbridge -d healthbridge  # Access database

# Backend
cd backend
npm install                            # Install dependencies
npm run migrate:docker                 # Run migrations (Windows/Docker)
npx prisma migrate dev                 # Run migrations (local PostgreSQL)
npx prisma generate                   # Generate Prisma Client
npm run dev:docker                     # Start backend in Docker (Windows)
npm run dev                            # Start backend on host
npx prisma studio                     # Open database GUI

# Frontend
cd frontend
npm install                            # Install dependencies
npm run dev                            # Start dev server
npm run build                          # Build for production

# Mobile
cd mobile
npm install                            # Install dependencies
npx expo install --fix                 # Fix dependency versions
npm start                              # Start Expo dev server
npm run android                        # Run on Android
npm run ios                            # Run on iOS
```

### Environment Variables Checklist

**Backend `.env`**:
- [ ] DATABASE_URL
- [ ] JWT_SECRET
- [ ] JWT_EXPIRES_IN
- [ ] PORT
- [ ] NODE_ENV
- [ ] FRONTEND_URL
- [ ] MOBILE_URL

**Frontend `.env`**:
- [ ] VITE_API_URL

### Ports Used

- **5000**: Backend API
- **3000**: Frontend web app
- **5432**: PostgreSQL database
- **8081**: Expo/Metro bundler (mobile)

### Project URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health
- Prisma Studio: http://localhost:5555 (when running `npx prisma studio`)

---

## Next Steps

After successful setup:

1. **Create your first user**: Register through the frontend at http://localhost:3000/register
2. **Explore the API**: Check `docs/API_DOCUMENTATION.md` for available endpoints
3. **Review Database Schema**: See `docs/DATABASE_SCHEMA.md` for data models
4. **Read User Guide**: Check `docs/USER_GUIDE.md` for feature documentation

---

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review error messages in the terminal/console
3. Check Docker logs: `docker logs healthbridge-db`
4. Verify all environment variables are set correctly
5. Ensure all prerequisites are installed and up to date

---

## Additional Resources

- **API Documentation**: `docs/API_DOCUMENTATION.md`
- **Database Schema**: `docs/DATABASE_SCHEMA.md`
- **Architecture Overview**: `docs/ARCHITECTURE.md`
- **Deployment Guide**: `docs/DEPLOYMENT_GUIDE.md`
- **User Guide**: `docs/USER_GUIDE.md`

---

**Last Updated**: December 2025
**Project Version**: Phase 1 MVP

