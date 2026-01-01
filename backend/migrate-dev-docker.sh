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

# Validate Prisma schema exists
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCHEMA_FILE="$SCRIPT_DIR/prisma/schema.prisma"
if [ ! -f "$SCHEMA_FILE" ]; then
    echo "❌ Error: Prisma schema not found at $SCHEMA_FILE"
    exit 1
fi

# Validate schema before running migrations
echo "🔍 Validating Prisma schema..."
$COMPOSE_CMD exec -T backend sh -c "cd /app && npx prisma validate" || {
    echo "❌ Error: Prisma schema validation failed"
    exit 1
}

# Ensure migrations directory exists
MIGRATIONS_DIR="$SCRIPT_DIR/prisma/migrations"
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "📁 Creating migrations directory..."
    mkdir -p "$MIGRATIONS_DIR"
    # Create .gitkeep if it doesn't exist
    touch "$MIGRATIONS_DIR/.gitkeep"
fi

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
$COMPOSE_CMD exec -T backend sh -c "cd /app && npx prisma migrate dev --name $MIGRATION_NAME" || {
    echo ""
    echo "❌ Migration failed. Please check the error messages above."
    exit 1
}

# Verify Prisma Client was generated (migrate dev automatically generates it)
echo "🔍 Verifying Prisma Client generation..."
$COMPOSE_CMD exec -T backend sh -c "cd /app && node -e \"try { require('@prisma/client'); console.log('✅ Prisma Client is available'); } catch(e) { console.error('❌ Prisma Client not found:', e.message); process.exit(1); }\"" || {
    echo "❌ Error: Prisma Client verification failed"
    exit 1
}

echo ""
echo "✅ Migration created and applied successfully!"

