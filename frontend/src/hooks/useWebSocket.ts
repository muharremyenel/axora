import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { toast } from '@/components/ui/use-toast';

export function useWebSocket() {
    const clientRef = useRef<Client | null>(null);
    const { user } = useAuthStore();
    const { addNotification } = useNotificationStore();
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        if (!user) return;

        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            debug: () => {},
            reconnectDelay: 30000,
            heartbeatIncoming: 20000,
            heartbeatOutgoing: 20000,
            onConnect: () => {
                const currentClient = clientRef.current;
                if (currentClient?.connected) {
                    currentClient.unsubscribe(`/user/${user.id}/notifications`);
                }

                client.subscribe(`/user/${user.id}/notifications`, message => {
                    try {
                        const notification = JSON.parse(message.body);
                        addNotification(notification);
                        toast({
                            title: notification.title,
                            description: notification.message,
                        });
                    } catch (error) {
                        // Sessizce hata yönetimi
                    }
                });
            },
            onStompError: () => {
                // Sadece gerçek hataları logla
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }
                reconnectTimeoutRef.current = setTimeout(() => {
                    const currentClient = clientRef.current;
                    if (currentClient && !currentClient.connected) {
                        currentClient.activate();
                    }
                }, 30000);
            }
        });

        clientRef.current = client;

        if (!document.hidden) {
            client.activate();
        }

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            const currentClient = clientRef.current;
            if (currentClient?.connected) {
                currentClient.unsubscribe(`/user/${user.id}/notifications`);
                currentClient.deactivate();
            }
        };
    }, [user?.id]);
} 