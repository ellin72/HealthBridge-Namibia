#!/bin/bash
# Run Prisma migrations in development mode (creates new migration)
# This script runs migrations in the backend container

set -e

echo "🚀 Running Prisma migrations (dev mode) in Docker..."

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null && ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed"
    exit 1
fi

# Use docker compose (v2) or docker-compose (v1)
COMPOSE_CMD="docker compose"
if ! docker compose version &> /dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Error: Docker Compose is not installed"
        exit 1
    fi
fi

# Get migration name from argument or use default
MIGRATION_NAME=${1:-"update_schema"}

# Check if containers are running
if ! $COMPOSE_CMD ps | grep -q "healthbridge-api\|healthbridge-backend"; then
    echo "⚠️  Backend container is not running. Starting containers..."
    $COMPOSE_CMD up -d postgres
    sleep 5
    $COMPOSE_CMD up -d backend
    echo "⏳ Waiting for backend container to be ready..."
    sleep 10
fi

# Run migrations in dev mode (creates new migration)
echo "📦 Creating new migration: $MIGRATION_NAME"
$COMPOSE_CMD exec -T backend sh -c "cd /app && npx prisma migrate dev --name $MIGRATION_NAME"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration created and applied successfully!"
else
    echo ""
    echo "❌ Migration failed. Please check the error messages above."
    exit 1
fi

