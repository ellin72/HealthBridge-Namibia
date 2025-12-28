#!/bin/bash
# Run backend dev server in Docker

cd "$(dirname "$0")"

docker run --rm -it \
  -v "$(pwd):/app" \
  -w /app \
  -p 5000:5000 \
  --network healthbridge-namibia_default \
  -e DATABASE_URL="postgresql://healthbridge:healthbridge123@postgres:5432/healthbridge?schema=public" \
  -e JWT_SECRET="development-secret-key-change-in-production" \
  -e JWT_EXPIRES_IN="7d" \
  -e PORT="5000" \
  -e NODE_ENV="development" \
  node:18 sh -c "npm install && npm run dev"

