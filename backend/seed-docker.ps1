# Run database seed from inside Docker (PowerShell script)

Write-Host "Running database seed from Docker container..." -ForegroundColor Cyan

# Get current directory and convert to Windows path for Docker
$currentDir = Get-Location
$winPath = $currentDir.Path

# Convert backslashes to forward slashes for Docker and create volume path
# Use single quotes to prevent variable expansion issues
$volumePath = $winPath + ':/app'

Write-Host "Starting Docker container..." -ForegroundColor Yellow

docker run --rm `
  -v "$volumePath" `
  -w /app `
  --network healthbridge-namibia_default `
  -e DATABASE_URL="postgresql://healthbridge:healthbridge123@postgres:5432/healthbridge?schema=public" `
  node:18 sh -c "npm install; npm run prisma:seed"

if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "Database seed completed successfully!" -ForegroundColor Green
} else {
  Write-Host ""
  Write-Host "Seed failed. Please check the error messages above." -ForegroundColor Red
  exit 1
}

