package com.axora.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axora.backend.dto.notification.NotificationResponse;
import com.axora.backend.entity.Notification;
import com.axora.backend.service.NotificationService;
import com.axora.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications() {
        List<Notification> notifications = notificationService.getUserNotifications(
            userService.getCurrentUser().getId()
        );
        List<NotificationResponse> response = notificationService.mapToResponseList(notifications);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount() {
        return ResponseEntity.ok(notificationService.getUnreadCount(
            userService.getCurrentUser().getId()
        ));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsRead(userService.getCurrentUser().getId());
        return ResponseEntity.ok().build();
    }
} 