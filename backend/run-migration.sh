#!/bin/bash
# Run Prisma migrations from inside Docker to avoid Windows networking issues

echo "Running Prisma migrations from Docker container..."

# Convert Git Bash path to Windows path for Docker on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
  # On Windows (Git Bash/Cygwin), convert Unix path to Windows path
  if command -v cygpath &> /dev/null; then
    WIN_PATH=$(cygpath -w "$(pwd)")
  else
    # Fallback: convert /c/Users/... to C:/Users/... (Docker accepts forward slashes)
    CURRENT_DIR=$(pwd)
    WIN_PATH=$(echo "$CURRENT_DIR" | sed -E 's|^/([a-z])/|\1:/|')
  fi
  VOLUME_PATH="$WIN_PATH:/app"
else
  # On Unix-like systems, use path as-is
  VOLUME_PATH="$(pwd):/app"
fi

docker run --rm \
  -v "$VOLUME_PATH" \
  -w /app \
  --network healthbridge-namibia_default \
  -e DATABASE_URL="postgresql://healthbridge:healthbridge123@postgres:5432/healthbridge?schema=public" \
  node:18 sh -c "npm ci && npx prisma migrate dev --name init"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migrations completed successfully!"
else
  echo ""
  echo "❌ Migration failed. Please check the error messages above."
  exit 1
fi

