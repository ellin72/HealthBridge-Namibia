# HealthBridge Namibia - Installation Guide for Windows

This guide will help you install all prerequisites needed to run the HealthBridge Namibia project on your Windows computer.

## Prerequisites Checklist

- [ ] Node.js 18+ and npm
- [ ] PostgreSQL 14+ (or Docker Desktop)
- [ ] Git
- [ ] Expo CLI (for mobile development - optional)
- [ ] Docker Desktop (optional, but recommended for easier database setup)

---

## Step 1: Install Node.js and npm

### Option A: Download from Official Website (Recommended)

1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** (Long Term Support) - should be Node.js 18 or higher
3. Run the installer (`.msi` file)
4. Follow the installation wizard:
   - Accept the license agreement
   - Choose installation location (default is fine)
   - **Important**: Make sure "Add to PATH" is checked
   - Click "Install"
5. Restart your terminal/PowerShell after installation

### Option B: Using Chocolatey (if you have it)

```powershell
choco install nodejs-lts
```

### Verify Installation

Open PowerShell or Command Prompt and run:

```powershell
node --version
npm --version
```

You should see versions like:
- `v18.x.x` or higher for Node.js
- `9.x.x` or higher for npm

---

## Step 2: Install Git (if not already installed)

### Check if Git is installed

```powershell
git --version
```

If you see a version number, Git is already installed. Skip to Step 3.

### Install Git

