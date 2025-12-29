#!/bin/bash
# Reset database and seed admin user
# This script uses Docker to connect to the database

echo "🔄 Resetting database and creating admin user..."

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not available. Please install Docker or use a local database."
    exit 1
fi

# Run seed script using Docker
echo "🌱 Running seed script in Docker..."
./seed-docker.sh

if [ $? -eq 0 ]; then
    echo "✅ Database reset complete!"
else
    echo "❌ Database reset failed!"
    exit 1
fi

