import { Bell } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuHeader,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { notificationService } from "@/services/notificationService";
import { Notification } from "@/types/notification";
import { cn } from "@/lib/utils";

export default function NotificationDropdown() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: notifications = [] } = useQuery({
        queryKey: ["notifications"],
        queryFn: notificationService.getNotifications,
    });

    const { data: unreadCount = 0 } = useQuery({
        queryKey: ["notifications", "unread"],
        queryFn: notificationService.getUnreadCount,
    });

    const markAsReadMutation = useMutation({
        mutationFn: notificationService.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: notificationService.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            markAsReadMutation.mutate(notification.id);
        }
        navigate(`/tasks/${notification.taskId}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-xs text-white flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuHeader className="flex items-center justify-between p-2">
                    <span className="font-medium">Bildirimler</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAllAsReadMutation.mutate()}
                        >
                            Tümünü Okundu İşaretle
                        </Button>
                    )}
                </DropdownMenuHeader>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                            Bildirim bulunmuyor
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={cn(
                                    "flex flex-col items-start p-3 cursor-pointer",
                                    !notification.read && "bg-muted/50 font-medium"
                                )}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="text-sm">{notification.title}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {notification.message}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 