// Offline storage utilities for store-and-forward functionality

const OFFLINE_STORAGE_KEY = 'healthbridge_offline_queue';

export interface OfflineAction {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: string;
  payload: any;
  timestamp: number;
}

// Add action to offline queue
export function addToOfflineQueue(action: Omit<OfflineAction, 'id' | 'timestamp'>): string {
  const queue = getOfflineQueue();
  const id = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const offlineAction: OfflineAction = {
    id,
    ...action,
    timestamp: Date.now(),
  };

  queue.push(offlineAction);
  localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(queue));
  
  return id;
}

// Get offline queue
export function getOfflineQueue(): OfflineAction[] {
  const stored = localStorage.getItem(OFFLINE_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Remove action from queue
export function removeFromOfflineQueue(id: string): void {
  const queue = getOfflineQueue();
  const filtered = queue.filter((action) => action.id !== id);
  localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(filtered));
}

// Clear offline queue
export function clearOfflineQueue(): void {
  localStorage.removeItem(OFFLINE_STORAGE_KEY);
}

// Check if online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Sync offline queue with backend
export async function syncOfflineQueue(api: any): Promise<void> {
  if (!isOnline()) {
    return;
  }

  const queue = getOfflineQueue();
  
  for (const action of queue) {
    try {
      // Attempt to sync each action
      await syncAction(action, api);
      removeFromOfflineQueue(action.id);
    } catch (error) {
      console.error(`Failed to sync action ${action.id}:`, error);
      // Keep in queue for retry
    }
  }
}

// Sync individual action
async function syncAction(action: OfflineAction, api: any): Promise<void> {
  const { action: actionType, entityType, payload } = action;
  
  // Map entity types to API endpoints
  const endpointMap: { [key: string]: string } = {
    APPOINTMENT: '/appointments',
    CONSULTATION: '/consultations',
    HABIT_ENTRY: '/wellness-tools/habits',
    TRIAGE: '/triage/assess',
  };

  const endpoint = endpointMap[entityType];
  if (!endpoint) {
    throw new Error(`Unknown entity type: ${entityType}`);
  }

  switch (actionType) {
    case 'CREATE':
      await api.post(endpoint, payload);
      break;
    case 'UPDATE':
      await api.put(`${endpoint}/${payload.id}`, payload);
      break;
    case 'DELETE':
      await api.delete(`${endpoint}/${payload.id}`);
      break;
  }
}

// Register service worker
export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

