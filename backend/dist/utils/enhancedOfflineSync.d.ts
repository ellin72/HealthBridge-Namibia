/**
 * Enhanced Offline-First Sync Queue Module
 * Handles rural deployments with improved sync capabilities
 */
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
export declare function processSyncQueueEnhanced(userId: string, batchSize?: number): Promise<{
    processed: number;
    successful: number;
    failed: number;
    results: any[];
}>;
/**
 * Get enhanced sync queue status with detailed metrics
 */
export declare function getEnhancedSyncQueueStatus(userId: string): Promise<{
    pending: number;
    synced: number;
    failed: number;
    byEntityType: {
        entityType: string;
        count: number;
    }[];
    byAction: {
        action: string;
        count: number;
    }[];
}>;
/**
 * Auto-sync when connection is available
 */
export declare function autoSyncOnConnection(userId: string): Promise<{
    processed: number;
    successful: number;
    failed: number;
    results: any[];
}>;
//# sourceMappingURL=enhancedOfflineSync.d.ts.map