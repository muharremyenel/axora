package com.axora.backend.unit.service;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.axora.backend.dto.notification.NotificationResponse;
import com.axora.backend.entity.Notification;
import com.axora.backend.entity.NotificationType;
import com.axora.backend.entity.Task;
import com.axora.backend.entity.User;
import com.axora.backend.repository.NotificationRepository;
import com.axora.backend.service.NotificationService;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @SuppressWarnings("unused")
    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    void getUserNotifications_ShouldReturnUserNotifications() {
        // Given
        User user = User.builder().id(1L).build();
        Task task = Task.builder().id(1L).build();
        
        Notification notification = Notification.builder()
            .id(1L)
            .user(user)
            .task(task)
            .title("Test Notification")
            .message("Test Message")
            .type(NotificationType.TASK_ASSIGNED)
            .read(false)
            .build();

        when(notificationRepository.findByUserIdOrderByCreatedAtDesc(1L))
            .thenReturn(List.of(notification));

        // When
        List<Notification> notifications = notificationService.getUserNotifications(1L);

        // Then
        assertThat(notifications).isNotEmpty();
        assertThat(notifications.get(0).getTitle()).isEqualTo("Test Notification");
    }

    @Test
    void markAsRead_ShouldMarkNotificationAsRead() {
        // Given
        User user = User.builder().id(1L).build();
        Task task = Task.builder().id(1L).build();
        
        Notification notification = Notification.builder()
            .id(1L)
            .user(user)
            .task(task)
            .title("Test Notification")
            .message("Test Message")
            .type(NotificationType.TASK_ASSIGNED)
            .read(false)
            .build();

        when(notificationRepository.findById(1L)).thenReturn(java.util.Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        // When
        notificationService.markAsRead(1L);

        // Then
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void createNotification_ShouldCreateAndSendNotification() {
        // Given
        User user = User.builder()
            .id(1L)
            .email("test@example.com")
            .build();
        
        Task task = Task.builder()
            .id(1L)
            .title("Test Task")
            .build();

        String title = "Test Notification";
        String message = "Test Message";
        NotificationType type = NotificationType.TASK_ASSIGNED;

        Notification savedNotification = Notification.builder()
            .id(1L)
            .user(user)
            .task(task)
            .title(title)
            .message(message)
            .type(type)
            .createdAt(LocalDateTime.now())
            .build();

        when(notificationRepository.save(any(Notification.class))).thenReturn(savedNotification);

        // When
        notificationService.createNotification(user, task, title, message, type);

        // Then
        verify(notificationRepository).save(any(Notification.class));
        verify(messagingTemplate).convertAndSendToUser(
            user.getId().toString(),
            "/notifications",
            NotificationResponse.builder()
                .id(savedNotification.getId())
                .title(title)
                .message(message)
                .type(type)
                .taskId(task.getId())
                .read(false)
                .createdAt(savedNotification.getCreatedAt())
                .build()
        );
    }
} 