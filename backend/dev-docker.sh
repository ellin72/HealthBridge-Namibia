#!/bin/bash
# Run backend dev server in Docker

cd "$(dirname "$0")"

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

docker run --rm -it \
  -v "$VOLUME_PATH" \
  -w /app \
  -p 5000:5000 \
  --network healthbridge-namibia_default \
  -e DATABASE_URL="postgresql://healthbridge:healthbridge123@postgres:5432/healthbridge?schema=public" \
  -e JWT_SECRET="development-secret-key-change-in-production" \
  -e JWT_EXPIRES_IN="7d" \
  -e PORT="5000" \
  -e NODE_ENV="development" \
  node:18 sh -c "npm ci && npm run dev"

