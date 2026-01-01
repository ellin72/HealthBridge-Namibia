#!/bin/bash
# Simple migration script - runs migrations in a temporary container
# This avoids needing the backend container to be running

set -e

echo "🚀 Running Prisma migrations in Docker..."

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

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

# Ensure postgres is running
echo "Checking PostgreSQL container..."
$COMPOSE_CMD up -d postgres
sleep 3

# Get the network name
NETWORK_NAME="healthbridge-namibia_default"
if ! docker network ls | grep -q "$NETWORK_NAME"; then
    # Try to get network from docker-compose
    NETWORK_FROM_CONFIG=$($COMPOSE_CMD config 2>/dev/null | grep -i "name:" | head -1 | awk '{print $2}' | tr -d '"')
    if [ -n "$NETWORK_FROM_CONFIG" ]; then
        NETWORK_NAME="$NETWORK_FROM_CONFIG"
    fi
fi

echo "📦 Running Prisma migrations in temporary container..."
echo "Network: $NETWORK_NAME"

# Validate Prisma schema exists
BACKEND_DIR="$ROOT_DIR/backend"
SCHEMA_FILE="$BACKEND_DIR/prisma/schema.prisma"
if [ ! -f "$SCHEMA_FILE" ]; then
    echo "❌ Error: Prisma schema not found at $SCHEMA_FILE"
    exit 1
fi

# Validate schema before running migrations
echo "🔍 Validating Prisma schema..."
docker run --rm \
    -v "${BACKEND_DIR}:/app" \
    -w /app \
    node:18-alpine sh -c "npx prisma validate" || {
    echo "❌ Error: Prisma schema validation failed"
    exit 1
}

# Ensure migrations directory exists
MIGRATIONS_DIR="$BACKEND_DIR/prisma/migrations"
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "📁 Creating migrations directory..."
    mkdir -p "$MIGRATIONS_DIR"
fi

# Run migrations in a temporary container
echo "📦 Running Prisma migrations..."
MIGRATE_COMMAND="cd /app && npm ci && npx prisma migrate deploy"

docker run --rm \
    -v "${BACKEND_DIR}:/app" \
    -w /app \
    --network "$NETWORK_NAME" \
    -e DATABASE_URL="postgresql://healthbridge:healthbridge123@postgres:5432/healthbridge?schema=public" \
    node:18-alpine sh -c "$MIGRATE_COMMAND" || {
    echo "❌ Migration failed. Please check the error messages above."
    exit 1
}

# Generate Prisma Client
echo ""
echo "📝 Generating Prisma Client..."
GENERATE_COMMAND="cd /app && npx prisma generate"

docker run --rm \
    -v "${BACKEND_DIR}:/app" \
    -w /app \
    node:18-alpine sh -c "$GENERATE_COMMAND" || {
    echo "❌ Error: Prisma Client generation failed"
    exit 1
}

# Verify Prisma Client was generated successfully
echo "🔍 Verifying Prisma Client generation..."
VERIFY_COMMAND="cd /app && node -e \"try { require('@prisma/client'); console.log('✅ Prisma Client is available'); } catch(e) { console.error('❌ Prisma Client not found:', e.message); process.exit(1); }\""

docker run --rm \
    -v "${BACKEND_DIR}:/app" \
    -w /app \
    node:18-alpine sh -c "$VERIFY_COMMAND" || {
    echo "❌ Error: Prisma Client verification failed"
    exit 1
}

echo ""
echo "✅ Migrations completed successfully!"

