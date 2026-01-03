# 💰 Finance Documentation - HealthBridge Namibia

**Last Updated:** 2024-01-XX  
**Finance Lead:** [To be assigned]

---

## Fee Structures

### Healthcare Provider Fees

#### Consultation Fees

| Service Type | Standard Fee (NAD) | Currency | Notes |
|--------------|-------------------|----------|-------|
| General Consultation | 500.00 | NAD | Standard 30-minute consultation |
| Specialist Consultation | 800.00 | NAD | Specialist provider consultation |
| Follow-up Consultation | 300.00 | NAD | Follow-up within 30 days |
| Emergency Consultation | 1000.00 | NAD | Urgent/emergency consultations |
| Telehealth Consultation | 400.00 | NAD | Video/telephone consultation |

#### Service Fees

| Service | Fee (NAD) | Description |
|---------|-----------|-------------|
| Prescription Writing | 50.00 | Per prescription |
| Medical Certificate | 100.00 | Per certificate |
| Referral Letter | 75.00 | Per referral |
| Lab Results Review | 150.00 | Per review |
| Medical Report | 200.00 | Comprehensive medical report |

### Platform Fees

#### Subscription Plans

| Plan | Monthly Fee (NAD) | Features |
|------|------------------|----------|
| **Monthly Wellness** | 199.00 | - Wellness tracking<br>- Habit monitoring<br>- Basic challenges |
| **Student Research** | 99.00 | - Research tools<br>- Proposal templates<br>- Supervisor matching |
| **Premium Patient** | 299.00 | - All wellness features<br>- Priority support<br>- Advanced analytics |
| **Provider Pro** | 999.00 | - Full platform access<br>- Advanced analytics<br>- API access |

#### Transaction Fees

| Payment Method | Fee Structure | Notes |
|----------------|---------------|-------|
| PayToday | 2.5% + NAD 2.50 | Per transaction |
| SnapScan | 2.5% + NAD 2.50 | Per transaction |
| Mobile Money | 1.5% + NAD 1.00 | Per transaction |
| Bank Transfer | Free | Manual processing |
| Credit/Debit Card | 3.0% + NAD 3.00 | Per transaction |

### Discounts & Promotions

#### Student Discounts
- **University Students:** 20% off all consultations
- **Research Students:** 50% off Student Research subscription

#### Loyalty Program
- **Frequent Users:** 10% discount after 10 consultations
- **Annual Subscriptions:** 15% discount for annual payments

#### Promotional Codes
- Promotional codes can be applied at checkout
- Codes managed through discount code system
- Expiration dates and usage limits configurable

---

## Payment Methods

### Supported Payment Gateways

1. **PayToday**
   - Namibian payment gateway
   - Supports credit/debit cards
   - Real-time processing

2. **SnapScan**
   - QR code payments
   - Mobile app integration
   - Popular in Southern Africa

3. **Mobile Money**
   - M-Pesa integration (future)
   - Orange Money (future)
   - Direct mobile carrier billing

4. **Bank Transfer**
   - Manual bank transfer
   - Reference number provided
   - Manual verification required

5. **Credit/Debit Cards**
   - Visa/Mastercard support
   - PCI-DSS compliant processing
   - Tokenization for security

### Payment Processing Flow

```
1. User initiates payment
   ↓
2. Payment gateway selection
   ↓
3. Transaction created in system
   ↓
4. Payment processed via gateway
   ↓
5. Webhook/callback received
   ↓
6. Transaction verified
   ↓
7. Payment status updated
   ↓
8. Receipt generated
   ↓
9. User notified
```

---

## Financial Reporting

### Revenue Streams

1. **Consultation Fees**
   - Provider consultation charges
   - Platform commission (10-15%)
   - Monthly revenue target: [To be set]

2. **Subscription Revenue**
   - Monthly/annual subscriptions
   - Recurring revenue model
   - Churn rate tracking

3. **Transaction Fees**
   - Payment processing fees
   - Platform service fees
   - Revenue share with providers

4. **Premium Features**
   - Advanced analytics
   - API access
   - Custom integrations

### Financial Metrics

#### Key Performance Indicators (KPIs)

