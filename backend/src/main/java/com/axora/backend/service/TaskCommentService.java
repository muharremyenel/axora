package com.axora.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.axora.backend.dto.comment.CommentRequest;
import com.axora.backend.dto.comment.CommentResponse;
import com.axora.backend.entity.NotificationType;
import com.axora.backend.entity.Role;
import com.axora.backend.entity.Task;
import com.axora.backend.entity.TaskComment;
import com.axora.backend.entity.User;
import com.axora.backend.repository.TaskCommentRepository;
import com.axora.backend.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskCommentService {
    private final TaskCommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public CommentResponse addComment(Long taskId, CommentRequest request) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Görev bulunamadı"));

        User currentUser = userService.getCurrentUser();

        TaskComment comment = TaskComment.builder()
            .content(request.getContent())
            .task(task)
            .user(currentUser)
            .build();

        TaskComment savedComment = commentRepository.save(comment);

        if (!task.getAssignedUser().getId().equals(currentUser.getId())) {
            notificationService.createNotification(
                task.getAssignedUser(),
                task,
                "Yeni Yorum",
                String.format("%s görevinize yorum yaptı: %s", currentUser.getName(), comment.getContent()),
                NotificationType.TASK_COMMENTED
            );
        }

        if (task.getCreatedBy().getRole().equals(Role.ROLE_ADMIN) && 
            !task.getCreatedBy().getId().equals(currentUser.getId())) {
            notificationService.createNotification(
                task.getCreatedBy(),
                task,
                "Yeni Yorum",
                String.format("%s göreve yorum yaptı: %s", currentUser.getName(), comment.getContent()),
                NotificationType.TASK_COMMENTED
            );
        }

        return mapToResponse(savedComment);
    }

    public List<CommentResponse> getTaskComments(Long taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public void deleteComment(Long taskId, Long commentId) {
        TaskComment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Yorum bulunamadı"));
        
        User currentUser = userService.getCurrentUser();
        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Bu yorumu silme yetkiniz yok");
        }

        commentRepository.delete(comment);
    }

    public CommentResponse updateComment(Long taskId, Long commentId, CommentRequest request) {
        TaskComment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Yorum bulunamadı"));
        
        User currentUser = userService.getCurrentUser();
        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Bu yorumu düzenleme yetkiniz yok");
        }

        comment.setContent(request.getContent());
        TaskComment updatedComment = commentRepository.save(comment);
        return mapToResponse(updatedComment);
    }

    private CommentResponse mapToResponse(TaskComment comment) {
        return CommentResponse.builder()
            .id(comment.getId())
            .content(comment.getContent())
            .userName(comment.getUser().getName())
            .userId(comment.getUser().getId())
            .createdAt(comment.getCreatedAt())
            .build();
    }
} 