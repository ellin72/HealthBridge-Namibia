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

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- React Native CLI (for mobile development)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file with database credentials
npx prisma migrate dev
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure API endpoint
npm start
```

### Mobile Setup
```bash
cd mobile
npm install
# For iOS: cd ios && pod install
npm run android  # or npm run ios
```

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

See the `docs/` directory for comprehensive documentation:
- API Documentation
- Database Schema
- Setup Guide
- Deployment Guide
- User Guides

## License

Proprietary - HealthBridge Namibia

