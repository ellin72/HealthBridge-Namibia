"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processOfflineSyncQueue = processOfflineSyncQueue;
exports.addToSyncQueue = addToSyncQueue;
exports.getSyncQueueStatus = getSyncQueueStatus;
const prisma_1 = require("./prisma");
// Process offline sync queue
async function processOfflineSyncQueue(userId) {
    const queueItems = await prisma_1.prisma.offlineSyncQueue.findMany({
        where: {
            userId,
            synced: false,
        },
        orderBy: { createdAt: 'asc' },
        take: 50, // Process in batches
    });
    const results = [];
    for (const item of queueItems) {
        try {
            const payload = JSON.parse(item.payload);
            // Process based on entity type
            let result;
            switch (item.entityType) {
                case 'APPOINTMENT':
                    result = await syncAppointment(item.action, payload, userId);
                    break;
                case 'CONSULTATION':
                    result = await syncConsultation(item.action, payload, userId);
                    break;
                case 'HABIT_ENTRY':
                    result = await syncHabitEntry(item.action, payload, userId);
                    break;
                default:
                    throw new Error(`Unknown entity type: ${item.entityType}`);
            }
            // Mark as synced
            await prisma_1.prisma.offlineSyncQueue.update({
                where: { id: item.id },
                data: {
                    synced: true,
                    syncedAt: new Date(),
                },
            });
            results.push({ success: true, itemId: item.id, result });
        }
        catch (error) {
            // Update retry count
            await prisma_1.prisma.offlineSyncQueue.update({
                where: { id: item.id },
                data: {
                    retryCount: item.retryCount + 1,
                    error: error.message,
                },
            });
            results.push({ success: false, itemId: item.id, error: error.message });
        }
    }
    return results;
}
// Add item to offline sync queue
async function addToSyncQueue(userId, action, entityType, payload, entityId) {
    return await prisma_1.prisma.offlineSyncQueue.create({
        data: {
            userId,
            action,
            entityType,
            entityId: entityId || null,
            payload: JSON.stringify(payload),
            synced: false,
        },
    });
}
// Sync appointment
async function syncAppointment(action, payload, userId) {
    switch (action) {
        case 'CREATE':
            return await prisma_1.prisma.appointment.create({
                data: {
                    ...payload,
                    patientId: userId,
                },
            });
        case 'UPDATE':
            return await prisma_1.prisma.appointment.update({
                where: { id: payload.id },
                data: payload,
            });
        case 'DELETE':
            return await prisma_1.prisma.appointment.delete({
                where: { id: payload.id },
            });
        default:
            throw new Error(`Unknown action: ${action}`);
    }
}
// Sync consultation
async function syncConsultation(action, payload, userId) {
    switch (action) {
        case 'CREATE':
            return await prisma_1.prisma.consultationNote.create({
                data: payload,
            });
        case 'UPDATE':
            return await prisma_1.prisma.consultationNote.update({
                where: { id: payload.id },
                data: payload,
            });
        default:
            throw new Error(`Unknown action: ${action}`);
    }
}
// Sync habit entry
async function syncHabitEntry(action, payload, userId) {
    switch (action) {
        case 'CREATE':
            return await prisma_1.prisma.habitEntry.create({
                data: payload,
            });
        case 'UPDATE':
            return await prisma_1.prisma.habitEntry.update({
                where: { id: payload.id },
                data: payload,
            });
        default:
            throw new Error(`Unknown action: ${action}`);
    }
}
// Get sync queue status
async function getSyncQueueStatus(userId) {
    const [pending, synced, failed] = await Promise.all([
        prisma_1.prisma.offlineSyncQueue.count({
            where: { userId, synced: false },
        }),
        prisma_1.prisma.offlineSyncQueue.count({
            where: { userId, synced: true },
        }),
        prisma_1.prisma.offlineSyncQueue.count({
            where: { userId, synced: false, retryCount: { gte: 3 } },
        }),
    ]);
    return { pending, synced, failed };
}
//# sourceMappingURL=offlineSync.js.map