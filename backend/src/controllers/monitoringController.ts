import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Get monitoring data
export const getMonitoringData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { patientId, metricType, startDate, endDate, alertsOnly } = req.query;

    const where: any = {};
    
    if (userRole === 'PATIENT') {
      // Patients can only see their own monitoring data
      where.patientId = userId;
    } else if (userRole === 'HEALTHCARE_PROVIDER') {
      // Providers can only see monitoring data for patients who have chosen them
      if (patientId) {
        // Verify the provider has a relationship with this patient
        const hasRelationship = await prisma.appointment.findFirst({
          where: {
            providerId: userId,
            patientId: patientId as string
          }
        });
        if (!hasRelationship) {
          return res.status(403).json({ message: 'Access denied. You can only view monitoring data for your patients.' });
        }
        where.patientId = patientId;
      } else {
        // Get all patients who have appointments with this provider
        const appointments = await prisma.appointment.findMany({
          where: { providerId: userId },
          select: { patientId: true },
          distinct: ['patientId']
        });
        const patientIds = appointments.map(a => a.patientId);
        if (patientIds.length === 0) {
          // No patients, return empty result
          where.patientId = '00000000-0000-0000-0000-000000000000';
        } else {
          where.patientId = { in: patientIds };
        }
      }
    } else {
      // All other roles cannot see monitoring data
      where.patientId = '00000000-0000-0000-0000-000000000000';
    }
    
    if (metricType) where.metricType = metricType;
    if (alertsOnly === 'true') where.isAlert = true;
    
    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt.gte = new Date(startDate as string);
      if (endDate) where.recordedAt.lte = new Date(endDate as string);
    }

    const data = await prisma.remoteMonitoringData.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: 100,
    });

    res.json({ data });
  } catch (error: any) {
    console.error('Get monitoring data error:', error);
    res.status(500).json({ message: 'Failed to fetch monitoring data', error: error.message });
  }
};

// Create monitoring data entry
export const createMonitoringData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { metricType, value, unit, deviceId, deviceType, notes } = req.body;

    if (!metricType || value === undefined || !unit) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Determine alert level based on metric type and value
    const { isAlert, alertLevel } = determineAlertLevel(metricType, value);

    const monitoringData = await prisma.remoteMonitoringData.create({
      data: {
        patientId: userId,
        metricType,
        value,
        unit,
        deviceId: deviceId || null,
        deviceType: deviceType || null,
        notes: notes || null,
        isAlert,
        alertLevel: alertLevel || null,
      },
    });

    res.status(201).json({
      message: 'Monitoring data recorded successfully',
      data: monitoringData,
    });
  } catch (error: any) {
    console.error('Create monitoring data error:', error);
    res.status(500).json({ message: 'Failed to record monitoring data', error: error.message });
  }
};

// Get monitoring statistics
export const getMonitoringStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { patientId, metricType, days = 30 } = req.query;

    const where: any = {};
    
    if (userRole === 'PATIENT') {
      // Patients can only see their own stats
      where.patientId = userId;
    } else if (userRole === 'HEALTHCARE_PROVIDER') {
      // Providers can only see stats for patients who have chosen them
      if (patientId) {
        // Verify the provider has a relationship with this patient
        const hasRelationship = await prisma.appointment.findFirst({
          where: {
            providerId: userId,
            patientId: patientId as string
          }
        });
        if (!hasRelationship) {
          return res.status(403).json({ message: 'Access denied. You can only view statistics for your patients.' });
        }
        where.patientId = patientId;
      } else {
        // Get all patients who have appointments with this provider
        const appointments = await prisma.appointment.findMany({
          where: { providerId: userId },
          select: { patientId: true },
          distinct: ['patientId']
        });
        const patientIds = appointments.map(a => a.patientId);
        if (patientIds.length === 0) {
          where.patientId = '00000000-0000-0000-0000-000000000000';
        } else {
          where.patientId = { in: patientIds };
        }
      }
    } else {
      // All other roles cannot see stats
      where.patientId = '00000000-0000-0000-0000-000000000000';
    }
    
    if (metricType) where.metricType = metricType;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));
    where.recordedAt = { gte: startDate };

    const [totalReadings, alertCount, latestData, averageValue] = await Promise.all([
      prisma.remoteMonitoringData.count({ where }),
      prisma.remoteMonitoringData.count({ where: { ...where, isAlert: true } }),
      prisma.remoteMonitoringData.findFirst({
        where,
        orderBy: { recordedAt: 'desc' },
      }),
      prisma.remoteMonitoringData.aggregate({
        where,
        _avg: { value: true },
      }),
    ]);

    res.json({
      stats: {
        totalReadings,
        alertCount,
        latestData,
        averageValue: averageValue._avg.value || 0,
        period: `${days} days`,
      },
    });
  } catch (error: any) {
    console.error('Get monitoring stats error:', error);
    res.status(500).json({ message: 'Failed to fetch monitoring statistics', error: error.message });
  }
};

// Helper function to determine alert level
function determineAlertLevel(metricType: string, value: number): { isAlert: boolean; alertLevel: string | null } {
  const thresholds: { [key: string]: { low: number; high: number; criticalLow: number; criticalHigh: number } } = {
    BLOOD_PRESSURE_SYSTOLIC: { low: 90, high: 140, criticalLow: 70, criticalHigh: 180 },
    BLOOD_PRESSURE_DIASTOLIC: { low: 60, high: 90, criticalLow: 40, criticalHigh: 120 },
    HEART_RATE: { low: 60, high: 100, criticalLow: 40, criticalHigh: 150 },
    GLUCOSE: { low: 70, high: 140, criticalLow: 50, criticalHigh: 250 },
    WEIGHT: { low: 0, high: 200, criticalLow: 0, criticalHigh: 300 }, // Placeholder
  };

  const threshold = thresholds[metricType];
  if (!threshold) {
    return { isAlert: false, alertLevel: null };
  }

  if (value <= threshold.criticalLow || value >= threshold.criticalHigh) {
    return { isAlert: true, alertLevel: 'CRITICAL' };
  } else if (value <= threshold.low || value >= threshold.high) {
    return { isAlert: true, alertLevel: 'HIGH' };
  }

  return { isAlert: false, alertLevel: 'NORMAL' };
}

