#!/bin/bash
# Run Prisma migrations from inside Docker to avoid Windows networking issues

docker-compose exec -T postgres psql -U healthbridge -d healthbridge -c "SELECT 1;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "Database is accessible. Running migrations from Docker container..."
    docker run --rm \
        -v "${PWD}:/app" \
        -w /app \
        --network healthbridge-namibia_default \
        -e DATABASE_URL="postgresql://healthbridge:healthbridge123@postgres:5432/healthbridge?schema=public" \
        node:18-alpine sh -c "npm install && npx prisma migrate dev"
else
    echo "Error: Cannot connect to database"
    exit 1
fi

