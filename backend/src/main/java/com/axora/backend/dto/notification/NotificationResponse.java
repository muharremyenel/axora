package com.axora.backend.dto.notification;

import java.time.LocalDateTime;

import com.axora.backend.entity.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private Long taskId;
    private boolean read;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
} 