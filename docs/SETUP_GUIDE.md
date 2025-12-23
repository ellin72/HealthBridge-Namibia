# HealthBridge Namibia - Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git
- For mobile development: React Native CLI or Expo CLI

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the `backend` directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/healthbridge?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
FRONTEND_URL=http://localhost:3000
MOBILE_URL=http://localhost:8081
```

### 4. Set up PostgreSQL database
```bash
# Create database
createdb healthbridge

# Or using psql
psql -U postgres
CREATE DATABASE healthbridge;
```

### 5. Run Prisma migrations
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 6. (Optional) Seed database with initial data
You can use Prisma Studio to add initial data:
```bash
npx prisma studio
```

### 7. Start the backend server
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the development server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Mobile App Setup

### 1. Navigate to mobile directory
```bash
cd mobile
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure API URL
Edit `mobile/src/services/authService.ts` and update the `API_URL` constant:
```typescript
const API_URL = 'http://your-api-url:5000/api';
```

For Android emulator, use `http://10.0.2.2:5000/api`
For iOS simulator, use `http://localhost:5000/api`
For physical device, use your computer's IP address: `http://192.168.x.x:5000/api`

### 4. Start Expo
```bash
npm start
```

### 5. Run on device
- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go app on physical device

## Database Schema

The database schema is defined in `backend/prisma/schema.prisma`. Key models include:

- **User**: All platform users (patients, providers, coaches, students)
- **Appointment**: Telehealth appointments
- **ConsultationNote**: Medical consultation notes
- **WellnessContent**: Wellness hub articles and resources
- **LearningResource**: Educational PDFs and documents
- **Assignment**: Student assignments
- **AssignmentSubmission**: Student assignment submissions

## Creating Initial Users

You can create users through:
1. The registration endpoint (`POST /api/auth/register`)
2. Prisma Studio (`npx prisma studio`)
3. Direct database insertion

### Example: Create Admin User via API
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@healthbridge.na",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }'
```

## Troubleshooting

### Backend Issues

**Database connection error**
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists

**Port already in use**
- Change PORT in `.env`
- Kill process using port 5000

**Prisma migration errors**
- Reset database: `npx prisma migrate reset`
- Check schema.prisma for syntax errors

### Frontend Issues

**API connection errors**
- Verify backend is running
- Check VITE_API_URL in `.env`
- Check CORS settings in backend

**Build errors**
- Clear node_modules and reinstall
- Check TypeScript version compatibility

### Mobile Issues

**Expo connection errors**
- Ensure backend is accessible from device/emulator
- Check firewall settings
- Verify API_URL is correct for your setup

**Module not found errors**
- Run `npm install` again
- Clear Expo cache: `expo start -c`

## Development Workflow

1. Start PostgreSQL database
2. Start backend server (`cd backend && npm run dev`)
3. Start frontend (`cd frontend && npm run dev`)
4. Start mobile app if needed (`cd mobile && npm start`)

## Testing

### Manual Testing
1. Register a new user
2. Login and verify token
3. Test each module (Appointments, Wellness, Learning)
4. Verify role-based access control

### API Testing
Use tools like Postman or curl to test endpoints:
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use token in subsequent requests
curl -X GET http://localhost:5000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Next Steps

1. Review the API documentation in `docs/API_DOCUMENTATION.md`
2. Check deployment guide in `docs/DEPLOYMENT_GUIDE.md`
3. Review database schema in `docs/DATABASE_SCHEMA.md`
4. Set up SSL certificates for production
5. Configure production environment variables

