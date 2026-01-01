# Prisma Migration Guide for Docker

This guide explains how to run Prisma migrations when using Docker.

## Quick Start

### Option 1: Using Migration Scripts (Recommended)

**For Production/Deploy Migrations:**
```bash
# Linux/Mac
cd backend
./run-migration-docker.sh

# Windows PowerShell
cd backend
.\run-migration-docker.ps1
```

**For Development (Creates New Migration):**
```bash
# Linux/Mac
cd backend
./migrate-dev-docker.sh migration_name

# Windows PowerShell
cd backend
.\migrate-dev-docker.ps1 -MigrationName "migration_name"
```

### Option 2: Using Docker Compose Directly

**Run migrations in the backend container:**
```bash
# From project root
docker-compose exec backend sh -c "cd /app && npx prisma migrate deploy"
docker-compose exec backend sh -c "cd /app && npx prisma generate"
```

**Or using docker compose (v2):**
```bash
docker compose exec backend sh -c "cd /app && npx prisma migrate deploy"
docker compose exec backend sh -c "cd /app && npx prisma generate"
```

### Option 3: Using Migration Service

```bash
# From project root
docker-compose -f docker-compose.yml -f docker-compose.migrate.yml run --rm migration
```

## Migration Commands

### Deploy Migrations (Production)
Applies pending migrations without creating new ones:
```bash
docker-compose exec backend sh -c "cd /app && npx prisma migrate deploy"
```

### Create New Migration (Development)
Creates a new migration file based on schema changes:
```bash
docker-compose exec backend sh -c "cd /app && npx prisma migrate dev --name migration_name"
```

### Reset Database (Development Only)
⚠️ **WARNING**: This will delete all data!
```bash
docker-compose exec backend sh -c "cd /app && npx prisma migrate reset"
```

### Generate Prisma Client
After schema changes, regenerate the Prisma Client:
```bash
docker-compose exec backend sh -c "cd /app && npx prisma generate"
```

### View Migration Status
Check which migrations have been applied:
```bash
docker-compose exec backend sh -c "cd /app && npx prisma migrate status"
```

## Troubleshooting

### Container Not Running
If the backend container is not running:
```bash
docker-compose up -d backend
```

### Database Connection Issues
Ensure the postgres container is healthy:
```bash
docker-compose ps
```

If postgres is not running:
```bash
docker-compose up -d postgres
```

### Permission Issues (Linux/Mac)
Make scripts executable:
```bash
chmod +x backend/run-migration-docker.sh
chmod +x backend/migrate-dev-docker.sh
```

### Network Issues
Ensure containers are on the same network:
```bash
docker-compose ps
```

All containers should be on the `healthbridge-namibia_default` network.

## Workflow Examples

### Initial Setup
```bash
# 1. Start database
docker-compose up -d postgres

# 2. Run migrations
cd backend
./run-migration-docker.sh

# 3. Start all services
cd ..
docker-compose up -d
```

### After Schema Changes
```bash
# 1. Make changes to backend/prisma/schema.prisma

# 2. Create and apply migration
cd backend
./migrate-dev-docker.sh add_billing_system

# 3. Restart backend to pick up changes
cd ..
docker-compose restart backend
```

### Production Deployment
```bash
# 1. Deploy migrations (applies pending migrations)
cd backend
./run-migration-docker.sh

# 2. Restart services
cd ..
docker-compose restart backend
```

## Notes

- Migrations run in the backend container, which has access to the database
- The `DATABASE_URL` is automatically set from docker-compose environment variables
- Always run `prisma generate` after schema changes to update the Prisma Client
- In production, use `prisma migrate deploy` (doesn't create new migrations)
- In development, use `prisma migrate dev` (creates new migration files)

