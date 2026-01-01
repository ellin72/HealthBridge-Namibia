# HealthBridge Namibia - Phase 1 MVP

A comprehensive digital healthcare platform integrating telehealth, wellness resources, and e-learning for Namibian communities.

## Project Overview

HealthBridge Namibia is a comprehensive digital healthcare platform designed to provide:
- **Telehealth Services**: Appointment booking, consultation notes, and video consultations
- **Wellness Hub**: Nutrition guides, fitness routines, stress management tips, and interactive wellness tools
- **Learning Zone**: Educational resources, assignment submissions, and research support for healthcare students
- **AI-Powered Triage**: Intelligent symptom checker for urgency assessment
- **Medical Aid Integration**: Support for Namibian medical aid schemes
- **Billing System**: Secure payment processing with multiple payment methods, provider fee management, and automated invoicing
- **Multilingual Support**: English, Afrikaans, and Oshiwambo
- **Offline Capabilities**: Works offline with automatic sync

## How It Works

### Architecture Overview

HealthBridge Namibia follows a **three-tier architecture**:

1. **Frontend Layer** (React Web + React Native Mobile)
   - User interface and user experience
   - Client-side routing and state management
   - API communication via Axios
   - Offline-first with service workers

2. **Backend Layer** (Node.js/Express API)
   - RESTful API endpoints
   - Business logic and validation
   - Authentication and authorization
   - File upload handling
   - Payment gateway integration

3. **Data Layer** (PostgreSQL + Prisma ORM)
   - Relational database for structured data
   - Prisma ORM for type-safe database access
   - Migrations for schema versioning

### Authentication & Authorization Flow

1. **User Registration/Login**:
   - User submits credentials via frontend
   - Backend validates and hashes password (bcrypt)
   - JWT token generated and returned
   - Token stored in localStorage (web) or AsyncStorage (mobile)

2. **Protected Routes**:
   - Frontend checks for valid JWT token
   - Token included in API request headers
   - Backend middleware validates token
   - Role-based access control (RBAC) enforces permissions

3. **Role-Based Access**:
   - Each user has a role (PATIENT, HEALTHCARE_PROVIDER, WELLNESS_COACH, STUDENT, ADMIN)
   - Middleware checks user role before allowing access
   - Different endpoints available based on role

### Appointment Booking Flow

1. **Provider Selection**:
   - Patient navigates to "Book Appointment" → "Choose Provider"
   - System displays all available healthcare providers
   - Each provider shows their consultation fee
   - Patient selects a provider

2. **Appointment Creation**:
   - Patient selects date and time
   - System checks provider availability
   - Appointment created with status `PENDING`
   - Provider receives notification

3. **Provider Confirmation**:
   - Provider reviews appointment request
   - Provider confirms or cancels appointment
   - Status updated to `CONFIRMED` or `CANCELLED`

4. **Consultation & Billing**:
   - After consultation, provider creates consultation note
   - System automatically generates invoice using provider's consultation fee
   - Invoice includes consultation fee + any additional service fees
   - Patient receives invoice notification

5. **Payment Processing**:
   - Patient views invoice in billing dashboard
   - Patient initiates payment
   - System redirects to payment gateway (PayToday, SnapScan, etc.)
   - Payment processed securely
   - Digital receipt generated and sent via email/SMS
   - Invoice status updated to `PAID`

### Billing System Architecture

The billing system is fully integrated and secure:

1. **Provider Fee Management**:
   - Providers set their consultation fees in their profile
   - Fees can be set per consultation type
   - Additional service fees can be configured
   - Fees displayed to patients before booking

