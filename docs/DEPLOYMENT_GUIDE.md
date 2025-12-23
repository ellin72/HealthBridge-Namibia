# HealthBridge Namibia - Deployment Guide

## Production Deployment

### Prerequisites
- Server with Node.js 18+
- PostgreSQL database (managed or self-hosted)
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

## Backend Deployment

### 1. Build the backend
```bash
cd backend
npm install
npm run build
```

### 2. Set production environment variables
Create `.env.production`:
```env
DATABASE_URL="postgresql://user:password@production-db-host:5432/healthbridge?schema=public"
JWT_SECRET=your-production-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=production
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
FRONTEND_URL=https://your-frontend-domain.com
MOBILE_URL=https://your-api-domain.com
```

### 3. Database Migration
```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Process Management
Use PM2 or similar:
```bash
npm install -g pm2
pm2 start dist/server.js --name healthbridge-api
pm2 save
pm2 startup
```

### 5. Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name api.healthbridge.na;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. SSL Certificate (Let's Encrypt)
```bash
sudo certbot --nginx -d api.healthbridge.na
```

## Frontend Deployment

### 1. Build the frontend
```bash
cd frontend
npm install
npm run build
```

### 2. Deploy to hosting service

#### Option A: Static Hosting (Vercel, Netlify)
- Connect your repository
- Set build command: `npm run build`
- Set output directory: `dist`
- Add environment variable: `VITE_API_URL=https://api.healthbridge.na/api`

#### Option B: Nginx
```nginx
server {
    listen 80;
    server_name healthbridge.na;

    root /var/www/healthbridge/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

## Mobile App Deployment

### 1. Build for production

#### Android
```bash
cd mobile
eas build --platform android
```

#### iOS
```bash
eas build --platform ios
```

### 2. Update API URL
Ensure production API URL is configured in the app before building.

### 3. Submit to app stores
- Google Play Store (Android)
- Apple App Store (iOS)

## Database Backup

### Automated Backups
Set up daily backups:
```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump healthbridge > /backups/healthbridge_$DATE.sql
```

### Restore
```bash
psql healthbridge < /backups/healthbridge_YYYYMMDD_HHMMSS.sql
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (minimum 32 characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] File upload size limits
- [ ] Input validation on all endpoints
- [ ] Rate limiting (consider adding)
- [ ] Logging and monitoring

## Monitoring

### Application Monitoring
- Set up error tracking (Sentry, Rollbar)
- Monitor API response times
- Track database performance

### Health Checks
Implement health check endpoint:
```typescript
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, AWS ALB)
- Stateless API design (already implemented)
- Session storage in database or Redis

### Database Scaling
- Read replicas for read-heavy operations
- Connection pooling (Prisma supports this)
- Query optimization

### File Storage
- Consider cloud storage (AWS S3, Cloudinary) for uploads
- CDN for static assets

## Environment-Specific Configurations

### Development
- Detailed error messages
- CORS allows localhost
- No SSL required
- Debug logging enabled

### Production
- Generic error messages
- Restricted CORS
- SSL required
- Error logging only
- Rate limiting enabled

## Rollback Procedure

1. Stop the application
2. Restore previous database backup if needed
3. Deploy previous version
4. Restart services
5. Verify functionality

## Maintenance

### Regular Tasks
- Weekly database backups
- Monthly security updates
- Quarterly dependency updates
- Monitor disk space for uploads
- Review and rotate logs

### Updates
1. Test in staging environment
2. Backup production database
3. Deploy updates during low-traffic period
4. Monitor for errors
5. Rollback if issues occur

## Support and Monitoring Tools

Recommended tools:
- **Error Tracking**: Sentry
- **Monitoring**: New Relic, Datadog
- **Logging**: Winston, Morgan (already included)
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Analytics**: Google Analytics (frontend)

## Cost Optimization

- Use managed PostgreSQL (AWS RDS, DigitalOcean)
- CDN for static assets
- Compress responses (gzip)
- Optimize database queries
- Cache frequently accessed data

## Compliance

Ensure compliance with:
- Data protection regulations (GDPR, local laws)
- Healthcare data regulations (HIPAA considerations)
- User privacy requirements
- Secure data transmission
- Data retention policies

