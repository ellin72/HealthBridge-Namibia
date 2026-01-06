export declare function processOfflineSyncQueue(userId: string): Promise<({
    success: boolean;
    itemId: string;
    result: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        providerId: string;
        appointmentDate: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        notes: string | null;
    } | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        providerId: string;
        notes: string;
        appointmentId: string;
        diagnosis: string | null;
        prescription: string | null;
        followUpDate: Date | null;
    } | {
        id: string;
        createdAt: Date;
        notes: string | null;
        date: Date;
        habitTrackerId: string;
        value: number;
    };
    error?: undefined;
} | {
    success: boolean;
    itemId: string;
    error: any;
    result?: undefined;
})[]>;
export declare function addToSyncQueue(userId: string, action: string, entityType: string, payload: any, entityId?: string): Promise<{
    error: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import(".prisma/client").$Enums.SyncQueueStatus;
    userId: string;
    action: string;
    entityType: string;
    entityId: string | null;
    payload: string;
    synced: boolean;
    syncedAt: Date | null;
    retryCount: number;
}>;
export declare function getSyncQueueStatus(userId: string): Promise<{
    pending: number;
    synced: number;
    failed: number;
}>;
//# sourceMappingURL=offlineSync.d.ts.map