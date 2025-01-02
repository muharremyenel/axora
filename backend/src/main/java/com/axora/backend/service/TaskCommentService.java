package com.axora.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.axora.backend.dto.comment.CommentRequest;
import com.axora.backend.dto.comment.CommentResponse;
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
        return mapToResponse(savedComment);
    }

    public List<CommentResponse> getTaskComments(Long taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    private CommentResponse mapToResponse(TaskComment comment) {
        return CommentResponse.builder()
            .id(comment.getId())
            .content(comment.getContent())
            .userName(comment.getUser().getName())
            .createdAt(comment.getCreatedAt())
            .build();
    }
} 