2. **Invoice Generation**:
   - Automatic invoice creation after consultation completion
   - Invoice includes:
     - Consultation fee (from provider's settings)
     - Additional service fees (if applicable)
     - Tax calculations
     - Payment due date

3. **Payment Processing**:
   - Multiple payment methods supported:
     - Debit/Credit cards (PCI-DSS compliant)
     - Mobile money (M-Pesa, etc.)
     - Bank transfers
     - Payment gateways (PayToday, SnapScan)
   - Two-factor authentication (2FA) for high-value transactions
   - Real-time transaction processing
   - Encrypted card data storage (AES-256-GCM)

4. **Security & Fraud Prevention**:
   - All financial data encrypted at rest and in transit
   - Payment audit logs for fraud detection
   - Risk scoring for suspicious transactions
   - 2FA required for payments above threshold
   - PCI-DSS compliance standards

5. **Provider Earnings**:
   - Providers can view earnings dashboard
   - Track total earnings, pending payouts
   - View payment history
   - Request payouts

6. **Admin Monitoring**:
   - Transaction monitoring dashboard
   - Fraud detection alerts
   - Reconciliation tools
   - System-wide financial analytics

### Data Flow Examples

#### Example 1: Patient Books Appointment
```
Patient → Frontend → API: POST /api/appointments
  → Backend validates user role (PATIENT)
  → Checks provider availability
  → Creates Appointment record
  → Returns appointment confirmation
  → Frontend updates UI
```

#### Example 2: Provider Creates Consultation Note
```
Provider → Frontend → API: POST /api/consultations
  → Backend validates user role (HEALTHCARE_PROVIDER)
  → Creates ConsultationNote record
  → Updates Appointment status to COMPLETED
  → Triggers automatic invoice generation
  → Creates BillingInvoice record
  → Sends notification to patient
```

#### Example 3: Patient Makes Payment
```
Patient → Frontend → API: POST /api/payments
  → Backend validates invoice and amount
  → Checks if 2FA required (based on amount)
  → If 2FA required: generates TOTP code
  → Patient verifies 2FA code
  → Backend calls payment gateway
  → Payment gateway processes transaction
  → Backend updates Payment status
  → Creates Receipt record
  → Sends digital receipt via email/SMS
  → Updates BillingInvoice status to PAID
```

### Module Interactions

1. **Telehealth Module**:
   - Creates appointments
   - Generates consultation notes
   - Triggers invoice generation
   - Links to billing system

2. **Billing Module**:
   - Receives consultation completion events
   - Generates invoices automatically
   - Processes payments
   - Tracks provider earnings
   - Manages receipts

3. **Wellness Module**:
   - Independent content management
   - Wellness coaches create content
   - Patients access wellness resources
   - Habit tracking and challenges

4. **Learning Module**:
   - Providers create assignments
   - Students submit assignments
   - Providers grade submissions
   - Research support tools

5. **Triage Module**:
   - AI-powered symptom assessment
   - Urgency level determination
   - Recommendations with confidence scores
   - Can suggest booking appointment

### Database Relationships

Key relationships in the system:

- **User** (1) → (N) **Appointment** (N) → (1) **User** (Provider)
- **Appointment** (1) → (1) **ConsultationNote**
- **ConsultationNote** (1) → (1) **BillingInvoice**
- **BillingInvoice** (1) → (N) **Payment**
- **Payment** (1) → (1) **Receipt**
- **User** (Provider) (1) → (1) **ProviderFee**
- **User** (1) → (N) **ProviderEarnings**
- **User** (1) → (N) **WellnessContent**
- **User** (1) → (N) **Assignment** (as instructor)
- **User** (1) → (N) **AssignmentSubmission** (as student)

### Security Features

1. **Data Encryption**:
   - Passwords: bcrypt hashing
   - Financial data: AES-256-GCM encryption
   - Card data: Encrypted before storage
   - JWT tokens: Signed with secret key

2. **Access Control**:
   - Role-based access control (RBAC)
   - Middleware validates permissions
   - API endpoints protected by authentication
   - CORS configured for allowed origins

3. **Fraud Prevention**:
   - Payment audit logs
   - Risk scoring system
   - 2FA for high-value transactions
   - Transaction monitoring

4. **Compliance**:
   - POPIA (Protection of Personal Information Act) compliance structure
   - HIPAA-inspired security measures
   - PCI-DSS standards for payment processing
   - FHIR interoperability for healthcare data exchange

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

**🚀 For step-by-step startup instructions, see [startup.md](./startup.md)** ⭐ **New developers start here!**

**📖 For detailed setup and configuration, see [docs/SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)**

### Quick Start (TL;DR)

1. **Prerequisites**: Install Node.js 18+, Docker Desktop, and Git
2. **Database**: `docker-compose up -d postgres`
3. **Backend**: 
   ```bash
   cd backend
   npm install
   npm run migrate:docker
   npm run dev:docker
   ```
4. **Frontend**: 
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
5. **Mobile** (optional): 
   ```bash
   cd mobile
   npm install
   npx expo install --fix
   npm start
   ```

**Note**: On Windows, use Docker-based commands (`dev:docker`, `migrate:docker`) to avoid networking issues.

### Development Workflow

1. **Start Services**:
   ```bash
   # Start database
   docker-compose up -d postgres
   
   # Start backend (in backend directory)
   npm run dev:docker
   
   # Start frontend (in frontend directory)
   npm run dev
   ```

2. **Database Migrations**:
   ```bash
   # After schema changes
   cd backend
   npm run migrate:docker
   
   # Or sync schema directly (dev only)
   docker-compose exec backend sh -c "cd /app; npx prisma db push"
   ```

3. **View Database**:
   ```bash
   # Open Prisma Studio
   cd backend
   npx prisma studio
   ```

4. **Testing**:
   - Backend API: `http://localhost:5000/api`
   - Frontend: `http://localhost:3000`
   - Prisma Studio: `http://localhost:5555`

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

#### Billing & Payment System
- **Provider Fee Management**: Providers set consultation and service fees
- **Automatic Invoice Generation**: Invoices created after consultations
- **Multiple Payment Methods**: 
  - Debit/Credit cards (PCI-DSS compliant)
  - Mobile money (M-Pesa, etc.)
  - Bank transfers
  - Payment gateways (PayToday, SnapScan)
- **Secure Payment Processing**: 
  - AES-256-GCM encryption for financial data
  - Two-factor authentication (2FA) for high-value transactions
  - Payment audit logs for fraud detection
- **Digital Receipts**: Email/SMS/app notifications after payments
- **Provider Earnings Dashboard**: Track earnings and payouts
- **Admin Monitoring**: Transaction monitoring and reconciliation tools
- **Subscription Support**: Foundation for wellness plans and student packages

#### Offline-First Capabilities
- Service worker for offline caching
- Local storage queue for offline actions
- Automatic sync when connection is restored

#### Enhanced Security & Compliance
- AES-256-GCM encryption for sensitive data
- POPIA/HIPAA compliance structure
- FHIR interoperability for healthcare system integration

## Documentation

- **[startup.md](./startup.md)** - Step-by-step startup guide for new developers ⭐ **Start here!**
- **[docs/SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)** - Complete setup and configuration guide
- **[docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)** - API endpoints and usage
- **[docs/DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)** - Database structure and relationships
- **[docs/USER_GUIDE.md](./docs/USER_GUIDE.md)** - User-facing feature documentation
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Database migration guide for Docker
- **[docs/README.md](./docs/README.md)** - Documentation index

## Development

### Project Structure

```
HealthBridge-Namibia/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # API route definitions
│   │   ├── middleware/        # Auth, validation middleware
│   │   ├── utils/             # Helper functions
│   │   └── server.ts          # Express server setup
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Database seeding
│   ├── Dockerfile             # Docker configuration
│   └── package.json
├── frontend/                   # React web application
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts (Auth, etc.)
│   │   ├── services/          # API service functions
│   │   └── utils/             # Helper functions
│   └── package.json
├── mobile/                     # React Native mobile app
│   ├── src/
│   │   ├── screens/           # Screen components
│   │   ├── contexts/          # React contexts
│   │   └── services/          # API service functions
│   └── package.json
├── docs/                       # Documentation
├── docker-compose.yml          # Docker services configuration
├── startup.md                  # Startup guide
└── README.md                   # This file
```

### Key Technologies

- **Backend**: Express.js, TypeScript, Prisma ORM, JWT, bcrypt
- **Frontend**: React, TypeScript, Material-UI, React Router, React Query
- **Mobile**: React Native, Expo, TypeScript
- **Database**: PostgreSQL 14+
- **Containerization**: Docker, Docker Compose
- **Payment**: PayToday, SnapScan integration
- **Security**: AES-256-GCM, 2FA (TOTP), JWT

### Common Tasks

**Database Migrations**:
```bash
cd backend
npm run migrate:docker              # Apply migrations
docker-compose exec backend sh -c "cd /app; npx prisma db push"  # Sync schema (dev)
npx prisma studio                   # View database
```

**Running Services**:
```bash
docker-compose up -d               # Start all services
docker-compose logs -f            # View logs
docker-compose down               # Stop all services
```

**Development**:
```bash
# Backend
cd backend && npm run dev:docker

# Frontend
cd frontend && npm run dev

# Mobile
cd mobile && npm start
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on contributing to the project.

## Support

For issues, questions, or contributions:
- Check the [documentation](./docs/) directory
- Review [startup.md](./startup.md) for setup help
- Check existing issues (if using GitHub)

## License

Proprietary - HealthBridge Namibia

---

**Built with ❤️ for healthcare in Namibia**

