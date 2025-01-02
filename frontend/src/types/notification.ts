export interface Notification {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    taskId: number;
    read: boolean;
    createdAt: string;
    readAt?: string;
}

export enum NotificationType {
    TASK_ASSIGNED = 'TASK_ASSIGNED',
    TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED',
    TASK_COMMENTED = 'TASK_COMMENTED',
    TASK_OVERDUE = 'TASK_OVERDUE'
} 