# Running Prisma Migrations in Docker

## Quick Commands

### Production/Deploy Migrations
Applies all pending migrations:
```bash
# Windows PowerShell
.\run-migration-docker.ps1

# Linux/Mac
./run-migration-docker.sh

# Or using npm
npm run migrate:deploy
```

### Development (Create New Migration)
Creates a new migration file:
```bash
# Windows PowerShell
.\migrate-dev-docker.ps1 -MigrationName "add_billing_system"

# Linux/Mac
./migrate-dev-docker.sh add_billing_system

# Or using docker-compose directly
docker-compose exec backend sh -c "cd /app && npx prisma migrate dev --name migration_name"
```

## Manual Commands

### Using Docker Compose
```bash
# From project root directory
docker-compose exec backend sh -c "cd /app && npx prisma migrate deploy"
docker-compose exec backend sh -c "cd /app && npx prisma generate"
```

### Using Docker Compose v2
```bash
docker compose exec backend sh -c "cd /app && npx prisma migrate deploy"
docker compose exec backend sh -c "cd /app && npx prisma generate"
```

## Common Workflows

### After Schema Changes
1. Edit `prisma/schema.prisma`
2. Run: `.\migrate-dev-docker.ps1 -MigrationName "description_of_changes"`
3. Restart backend: `docker-compose restart backend`

### Initial Setup
1. Start database: `docker-compose up -d postgres`
2. Run migrations: `.\run-migration-docker.ps1`
3. Start all services: `docker-compose up -d`

### Check Migration Status
```bash
docker-compose exec backend sh -c "cd /app && npx prisma migrate status"
```

## Troubleshooting

**Container not running?**
```bash
docker-compose up -d backend
```

**Database not accessible?**
```bash
docker-compose up -d postgres
docker-compose ps  # Check container status
```

**Permission denied (Linux/Mac)?**
```bash
chmod +x run-migration-docker.sh migrate-dev-docker.sh
```

