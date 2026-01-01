# Simple migration script - runs migrations in a temporary container
# This avoids needing the backend container to be running

Write-Host "🚀 Running Prisma migrations in Docker..." -ForegroundColor Cyan

# Navigate to project root
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootPath = Split-Path -Parent $scriptPath
Set-Location $rootPath

# Check if docker-compose is available
$composeCmd = $null
if (Get-Command "docker" -ErrorAction SilentlyContinue) {
    $testResult = & docker compose version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $composeCmd = "docker compose"
    }
}

if (-not $composeCmd) {
    if (Get-Command "docker-compose" -ErrorAction SilentlyContinue) {
        $composeCmd = "docker-compose"
    } else {
        Write-Host "❌ Error: Docker Compose is not installed" -ForegroundColor Red
        exit 1
    }
}

# Ensure postgres is running
Write-Host "Checking PostgreSQL container..." -ForegroundColor Cyan
& $composeCmd up -d postgres
Start-Sleep -Seconds 3

# Get the network name
$networkName = "healthbridge-namibia_default"
$psOutput = & $composeCmd ps 2>&1
$networkCheck = & docker network ls | Select-String -Pattern $networkName
if (-not $networkCheck) {
    # Try to get network from docker-compose
    $networkName = (& $composeCmd config 2>&1 | Select-String -Pattern "name:" | Select-Object -First 1)
    if ($networkName) {
        $networkName = $networkName.ToString().Split(":")[1].Trim()
    } else {
        $networkName = "healthbridge-namibia_default"
    }
}

Write-Host "📦 Running Prisma migrations in temporary container..." -ForegroundColor Cyan
Write-Host "Network: $networkName" -ForegroundColor Gray

# Run migrations in a temporary container
$backendPath = Join-Path $rootPath "backend"
$migrateCommand = "cd /app; npm install; npx prisma migrate deploy; npx prisma generate"

docker run --rm `
    -v "${backendPath}:/app" `
    -w /app `
    --network $networkName `
    -e DATABASE_URL="postgresql://healthbridge:healthbridge123@postgres:5432/healthbridge?schema=public" `
    node:18-alpine sh -c $migrateCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Migrations completed successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Migration failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}