1. Visit [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Download the installer
3. Run the installer and follow the wizard:
   - Use default options (they're fine for most users)
   - Choose "Git from the command line and also from 3rd-party software"
   - Click "Next" through the rest
4. Restart your terminal after installation

### Verify Installation

```powershell
git --version
```

---

## Step 3: Install PostgreSQL Database

You have two options: Install PostgreSQL directly or use Docker (easier).

### Option A: Install PostgreSQL Directly

1. Visit [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Click "Download the installer"
3. Download PostgreSQL 14 or higher
4. Run the installer:
   - Choose installation directory (default is fine)
   - **Important**: Remember the password you set for the `postgres` user (you'll need it later)
   - Port: 5432 (default)
   - Locale: Default locale
   - Complete the installation

5. **Add PostgreSQL to PATH** (if not done automatically):
   - Find PostgreSQL installation (usually `C:\Program Files\PostgreSQL\14\bin`)
   - Add it to your system PATH environment variable

### Option B: Use Docker Desktop (Recommended - Easier Setup)

1. Visit [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Download Docker Desktop for Windows
3. Run the installer
4. Follow the installation wizard
5. Restart your computer when prompted
6. Launch Docker Desktop and wait for it to start (whale icon in system tray)

**Note**: Docker Desktop requires Windows 10/11 with WSL 2. If you don't have WSL 2, Docker will guide you through installing it.

### Verify PostgreSQL Installation

**If you installed PostgreSQL directly:**

```powershell
psql --version
```

**If using Docker:**

```powershell
docker --version
```

---

## Step 4: Install Expo CLI (For Mobile Development - Optional)

If you plan to run the mobile app, install the modern Expo CLI:

```powershell
npm install -g @expo/cli
```

**Important**: The old `expo-cli` package is deprecated. Use `@expo/cli` instead.

### Verify Installation

The modern way to use Expo is with `npx`:

```powershell
npx expo --version
```

Or if you want to use it from the mobile directory:

```powershell
cd mobile
npx expo --version
```

**Note**: 
- You can use `npx expo` from anywhere, or the scripts in `package.json` will automatically use the local Expo installation
- For mobile development, you'll also need:
  - **Android**: Android Studio with Android SDK (optional - you can use Expo Go app instead)
  - **iOS**: macOS with Xcode (Windows users can't develop iOS apps natively)
- For testing, you can use the **Expo Go** app on your phone (available on App Store and Google Play Store)

---

## Step 5: Install Project Dependencies

Now that all prerequisites are installed, let's install the project dependencies:

1. **Navigate to the project directory** (if not already there):

```powershell
cd C:\Users\hp\Documents\HealthBridge-Namibia
```

2. **Install all dependencies** (root, backend, frontend, and mobile):

```powershell
npm run install:all
```

Or install them individually:

```powershell
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..

# Mobile dependencies (optional)
cd mobile
npm install
cd ..
```

---

## Step 6: Set Up the Database

### If Using Docker (Recommended)

1. Make sure Docker Desktop is running
2. Start the database container:

```powershell
docker-compose up -d postgres
```

This will create and start a PostgreSQL container with the database already configured.

### If Using Local PostgreSQL

1. Open PowerShell as Administrator
2. Create the database:

```powershell
# Connect to PostgreSQL (you'll be prompted for the password you set during installation)
psql -U postgres

# In the PostgreSQL prompt, run:
CREATE DATABASE healthbridge;

# Exit PostgreSQL
\q
```

---

## Step 7: Configure Environment Variables

### Backend Configuration

1. Navigate to the backend directory:

```powershell
cd backend
```

2. Create a `.env` file (you can copy from `.env.example` if it exists, or create a new one):

```powershell
# If .env.example exists:
copy .env.example .env

# Or create a new .env file
notepad .env
```

3. Add the following content to `.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/healthbridge?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
FRONTEND_URL=http://localhost:3000
MOBILE_URL=http://localhost:8081
```

**Important**: Replace `YOUR_PASSWORD` with the PostgreSQL password you set during installation.

**If using Docker**, use this DATABASE_URL instead:

```env
DATABASE_URL="postgresql://healthbridge:healthbridge123@localhost:5432/healthbridge?schema=public"
```

### Frontend Configuration

1. Navigate to the frontend directory:

```powershell
cd ..\frontend
```

2. Create a `.env` file:

```powershell
notepad .env
```

3. Add the following content:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Step 8: Set Up the Database Schema

1. Navigate to the backend directory:

```powershell
cd ..\backend
```

2. Generate Prisma Client:

```powershell
npx prisma generate
```

3. Run database migrations:

```powershell
npx prisma migrate dev
```

This will create all the necessary database tables.

---

## Step 9: Verify Installation

### Test Backend

1. Start the backend server:

```powershell
cd backend
npm run dev
```

You should see the server running on `http://localhost:5000`

### Test Frontend

Open a new terminal window:

```powershell
cd frontend
npm run dev
```

The frontend should be available at `http://localhost:3000`

### Test Mobile (Optional)

Open another terminal window:

```powershell
cd mobile
npm start
```

This will start Expo. You can:
- Press `a` for Android emulator
- Press `i` for iOS simulator (macOS only)
- Scan QR code with Expo Go app on your phone

---

## Troubleshooting

### Node.js Issues

**"node is not recognized"**
- Restart your terminal/PowerShell
- Verify Node.js is in your PATH: `$env:PATH`
- Reinstall Node.js and make sure "Add to PATH" is checked

### PostgreSQL Issues

**"psql is not recognized"**
- Add PostgreSQL bin directory to PATH:
  - Usually: `C:\Program Files\PostgreSQL\14\bin`
  - Add via System Properties > Environment Variables

**"Connection refused"**
- Make sure PostgreSQL service is running:
  - Open Services (Win + R, type `services.msc`)
  - Find "postgresql-x64-14" and start it

### Docker Issues

**"Docker daemon is not running"**
- Make sure Docker Desktop is running (check system tray)
- Restart Docker Desktop if needed

**"WSL 2 required"**
- Install WSL 2: `wsl --install` in PowerShell as Administrator
- Restart your computer

### Database Connection Issues

**"password authentication failed"**
- Check your `.env` file DATABASE_URL
- Verify PostgreSQL password
- If using Docker, use: `healthbridge123` as password

**"database does not exist"**
- Create the database manually or run migrations
- Check DATABASE_URL in `.env`

### Port Already in Use

**"Port 5000 already in use"**
- Find and kill the process: `netstat -ano | findstr :5000`
- Or change PORT in backend `.env` file

---

## Quick Start Commands

Once everything is installed, you can use these commands:

```powershell
# Start database (if using Docker)
docker-compose up -d postgres

# Start backend (in one terminal)
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev

# Start mobile (in another terminal, optional)
cd mobile
npm start
```

---

## Next Steps

1. Read the [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) for detailed setup instructions
2. Review the [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) to understand the API
3. Check the [USER_GUIDE.md](docs/USER_GUIDE.md) for using the application

---

## Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the [SETUP_GUIDE.md](docs/SETUP_GUIDE.md)
3. Check the project's README.md files in each directory

