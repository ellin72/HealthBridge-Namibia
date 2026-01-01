# Simple migration script - runs migrations in a temporary container
# This avoids needing the backend container to be running

Write-Host "🚀 Running Prisma migrations in Docker..." -ForegroundColor Cyan

# Navigate to project root
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootPath = Split-Path -Parent $scriptPath
Set-Location $rootPath

# Validate Prisma schema exists
$schemaFile = Join-Path $scriptPath "prisma\schema.prisma"
if (-not (Test-Path $schemaFile)) {
    Write-Host "❌ Error: Prisma schema not found at $schemaFile" -ForegroundColor Red
    exit 1
}

# Validate schema before running migrations
Write-Host "🔍 Validating Prisma schema..." -ForegroundColor Cyan
docker run --rm `
    -v "${scriptPath}:/app" `
    -w /app `
    node:18-alpine sh -c "npx prisma validate"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Prisma schema validation failed" -ForegroundColor Red
    exit 1
}

# Ensure migrations directory exists
$migrationsDir = Join-Path $scriptPath "prisma\migrations"
if (-not (Test-Path $migrationsDir)) {
    Write-Host "📁 Creating migrations directory..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $migrationsDir -Force | Out-Null
    # Create .gitkeep if it doesn't exist
    $gitkeepPath = Join-Path $migrationsDir ".gitkeep"
    if (-not (Test-Path $gitkeepPath)) {
        New-Item -ItemType File -Path $gitkeepPath -Force | Out-Null
    }
}

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
$migrateCommand = "cd /app && npm ci && npx prisma migrate deploy"

Write-Host "📦 Running Prisma migrations..." -ForegroundColor Cyan
docker run --rm `
    -v "${backendPath}:/app" `
    -w /app `
    --network $networkName `
    -e DATABASE_URL="postgresql://healthbridge:healthbridge123@postgres:5432/healthbridge?schema=public" `
    node:18-alpine sh -c $migrateCommand

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Migration failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}

# Generate Prisma Client
Write-Host ""
Write-Host "📝 Generating Prisma Client..." -ForegroundColor Cyan
$generateCommand = "cd /app && npx prisma generate"
docker run --rm `
    -v "${backendPath}:/app" `
    -w /app `
    node:18-alpine sh -c $generateCommand

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Prisma Client generation failed" -ForegroundColor Red
    exit 1
}

# Verify Prisma Client was generated successfully
Write-Host "🔍 Verifying Prisma Client generation..." -ForegroundColor Cyan
$verifyCommand = "cd /app && node -e `"try { require('@prisma/client'); console.log('✅ Prisma Client is available'); } catch(e) { console.error('❌ Prisma Client not found:', e.message); process.exit(1); }`""
docker run --rm `
    -v "${backendPath}:/app" `
    -w /app `
    node:18-alpine sh -c $verifyCommand

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Prisma Client verification failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Migrations completed successfully!" -ForegroundColor Green

