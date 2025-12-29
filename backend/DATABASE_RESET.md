# Database Reset and Admin User Setup

This guide explains how to clear the database and create an admin user.

## Admin User Credentials

- **Email**: elcorpnamibia@gmail.com
- **Password**: Elcorpnamibia@2025
- **Name**: Admin User
- **Role**: ADMIN

## Method 1: Using Docker (Recommended for Docker setups)

### On Windows (PowerShell):
```powershell
cd backend
.\seed-docker.ps1
```

### On Linux/Mac (Bash):
```bash
cd backend
chmod +x seed-docker.sh
./seed-docker.sh
```

Or using npm:
```bash
npm run seed:docker
```

## Method 2: Using npm script (For local database)

### On Windows (PowerShell):
```powershell
cd backend
npm run prisma:seed
```

### On Linux/Mac (Bash):
```bash
cd backend
npm run prisma:seed
```

## Method 3: Using the reset scripts

### On Windows:
```powershell
cd backend
.\reset-db.ps1
```

### On Linux/Mac:
```bash
cd backend
chmod +x reset-db.sh
./reset-db.sh
```

## What the script does:

1. ✅ Clears all existing data from the database:
   - Assignment Submissions
   - Assignments
   - Consultation Notes
   - Appointments
   - Wellness Content
   - Learning Resources
   - Users

2. ✅ Creates a new admin user with:
   - Email: elcorpnamibia@gmail.com
   - Password: Elcorpnamibia@2025 (hashed with bcrypt)
   - First Name: Admin
   - Last Name: User
   - Role: ADMIN
   - Active: true

## Prerequisites

- Database must be running and accessible
- DATABASE_URL must be set in your `.env` file
- Prisma Client must be generated (`npm run prisma:generate`)

## Troubleshooting

If you encounter errors:

1. **Make sure your database is running**
   ```bash
   # Check if PostgreSQL is running
   # Or if using Docker:
   docker ps
   ```

2. **Check your DATABASE_URL in .env**
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```

3. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

4. **If ts-node is not found**
   ```bash
   npm install ts-node --save-dev
   ```

## Manual Reset (Alternative)

If the scripts don't work, you can manually:

1. Open Prisma Studio:
   ```bash
   npm run prisma:studio
   ```

2. Delete all records manually through the UI

3. Or use SQL directly:
   ```sql
   TRUNCATE TABLE "AssignmentSubmission", "Assignment", "ConsultationNote", 
   "Appointment", "WellnessContent", "LearningResource", "User" CASCADE;
   ```

4. Then run the seed script:
   ```bash
   npm run prisma:seed
   ```

