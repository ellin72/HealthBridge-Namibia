# Run Prisma migrations from inside Docker to avoid Windows networking issues
# This script runs the migration in a temporary Node.js container on the same network as the database

Write-Host "Running Prisma migrations from Docker container..." -ForegroundColor Green

$backendPath = (Get-Location).Path
$rootPath = Split-Path $backendPath -Parent

docker run --rm `
    -v "${backendPath}:/app" `
    -w /app `
    --network healthbridge-namibia_default `
    -e DATABASE_URL="postgresql://healthbridge:healthbridge123@postgres:5432/healthbridge?schema=public" `
    node:18-alpine sh -c "npm install && npx prisma migrate dev"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Migrations completed successfully!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Migration failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}

