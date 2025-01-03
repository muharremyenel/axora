package com.axora.backend.repository;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.axora.backend.entity.Notification;
import com.axora.backend.entity.NotificationType;
import com.axora.backend.entity.Role;
import com.axora.backend.entity.Task;
import com.axora.backend.entity.TaskPriority;
import com.axora.backend.entity.TaskStatus;
import com.axora.backend.entity.User;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class NotificationRepositoryTest {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Test
    void shouldLoadContext() {
        assertThat(notificationRepository).isNotNull();
    }

    @Test
    void findByUserIdOrderByCreatedAtDesc_ShouldReturnNotifications() {
        // Given
        User user = User.builder()
            .name("Test User")
            .email("test@example.com")
            .password("password")
            .role(Role.ROLE_USER)
            .active(true)
            .build();
        userRepository.save(user);

        Task task = Task.builder()
            .title("Test Task")
            .description("Test Description")
            .assignedUser(user)
            .createdBy(user)  // created_by_id eklendi
            .status(TaskStatus.TODO)  // status eklendi
            .priority(TaskPriority.MEDIUM)  // priority eklendi
            .build();
        taskRepository.save(task);

        Notification notification = Notification.builder()
            .user(user)
            .task(task)
            .title("Test Notification")
            .message("Test Message")
            .type(NotificationType.TASK_ASSIGNED)
            .read(false)
            .build();
        notificationRepository.save(notification);

        // When
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        // Then
        assertThat(notifications).isNotEmpty();
        assertThat(notifications.get(0).getUser().getId()).isEqualTo(user.getId());
    }
} 