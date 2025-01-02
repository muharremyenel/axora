import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { toast } from '@/components/ui/use-toast';

export function useWebSocket() {
    const clientRef = useRef<Client | null>(null);
    const { user } = useAuthStore();
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        if (!user) return;

        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            debug: function (str) {
                console.log('STOMP:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('WebSocket bağlantısı kuruldu, User:', user.email);
                client.subscribe(`/user/${user.id}/notifications`, message => {
                    try {
                        const notification = JSON.parse(message.body);
                        console.log('Yeni bildirim alındı:', notification);
                        addNotification(notification);
                        toast({
                            title: notification.title,
                            description: notification.message,
                        });
                    } catch (error) {
                        console.error('Bildirim işlenirken hata:', error);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('STOMP Hatası:', frame);
            },
            onWebSocketError: (event) => {
                console.error('WebSocket Hatası:', event);
            }
        });

        client.activate();
        clientRef.current = client;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                client.deactivate();
            } else {
                client.activate();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [user, addNotification]);
} 