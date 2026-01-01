# Run Prisma migrations using Docker Compose
# This script runs migrations in the backend container

Write-Host "🚀 Running Prisma migrations in Docker..." -ForegroundColor Cyan

# Check if docker-compose is available (try v2 first, then v1)
$composeCmd = $null
$dockerComposeV2 = Get-Command "docker" -ErrorAction SilentlyContinue
if ($dockerComposeV2) {
    $testResult = & docker compose version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $composeCmd = "docker compose"
    }
}

if (-not $composeCmd) {
    $dockerComposeV1 = Get-Command "docker-compose" -ErrorAction SilentlyContinue
    if ($dockerComposeV1) {
        $composeCmd = "docker-compose"
    } else {
        Write-Host "❌ Error: Docker Compose is not installed" -ForegroundColor Red
        exit 1
    }
}

# Navigate to project root (where docker-compose.yml is)
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootPath = Split-Path -Parent $scriptPath
Set-Location $rootPath

# Check if containers are running
$psOutput = & $composeCmd ps 2>&1
$backendRunning = $psOutput | Select-String -Pattern "healthbridge-api|healthbridge-backend|backend.*Up"

if (-not $backendRunning) {
    Write-Host "⚠️  Backend container is not running. Starting containers..." -ForegroundColor Yellow
    
    # Start postgres first
    Write-Host "Starting PostgreSQL..." -ForegroundColor Cyan
    & $composeCmd up -d postgres
    Start-Sleep -Seconds 5
    
    # Check if backend needs to be built
    Write-Host "Starting backend container..." -ForegroundColor Cyan
    & $composeCmd up -d --build backend
    
    Write-Host "⏳ Waiting for backend container to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
    
    # Verify backend is running
    $psCheck = & $composeCmd ps 2>&1
    $backendCheck = $psCheck | Select-String -Pattern "healthbridge-api|healthbridge-backend|backend.*Up"
    if (-not $backendCheck) {
        Write-Host "❌ Backend container failed to start. Please check logs with: docker-compose logs backend" -ForegroundColor Red
        exit 1
    }
}

# Run migrations in the backend container
Write-Host "📦 Running Prisma migrations..." -ForegroundColor Cyan
$migrateCommand = "cd /app; npx prisma migrate deploy"
& $composeCmd exec -T backend sh -c $migrateCommand
$migrateExitCode = $LASTEXITCODE

if ($migrateExitCode -eq 0) {
    Write-Host ""
    Write-Host "✅ Migrations completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Generating Prisma Client..." -ForegroundColor Cyan
    $generateCommand = "cd /app; npx prisma generate"
    & $composeCmd exec -T backend sh -c $generateCommand
    $generateExitCode = $LASTEXITCODE
    
    if ($generateExitCode -eq 0) {
        Write-Host "✅ Prisma Client generated!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Warning: Prisma Client generation had issues" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "❌ Migration failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}
