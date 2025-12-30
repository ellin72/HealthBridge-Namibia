# HealthBridge Namibia - Phase 1 MVP

A comprehensive digital healthcare platform integrating telehealth, wellness resources, and e-learning for Namibian communities.

## Project Overview

HealthBridge Namibia is a comprehensive digital healthcare platform designed to provide:
- **Telehealth Services**: Appointment booking, consultation notes, and video consultations
- **Wellness Hub**: Nutrition guides, fitness routines, stress management tips, and interactive wellness tools
- **Learning Zone**: Educational resources, assignment submissions, and research support for healthcare students
- **AI-Powered Triage**: Intelligent symptom checker for urgency assessment
- **Medical Aid Integration**: Support for Namibian medical aid schemes
- **Multilingual Support**: English, Afrikaans, and Oshiwambo
- **Offline Capabilities**: Works offline with automatic sync

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
└── docs/             # Comprehensive documentation
```

## Getting Started

**📖 For complete setup instructions, see [docs/SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)**

The setup guide includes:
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

1. **Patients**: 
   - Book appointments, access wellness content
   - Use symptom checker for triage
   - Track wellness habits and join challenges
   - Access medical aid information and claims
   - View comprehensive medical history

2. **Healthcare Providers**: 
   - Manage appointments and create consultation notes
   - Conduct video consultations
   - Access patient medical history
   - View provider analytics
   - Create assignments for students
   - Grade student assignments

3. **Wellness Coaches**: 
   - Create and manage wellness content
   - Create wellness challenges
   - Monitor community engagement

4. **Students**: 
   - Access learning resources and submit assignments
   - Use research support tools (topic generator, proposal builder)
   - Connect with supervisors
   - Track research milestones
   - Collaborate on research projects

5. **Admin**: 
   - User management
   - System administration

## Features

### Phase 1 - Core Features

#### Telehealth Lite
- Appointment booking system
- Consultation notes management
- Provider availability management

#### Wellness Hub
- Nutrition guides and meal plans
- Fitness routines and exercise videos
- Stress management tips and resources
- Content creation and management by wellness coaches

#### Learning Zone
- PDF resource uploads
- Assignment submission system
- Educational content management
- Assignment grading for instructors

### Phase 2 - Advanced Features

#### Telehealth Pro
- Video consultations with Zoom/Google Meet integration
- Comprehensive patient medical history tracking
- Provider analytics dashboard with appointment statistics

#### Interactive Wellness Tools
- Personalized wellness plans with custom goals
- Habit tracking (nutrition, fitness, sleep, meditation, hydration)
- Community wellness challenges with progress tracking

#### Research Support (Students)
- AI-powered research topic generator
- Research proposal builder
- Curated resource library (articles, journals, datasets)
- Supervisor matching and connection
- Research milestone tracking
- Collaboration tools (shared folders, notes, chat)

### Additional Features

#### AI-Powered Symptom Checker
- Intelligent symptom assessment
- Urgency level determination (LOW, MEDIUM, HIGH, URGENT, EMERGENCY)
- AI recommendations with confidence scores
- Triage history tracking

#### Multilingual Support
- English, Afrikaans, and Oshiwambo language support
- User language preference storage
- Seamless language switching

#### Namibian Medical Aid Integration
- Support for NAMMED, Medical Aid Fund, and Prosana
- Medical aid information storage and verification
- Claim submission and tracking system

#### Payment Gateway Integration
- PayToday and SnapScan support (popular in Namibia)
- Credit card payment processing
- Transaction history and tracking

#### Offline-First Capabilities
- Service worker for offline caching
- Local storage queue for offline actions
- Automatic sync when connection is restored

#### Enhanced Security & Compliance
- AES-256-GCM encryption for sensitive data
- POPIA/HIPAA compliance structure
- FHIR interoperability for healthcare system integration

## Documentation

- **[docs/SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)** - Complete setup and configuration guide ⭐ **Start here!**
- **[docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)** - API endpoints and usage
- **[docs/DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)** - Database structure and relationships
- **[docs/USER_GUIDE.md](./docs/USER_GUIDE.md)** - User-facing feature documentation
- **[docs/README.md](./docs/README.md)** - Documentation index

## License

Proprietary - HealthBridge Namibia

