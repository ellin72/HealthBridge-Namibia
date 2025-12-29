# Setup Guide for New Features

This guide will help you set up and use the new improvements implemented from `Tips.md`.

## Prerequisites

1. Ensure you have Node.js and npm installed
2. PostgreSQL database running
3. Backend and frontend dependencies installed

## Step 1: Database Migration

Run the Prisma migration to add the new database models:

```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

This will create the following new tables:
- `MedicalAidInfo`
- `MedicalAidClaim`
- `TriageAssessment`
- `Payment`
- `OfflineSyncQueue`
- `FHIRResource`

And add the `preferredLanguage` field to the `User` table.

## Step 2: Install Frontend Dependencies

Install the new i18n dependencies:

```bash
cd frontend
npm install i18next react-i18next
```

## Step 3: Environment Variables

Add the following to your `.env` file in the backend directory:

```env
# Encryption key for AES-256 encryption (generate a 32-byte hex key)
ENCRYPTION_KEY=<your-32-byte-hex-key>
```

To generate an encryption key, you can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Register Service Worker (Optional)

The service worker for offline support will be automatically registered when the app loads. Make sure the `sw.js` file is in the `frontend/public/` directory.

## Step 5: Start the Application

Start both backend and frontend:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Using the New Features

### 1. Multilingual Support

- Click the language selector in the top navigation bar
- Choose from English, Afrikaans, or Oshiwambo
- Your preference will be saved and synced across sessions

### 2. Symptom Checker (AI Triage)

- Navigate to "Symptom Checker" from the sidebar
- Add symptoms by typing or selecting from common symptoms
- Optionally add a description
- Click "Check Symptoms" to get AI-powered assessment
- View urgency level, recommendations, and follow-up dates

### 3. Medical Aid Integration

**For Patients:**
- Go to Profile page
- Add your medical aid information:
  - Scheme (NAMMED, Medical Aid Fund, Prosana, or Other)
  - Member Number
  - Policy Number (optional)
- Verify your membership
- Submit claims for appointments

**API Endpoints:**
- `GET /api/medical-aid` - Get your medical aid info
- `POST /api/medical-aid` - Add/update medical aid info
- `POST /api/medical-aid/verify` - Verify membership
- `POST /api/medical-aid/claims` - Submit a claim
- `GET /api/medical-aid/claims` - View claim history

### 4. Payment Integration

**Supported Methods:**
- Credit Card
- PayToday (Namibian mobile payment)
- SnapScan (Namibian mobile payment)
- Bank Transfer

**API Endpoints:**
- `POST /api/payments` - Create a payment
- `GET /api/payments` - Get payment history
- `GET /api/payments/:id` - Get specific payment

### 5. Offline Support

The app now supports offline functionality:

- Actions performed offline are queued locally
- When connection is restored, actions are automatically synced
- View sync status in the profile or settings

**API Endpoints:**
- `POST /api/offline-sync/sync` - Manually trigger sync
- `GET /api/offline-sync/status` - Get sync queue status

### 6. FHIR Interoperability

FHIR resources can be exported for integration with legacy systems:

**Backend Utilities:**
- `patientToFHIR()` - Convert patient to FHIR Patient resource
- `appointmentToFHIR()` - Convert appointment to FHIR Appointment resource
- `observationToFHIR()` - Convert observations to FHIR Observation resource
- `exportPatientAsFHIRBundle()` - Export complete patient data as FHIR Bundle

## Testing the Features

### Test Multilingual Support:
1. Change language using the selector
2. Navigate through the app to see translations
3. Refresh the page - language preference should persist

### Test Symptom Checker:
1. Go to Symptom Checker
2. Add symptoms like "Fever", "Headache", "Cough"
3. Add description: "Started yesterday, getting worse"
4. Click "Check Symptoms"
5. Review the urgency assessment and recommendations

### Test Offline Support:
1. Open browser DevTools > Network tab
2. Set to "Offline" mode
3. Try creating an appointment or adding a symptom
4. Set back to "Online"
5. Check that actions were synced

### Test Medical Aid:
1. Go to Profile
2. Add medical aid information
3. Submit a test claim
4. View claim history

## Integration with Real Services

### Payment Gateways

To integrate with real payment gateways, update `backend/src/controllers/paymentController.ts`:

1. **PayToday Integration:**
   - Get API credentials from PayToday
   - Update `getPaymentGatewayUrl()` function
   - Implement actual payment processing

2. **SnapScan Integration:**
   - Get API credentials from SnapScan
   - Update payment callback handler
   - Implement webhook verification

### Medical Aid Schemes

To integrate with real medical aid APIs:

1. **NAMMED API:**
   - Contact NAMMED for API access
   - Update `simulateMedicalAidVerification()` in `medicalAidController.ts`
   - Implement real verification logic

2. **Other Schemes:**
   - Follow similar pattern for other medical aid providers

### AI Triage Enhancement

To improve AI triage with real LLM:

1. **OpenAI Integration:**
   ```typescript
   import OpenAI from 'openai';
   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
   ```

2. **Anthropic Integration:**
   ```typescript
   import Anthropic from '@anthropic-ai/sdk';
   const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
   ```

3. Update `determineUrgency()` and `generateRecommendation()` functions in `triageController.ts`

## Troubleshooting

### Database Migration Issues:
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Try: `npx prisma migrate reset` (WARNING: This will delete all data)

### i18n Not Working:
- Clear browser cache
- Check browser console for errors
- Verify `i18next` and `react-i18next` are installed

### Service Worker Not Registering:
- Check browser console for errors
- Ensure `sw.js` is in `frontend/public/` directory
- Clear browser cache and reload

### Encryption Errors:
- Verify `ENCRYPTION_KEY` is set in `.env`
- Ensure key is 64 characters (32 bytes in hex)
- Generate new key if needed

## Next Steps

1. **Enhance Dashboards:**
   - Add medication reminders to patient dashboard
   - Add clinical templates to doctor dashboard
   - Add billing automation

2. **Wearable Integration:**
   - Add IoT device support
   - Implement continuous health monitoring
   - Sync data from smartwatches/glucose monitors

3. **Cloud Deployment:**
   - Deploy to AWS/Azure with HIPAA compliance
   - Set up auto-scaling
   - Configure CDN for static assets

4. **Testing:**
   - Add unit tests for new features
   - Add integration tests for API endpoints
   - Add E2E tests for critical user flows

## Support

For issues or questions, refer to:
- `IMPLEMENTATION_SUMMARY.md` - Detailed implementation overview
- `Tips.md` - Original improvement suggestions
- API documentation in `docs/API_DOCUMENTATION.md`

