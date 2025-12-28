# HealthBridge Namibia - Phase 1 MVP

A comprehensive digital healthcare platform integrating telehealth, wellness resources, and e-learning for Namibian communities.

## Project Overview

HealthBridge Namibia is a mobile and web platform designed to provide:
- **Telehealth Services**: Appointment booking and consultation notes
- **Wellness Hub**: Nutrition guides, fitness routines, and stress management tips
- **Learning Zone**: Educational resources and assignment submissions for healthcare students

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL with Prisma ORM
- JWT Authentication
- File upload handling (Multer)

### Frontend (Web)
- React with TypeScript
- Material-UI for components
- React Router for navigation
- Axios for API calls

### Mobile
- React Native with TypeScript
- React Navigation
- AsyncStorage for local storage

## Project Structure

```
HealthBridge-Namibia/
├── backend/          # Node.js/Express API
├── frontend/         # React web application
├── mobile/           # React Native mobile app
├── docs/             # Comprehensive documentation
└── phase1.md         # Project charter
```

## Getting Started

**📖 For complete setup instructions, see [STARTUP_GUIDE.md](./STARTUP_GUIDE.md)**

The startup guide includes:
- Detailed prerequisites and installation steps
- Database setup (Docker and local PostgreSQL)
- Backend, frontend, and mobile configuration
- Troubleshooting common issues
- Quick reference commands

### Quick Start (TL;DR)

1. **Prerequisites**: Install Node.js 18+, Docker Desktop, and Git
2. **Database**: `docker-compose up -d postgres`
3. **Backend**: `cd backend && npm install && npm run migrate:docker && npm run dev:docker`
4. **Frontend**: `cd frontend && npm install && npm run dev`
5. **Mobile** (optional): `cd mobile && npm install && npx expo install --fix && npm start`

**Note**: On Windows, use Docker-based commands (`dev:docker`, `migrate:docker`) to avoid networking issues.

## User Roles

1. **Patients**: Book appointments, access wellness content
2. **Healthcare Providers**: Manage appointments, create consultation notes
3. **Wellness Coaches**: Manage wellness content
4. **Students**: Access learning resources, submit assignments

## Features

### Telehealth Lite
- Appointment booking system
- Consultation notes management
- Provider availability management

### Wellness Hub
- Nutrition guides and meal plans
- Fitness routines and exercise videos
- Stress management tips and resources

### Learning Zone
- PDF resource uploads
- Assignment submission system
- Educational content management

## Documentation

- **[STARTUP_GUIDE.md](./STARTUP_GUIDE.md)** - Complete setup and configuration guide ⭐ **Start here!**
- **[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)** - Detailed prerequisite installation (Windows)
- **docs/API_DOCUMENTATION.md** - API endpoints and usage
- **docs/DATABASE_SCHEMA.md** - Database structure and relationships
- **docs/DEPLOYMENT_GUIDE.md** - Production deployment instructions
- **docs/USER_GUIDE.md** - User-facing feature documentation

## License

Proprietary - HealthBridge Namibia

