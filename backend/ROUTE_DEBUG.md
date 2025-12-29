# Route Debugging Guide

## Issue: 404 on POST /api/users

### Check 1: Is the backend server running?

Check if the backend is running:
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000
```

### Check 2: Restart the backend server

If using `npm run dev`:
1. Stop the server (Ctrl+C)
2. Restart: `npm run dev`

If using Docker:
1. Restart the container
2. Or rebuild if needed

### Check 3: Verify the route is registered

The route should be:
- **Path**: `POST /api/users`
- **Controller**: `createUser` in `userController.ts`
- **Middleware**: Requires authentication + ADMIN role

### Check 4: Test the route manually

You can test with curl:
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User",
    "role": "PATIENT"
  }'
```

### Check 5: Verify authentication

Make sure:
1. You're logged in as an ADMIN user
2. The token is being sent in the Authorization header
3. The token is valid and not expired

### Common Solutions:

1. **Restart the backend server** - Most common fix
2. **Check server logs** - Look for any errors during startup
3. **Verify database connection** - Make sure Prisma can connect
4. **Check environment variables** - Ensure JWT_SECRET and DATABASE_URL are set

