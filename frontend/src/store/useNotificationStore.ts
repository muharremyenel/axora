import { create } from 'zustand';
import { Notification } from '@/types/notification';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Notification) => void;
    setNotifications: (notifications: Notification[]) => void;
    setUnreadCount: (count: number) => void;
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    addNotification: (notification) => 
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        })),
    setNotifications: (notifications) => 
        set({ notifications }),
    setUnreadCount: (count) => 
        set({ unreadCount: count }),
    markAsRead: (id) => 
        set((state) => ({
            notifications: state.notifications.map(n => 
                n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: state.unreadCount - 1
        })),
    markAllAsRead: () => 
        set((state) => ({
            notifications: state.notifications.map(n => ({ ...n, read: true })),
            unreadCount: 0
        }))
})); 