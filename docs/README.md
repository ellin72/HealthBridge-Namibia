# HealthBridge Namibia - Documentation

Welcome to the HealthBridge Namibia documentation. This directory contains comprehensive documentation for the Phase 1 MVP implementation.

## Documentation Index

### [API Documentation](./API_DOCUMENTATION.md)
Complete API reference with all endpoints, request/response formats, authentication, and error handling.

### [Setup Guide](./SETUP_GUIDE.md)
Step-by-step instructions for setting up the development environment, including backend, frontend, and mobile app.

### [Deployment Guide](./DEPLOYMENT_GUIDE.md)
Production deployment instructions, security checklist, scaling considerations, and maintenance procedures.

### [Database Schema](./DATABASE_SCHEMA.md)
Detailed database schema documentation, entity relationships, indexes, and query optimization tips.

### [User Guide](./USER_GUIDE.md)
End-user documentation covering all features, user roles, and how to use the platform.

## Quick Links

- **Getting Started**: See [Setup Guide](./SETUP_GUIDE.md)
- **API Reference**: See [API Documentation](./API_DOCUMENTATION.md)
- **Deploying**: See [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- **Database**: See [Database Schema](./DATABASE_SCHEMA.md)
- **Using the Platform**: See [User Guide](./USER_GUIDE.md)

## Project Structure

```
HealthBridge-Namibia/
├── backend/          # Node.js/Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── prisma/
│       └── schema.prisma
├── frontend/         # React web application
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── contexts/
│       └── services/
├── mobile/           # React Native mobile app
│   └── src/
│       ├── screens/
│       ├── contexts/
│       └── services/
└── docs/            # This documentation
```

## Technology Stack

- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend**: React, TypeScript, Material-UI, Vite
- **Mobile**: React Native, Expo, TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT

## Key Features

1. **Telehealth Module**
   - Appointment booking
   - Consultation notes
   - Provider management

2. **Wellness Hub**
   - Nutrition guides
   - Fitness routines
   - Stress management tips

3. **Learning Zone**
   - Resource uploads
   - Assignment management
   - Submission and grading

## Support

For questions or issues:
- Review the relevant documentation
- Check the troubleshooting sections
- Contact the development team

## Version

This documentation is for **Phase 1 MVP** of HealthBridge Namibia.

