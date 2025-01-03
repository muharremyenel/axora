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

import com.axora.backend.dto.comment.CommentRequest;
import com.axora.backend.dto.comment.CommentResponse;
import com.axora.backend.entity.Role;
import com.axora.backend.entity.Task;
import com.axora.backend.entity.TaskComment;
import com.axora.backend.entity.User;
import com.axora.backend.repository.TaskCommentRepository;
import com.axora.backend.repository.TaskRepository;
import com.axora.backend.service.NotificationService;
import com.axora.backend.service.TaskCommentService;
import com.axora.backend.service.UserService;

@ExtendWith(MockitoExtension.class)
class TaskCommentServiceTest {

    @Mock
    private TaskCommentRepository commentRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserService userService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private TaskCommentService taskCommentService;

    @Test
    void addComment_ShouldCreateAndReturnComment() {
        // Given
        User currentUser = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .build();

        User adminUser = User.builder()
            .id(2L)
            .name("Admin User")
            .email("admin@example.com")
            .role(Role.ROLE_ADMIN)
            .build();

        Task task = Task.builder()
            .id(1L)
            .title("Test Task")
            .assignedUser(currentUser)
            .createdBy(adminUser)
            .build();

        CommentRequest request = new CommentRequest();
        request.setContent("Test Comment");

        TaskComment savedComment = TaskComment.builder()
            .id(1L)
            .task(task)
            .user(currentUser)
            .content(request.getContent())
            .createdAt(LocalDateTime.now())
            .build();

        when(taskRepository.findById(1L)).thenReturn(java.util.Optional.of(task));
        when(userService.getCurrentUser()).thenReturn(currentUser);
        when(commentRepository.save(any(TaskComment.class))).thenReturn(savedComment);

        // When
        CommentResponse response = taskCommentService.addComment(1L, request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getContent()).isEqualTo("Test Comment");
        assertThat(response.getUserName()).isEqualTo("Test User");
        verify(commentRepository).save(any(TaskComment.class));
    }

    @Test
    void getTaskComments_ShouldReturnComments() {
        // Given
        User user = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .build();

        Task task = Task.builder()
            .id(1L)
            .title("Test Task")
            .build();

        TaskComment comment = TaskComment.builder()
            .id(1L)
            .task(task)
            .user(user)
            .content("Test Comment")
            .createdAt(LocalDateTime.now())
            .build();

        when(commentRepository.findByTaskIdOrderByCreatedAtDesc(1L))
            .thenReturn(List.of(comment));

        // When
        List<CommentResponse> comments = taskCommentService.getTaskComments(1L);

        // Then
        assertThat(comments).isNotEmpty();
        assertThat(comments.get(0).getContent()).isEqualTo("Test Comment");
        assertThat(comments.get(0).getUserName()).isEqualTo("Test User");
    }

    @Test
    void deleteComment_ShouldDeleteOwnComment() {
        // Given
        User currentUser = User.builder()
            .id(1L)
            .name("Test User")
            .build();

        TaskComment comment = TaskComment.builder()
            .id(1L)
            .user(currentUser)
            .content("Test Comment")
            .build();

        when(commentRepository.findById(1L)).thenReturn(java.util.Optional.of(comment));
        when(userService.getCurrentUser()).thenReturn(currentUser);

        // When
        taskCommentService.deleteComment(1L, 1L);

        // Then
        verify(commentRepository).delete(comment);
    }

    @Test
    void updateComment_ShouldUpdateOwnComment() {
        // Given
        User currentUser = User.builder()
            .id(1L)
            .name("Test User")
            .build();

        TaskComment comment = TaskComment.builder()
            .id(1L)
            .user(currentUser)
            .content("Old Comment")
            .build();

        CommentRequest request = new CommentRequest();
        request.setContent("Updated Comment");

        when(commentRepository.findById(1L)).thenReturn(java.util.Optional.of(comment));
        when(userService.getCurrentUser()).thenReturn(currentUser);
        when(commentRepository.save(any(TaskComment.class))).thenReturn(comment);

        // When
        CommentResponse response = taskCommentService.updateComment(1L, 1L, request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getContent()).isEqualTo("Updated Comment");
        verify(commentRepository).save(any(TaskComment.class));
    }
} 