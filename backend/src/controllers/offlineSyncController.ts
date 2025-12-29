import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { processOfflineSyncQueue, getSyncQueueStatus } from '../utils/offlineSync';

// Process offline sync queue
export const syncOfflineData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const results = await processOfflineSyncQueue(userId);

    res.json({
      message: 'Offline sync completed',
      results,
    });
  } catch (error: any) {
    console.error('Offline sync error:', error);
    res.status(500).json({ message: 'Offline sync failed', error: error.message });
  }
};

// Get sync queue status
export const getSyncStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const status = await getSyncQueueStatus(userId);

    res.json({ status });
  } catch (error: any) {
    console.error('Get sync status error:', error);
    res.status(500).json({ message: 'Failed to get sync status', error: error.message });
  }
};

