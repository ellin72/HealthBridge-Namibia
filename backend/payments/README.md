# Payments Abstraction Layer

This directory contains the payments abstraction layer that supports multiple payment gateways.

## Structure

- `gateways/` - Individual payment gateway implementations
- `interfaces.ts` - Common interfaces and types
- `paymentService.ts` - Main payment service that routes to appropriate gateway
- `transactionLogger.ts` - Transaction logging service

## Supported Gateways

1. **PayToday** - Namibian payment gateway
2. **SnapScan** - QR code payments
3. **Mobile Money** - Mobile carrier billing
4. **Bank Transfer** - Manual bank transfers
5. **Stripe** - Credit/debit card processing (future)

## Usage

```typescript
import { PaymentService } from './paymentService';

const paymentService = new PaymentService();

const result = await paymentService.processPayment({
  amount: 500,
  currency: 'NAD',
  method: 'PAYTODAY',
  reference: 'INV-001',
  customerEmail: 'user@example.com'
});
```

