"use strict";
/**
 * Enhanced Offline-First Sync Queue Module
 * Handles rural deployments with improved sync capabilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSyncQueueEnhanced = processSyncQueueEnhanced;
exports.getEnhancedSyncQueueStatus = getEnhancedSyncQueueStatus;
exports.autoSyncOnConnection = autoSyncOnConnection;
const prisma_1 = require("./prisma");
const offlineSync_1 = require("./offlineSync");
/**
 * Enhanced sync queue processing with batch optimization
 */
async function processSyncQueueEnhanced(userId, batchSize = 50) {
    // First, migrate any items with null status to PENDING (for existing records before status field was added)
    // This must happen BEFORE the retry count check to ensure items with retryCount >= 5 are properly marked as FAILED
    // Note: Using raw query to handle potential null values in legacy data (Prisma types don't allow null on non-nullable fields)
    await prisma_1.prisma.$executeRaw `
    UPDATE "OfflineSyncQueue" 
    SET status = 'PENDING' 
    WHERE "userId" = ${userId} AND status IS NULL
  `;
    // Handle orphaned items: mark PROCESSING items as PENDING for retry, and mark PENDING items with retryCount >= 5 as FAILED
    const processingTimeout = 5 * 60 * 1000; // 5 minutes - items stuck in PROCESSING longer than this are considered orphaned
    const timeoutThreshold = new Date(Date.now() - processingTimeout);
    await Promise.all([
        // Reset any items stuck in PROCESSING status for more than 5 minutes back to PENDING (they may have been interrupted)
        // Only reset items that have been PROCESSING for a while to avoid interfering with active processing
        prisma_1.prisma.offlineSyncQueue.updateMany({
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
        // Mark any PENDING items with retryCount >= 5 as FAILED (including items that were just migrated from null status)
        // This check runs AFTER the null status migration to ensure all items with exhausted retries are marked as FAILED
        prisma_1.prisma.offlineSyncQueue.updateMany({
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
    // Fetch candidate items to process: PENDING status with retryCount < 5
    const candidateItems = await prisma_1.prisma.offlineSyncQueue.findMany({
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
    await prisma_1.prisma.offlineSyncQueue.updateMany({
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
    const queueItems = await prisma_1.prisma.offlineSyncQueue.findMany({
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
            await prisma_1.prisma.offlineSyncQueue.update({
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
        }
        catch (error) {
            // Update retry count
            const newRetryCount = item.retryCount + 1;
            const isFailed = newRetryCount >= 5;
            // Update status: mark as FAILED after max retries, otherwise keep as PENDING
            await prisma_1.prisma.offlineSyncQueue.update({
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
async function syncAppointmentEnhanced(action, payload, userId) {
    switch (action) {
        case 'CREATE':
            // Check for duplicates
            const existing = await prisma_1.prisma.appointment.findFirst({
                where: {
                    patientId: userId,
                    providerId: payload.providerId,
                    appointmentDate: payload.appointmentDate ? new Date(payload.appointmentDate) : undefined
                }
            });
            if (existing) {
                // Update instead of create
                return await prisma_1.prisma.appointment.update({
                    where: { id: existing.id },
                    data: payload
                });
            }
            return await prisma_1.prisma.appointment.create({
                data: {
                    ...payload,
                    patientId: userId
                }
            });
        case 'UPDATE':
            return await prisma_1.prisma.appointment.update({
                where: { id: payload.id },
                data: payload
            });
        case 'DELETE':
            return await prisma_1.prisma.appointment.delete({
                where: { id: payload.id }
            });
        default:
            throw new Error(`Unknown action: ${action}`);
    }
}
/**
 * Enhanced consultation sync
 */
async function syncConsultationEnhanced(action, payload, userId) {
    switch (action) {
        case 'CREATE':
            return await prisma_1.prisma.consultationNote.create({
                data: payload
            });
        case 'UPDATE':
            return await prisma_1.prisma.consultationNote.update({
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
async function syncHabitEntryEnhanced(action, payload, userId) {
    switch (action) {
        case 'CREATE':
            return await prisma_1.prisma.habitEntry.create({
                data: payload
            });
        case 'UPDATE':
            return await prisma_1.prisma.habitEntry.update({
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
async function syncMedicationLogEnhanced(action, payload, userId) {
    switch (action) {
        case 'CREATE':
            return await prisma_1.prisma.medicationLog.create({
                data: payload
            });
        case 'UPDATE':
            return await prisma_1.prisma.medicationLog.update({
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
async function syncMonitoringDataEnhanced(action, payload, userId) {
    switch (action) {
        case 'CREATE':
            return await prisma_1.prisma.remoteMonitoringData.create({
                data: {
                    ...payload,
                    patientId: userId
                }
            });
        case 'UPDATE':
            return await prisma_1.prisma.remoteMonitoringData.update({
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
async function getEnhancedSyncQueueStatus(userId) {
    const [pending, synced, failed, byEntityType, byAction] = await Promise.all([
        // Pending items: PENDING or PROCESSING status, not synced, not failed, retry count < 5
        prisma_1.prisma.offlineSyncQueue.count({
            where: {
                userId,
                status: { in: ['PENDING', 'PROCESSING'] },
                synced: false,
                retryCount: { lt: 5 }
            }
        }),
        // Synced items: successfully synced
        prisma_1.prisma.offlineSyncQueue.count({
            where: {
                userId,
                status: 'SYNCED',
                synced: true
            }
        }),
        // Failed items: exhausted retries (status = FAILED or retryCount >= 5)
        prisma_1.prisma.offlineSyncQueue.count({
            where: {
                userId,
                OR: [
                    { status: 'FAILED' },
                    { synced: false, retryCount: { gte: 5 } }
                ]
            }
        }),
        prisma_1.prisma.offlineSyncQueue.groupBy({
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
        prisma_1.prisma.offlineSyncQueue.groupBy({
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
async function autoSyncOnConnection(userId) {
    const status = await (0, offlineSync_1.getSyncQueueStatus)(userId);
    if (status.pending > 0) {
        console.log(`Auto-syncing ${status.pending} items for user ${userId}`);
        return await processSyncQueueEnhanced(userId);
    }
    return { processed: 0, successful: 0, failed: 0, results: [] };
}
//# sourceMappingURL=enhancedOfflineSync.js.map