"use strict";
/**
 * Policy Controller
 * Manages configurable policy engine
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPolicyById = exports.updatePolicy = exports.getActivePolicy = exports.getPolicies = exports.createPolicy = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../utils/prisma");
const policyEngine_1 = require("../utils/policyEngine");
/**
 * Create a new policy
 * Uses transaction with retry logic to handle race conditions
 */
const createPolicy = async (req, res) => {
    try {
        const { policyType, name, description, policyData, effectiveDate, expirationDate } = req.body;
        const userId = req.user?.id;
        // Use transaction with retry logic to handle concurrent policy creation
        const maxRetries = 5;
        let retries = 0;
        let policy;
        // Loop allows exactly maxRetries attempts (0 to maxRetries-1)
        // Single gate: while condition is the only check - no redundant inner check
        while (retries < maxRetries) {
            try {
                policy = await prisma_1.prisma.$transaction(async (tx) => {
                    // Get latest version for this policy type within transaction
                    const latestPolicy = await tx.policy.findFirst({
                        where: { policyType },
                        orderBy: { version: 'desc' }
                    });
                    const newVersion = latestPolicy ? latestPolicy.version + 1 : 1;
                    // Attempt to create policy - will fail if unique constraint violated
                    return await tx.policy.create({
                        data: {
                            policyType,
                            name,
                            description,
                            policyData: JSON.stringify(policyData),
                            version: newVersion,
                            effectiveDate: effectiveDate ? new Date(effectiveDate) : new Date(),
                            expirationDate: expirationDate ? new Date(expirationDate) : null,
                            createdBy: userId,
                            updatedBy: userId
                        }
                    });
                });
                // Success - break out of retry loop
                break;
            }
            catch (error) {
                // Check if it's a unique constraint violation (race condition)
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                    // Increment retry count
                    retries++;
                    // Exponential backoff with jitter: 2^retries * 50ms base + random 0-50ms
                    // This prevents thundering herd while ensuring eventual success
                    const baseDelay = Math.pow(2, retries) * 50;
                    const jitter = Math.random() * 50;
                    await new Promise(resolve => setTimeout(resolve, baseDelay + jitter));
                    continue;
                }
                // If it's not a unique constraint error, throw immediately
                throw error;
            }
        }
        // If we exited the loop without creating a policy, throw error
        // Single gate: relies solely on the while condition (retries < maxRetries)
        // This ensures exactly maxRetries attempts (0 to maxRetries-1)
        if (!policy) {
            throw new Error('Failed to create policy after multiple retries due to concurrent requests');
        }
        res.status(201).json({
            success: true,
            data: {
                ...policy,
                policyData: JSON.parse(policy.policyData)
            }
        });
    }
    catch (error) {
        // Handle unique constraint violation with appropriate status code
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: 'Policy version conflict. Please try again.',
                error: 'A policy with this type and version already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create policy',
            error: error.message
        });
    }
};
exports.createPolicy = createPolicy;
/**
 * Get all policies
 */
const getPolicies = async (req, res) => {
    try {
        const { policyType, isActive } = req.query;
        const where = {};
        if (policyType)
            where.policyType = policyType;
        if (isActive !== undefined)
            where.isActive = isActive === 'true';
        const policies = await prisma_1.prisma.policy.findMany({
            where,
            orderBy: [
                { policyType: 'asc' },
                { version: 'desc' }
            ]
        });
        res.json({
            success: true,
            data: policies.map(policy => ({
                ...policy,
                policyData: JSON.parse(policy.policyData)
            }))
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch policies',
            error: error.message
        });
    }
};
exports.getPolicies = getPolicies;
/**
 * Get active policy by type
 */
const getActivePolicy = async (req, res) => {
    try {
        const { policyType } = req.params;
        // Validate policyType against PolicyType enum
        if (!Object.values(policyEngine_1.PolicyType).includes(policyType)) {
            return res.status(400).json({
                success: false,
                message: `Invalid policy type. Valid types are: ${Object.values(policyEngine_1.PolicyType).join(', ')}`
            });
        }
        const now = new Date();
        const policy = await prisma_1.prisma.policy.findFirst({
            where: {
                policyType: policyType,
                isActive: true,
                effectiveDate: { lte: now },
                OR: [
                    { expirationDate: null },
                    { expirationDate: { gte: now } }
                ]
            },
            orderBy: { version: 'desc' }
        });
        if (!policy) {
            return res.json({
                success: true,
                data: null
            });
        }
        res.json({
            success: true,
            data: {
                ...policy,
                policyData: JSON.parse(policy.policyData)
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch policy',
            error: error.message
        });
    }
};
exports.getActivePolicy = getActivePolicy;
/**
 * Update policy
 */
const updatePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, policyData, isActive, expirationDate } = req.body;
        const userId = req.user?.id;
        const updateData = {
            updatedBy: userId
        };
        if (name)
            updateData.name = name;
        if (description !== undefined)
            updateData.description = description;
        if (policyData)
            updateData.policyData = JSON.stringify(policyData);
        if (isActive !== undefined)
            updateData.isActive = isActive;
        if (expirationDate !== undefined)
            updateData.expirationDate = expirationDate ? new Date(expirationDate) : null;
        const policy = await prisma_1.prisma.policy.update({
            where: { id },
            data: updateData
        });
        res.json({
            success: true,
            data: {
                ...policy,
                policyData: JSON.parse(policy.policyData)
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update policy',
            error: error.message
        });
    }
};
exports.updatePolicy = updatePolicy;
/**
 * Get policy by ID
 */
const getPolicyById = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await prisma_1.prisma.policy.findUnique({
            where: { id }
        });
        if (!policy) {
            return res.status(404).json({
                success: false,
                message: 'Policy not found'
            });
        }
        res.json({
            success: true,
            data: {
                ...policy,
                policyData: JSON.parse(policy.policyData)
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch policy',
            error: error.message
        });
    }
};
exports.getPolicyById = getPolicyById;
//# sourceMappingURL=policyController.js.map