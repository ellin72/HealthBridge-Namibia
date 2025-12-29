# Database Setup Guide

## PostgreSQL Connection Error Fix

If you're getting authentication errors, follow these steps:

### Option 1: Use Default PostgreSQL Credentials

If you have PostgreSQL installed with default settings, update your `.env` file:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/healthbridge?schema=public
```

Replace `YOUR_PASSWORD` with your PostgreSQL `postgres` user password.

### Option 2: Create the Database and User

If you want to use the `healthbridge` user, run these commands in PostgreSQL:

1. **Open PostgreSQL Command Line** (psql) or use pgAdmin

2. **Connect as postgres user:**
   ```sql
   psql -U postgres
   ```

3. **Create the database:**
   ```sql
   CREATE DATABASE healthbridge;
   ```

4. **Create the user and set password:**
   ```sql
   CREATE USER healthbridge WITH PASSWORD 'healthbridge123';
   ```

5. **Grant privileges:**
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE healthbridge TO healthbridge;
   \c healthbridge
   GRANT ALL ON SCHEMA public TO healthbridge;
   ```

6. **Exit psql:**
   ```sql
   \q
   ```

### Option 3: Check Your Current PostgreSQL Setup

1. **Check if PostgreSQL is running:**
   ```powershell
   Get-Service -Name "*postgresql*"
   ```

2. **Test connection with psql:**
   ```bash
   psql -U postgres -h localhost
   ```

3. **List existing databases:**
   ```sql
   \l
   ```

4. **List existing users:**
   ```sql
   \du
   ```

### Quick Fix: Update .env with Your Credentials

1. Open `backend/.env` file
2. Update the `DATABASE_URL` line with your actual PostgreSQL credentials:

   **For default postgres user:**
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/healthbridge?schema=public
   ```

   **For custom user:**
   ```env
   DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/healthbridge?schema=public
   ```

3. Replace:
   - `YOUR_USERNAME` - Your PostgreSQL username (usually `postgres`)
   - `YOUR_PASSWORD` - Your PostgreSQL password
   - `healthbridge` - Database name (create it if it doesn't exist)

### Create Database if It Doesn't Exist

If the database doesn't exist, create it:

```sql
CREATE DATABASE healthbridge;
```

### After Fixing Credentials

Once you've updated the `.env` file with correct credentials:

```bash
cd backend
npm run prisma:migrate
```

This will create all the necessary tables in your database.

### Docker Alternative

If you prefer using Docker, you can use the provided `docker-compose.yml`:

```bash
docker-compose up -d
```

This will start PostgreSQL with the correct credentials automatically.