- **Monthly Recurring Revenue (MRR)**
- **Annual Recurring Revenue (ARR)**
- **Customer Acquisition Cost (CAC)**
- **Lifetime Value (LTV)**
- **Churn Rate**
- **Average Revenue Per User (ARPU)**
- **Gross Margin**
- **Burn Rate**

#### Reporting Schedule

- **Daily:** Transaction summaries
- **Weekly:** Revenue reports
- **Monthly:** Financial statements
- **Quarterly:** Comprehensive financial review

---

## Billing & Invoicing

### Invoice Generation

- Automatic invoice generation for consultations
- Manual invoice creation for custom services
- Invoice numbering: `HB-YYYY-MM-XXXXX`
- PDF generation with branding

### Payment Terms

- **Standard:** Payment due within 7 days
- **Subscription:** Auto-renewal on due date
- **Overdue:** 5% late fee after 14 days
- **Collections:** Automated reminders

### Receipt Management

- Automatic receipt generation on payment
- Email delivery to users
- Downloadable PDF receipts
- Receipt history in user dashboard

---

## Financial Security

### Fraud Prevention

- Transaction monitoring
- Risk scoring algorithms
- Suspicious activity alerts
- Manual review process for high-risk transactions

### Payment Security

- PCI-DSS compliance
- Encrypted payment data
- Tokenization for card details
- 2FA for high-value transactions

### Audit Trail

- Complete transaction logging
- Payment audit logs
- Financial reconciliation reports
- Compliance with accounting standards

---

## Accounting Integration

### Chart of Accounts

- **Revenue Accounts**
  - Consultation Revenue
  - Subscription Revenue
  - Transaction Fee Revenue
  - Other Revenue

- **Expense Accounts**
  - Payment Gateway Fees
  - Infrastructure Costs
  - Staff Salaries
  - Marketing Expenses
  - Operational Expenses

### Reconciliation

- Daily transaction reconciliation
- Monthly bank reconciliation
- Quarterly financial audits
- Annual financial statements

---

## Financial Policies

### Refund Policy

- **Consultations:** No refunds (service already provided)
- **Subscriptions:** Pro-rated refunds for unused period
- **Failed Services:** Full refund within 7 days
- **Processing Time:** 5-10 business days

### Cancellation Policy

- **Subscriptions:** Cancel anytime, effective end of billing period
- **Appointments:** 24-hour cancellation notice required
- **No-show Policy:** 50% charge for no-shows

### Pricing Changes

- 30-day notice for subscription price changes
- Existing subscribers grandfathered for 3 months
- Consultation fees updated with provider approval

---

## Financial Tools & Systems

### Payment Processing
- Payment Gateway Abstraction Layer (`/backend/payments/`)
- Multiple gateway support
- Fallback mechanisms

### Financial Reporting
- Transaction logging system
- Revenue analytics dashboard
- Financial export capabilities

### Accounting Software Integration
- [Future] QuickBooks integration
- [Future] Xero integration
- [Future] Sage integration

---

## Budget & Forecasting

### Operating Budget

| Category | Monthly Budget (NAD) | Annual Budget (NAD) |
|----------|---------------------|---------------------|
| Infrastructure | [To be set] | [To be set] |
| Staff Salaries | [To be set] | [To be set] |
| Marketing | [To be set] | [To be set] |
| Operations | [To be set] | [To be set] |
| Compliance & Legal | [To be set] | [To be set] |
| **Total** | [To be set] | [To be set] |

### Revenue Projections

- **Year 1:** [To be projected]
- **Year 2:** [To be projected]
- **Year 3:** [To be projected]

---

## Financial Contacts

| Role | Name | Email | Phone |
|------|------|-------|-------|
| Finance Lead | [To be assigned] | - | - |
| Accountant | [To be assigned] | - | - |
| Payment Processing | [To be assigned] | - | - |

---

## Notes

- All fees are in Namibian Dollars (NAD) unless otherwise specified
- Exchange rates for multi-currency support: [To be configured]
- Fee structures subject to change with 30-day notice
- Discount codes and promotions may have expiration dates
- Financial data is subject to audit and compliance requirements

