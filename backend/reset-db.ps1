# Reset database and seed admin user (PowerShell script)
# This script uses Docker to connect to the database

Write-Host "🔄 Resetting database and creating admin user..." -ForegroundColor Cyan

# Check if Docker is available
$dockerAvailable = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerAvailable) {
    Write-Host "❌ Docker is not available. Please install Docker or use a local database." -ForegroundColor Red
    exit 1
}

# Run seed script using Docker
Write-Host "🌱 Running seed script in Docker..." -ForegroundColor Yellow
.\seed-docker.ps1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database reset complete!" -ForegroundColor Green
} else {
    Write-Host "❌ Database reset failed!" -ForegroundColor Red
    exit 1
}

