#!/bin/bash
# Run Prisma migrations from inside Docker to avoid Windows networking issues

echo "Running Prisma migrations from Docker container..."

docker run --rm \
  -v "$(pwd):/app" \
  -w /app \
  --network healthbridge-namibia_default \
  -e DATABASE_URL="postgresql://healthbridge:healthbridge123@postgres:5432/healthbridge?schema=public" \
  node:18 sh -c "npm install && npx prisma migrate dev --name init"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migrations completed successfully!"
else
  echo ""
  echo "❌ Migration failed. Please check the error messages above."
  exit 1
fi

