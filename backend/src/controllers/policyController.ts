/**
 * Policy Controller
 * Manages configurable policy engine
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a new policy
 */
export const createPolicy = async (req: Request, res: Response) => {
  try {
    const { policyType, name, description, policyData, effectiveDate, expirationDate } = req.body;
    const userId = (req as any).user?.id;

    // Get latest version for this policy type
    const latestPolicy = await prisma.policy.findFirst({
      where: { policyType },
      orderBy: { version: 'desc' }
    });

    const newVersion = latestPolicy ? latestPolicy.version + 1 : 1;

    const policy = await prisma.policy.create({
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

    res.status(201).json({
      success: true,
      data: {
        ...policy,
        policyData: JSON.parse(policy.policyData)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create policy',
      error: error.message
    });
  }
};

/**
 * Get all policies
 */
export const getPolicies = async (req: Request, res: Response) => {
  try {
    const { policyType, isActive } = req.query;

    const where: any = {};
    if (policyType) where.policyType = policyType;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const policies = await prisma.policy.findMany({
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch policies',
      error: error.message
    });
  }
};

/**
 * Get active policy by type
 */
export const getActivePolicy = async (req: Request, res: Response) => {
  try {
    const { policyType } = req.params;
    const now = new Date();

    const policy = await prisma.policy.findFirst({
      where: {
        policyType: policyType as any,
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
      return res.status(404).json({
        success: false,
        message: 'Active policy not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...policy,
        policyData: JSON.parse(policy.policyData)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch policy',
      error: error.message
    });
  }
};

/**
 * Update policy
 */
export const updatePolicy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, policyData, isActive, expirationDate } = req.body;
    const userId = (req as any).user?.id;

    const updateData: any = {
      updatedBy: userId
    };

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (policyData) updateData.policyData = JSON.stringify(policyData);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (expirationDate !== undefined) updateData.expirationDate = expirationDate ? new Date(expirationDate) : null;

    const policy = await prisma.policy.update({
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update policy',
      error: error.message
    });
  }
};

/**
 * Get policy by ID
 */
export const getPolicyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const policy = await prisma.policy.findUnique({
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch policy',
      error: error.message
    });
  }
};

