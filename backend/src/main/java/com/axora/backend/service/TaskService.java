package com.axora.backend.service;

import com.axora.backend.dto.task.TaskRequest;
import com.axora.backend.dto.task.TaskResponse;
import com.axora.backend.dto.task.TaskStatusUpdateRequest;
import com.axora.backend.dto.user.UserSummary;
import com.axora.backend.entity.*;
import com.axora.backend.repository.CategoryRepository;
import com.axora.backend.repository.TaskRepository;
import com.axora.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Kategori bulunamadı"));
        }

        User assignedUser = null;
        if (request.getAssignedUserId() != null) {
            assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new EntityNotFoundException("Kullanıcı bulunamadı"));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .category(category)
                .assignedUser(assignedUser)
                .createdBy(currentUser)
                .dueDate(request.getDueDate())
                .build();

        task = taskRepository.save(task);
        return mapToResponse(task);
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasks(Pageable pageable) {
        return taskRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> getMyTasks(Pageable pageable) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return taskRepository.findByAssignedUser(currentUser, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        return taskRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new EntityNotFoundException("Görev bulunamadı"));
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long id, TaskStatusUpdateRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Görev bulunamadı"));

        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        if (!currentUser.equals(task.getAssignedUser()) && !currentUser.equals(task.getCreatedBy())) {
            throw new RuntimeException("Bu görevi güncelleme yetkiniz yok");
        }

        task.setStatus(request.getStatus());
        task = taskRepository.save(task);
        return mapToResponse(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new EntityNotFoundException("Görev bulunamadı");
        }
        taskRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksWithFilters(
            TaskStatus status,
            TaskPriority priority,
            Long categoryId,
            Long assignedUserId,
            LocalDateTime dueDateStart,
            LocalDateTime dueDateEnd,
            Pageable pageable) {
        return taskRepository.findByFilters(
                status, priority, categoryId, assignedUserId, 
                dueDateStart, dueDateEnd, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> getMyTasksWithFilters(
            TaskStatus status,
            TaskPriority priority,
            Long categoryId,
            LocalDateTime dueDateStart,
            LocalDateTime dueDateEnd,
            Pageable pageable) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return taskRepository.findByFilters(
                status, priority, categoryId, currentUser.getId(), 
                dueDateStart, dueDateEnd, pageable)
                .map(this::mapToResponse);
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .category(task.getCategory() != null ? categoryService.getCategoryById(task.getCategory().getId()) : null)
                .assignedUser(task.getAssignedUser() != null ? mapToUserSummary(task.getAssignedUser()) : null)
                .createdBy(mapToUserSummary(task.getCreatedBy()))
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    private UserSummary mapToUserSummary(User user) {
        return UserSummary.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profilePicture(user.getProfilePicture())
                .build();
    }
} 