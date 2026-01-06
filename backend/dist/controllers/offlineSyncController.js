"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSyncStatus = exports.syncOfflineData = void 0;
const offlineSync_1 = require("../utils/offlineSync");
// Process offline sync queue
const syncOfflineData = async (req, res) => {
    try {
        const userId = req.user.id;
        const results = await (0, offlineSync_1.processOfflineSyncQueue)(userId);
        res.json({
            message: 'Offline sync completed',
            results,
        });
    }
    catch (error) {
        console.error('Offline sync error:', error);
        res.status(500).json({ message: 'Offline sync failed', error: error.message });
    }
};
exports.syncOfflineData = syncOfflineData;
// Get sync queue status
const getSyncStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const status = await (0, offlineSync_1.getSyncQueueStatus)(userId);
        res.json({ status });
    }
    catch (error) {
        console.error('Get sync status error:', error);
        res.status(500).json({ message: 'Failed to get sync status', error: error.message });
    }
};
exports.getSyncStatus = getSyncStatus;
//# sourceMappingURL=offlineSyncController.js.map