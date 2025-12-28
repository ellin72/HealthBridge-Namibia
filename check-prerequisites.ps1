# HealthBridge Namibia - Prerequisites Check Script
# This script checks if all required prerequisites are installed

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HealthBridge Namibia - Prerequisites Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($nodeMajor -ge 18) {
        Write-Host "  ✓ Node.js $nodeVersion is installed (Required: 18+)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Node.js $nodeVersion is installed, but version 18+ is required" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "  ✗ Node.js is not installed or not in PATH" -ForegroundColor Red
    $allGood = $false
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  ✓ npm $npmVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "  ✗ npm is not installed or not in PATH" -ForegroundColor Red
    $allGood = $false
}

# Check Git
Write-Host "Checking Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "  ✓ $gitVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Git is not installed or not in PATH" -ForegroundColor Red
    $allGood = $false
}

# Check PostgreSQL (direct installation)
Write-Host "Checking PostgreSQL (direct installation)..." -ForegroundColor Yellow
try {
    $psqlVersion = psql --version
    Write-Host "  ✓ PostgreSQL is installed: $psqlVersion" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ PostgreSQL (direct) not found - checking Docker..." -ForegroundColor Yellow
    
    # Check Docker
    Write-Host "Checking Docker..." -ForegroundColor Yellow
    try {
        $dockerVersion = docker --version
        Write-Host "  ✓ Docker is installed: $dockerVersion" -ForegroundColor Green
        
        # Check if Docker is running
        try {
            docker ps | Out-Null
            Write-Host "  ✓ Docker is running" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠ Docker is installed but not running. Please start Docker Desktop." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ✗ Neither PostgreSQL nor Docker found" -ForegroundColor Red
        Write-Host "    You need either PostgreSQL 14+ or Docker Desktop installed" -ForegroundColor Red
        $allGood = $false
    }
}

# Check Expo CLI (optional)
Write-Host "Checking Expo CLI (optional for mobile)..." -ForegroundColor Yellow
try {
    $expoVersion = expo --version
    Write-Host "  ✓ Expo CLI $expoVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ Expo CLI is not installed (optional - only needed for mobile development)" -ForegroundColor Yellow
}

# Check project dependencies
Write-Host ""
Write-Host "Checking project dependencies..." -ForegroundColor Yellow

if (Test-Path "backend\node_modules") {
    Write-Host "  ✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Backend dependencies not installed. Run: cd backend && npm install" -ForegroundColor Yellow
}

if (Test-Path "frontend\node_modules") {
    Write-Host "  ✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Frontend dependencies not installed. Run: cd frontend && npm install" -ForegroundColor Yellow
}

if (Test-Path "mobile\node_modules") {
    Write-Host "  ✓ Mobile dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Mobile dependencies not installed. Run: cd mobile && npm install" -ForegroundColor Yellow
}

# Check environment files
Write-Host ""
Write-Host "Checking environment configuration..." -ForegroundColor Yellow

if (Test-Path "backend\.env") {
    Write-Host "  ✓ Backend .env file exists" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Backend .env file not found. Create it from .env.example" -ForegroundColor Yellow
}

if (Test-Path "frontend\.env") {
    Write-Host "  ✓ Frontend .env file exists" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Frontend .env file not found. Create it with VITE_API_URL" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✓ All required prerequisites are installed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Configure your .env files (see INSTALLATION_GUIDE.md)" -ForegroundColor White
    Write-Host "2. Set up the database (run: npx prisma migrate dev in backend folder)" -ForegroundColor White
    Write-Host "3. Start the backend: cd backend && npm run dev" -ForegroundColor White
    Write-Host "4. Start the frontend: cd frontend && npm run dev" -ForegroundColor White
} else {
    Write-Host "✗ Some prerequisites are missing. Please install them first." -ForegroundColor Red
    Write-Host ""
    Write-Host "See INSTALLATION_GUIDE.md for detailed installation instructions." -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan

