# HealthBridge Namibia - Complete Project Documentation

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Status:** Active Development - Phase 1 MVP

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Recent Improvements & Changes](#recent-improvements--changes)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Navigation System](#navigation-system)
6. [User Roles & Permissions](#user-roles--permissions)
7. [Component Structure](#component-structure)
8. [Features](#features)
9. [Build & Deployment](#build--deployment)
10. [Development Workflow](#development-workflow)
11. [API Documentation](#api-documentation)
12. [Database Schema](#database-schema)
13. [Security & Compliance](#security--compliance)
14. [Future Roadmap](#future-roadmap)

---

## Project Overview

HealthBridge Namibia is a comprehensive digital healthcare platform designed to provide telehealth services, wellness resources, and e-learning capabilities for Namibian communities. The platform integrates multiple healthcare services into a single, user-friendly interface.

### Mission
To connect patients and healthcare providers for medical care, mental health support, chronic condition management, and wellness education across Namibia.

### Key Objectives
- Provide accessible healthcare services to remote and urban communities
- Support healthcare providers with efficient patient management tools
- Offer wellness and educational resources
- Enable secure billing and payment processing
- Support multilingual access (English, Afrikaans, Oshiwambo)

---

## Recent Improvements & Changes

### 1. Navigation System Overhaul (December 2024)

#### 1.1 Teladoc-Style Top Navigation Bar
**Implementation Date:** December 2024

**New Component:** `TopNavigationBar.tsx`

**Features:**
- **Main Navigation with Dropdowns:**
  - Public users: 24/7 Care, Mental Health, Wellness, Learning, Specialty Care
  - Authenticated users: Role-based navigation with contextual menus
  - Smooth dropdown animations with Material-UI Menu components
  - Icon support for all navigation items

- **Call-to-Action Buttons:**
  - Public: "Get Care Now" (green gradient button)
  - Authenticated: Role-specific CTAs
    - Patients: "Book Appointment"
    - Providers: "View Appointments"
    - Others: "Dashboard"

- **User Menu:**
  - Avatar with user initials
  - Dropdown showing user name, role, and actions
  - Quick access to Profile and Logout

- **Responsive Design:**
  - Desktop: Full navigation bar with dropdowns
  - Mobile: Hamburger menu with slide-out drawer
  - Adaptive layout for all screen sizes

**Integration:**
- Integrated into `Landing.tsx` for public pages
- Integrated into `Layout.tsx` for authenticated pages
- Works seamlessly with existing sidebar navigation

#### 1.2 Role-Based Dashboards
**Implementation Date:** December 2024

**New Components:**
- `components/dashboards/PatientDashboard.tsx`
- `components/dashboards/ProviderDashboard.tsx`
- `components/dashboards/CoachDashboard.tsx`
- `components/dashboards/StudentDashboard.tsx`
- `components/dashboards/AdminDashboard.tsx`

**Features:**
- **Tailored Content:** Each role sees only relevant information
- **Quick Action Tiles:** Prominent shortcuts for common tasks
- **Role-Specific Stats:** Customized metrics and KPIs
- **Recent Activity:** Shows recent appointments, assignments, or content

**Dashboard Breakdown:**

**Patient Dashboard:**
- Quick Actions: Book Appointment, Symptom Checker, Wellness Hub, Pay Invoice
- Stats: Upcoming Appointments, Prescriptions, Pending Bills
- Sections: Medication Reminders, Remote Monitoring, Recent Appointments

**Provider Dashboard:**
- Quick Actions: Manage Appointments, Consultation Notes, Patient History, View Earnings
- Stats: Today's Appointments, Total Patients, Total Appointments
- Sections: Billing Overview, Clinical Templates, Remote Monitoring

**Coach Dashboard:**
- Quick Actions: Create Content, Launch Challenge, Engagement Analytics
- Stats: Published Articles, Total Articles, Draft Articles
- Sections: My Wellness Content

**Student Dashboard:**
- Quick Actions: Learning Zone, Upload Assignment, Research Tools
- Stats: Pending Assignments, Total Assignments, Learning Resources
- Sections: Recent Assignments

**Admin Dashboard:**
- Quick Actions: User Management, System Monitoring, Fraud Detection
- Stats: Total Users, System Overview, Total Appointments

#### 1.3 Quick Action Tiles Component
**Implementation Date:** December 2024

**New Component:** `QuickActionTiles.tsx`

**Purpose:** Provide prominent, clickable tiles for the most common user actions based on role.

**Features:**
- Role-specific action tiles
- Gradient backgrounds with icons
- Hover effects and animations
- Direct navigation to relevant pages

**Actions by Role:**
- **Patients:** Book Appointment Now, Symptom Checker, Wellness Hub, Pay Invoice
- **Providers:** Manage Appointments, Consultation Notes, Patient History, View Earnings
- **Coaches:** Create Content, Launch Challenge, Engagement Analytics
- **Students:** Learning Zone, Upload Assignment, Research Tools
- **Admins:** User Management, System Monitoring, Fraud Detection

#### 1.4 Global Navigation Bar
**Implementation Date:** December 2024

**New Component:** `GlobalNavBar.tsx`

**Purpose:** Provide persistent navigation across all authenticated pages.

**Features:**
- Universal navigation items: Home, Appointments, Wellness, Learning, Billing
- Role-based filtering (only shows relevant items)
- Active state highlighting
- Responsive design (horizontal scroll on mobile)
- Integrated with Layout component

#### 1.5 Contextual Authentication Redirection
**Implementation Date:** December 2024

**Improvements:**
- Updated `PrivateRoute.tsx` to save attempted location
- Updated `Login.tsx` to redirect to originally requested page
- Uses React Router's `location.state.from` pattern
- Preserves user navigation intent

**Flow:**
1. User attempts to access protected route
2. If not authenticated, redirected to login with `state.from` saved
3. After login, user redirected to originally requested page
4. Falls back to dashboard if no previous location

---

## Architecture

### System Architecture

HealthBridge Namibia follows a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  React Web App + React Native Mobile App                │
│  - User Interface & Experience                          │
│  - Client-side Routing & State Management              │
│  - API Communication via Axios                          │
│  - Offline-first with Service Workers                   │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                    Backend Layer                        │
│  Node.js/Express API                                    │
│  - RESTful API Endpoints                                │
│  - Business Logic & Validation                          │
│  - Authentication & Authorization                       │
│  - File Upload Handling                                 │
│  - Payment Gateway Integration                          │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                           │
│  PostgreSQL + Prisma ORM                                │
│  - Relational Database                                  │
│  - Type-safe Database Access                            │
│  - Migrations for Schema Versioning                    │
└─────────────────────────────────────────────────────────┘
```

### Frontend Architecture

**Component Hierarchy:**
```
App.tsx
├── ThemeProvider
├── AuthProvider
└── Router
    ├── Public Routes
    │   ├── Landing (with TopNavigationBar)
    │   ├── Login
    │   └── Register
    └── Private Routes (with Layout)
        ├── Dashboard (role-based routing)
        ├── Appointments
        ├── Wellness Hub
        ├── Learning Zone
        └── ... (other protected routes)
```

**Layout Structure:**
```
Layout.tsx
├── TopNavigationBar (Teladoc-style)
├── Sidebar Navigation (role-based menu)
├── GlobalNavBar (persistent nav)
└── Main Content Area
    └── {children}
```

### Backend Architecture

**Directory Structure:**
```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── routes/           # API route definitions
│   ├── middleware/       # Auth, validation middleware
│   ├── utils/           # Helper functions
│   └── server.ts        # Express server setup
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding
└── package.json
```

---

## Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript 5.3+
- **Database:** PostgreSQL 14+
- **ORM:** Prisma 5.7+
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **Development:** tsx (hot-reload)
- **Build:** TypeScript Compiler (tsc)

### Frontend (Web)
- **Framework:** React 18
- **Language:** TypeScript 5.3+
- **Build Tool:** Vite 5
- **UI Library:** Material-UI (MUI) 5.15
- **Routing:** React Router 6.21
- **State Management:** React Query 3.39
- **HTTP Client:** Axios 1.6
- **Internationalization:** i18next 23.16
- **Form Handling:** React Hook Form 7.49
- **Markdown:** React Markdown 10.1

### Mobile
- **Framework:** React Native 0.72
- **Platform:** Expo SDK 54
- **Language:** TypeScript 5.1+
- **Navigation:** React Navigation 6
- **Storage:** AsyncStorage 1.18
- **UI:** React Native Paper 5.11

### Infrastructure
- **Containerization:** Docker, Docker Compose
- **Database:** PostgreSQL 14
- **Payment Gateways:** PayToday, SnapScan
- **Security:** AES-256-GCM, 2FA (TOTP)

---

## Navigation System

### Top Navigation Bar (Teladoc-Style)

**Location:** `components/TopNavigationBar.tsx`

**Features:**
- Sticky navigation bar at the top
- Logo and branding on the left
- Main navigation items in the center (desktop)
- User actions on the right
- Responsive mobile menu

**Navigation Items by User State:**

**Unauthenticated:**
- 24/7 Care (dropdown)
  - Get Care Now
  - Urgent Care
  - Primary Care
  - Symptom Checker
- Mental Health
- Wellness (dropdown)
  - Wellness Hub
  - Wellness Tools
- Learning (dropdown)
  - Learning Zone
  - Research Support
- Specialty Care (dropdown)
  - Chronic Disease Management
  - Specialty Care

**Authenticated (Role-Based):**

**Patients:**
- Home
- Healthcare (dropdown)
  - Book Appointment
  - My Appointments
  - Urgent Care
  - Primary Care
  - Telehealth Pro
  - Symptom Checker
  - Mental Health
  - Chronic Disease
  - Specialty Care
- Wellness (dropdown)
  - Wellness Hub
  - Wellness Tools
- Billing

**Providers:**
- Home
- Clinical (dropdown)
  - Appointments
  - Telehealth Pro
  - Urgent Care
  - Primary Care
  - Mental Health
  - Chronic Disease
  - Specialty Care
- Billing (dropdown)
  - Billing Dashboard
  - Provider Earnings

**Coaches:**
- Home
- Wellness (dropdown)
  - Wellness Hub
  - Wellness Tools

**Students:**
- Home
- Learning (dropdown)
  - Learning Zone
  - Research Support

**Admins:**
- Home
- Administration (dropdown)
  - User Management
  - System Monitoring

### Sidebar Navigation

**Location:** `components/Layout.tsx`

**Features:**
- Collapsible menu groups
- Search functionality
- Role-based menu items
- Active state highlighting
- User profile footer

### Global Navigation Bar

**Location:** `components/GlobalNavBar.tsx`

**Features:**
- Persistent navigation below top bar
- Quick access to main sections
- Role-filtered items
- Active state indicators
- Mobile-friendly horizontal scroll

---

## User Roles & Permissions

### 1. Patients (PATIENT)

**Dashboard Features:**
- Book Appointment Now
- Symptom Checker
- Wellness Hub
- Pay Invoice

**Access:**
- Book and manage appointments
- Access wellness content
- Use symptom checker
- View medical history
- Track wellness habits
- Access medical aid information
- View and pay invoices

**Quick Actions:**
- Book Appointment Now → `/select-provider`
- Symptom Checker → `/symptom-checker`
- Wellness Hub → `/wellness`
- Pay Invoice → `/billing`

### 2. Healthcare Providers (HEALTHCARE_PROVIDER)

**Dashboard Features:**
- Manage Appointments
- Consultation Notes
- Patient History
- View Earnings

**Access:**
- Manage appointments
- Create consultation notes
- Conduct video consultations
- Access patient medical history
- View provider analytics
- Create assignments for students
- Grade student assignments
- Manage billing and earnings

**Quick Actions:**
- Manage Appointments → `/appointments`
- Consultation Notes → `/telehealth-pro`
- Patient History → `/telehealth-pro`
- View Earnings → `/provider-earnings`

### 3. Wellness Coaches (WELLNESS_COACH)

**Dashboard Features:**
- Create Content
- Launch Challenges
- Engagement Analytics

**Access:**
- Create and manage wellness content
- Create wellness challenges
- Monitor community engagement
- Publish wellness articles

**Quick Actions:**
- Create Content → `/wellness`
- Launch Challenge → `/wellness-tools`
- Engagement Analytics → `/wellness`

### 4. Students (STUDENT)

**Dashboard Features:**
- Learning Zone
- Assignment Submission
- Research Tools

**Access:**
- Access learning resources
- Submit assignments
- Use research support tools
- Connect with supervisors
- Track research milestones
- Collaborate on research projects

**Quick Actions:**
- Learning Zone → `/learning`
- Upload Assignment → `/learning`
- Research Tools → `/research`

### 5. Administrators (ADMIN)

**Dashboard Features:**
- User Management
- System Monitoring
- Fraud Detection

**Access:**
- User management (CRUD operations)
- System administration
- Transaction monitoring
- Fraud detection
- System-wide analytics

**Quick Actions:**
- User Management → `/users`
- System Monitoring → `/monitoring`
- Fraud Detection → `/monitoring`

---

## Component Structure

### Frontend Components

```
frontend/src/
├── components/
│   ├── dashboards/
│   │   ├── PatientDashboard.tsx
│   │   ├── ProviderDashboard.tsx
│   │   ├── CoachDashboard.tsx
│   │   ├── StudentDashboard.tsx
│   │   └── AdminDashboard.tsx
│   ├── TopNavigationBar.tsx      # Teladoc-style top nav
│   ├── GlobalNavBar.tsx           # Persistent navigation
│   ├── QuickActionTiles.tsx      # Role-based quick actions
│   ├── Layout.tsx                # Main layout wrapper
│   ├── PrivateRoute.tsx          # Protected route wrapper
│   ├── LanguageSelector.tsx      # i18n language switcher
│   ├── MedicationReminders.tsx
│   ├── BillingOverview.tsx
│   ├── ClinicalTemplates.tsx
│   └── RemoteMonitoring.tsx
├── pages/
│   ├── Landing.tsx               # Public landing page
│   ├── Login.tsx                 # Authentication
│   ├── Register.tsx
│   ├── Dashboard.tsx             # Role-based routing
│   ├── Appointments.tsx
│   ├── SelectProvider.tsx
│   ├── TelehealthPro.tsx
│   ├── WellnessHub.tsx
│   ├── WellnessTools.tsx
│   ├── LearningZone.tsx
│   ├── ResearchSupport.tsx
│   ├── SymptomChecker.tsx
│   ├── Billing.tsx
│   ├── Profile.tsx
│   ├── UserManagement.tsx
│   ├── ProviderEarnings.tsx
│   ├── Monitoring.tsx
│   ├── UrgentCare.tsx
│   ├── PrimaryCare.tsx
│   ├── MentalHealth.tsx
│   ├── ChronicDiseaseManagement.tsx
│   └── SpecialtyCare.tsx
├── contexts/
│   └── AuthContext.tsx           # Authentication state
├── services/
│   └── authService.ts            # API service functions
└── utils/
    └── (helper functions)
```

### Key Components

**TopNavigationBar.tsx**
- Main navigation bar (Teladoc-style)
- Dropdown menus for navigation items
- User menu with profile and logout
- CTA buttons (Get Care Now, Book Appointment, etc.)
- Mobile-responsive with drawer menu

**Layout.tsx**
- Main layout wrapper for authenticated pages
- Sidebar navigation with collapsible groups
- Search functionality
- User profile footer
- Integrates TopNavigationBar and GlobalNavBar

**QuickActionTiles.tsx**
- Role-based quick action cards
- Gradient backgrounds with icons
- Direct navigation to common tasks
- Responsive grid layout

**Role-Based Dashboards**
- PatientDashboard: Appointment booking, wellness, billing
- ProviderDashboard: Appointments, consultations, earnings
- CoachDashboard: Content creation, challenges, analytics
- StudentDashboard: Learning, assignments, research
- AdminDashboard: User management, monitoring, fraud detection

---

## Features

### Phase 1 - Core Features

#### Telehealth Lite
- ✅ Appointment booking system
- ✅ Consultation notes management
- ✅ Provider availability management
- ✅ Role-based dashboards
- ✅ Quick action tiles

#### Wellness Hub
- ✅ Nutrition guides and meal plans
- ✅ Fitness routines and exercise videos
- ✅ Stress management tips and resources
- ✅ Content creation and management by wellness coaches
- ✅ Wellness challenges

#### Learning Zone
- ✅ PDF resource uploads
- ✅ Assignment submission system
- ✅ Educational content management
- ✅ Assignment grading for instructors
- ✅ Research support tools

### Phase 2 - Advanced Features

#### Telehealth Pro
- ✅ Video consultations with Zoom/Google Meet integration
- ✅ Comprehensive patient medical history tracking
- ✅ Provider analytics dashboard with appointment statistics
- ✅ Clinical templates

#### Interactive Wellness Tools
- ✅ Personalized wellness plans with custom goals
- ✅ Habit tracking (nutrition, fitness, sleep, meditation, hydration)
- ✅ Community wellness challenges with progress tracking

#### Research Support (Students)
- ✅ AI-powered research topic generator
- ✅ Research proposal builder
- ✅ Curated resource library (articles, journals, datasets)
- ✅ Supervisor matching and connection
- ✅ Research milestone tracking
- ✅ Collaboration tools (shared folders, notes, chat)

### Additional Features

#### AI-Powered Symptom Checker
- ✅ Intelligent symptom assessment
- ✅ Urgency level determination (LOW, MEDIUM, HIGH, URGENT, EMERGENCY)
- ✅ AI recommendations with confidence scores
- ✅ Triage history tracking

#### Multilingual Support
- ✅ English, Afrikaans, and Oshiwambo language support
- ✅ User language preference storage
- ✅ Seamless language switching
- ✅ Language selector component

#### Namibian Medical Aid Integration
- ✅ Support for NAMMED, Medical Aid Fund, and Prosana
- ✅ Medical aid information storage and verification
- ✅ Claim submission and tracking system

#### Billing & Payment System
- ✅ Provider Fee Management: Providers set consultation and service fees
- ✅ Automatic Invoice Generation: Invoices created after consultations
- ✅ Multiple Payment Methods:
  - Debit/Credit cards (PCI-DSS compliant)
  - Mobile money (M-Pesa, etc.)
  - Bank transfers
  - Payment gateways (PayToday, SnapScan)
- ✅ Secure Payment Processing:
  - AES-256-GCM encryption for financial data
  - Two-factor authentication (2FA) for high-value transactions
  - Payment audit logs for fraud detection
- ✅ Digital Receipts: Email/SMS/app notifications after payments
- ✅ Provider Earnings Dashboard: Track earnings and payouts
- ✅ Admin Monitoring: Transaction monitoring and reconciliation tools
- ✅ Subscription Support: Foundation for wellness plans and student packages

#### Navigation & User Experience
- ✅ Role-Based Dashboards: Tailored dashboards for each user role
- ✅ Global Navigation Bar: Persistent navigation with role-filtered items
- ✅ Quick Action Tiles: Prominent shortcuts for common tasks
- ✅ Contextual Authentication: Smart redirect to originally requested page
- ✅ Teladoc-Style Top Navigation: Professional navigation bar with dropdowns
- ✅ Responsive Design: Mobile-friendly navigation with horizontal scroll

#### Offline-First Capabilities
- ✅ Service worker for offline caching
- ✅ Local storage queue for offline actions
- ✅ Automatic sync when connection is restored

#### Enhanced Security & Compliance
- ✅ AES-256-GCM encryption for sensitive data
- ✅ POPIA/HIPAA compliance structure
- ✅ FHIR interoperability for healthcare system integration
- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control (RBAC)

---

## Build & Deployment

### Build Process

#### Backend Build
**Development:**
```bash
cd backend
npm run dev              # Uses tsx watch for hot-reloading
npm run dev:docker       # Run in Docker container with hot-reload
```

**Production:**
```bash
cd backend
npm run build            # Compile TypeScript to dist/
npm start                # Run compiled JavaScript from dist/server.js
```

**Build Output:** `backend/dist/` directory containing compiled JavaScript files

**Docker:**
- Base Image: Node.js 18-slim
- Installs Prisma CLI globally
- Generates Prisma Client during build
- Exposes port 5000

#### Frontend Build
**Development:**
```bash
cd frontend
npm run dev              # Start Vite dev server with HMR
# Runs on http://localhost:3000
# Hot module replacement (HMR) enabled for instant updates
```

**Production:**
```bash
cd frontend
npm run build            # Create production bundle (TypeScript + Vite)
# Build output: frontend/dist/ with optimized static assets
# Serve dist/ directory with a static file server (nginx, etc.)
```

**Build Output:** `frontend/dist/` directory containing optimized static assets

**Docker:**
- Base Image: Node.js 18-alpine
- Runs Vite dev server in container
- Exposes port 3000

#### Mobile Build
**Development:**
```bash
cd mobile
npm start                # Start Expo development server
```

**Production:**
```bash
# Use Expo CLI for building native apps
expo build:android       # Build Android APK/AAB
expo build:ios           # Build iOS IPA
```

### Docker Deployment

**Development (Local Profile):**
```bash
# Start database
docker-compose --profile local up -d postgres

# Start backend
cd backend && npm run dev:docker

# Start frontend
cd frontend && npm run dev
```

**Production:**
```bash
# Build production images
docker-compose --profile production build

# Start production services
docker-compose --profile production up -d

# Required environment variables:
# - PROD_DATABASE_URL
# - PROD_JWT_SECRET
# - PROD_FRONTEND_URL (optional)
# - PROD_MOBILE_URL (optional)
```

### Build Requirements

- **Node.js:** 18+ (required for all components)
- **Docker:** For containerized builds and database
- **Prisma:** Installed globally or via npm (for backend migrations)
- **TypeScript:** 5.3+ (for backend and frontend)
- **Expo CLI:** For mobile production builds (install globally: `npm install -g expo-cli`)

---

## Development Workflow

### Getting Started

1. **Prerequisites:**
   ```bash
   # Install Node.js 18+, Docker Desktop, and Git
   ```

2. **Database Setup:**
   ```bash
   docker-compose up -d postgres
   ```

3. **Backend Setup:**
   ```bash
   cd backend
   npm install
   npm run migrate:docker
   npm run dev:docker
   ```

4. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Mobile Setup (Optional):**
   ```bash
   cd mobile
   npm install
   npx expo install --fix
   npm start
   ```

### Common Development Tasks

**Database Migrations:**
```bash
cd backend
npm run migrate:docker              # Apply migrations
docker-compose exec backend sh -c "cd /app; npx prisma db push"  # Sync schema (dev)
npx prisma studio                   # View database
```

**Running Services:**
```bash
# Development (local profile)
docker-compose --profile local up -d    # Start all services
docker-compose logs -f                  # View logs
docker-compose down                     # Stop all services
```

**Testing:**
- Backend API: `http://localhost:5000/api`
- Frontend: `http://localhost:3000`
- Prisma Studio: `http://localhost:5555`

### Code Structure

**Frontend Architecture:**
- Component-based architecture with React
- Role-based routing and navigation
- Context API for global state (Auth)
- React Query for server state management
- Material-UI for consistent design system

**Backend Architecture:**
- RESTful API design
- Middleware-based request processing
- Prisma ORM for database operations
- JWT-based authentication
- Role-based authorization

---

## API Documentation

### Authentication Endpoints

**POST /api/auth/login**
- Login user and receive JWT token
- Returns: `{ token, user }`

**POST /api/auth/register**
- Register new user
- Returns: `{ token, user }`

### Appointment Endpoints

**GET /api/appointments**
- Get user's appointments (role-based filtering)
- Returns: Array of appointments

**POST /api/appointments**
- Create new appointment
- Required: `providerId, appointmentDate, reason`

**PUT /api/appointments/:id**
- Update appointment status
- Required: `status`

### Billing Endpoints

**GET /api/billing/stats**
- Get billing statistics
- Returns: `{ stats: { pendingInvoices, totalPaid, etc. } }`

**GET /api/billing/invoices**
- Get user's invoices
- Returns: Array of invoices

**POST /api/payments**
- Process payment
- Required: `invoiceId, amount, paymentMethod`

### Wellness Endpoints

**GET /api/wellness**
- Get wellness content
- Query params: `publishedOnly`, `category`

**POST /api/wellness**
- Create wellness content (Wellness Coach only)
- Required: `title, content, category`

### Learning Endpoints

**GET /api/learning/assignments**
- Get assignments (role-based)
- Returns: Array of assignments

**POST /api/learning/assignments/:id/submit**
- Submit assignment (Student only)
- Required: `file, notes`

**GET /api/learning/resources**
- Get learning resources
- Query params: `publishedOnly`

### Provider Endpoints

**GET /api/telehealth-pro/analytics**
- Get provider analytics
- Returns: `{ totalAppointments, uniquePatients, etc. }`

**GET /api/provider-earnings**
- Get provider earnings
- Returns: Earnings data

---

## Database Schema

### Core Models

**User**
- `id`, `email`, `password`, `firstName`, `lastName`, `role`, `phone`, `createdAt`, `updatedAt`

**Appointment**
- `id`, `patientId`, `providerId`, `appointmentDate`, `status`, `reason`, `createdAt`, `updatedAt`

**ConsultationNote**
- `id`, `appointmentId`, `providerId`, `patientId`, `notes`, `prescription`, `createdAt`, `updatedAt`

**BillingInvoice**
- `id`, `consultationNoteId`, `patientId`, `providerId`, `amount`, `status`, `dueDate`, `createdAt`, `updatedAt`

**Payment**
- `id`, `invoiceId`, `amount`, `paymentMethod`, `status`, `transactionId`, `createdAt`, `updatedAt`

**WellnessContent**
- `id`, `authorId`, `title`, `content`, `category`, `isPublished`, `createdAt`, `updatedAt`

**Assignment**
- `id`, `instructorId`, `title`, `description`, `dueDate`, `createdAt`, `updatedAt`

**AssignmentSubmission**
- `id`, `assignmentId`, `studentId`, `file`, `notes`, `status`, `grade`, `createdAt`, `updatedAt`

---

## Security & Compliance

### Authentication & Authorization

- **JWT Tokens:** Secure token-based authentication
- **Password Hashing:** bcrypt with salt rounds
- **Role-Based Access Control (RBAC):** Five roles with specific permissions
- **Protected Routes:** PrivateRoute component validates authentication
- **Contextual Redirects:** Preserves user navigation intent

### Data Security

- **Encryption:**
  - Passwords: bcrypt hashing
  - Financial data: AES-256-GCM encryption
  - Card data: Encrypted before storage
  - JWT tokens: Signed with secret key

### Compliance

- **POPIA:** Protection of Personal Information Act compliance structure
- **HIPAA:** HIPAA-inspired security measures
- **PCI-DSS:** Standards for payment processing
- **FHIR:** Interoperability for healthcare data exchange

### Fraud Prevention

- Payment audit logs
- Risk scoring system
- 2FA for high-value transactions
- Transaction monitoring
- Admin fraud detection dashboard

---

## Future Roadmap

### Phase 3 - Planned Features

#### Advanced Telehealth
- [ ] Real-time video consultations with WebRTC
- [ ] Screen sharing capabilities
- [ ] Virtual waiting rooms
- [ ] Appointment reminders via SMS/Email

#### Enhanced Analytics
- [ ] Provider performance dashboards
- [ ] Patient health trends
- [ ] System usage analytics
- [ ] Revenue reports

#### Mobile App Enhancements
- [ ] Push notifications
- [ ] Offline mode improvements
- [ ] Biometric authentication
- [ ] Health data sync

#### Integration
- [ ] Electronic Health Records (EHR) integration
- [ ] Laboratory result integration
- [ ] Pharmacy integration
- [ ] Insurance claim automation

### Technical Improvements

- [ ] GraphQL API option
- [ ] Microservices architecture
- [ ] Advanced caching (Redis)
- [ ] Real-time notifications (WebSockets)
- [ ] Advanced search (Elasticsearch)
- [ ] Performance monitoring (APM)
- [ ] Automated testing suite expansion

---

## Project Statistics

### Codebase
- **Total Files:** 450+
- **TypeScript Files:** 169 (backend) + 45 (frontend) = 214
- **React Components:** 60+
- **API Endpoints:** 50+
- **Database Models:** 20+

### Features
- **User Roles:** 5 (Patient, Provider, Coach, Student, Admin)
- **Navigation Items:** 30+ (role-based)
- **Dashboard Types:** 5 (one per role)
- **Quick Actions:** 15+ (role-based)
- **Languages Supported:** 3 (English, Afrikaans, Oshiwambo)

### Development
- **Build Tools:** TypeScript Compiler, Vite, Expo CLI
- **Containerization:** Docker, Docker Compose
- **Database:** PostgreSQL with Prisma ORM
- **Testing:** Jest (backend), React Testing Library (planned)

---

## Contributing

### Development Guidelines

1. **Code Style:**
   - TypeScript strict mode enabled
   - ESLint for code quality
   - Prettier for code formatting

2. **Git Workflow:**
   - Feature branches from `main`
   - Descriptive commit messages
   - Pull request reviews required

3. **Testing:**
   - Write tests for new features
   - Maintain test coverage
   - Test role-based access

4. **Documentation:**
   - Update README for major changes
   - Document new components
   - Update API documentation

---

## Support & Resources

### Documentation
- **README.md:** Main project overview
- **startup.md:** Step-by-step startup guide
- **docs/SETUP_GUIDE.md:** Complete setup instructions
- **docs/API_DOCUMENTATION.md:** API endpoints
- **docs/DATABASE_SCHEMA.md:** Database structure
- **docs/USER_GUIDE.md:** User-facing documentation

### Getting Help
- Check documentation in `docs/` directory
- Review `startup.md` for setup issues
- Check existing issues (if using GitHub)
- Contact development team

---

## License

**Proprietary** - HealthBridge Namibia

All rights reserved. This software and associated documentation files are proprietary to HealthBridge Namibia.

---

**Document Version:** 1.0.0  
**Last Updated:** December 2024  
**Maintained By:** HealthBridge Namibia Development Team

---

**Built with ❤️ for healthcare in Namibia**
