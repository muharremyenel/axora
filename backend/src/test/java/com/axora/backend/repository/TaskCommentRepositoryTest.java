package com.axora.backend.repository;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.axora.backend.entity.Role;
import com.axora.backend.entity.Task;
import com.axora.backend.entity.TaskComment;
import com.axora.backend.entity.TaskPriority;
import com.axora.backend.entity.TaskStatus;
import com.axora.backend.entity.User;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class TaskCommentRepositoryTest {

    @Autowired
    private TaskCommentRepository taskCommentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Test
    void shouldLoadContext() {
        assertThat(taskCommentRepository).isNotNull();
    }

    @Test
    void findByTaskIdOrderByCreatedAtDesc_ShouldReturnCommentsInOrder() {
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
            .createdBy(user)
            .status(TaskStatus.TODO)
            .priority(TaskPriority.MEDIUM)
            .build();
        taskRepository.save(task);

        TaskComment comment1 = TaskComment.builder()
            .task(task)
            .user(user)
            .content("Test Comment 1")
            .build();
        TaskComment comment2 = TaskComment.builder()
            .task(task)
            .user(user)
            .content("Test Comment 2")
            .build();
        taskCommentRepository.save(comment1);
        taskCommentRepository.save(comment2);

        // When
        List<TaskComment> comments = taskCommentRepository.findByTaskIdOrderByCreatedAtDesc(task.getId());

        // Then
        assertThat(comments).isNotEmpty();
        assertThat(comments).hasSize(2);
        assertThat(comments.get(0).getCreatedAt()).isAfterOrEqualTo(comments.get(1).getCreatedAt());
    }
} 