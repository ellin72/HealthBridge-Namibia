import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import providerRoutes from './routes/providers';
import appointmentRoutes from './routes/appointments';
import consultationRoutes from './routes/consultations';
import wellnessRoutes from './routes/wellness';
import learningRoutes from './routes/learning';
import telehealthProRoutes from './routes/telehealthPro';
import wellnessToolsRoutes from './routes/wellnessTools';
import researchRoutes from './routes/research';
import triageRoutes from './routes/triage';
import medicalAidRoutes from './routes/medicalAid';
import paymentRoutes from './routes/payments';
import offlineSyncRoutes from './routes/offlineSync';
import medicationRoutes from './routes/medications';
import clinicalTemplateRoutes from './routes/clinicalTemplates';
import billingRoutes from './routes/billing';
import monitoringRoutes from './routes/monitoring';
import providerFeeRoutes from './routes/providerFees';
import providerEarningsRoutes from './routes/providerEarnings';
import adminMonitoringRoutes from './routes/adminMonitoring';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.MOBILE_URL || 'http://localhost:8081'
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HealthBridge API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
// Mount providers route BEFORE users route to avoid route conflicts
app.use('/api/users/providers', providerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/telehealth-pro', telehealthProRoutes);
app.use('/api/wellness-tools', wellnessToolsRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/medical-aid', medicalAidRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/offline-sync', offlineSyncRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/clinical-templates', clinicalTemplateRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/provider-fees', providerFeeRoutes);
app.use('/api/provider-earnings', providerEarningsRoutes);
app.use('/api/admin', adminMonitoringRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HealthBridge API server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;

