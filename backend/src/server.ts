import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { prisma } from './utils/prisma';

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
import surveyRoutes from './routes/surveys';
import feedbackRoutes from './routes/feedback';
import policyRoutes from './routes/policies';
import mentalHealthRoutes from './routes/mentalHealth';
import weightManagementRoutes from './routes/weightManagement';
import diabetesManagementRoutes from './routes/diabetesManagement';
import hypertensionManagementRoutes from './routes/hypertensionManagement';
import specialtyWellnessRoutes from './routes/specialtyWellness';
import primaryCareRoutes from './routes/primaryCare';
import urgentCareRoutes from './routes/urgentCare';
import { apiMonitoring } from './middleware/apiMonitoring';

// Load environment variables
dotenv.config();

// CRITICAL SECURITY: Validate required environment variables in production
if (process.env.NODE_ENV === 'production') {
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingVars = requiredVars.filter(varName => !process.env[varName] || process.env[varName]!.trim() === '');
  
  if (missingVars.length > 0) {
    console.error('❌ CRITICAL ERROR: Required environment variables are missing:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('The application cannot start without these variables.');
    console.error('Please set them using environment variables, .env files, or secrets management.');
    process.exit(1);
  }
  
  // Additional validation: ensure JWT_SECRET is not a placeholder
  if (process.env.JWT_SECRET && (
    process.env.JWT_SECRET.includes('CHANGE_ME') ||
    process.env.JWT_SECRET.includes('change-in-production') ||
    process.env.JWT_SECRET.length < 32
  )) {
    console.error('❌ CRITICAL ERROR: JWT_SECRET appears to be a placeholder or is too weak.');
    console.error('JWT_SECRET must be a strong, randomly generated secret (minimum 32 characters).');
    process.exit(1);
  }
  
  // Additional validation: ensure DATABASE_URL is not a placeholder
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('CHANGE_ME')) {
    console.error('❌ CRITICAL ERROR: DATABASE_URL contains placeholder values.');
    console.error('DATABASE_URL must be a valid database connection string.');
    process.exit(1);
  }
}

const app = express();
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
app.use(apiMonitoring); // API monitoring middleware
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
app.use('/api/surveys', surveyRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/mental-health', mentalHealthRoutes);
app.use('/api/weight-management', weightManagementRoutes);
app.use('/api/diabetes-management', diabetesManagementRoutes);
app.use('/api/hypertension-management', hypertensionManagementRoutes);
app.use('/api/specialty-wellness', specialtyWellnessRoutes);
app.use('/api/primary-care', primaryCareRoutes);
app.use('/api/urgent-care', urgentCareRoutes);

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

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  try {
    // Disconnect the singleton PrismaClient instance
    await prisma.$disconnect();
    console.log('✅ Database connections closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;

