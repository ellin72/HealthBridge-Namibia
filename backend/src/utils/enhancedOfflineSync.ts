/**
 * Enhanced Offline-First Sync Queue Module
 * Handles rural deployments with improved sync capabilities
 */

import { PrismaClient } from '@prisma/client';
import { addToSyncQueue, processOfflineSyncQueue, getSyncQueueStatus } from './offlineSync';

const prisma = new PrismaClient();

export interface SyncQueueItem {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  payload: any;
  synced: boolean;
  syncedAt?: Date;
  error?: string;
  retryCount: number;
  createdAt: Date;
}

/**
 * Enhanced sync queue processing with batch optimization
 */
export async function processSyncQueueEnhanced(userId: string, batchSize: number = 50): Promise<{
  processed: number;
  successful: number;
  failed: number;
  results: any[];
}> {
  const queueItems = await prisma.offlineSyncQueue.findMany({
    where: {
      userId,
      synced: false,
      status: { in: ['PENDING', 'PROCESSING'] }, // Only process pending/processing items
      retryCount: { lt: 5 } // Max 5 retries
    },
    orderBy: [
      { retryCount: 'asc' }, // Process items with fewer retries first
      { createdAt: 'asc' }
    ],
    take: batchSize
  });

  const results = [];
  let successful = 0;
  let failed = 0;

  for (const item of queueItems) {
    try {
      const payload = JSON.parse(item.payload);
      
      // Process based on entity type with enhanced error handling
      let result;
      switch (item.entityType) {
        case 'APPOINTMENT':
          result = await syncAppointmentEnhanced(item.action, payload, userId);
          break;
        case 'CONSULTATION':
          result = await syncConsultationEnhanced(item.action, payload, userId);
          break;
        case 'HABIT_ENTRY':
          result = await syncHabitEntryEnhanced(item.action, payload, userId);
          break;
        case 'MEDICATION_LOG':
          result = await syncMedicationLogEnhanced(item.action, payload, userId);
          break;
        case 'MONITORING_DATA':
          result = await syncMonitoringDataEnhanced(item.action, payload, userId);
          break;
        default:
          throw new Error(`Unknown entity type: ${item.entityType}`);
      }

      // Mark as synced
      await prisma.offlineSyncQueue.update({
        where: { id: item.id },
        data: {
          synced: true,
          status: 'SYNCED',
          syncedAt: new Date(),
          error: null
        }
      });

      results.push({ success: true, itemId: item.id, result });
      successful++;
    } catch (error: any) {
      // Update retry count
      const newRetryCount = item.retryCount + 1;
      const isFailed = newRetryCount >= 5;
      
      // Update status: mark as FAILED after max retries, otherwise keep as PENDING
      await prisma.offlineSyncQueue.update({
        where: { id: item.id },
        data: {
          retryCount: newRetryCount,
          error: error.message,
          synced: false, // Keep as false for failed items so they remain queryable
          status: isFailed ? 'FAILED' : 'PENDING' // Use status field to distinguish pending from failed
        }
      });

      results.push({ success: false, itemId: item.id, error: error.message });
      failed++;
    }
  }

  return {
    processed: queueItems.length,
    successful,
    failed,
    results
  };
}

/**
 * Enhanced appointment sync with conflict resolution
 */
async function syncAppointmentEnhanced(action: string, payload: any, userId: string) {
  switch (action) {
    case 'CREATE':
      // Check for duplicates
      const existing = await prisma.appointment.findFirst({
        where: {
          patientId: userId,
          providerId: payload.providerId,
          scheduledAt: new Date(payload.scheduledAt)
        }
      });

      if (existing) {
        // Update instead of create
        return await prisma.appointment.update({
          where: { id: existing.id },
          data: payload
        });
      }

      return await prisma.appointment.create({
        data: {
          ...payload,
          patientId: userId
        }
      });
    case 'UPDATE':
      return await prisma.appointment.update({
        where: { id: payload.id },
        data: payload
      });
    case 'DELETE':
      return await prisma.appointment.delete({
        where: { id: payload.id }
      });
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

/**
 * Enhanced consultation sync
 */
async function syncConsultationEnhanced(action: string, payload: any, userId: string) {
  switch (action) {
    case 'CREATE':
      return await prisma.consultationNote.create({
        data: payload
      });
    case 'UPDATE':
      return await prisma.consultationNote.update({
        where: { id: payload.id },
        data: payload
      });
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

/**
 * Enhanced habit entry sync
 */
async function syncHabitEntryEnhanced(action: string, payload: any, userId: string) {
  switch (action) {
    case 'CREATE':
      return await prisma.habitEntry.create({
        data: payload
      });
    case 'UPDATE':
      return await prisma.habitEntry.update({
        where: { id: payload.id },
        data: payload
      });
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

/**
 * Enhanced medication log sync
 */
async function syncMedicationLogEnhanced(action: string, payload: any, userId: string) {
  switch (action) {
    case 'CREATE':
      return await prisma.medicationLog.create({
        data: payload
      });
    case 'UPDATE':
      return await prisma.medicationLog.update({
        where: { id: payload.id },
        data: payload
      });
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

/**
 * Enhanced monitoring data sync
 */
async function syncMonitoringDataEnhanced(action: string, payload: any, userId: string) {
  switch (action) {
    case 'CREATE':
      return await prisma.remoteMonitoringData.create({
        data: {
          ...payload,
          patientId: userId
        }
      });
    case 'UPDATE':
      return await prisma.remoteMonitoringData.update({
        where: { id: payload.id },
        data: payload
      });
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

/**
 * Get enhanced sync queue status with detailed metrics
 */
export async function getEnhancedSyncQueueStatus(userId: string) {
  const [pending, synced, failed, byEntityType, byAction] = await Promise.all([
    // Pending items: not synced, not failed, retry count < 5
    prisma.offlineSyncQueue.count({
      where: { 
        userId, 
        status: 'PENDING',
        synced: false,
        retryCount: { lt: 5 }
      }
    }),
    // Synced items: successfully synced
    prisma.offlineSyncQueue.count({
      where: { 
        userId, 
        status: 'SYNCED',
        synced: true 
      }
    }),
    // Failed items: exhausted retries (status = FAILED or retryCount >= 5)
    prisma.offlineSyncQueue.count({
      where: { 
        userId, 
        OR: [
          { status: 'FAILED' },
          { synced: false, retryCount: { gte: 5 } }
        ]
      }
    }),
    prisma.offlineSyncQueue.groupBy({
      by: ['entityType'],
      where: { 
        userId, 
        OR: [
          { status: 'PENDING' },
          { status: 'FAILED' }
        ]
      },
      _count: true
    }),
    prisma.offlineSyncQueue.groupBy({
      by: ['action'],
      where: { 
        userId, 
        OR: [
          { status: 'PENDING' },
          { status: 'FAILED' }
        ]
      },
      _count: true
    })
  ]);

  return {
    pending,
    synced,
    failed,
    byEntityType: byEntityType.map(item => ({
      entityType: item.entityType,
      count: item._count
    })),
    byAction: byAction.map(item => ({
      action: item.action,
      count: item._count
    }))
  };
}

/**
 * Auto-sync when connection is available
 */
export async function autoSyncOnConnection(userId: string) {
  const status = await getSyncQueueStatus(userId);
  
  if (status.pending > 0) {
    console.log(`Auto-syncing ${status.pending} items for user ${userId}`);
    return await processSyncQueueEnhanced(userId);
  }

  return { processed: 0, successful: 0, failed: 0, results: [] };
}

