import axios from '@/lib/axios';
import { Notification } from '@/types/notification';

export const notificationService = {
    getNotifications: async () => {
        try {
            const response = await axios.get<Notification[]>('/api/notifications');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUnreadCount: async () => {
        try {
            const response = await axios.get<number>('/api/notifications/unread/count');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    markAsRead: async (id: number) => {
        try {
            await axios.patch(`/api/notifications/${id}/read`);
        } catch (error) {
            throw error;
        }
    },

    markAllAsRead: async () => {
        try {
            await axios.patch('/api/notifications/read-all');
        } catch (error) {
            throw error;
        }
    }
}; 