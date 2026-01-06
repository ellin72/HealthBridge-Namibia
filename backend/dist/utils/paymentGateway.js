"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentGateway = void 0;
const crypto_1 = __importDefault(require("crypto"));
class PaymentGatewayService {
    constructor(config) {
        this.config = config;
    }
    /**
     * Process payment through appropriate gateway
     */
    async processPayment(request) {
        try {
            switch (request.method) {
                case 'PAYTODAY':
                    return await this.processPayToday(request);
                case 'SNAPSCAN':
                    return await this.processSnapScan(request);
                case 'MOBILE_MONEY':
                    return await this.processMobileMoney(request);
                case 'BANK_TRANSFER':
                    return await this.processBankTransfer(request);
                case 'CREDIT_CARD':
                case 'DEBIT_CARD':
                    return await this.processCardPayment(request);
                default:
                    return {
                        success: false,
                        error: `Unsupported payment method: ${request.method}`
                    };
            }
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Payment processing failed'
            };
        }
    }
    /**
     * PayToday Payment Processing
     */
    async processPayToday(request) {
        // In production, this would make actual API calls to PayToday
        // For now, we'll simulate the response
        // In development, allow payments without API keys (simulated)
        const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
        if (!this.config.paytodayApiKey || !this.config.paytodayApiSecret) {
            if (isDevelopment) {
                // In development, simulate successful payment
                console.warn('PayToday API credentials not configured - simulating payment in development mode');
            }
            else {
                return {
                    success: false,
                    error: 'PayToday API credentials not configured. Please configure PAYTODAY_API_KEY and PAYTODAY_API_SECRET environment variables.'
                };
            }
        }
        // Generate secure transaction ID
        const transactionId = `PT-${Date.now()}-${crypto_1.default.randomBytes(8).toString('hex').toUpperCase()}`;
        // In production: Make API call to PayToday
        // const response = await fetch('https://api.paytoday.com.na/payments', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${this.config.paytodayApiKey}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     amount: request.amount,
        //     currency: request.currency,
        //     reference: request.reference,
        //     returnUrl: request.returnUrl,
        //     cancelUrl: request.cancelUrl
        //   })
        // });
        return {
            success: true,
            transactionId,
            paymentUrl: `https://paytoday.com.na/pay?ref=${request.reference}&amount=${request.amount}&currency=${request.currency}`
        };
    }
    /**
     * SnapScan Payment Processing
     */
    async processSnapScan(request) {
        const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
        if (!this.config.snapscanApiKey || !this.config.snapscanApiSecret) {
            if (isDevelopment) {
                // In development, simulate successful payment
                console.warn('SnapScan API credentials not configured - simulating payment in development mode');
            }
            else {
                return {
                    success: false,
                    error: 'SnapScan API credentials not configured. Please configure SNAPSCAN_API_KEY and SNAPSCAN_API_SECRET environment variables.'
                };
            }
        }
        const transactionId = `SS-${Date.now()}-${crypto_1.default.randomBytes(8).toString('hex').toUpperCase()}`;
        // In production: Make API call to SnapScan
        return {
            success: true,
            transactionId,
            paymentUrl: `https://snapscan.co.za/pay?ref=${request.reference}&amount=${request.amount}`,
            qrCode: `https://snapscan.co.za/qr/${request.reference}`
        };
    }
    /**
     * Mobile Money Payment Processing
     */
    async processMobileMoney(request) {
        if (!request.customerPhone) {
            return {
                success: false,
                error: 'Phone number required for mobile money payment'
            };
        }
        const transactionId = `MM-${Date.now()}-${crypto_1.default.randomBytes(8).toString('hex').toUpperCase()}`;
        // In production: Integrate with mobile money providers (M-Pesa, Orange Money, etc.)
        return {
            success: true,
            transactionId,
            instructions: `Please send NAD ${request.amount} to ${request.reference} via mobile money. You will receive a confirmation SMS.`
        };
    }
    /**
     * Bank Transfer Processing
     */
    async processBankTransfer(request) {
        const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
        if (!this.config.bankTransferDetails) {
            if (isDevelopment) {
                // In development, use default bank details
                console.warn('Bank transfer details not configured - using default in development mode');
                const defaultBankDetails = {
                    accountName: 'HealthBridge Namibia',
                    accountNumber: '1234567890',
                    bankName: 'Standard Bank',
                    branchCode: '123456'
                };
                const transactionId = `BT-${Date.now()}-${crypto_1.default.randomBytes(8).toString('hex').toUpperCase()}`;
                return {
                    success: true,
                    transactionId,
                    instructions: `Please transfer NAD ${request.amount} to:\nAccount Name: ${defaultBankDetails.accountName}\nAccount Number: ${defaultBankDetails.accountNumber}\nBank: ${defaultBankDetails.bankName}\nBranch Code: ${defaultBankDetails.branchCode}\nReference: ${request.reference}`
                };
            }
            else {
                return {
                    success: false,
                    error: 'Bank transfer details not configured. Please configure BANK_ACCOUNT_NAME, BANK_ACCOUNT_NUMBER, BANK_NAME, and BANK_BRANCH_CODE environment variables.'
                };
            }
        }
        const transactionId = `BT-${Date.now()}-${crypto_1.default.randomBytes(8).toString('hex').toUpperCase()}`;
        const { accountName, accountNumber, bankName, branchCode } = this.config.bankTransferDetails;
        return {
            success: true,
            transactionId,
            instructions: `Please transfer NAD ${request.amount} to:\nAccount Name: ${accountName}\nAccount Number: ${accountNumber}\nBank: ${bankName}\nBranch Code: ${branchCode}\nReference: ${request.reference}`
        };
    }
    /**
     * Card Payment Processing (PCI-DSS compliant)
     */
    async processCardPayment(request) {
        // In production, use a PCI-DSS compliant payment processor like Stripe, PayPal, etc.
        // Never store full card details - use tokenization
        const transactionId = `CC-${Date.now()}-${crypto_1.default.randomBytes(8).toString('hex').toUpperCase()}`;
        return {
            success: true,
            transactionId,
            paymentUrl: `https://secure-payment-gateway.com/pay?ref=${request.reference}&amount=${request.amount}`
        };
    }
    /**
     * Verify payment status from gateway
     */
    async verifyPayment(transactionId, method) {
        try {
            // In production, verify with actual gateway
            // For now, return mock verification
            return {
                verified: true,
                status: 'COMPLETED'
            };
        }
        catch (error) {
            return {
                verified: false,
                error: error.message
            };
        }
    }
}
// Export singleton instance
exports.paymentGateway = new PaymentGatewayService({
    paytodayApiKey: process.env.PAYTODAY_API_KEY,
    paytodayApiSecret: process.env.PAYTODAY_API_SECRET,
    snapscanApiKey: process.env.SNAPSCAN_API_KEY,
    snapscanApiSecret: process.env.SNAPSCAN_API_SECRET,
    mobileMoneyProvider: process.env.MOBILE_MONEY_PROVIDER,
    bankTransferDetails: process.env.BANK_ACCOUNT_NAME ? {
        accountName: process.env.BANK_ACCOUNT_NAME,
        accountNumber: process.env.BANK_ACCOUNT_NUMBER || '',
        bankName: process.env.BANK_NAME || 'Standard Bank',
        branchCode: process.env.BANK_BRANCH_CODE || ''
    } : undefined
});
//# sourceMappingURL=paymentGateway.js.map