/**
 * Enhanced Offline-First Sync Queue Module
 * Handles rural deployments with improved sync capabilities
 */

import { prisma } from './prisma';
import { addToSyncQueue, processOfflineSyncQueue, getSyncQueueStatus } from './offlineSync';

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
  // First, handle orphaned items: mark PROCESSING items as PENDING for retry, and mark PENDING items with retryCount >= 5 as FAILED
  const processingTimeout = 5 * 60 * 1000; // 5 minutes - items stuck in PROCESSING longer than this are considered orphaned
  const timeoutThreshold = new Date(Date.now() - processingTimeout);
  
  await Promise.all([
    // Reset any items stuck in PROCESSING status for more than 5 minutes back to PENDING (they may have been interrupted)
    // Only reset items that have been PROCESSING for a while to avoid interfering with active processing
    prisma.offlineSyncQueue.updateMany({
      where: {
        userId,
        status: 'PROCESSING',
        synced: false,
        updatedAt: { lt: timeoutThreshold } // Only reset items that haven't been updated recently
      },
      data: {
        status: 'PENDING'
      }
    }),
    // Mark any PENDING items with retryCount >= 5 as FAILED (they should have been marked as FAILED but weren't due to race conditions)
    prisma.offlineSyncQueue.updateMany({
      where: {
        userId,
        status: 'PENDING',
        synced: false,
        retryCount: { gte: 5 }
      },
      data: {
        status: 'FAILED'
      }
    })
  ]);

  // First, migrate any items with null status to PENDING (for existing records before status field was added)
  await prisma.offlineSyncQueue.updateMany({
    where: {
      userId,
      status: null
    },
    data: {
      status: 'PENDING'
    }
  });

  // Fetch candidate items to process: PENDING status with retryCount < 5
  const candidateItems = await prisma.offlineSyncQueue.findMany({
    where: {
      userId,
      synced: false,
      status: 'PENDING',
      retryCount: { lt: 5 } // Max 5 retries
    },
    orderBy: [
      { retryCount: 'asc' }, // Process items with fewer retries first
      { createdAt: 'asc' }
    ],
    take: batchSize
  });

  if (candidateItems.length === 0) {
    return {
      processed: 0,
      successful: 0,
      failed: 0,
      results: []
    };
  }

  // Atomically mark items as PROCESSING only if they're still PENDING (prevents race conditions)
  // This ensures only one process can claim an item for processing
  const itemIds = candidateItems.map(item => item.id);
  await prisma.offlineSyncQueue.updateMany({
    where: {
      id: { in: itemIds },
      status: 'PENDING', // Only update if still PENDING (atomic check prevents race conditions)
      synced: false
    },
    data: {
      status: 'PROCESSING'
    }
  });

  // Re-fetch only items that are now PROCESSING to see which ones we successfully claimed
  // Items claimed by other processes will have a different status
  const queueItems = await prisma.offlineSyncQueue.findMany({
    where: {
      id: { in: itemIds },
      status: 'PROCESSING', // Only process items we successfully claimed
      synced: false
    },
    orderBy: [
      { retryCount: 'asc' },
      { createdAt: 'asc' }
    ]
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
          appointmentDate: payload.appointmentDate ? new Date(payload.appointmentDate) : undefined
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
    // Pending items: PENDING or PROCESSING status, not synced, not failed, retry count < 5
    prisma.offlineSyncQueue.count({
      where: { 
        userId, 
        status: { in: ['PENDING', 'PROCESSING'] },
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
          { status: 'PROCESSING' },
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
          { status: 'PROCESSING' },
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

