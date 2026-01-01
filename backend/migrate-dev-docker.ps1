# Run Prisma migrations in development mode (creates new migration)
# This script runs migrations in the backend container

param(
    [string]$MigrationName = "update_schema"
)

Write-Host "🚀 Running Prisma migrations (dev mode) in Docker..." -ForegroundColor Cyan

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
$backendRunning = $psOutput | Select-String -Pattern "healthbridge-api|healthbridge-backend"

if (-not $backendRunning) {
    Write-Host "⚠️  Backend container is not running. Starting containers..." -ForegroundColor Yellow
    & $composeCmd up -d postgres
    Start-Sleep -Seconds 5
    & $composeCmd up -d backend
    Write-Host "⏳ Waiting for backend container to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

# Run migrations in dev mode (creates new migration)
Write-Host "📦 Creating new migration: $MigrationName" -ForegroundColor Cyan
$migrateCommand = "cd /app; npx prisma migrate dev --name $MigrationName"
& $composeCmd exec -T backend sh -c $migrateCommand
$exitCode = $LASTEXITCODE

if ($exitCode -eq 0) {
    Write-Host ""
    Write-Host "✅ Migration created and applied successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Migration failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}
