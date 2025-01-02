package com.axora.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.axora.backend.entity.Notification;
import com.axora.backend.entity.NotificationType;
import com.axora.backend.entity.Task;
import com.axora.backend.entity.User;
import com.axora.backend.repository.NotificationRepository;
import com.axora.backend.dto.notification.NotificationResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void createNotification(User user, Task task, String title, String message, NotificationType type) {
        try {
            log.info("Bildirim oluşturuluyor: {} için {}", user.getEmail(), type);
            
            Notification notification = Notification.builder()
                .user(user)
                .task(task)
                .title(title)
                .message(message)
                .type(type)
                .build();

            notification = notificationRepository.save(notification);

            NotificationResponse response = mapToResponse(notification);
            
            messagingTemplate.convertAndSendToUser(
                user.getId().toString(),
                "/notifications",
                response
            );
            
            log.info("Bildirim başarıyla gönderildi: {}", notification.getId());
        } catch (Exception e) {
            log.error("Bildirim gönderilirken hata oluştu: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Bildirim bulunamadı"));

        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId);
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
        });
        notificationRepository.saveAll(unreadNotifications);
    }

    public List<NotificationResponse> mapToResponseList(List<Notification> notifications) {
        return notifications.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
            .id(notification.getId())
            .title(notification.getTitle())
            .message(notification.getMessage())
            .type(notification.getType())
            .taskId(notification.getTask().getId())
            .read(notification.isRead())
            .createdAt(notification.getCreatedAt())
            .readAt(notification.getReadAt())
            .build();
    }
} 