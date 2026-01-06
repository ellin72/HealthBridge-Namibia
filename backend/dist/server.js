"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const prisma_1 = require("./utils/prisma");
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const providers_1 = __importDefault(require("./routes/providers"));
const appointments_1 = __importDefault(require("./routes/appointments"));
const consultations_1 = __importDefault(require("./routes/consultations"));
const wellness_1 = __importDefault(require("./routes/wellness"));
const learning_1 = __importDefault(require("./routes/learning"));
const telehealthPro_1 = __importDefault(require("./routes/telehealthPro"));
const wellnessTools_1 = __importDefault(require("./routes/wellnessTools"));
const research_1 = __importDefault(require("./routes/research"));
const triage_1 = __importDefault(require("./routes/triage"));
const medicalAid_1 = __importDefault(require("./routes/medicalAid"));
const payments_1 = __importDefault(require("./routes/payments"));
const offlineSync_1 = __importDefault(require("./routes/offlineSync"));
const medications_1 = __importDefault(require("./routes/medications"));
const clinicalTemplates_1 = __importDefault(require("./routes/clinicalTemplates"));
const billing_1 = __importDefault(require("./routes/billing"));
const monitoring_1 = __importDefault(require("./routes/monitoring"));
const providerFees_1 = __importDefault(require("./routes/providerFees"));
const providerEarnings_1 = __importDefault(require("./routes/providerEarnings"));
const adminMonitoring_1 = __importDefault(require("./routes/adminMonitoring"));
const surveys_1 = __importDefault(require("./routes/surveys"));
const feedback_1 = __importDefault(require("./routes/feedback"));
const policies_1 = __importDefault(require("./routes/policies"));
const mentalHealth_1 = __importDefault(require("./routes/mentalHealth"));
const weightManagement_1 = __importDefault(require("./routes/weightManagement"));
const diabetesManagement_1 = __importDefault(require("./routes/diabetesManagement"));
const hypertensionManagement_1 = __importDefault(require("./routes/hypertensionManagement"));
const specialtyWellness_1 = __importDefault(require("./routes/specialtyWellness"));
const primaryCare_1 = __importDefault(require("./routes/primaryCare"));
const urgentCare_1 = __importDefault(require("./routes/urgentCare"));
const apiMonitoring_1 = require("./middleware/apiMonitoring");
// Load environment variables
dotenv_1.default.config();
// CRITICAL SECURITY: Validate required environment variables in production
if (process.env.NODE_ENV === 'production') {
    const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
    const missingVars = requiredVars.filter(varName => !process.env[varName] || process.env[varName].trim() === '');
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
    if (process.env.JWT_SECRET && (process.env.JWT_SECRET.includes('CHANGE_ME') ||
        process.env.JWT_SECRET.includes('change-in-production') ||
        process.env.JWT_SECRET.length < 32)) {
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
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        process.env.MOBILE_URL || 'http://localhost:8081'
    ],
    credentials: true
}));
app.use((0, morgan_1.default)('combined'));
app.use(apiMonitoring_1.apiMonitoring); // API monitoring middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve uploaded files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'HealthBridge API is running' });
});
// API Routes
app.use('/api/auth', auth_1.default);
// Mount providers route BEFORE users route to avoid route conflicts
app.use('/api/users/providers', providers_1.default);
app.use('/api/users', users_1.default);
app.use('/api/appointments', appointments_1.default);
app.use('/api/consultations', consultations_1.default);
app.use('/api/wellness', wellness_1.default);
app.use('/api/learning', learning_1.default);
app.use('/api/telehealth-pro', telehealthPro_1.default);
app.use('/api/wellness-tools', wellnessTools_1.default);
app.use('/api/research', research_1.default);
app.use('/api/triage', triage_1.default);
app.use('/api/medical-aid', medicalAid_1.default);
app.use('/api/payments', payments_1.default);
app.use('/api/offline-sync', offlineSync_1.default);
app.use('/api/medications', medications_1.default);
app.use('/api/clinical-templates', clinicalTemplates_1.default);
app.use('/api/billing', billing_1.default);
app.use('/api/monitoring', monitoring_1.default);
app.use('/api/provider-fees', providerFees_1.default);
app.use('/api/provider-earnings', providerEarnings_1.default);
app.use('/api/admin', adminMonitoring_1.default);
app.use('/api/surveys', surveys_1.default);
app.use('/api/feedback', feedback_1.default);
app.use('/api/policies', policies_1.default);
app.use('/api/mental-health', mentalHealth_1.default);
app.use('/api/weight-management', weightManagement_1.default);
app.use('/api/diabetes-management', diabetesManagement_1.default);
app.use('/api/hypertension-management', hypertensionManagement_1.default);
app.use('/api/specialty-wellness', specialtyWellness_1.default);
app.use('/api/primary-care', primaryCare_1.default);
app.use('/api/urgent-care', urgentCare_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
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
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    try {
        // Disconnect the singleton PrismaClient instance
        await prisma_1.prisma.$disconnect();
        console.log('✅ Database connections closed');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
};
// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
exports.default = app;
//# sourceMappingURL=server.js.map