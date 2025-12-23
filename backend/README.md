# HealthBridge Backend API

Node.js/Express backend API for HealthBridge Namibia.

## Setup

1. Install dependencies: `npm install`
2. Configure `.env` file (see `.env.example`)
3. Run migrations: `npx prisma migrate dev`
4. Start server: `npm run dev`

## API Endpoints

See `docs/API_DOCUMENTATION.md` for complete API reference.

## Database

Uses PostgreSQL with Prisma ORM. Schema defined in `prisma/schema.prisma`.

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run prisma:studio`: Open Prisma Studio

