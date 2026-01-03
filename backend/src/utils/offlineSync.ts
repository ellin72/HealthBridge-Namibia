import { prisma } from './prisma';

// Process offline sync queue
export async function processOfflineSyncQueue(userId: string) {
  const queueItems = await prisma.offlineSyncQueue.findMany({
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
      await prisma.offlineSyncQueue.update({
        where: { id: item.id },
        data: {
          synced: true,
          syncedAt: new Date(),
        },
      });

      results.push({ success: true, itemId: item.id, result });
    } catch (error: any) {
      // Update retry count
      await prisma.offlineSyncQueue.update({
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
export async function addToSyncQueue(
  userId: string,
  action: string,
  entityType: string,
  payload: any,
  entityId?: string
) {
  return await prisma.offlineSyncQueue.create({
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
async function syncAppointment(action: string, payload: any, userId: string) {
  switch (action) {
    case 'CREATE':
      return await prisma.appointment.create({
        data: {
          ...payload,
          patientId: userId,
        },
      });
    case 'UPDATE':
      return await prisma.appointment.update({
        where: { id: payload.id },
        data: payload,
      });
    case 'DELETE':
      return await prisma.appointment.delete({
        where: { id: payload.id },
      });
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

// Sync consultation
async function syncConsultation(action: string, payload: any, userId: string) {
  switch (action) {
    case 'CREATE':
      return await prisma.consultationNote.create({
        data: payload,
      });
    case 'UPDATE':
      return await prisma.consultationNote.update({
        where: { id: payload.id },
        data: payload,
      });
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

// Sync habit entry
async function syncHabitEntry(action: string, payload: any, userId: string) {
  switch (action) {
    case 'CREATE':
      return await prisma.habitEntry.create({
        data: payload,
      });
    case 'UPDATE':
      return await prisma.habitEntry.update({
        where: { id: payload.id },
        data: payload,
      });
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

// Get sync queue status
export async function getSyncQueueStatus(userId: string) {
  const [pending, synced, failed] = await Promise.all([
    prisma.offlineSyncQueue.count({
      where: { userId, synced: false },
    }),
    prisma.offlineSyncQueue.count({
      where: { userId, synced: true },
    }),
    prisma.offlineSyncQueue.count({
      where: { userId, synced: false, retryCount: { gte: 3 } },
    }),
  ]);

  return { pending, synced, failed };
}

