package com.axora.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.axora.backend.dto.task.TaskRequest;
import com.axora.backend.dto.task.TaskResponse;
import com.axora.backend.entity.Category;
import com.axora.backend.entity.NotificationType;
import com.axora.backend.entity.Task;
import com.axora.backend.entity.TaskStatus;
import com.axora.backend.entity.User;
import com.axora.backend.repository.CategoryRepository;
import com.axora.backend.repository.TaskRepository;
import com.axora.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public List<TaskResponse> getTasksByCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        return taskRepository.findByAssignedUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse createTask(TaskRequest request) {
        User currentUser = userService.getCurrentUser();
        User assignedUser = userRepository.findById(request.getAssignedUserId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Kategori bulunamadı"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .priority(request.getPriority())
                .status(TaskStatus.TODO)
                .assignedUser(assignedUser)
                .createdBy(currentUser)
                .category(category)
                .build();

        Task savedTask = taskRepository.save(task);

        notificationService.createNotification(
            assignedUser,
            savedTask,
            "Yeni Görev Atandı",
            String.format("%s size yeni bir görev atadı: %s", currentUser.getName(), task.getTitle()),
            NotificationType.TASK_ASSIGNED
        );

        log.info("Yeni görev oluşturuldu - ID: {}, Başlık: {}, Atanan: {}", 
            savedTask.getId(), savedTask.getTitle(), assignedUser.getEmail());

        return mapToResponse(savedTask);
    }

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Görev bulunamadı"));
        return mapToResponse(task);
    }

    public List<TaskResponse> getTasksByAssignedUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        return taskRepository.findByAssignedUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> getTasksByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Kategori bulunamadı"));
        return taskRepository.findByCategory(category).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Görev bulunamadı"));

        User assignedUser = userRepository.findById(request.getAssignedUserId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Kategori bulunamadı"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setPriority(request.getPriority());
        task.setAssignedUser(assignedUser);
        task.setCategory(category);

        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    public TaskResponse updateTaskStatus(Long id, TaskStatus newStatus) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Görev bulunamadı"));
        
        TaskStatus oldStatus = task.getStatus();
        task.setStatus(newStatus);
        task = taskRepository.save(task);

        // Admin'e bildirim gönder
        if (!userService.getCurrentUser().getId().equals(task.getCreatedBy().getId())) {
            notificationService.createNotification(
                task.getCreatedBy(),  // Admin'e bildirim
                task,
                "Görev Durumu Değişti",
                String.format("%s görevi %s durumuna güncellendi", task.getTitle(), newStatus),
                NotificationType.TASK_STATUS_CHANGED
            );
        }

        // Atanan kullanıcıya bildirim gönder
        if (!userService.getCurrentUser().getId().equals(task.getAssignedUser().getId())) {
            notificationService.createNotification(
                task.getAssignedUser(),  // Atanan kullanıcıya bildirim
                task,
                "Görev Durumu Değişti",
                String.format("%s görevi %s durumuna güncellendi", task.getTitle(), newStatus),
                NotificationType.TASK_STATUS_CHANGED
            );
        }

        log.info("Görev durumu güncellendi - ID: {}, Eski Durum: {}, Yeni Durum: {}", 
            id, oldStatus, newStatus);

        return mapToResponse(task);
    }

    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Görev bulunamadı");
        }
        taskRepository.deleteById(id);
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .priority(task.getPriority())
                .status(task.getStatus())
                .assignedUser(task.getAssignedUser() != null ? task.getAssignedUser().getName() : null)
                .assignedUserId(task.getAssignedUser() != null ? task.getAssignedUser().getId() : null)
                .category(task.getCategory() != null ? task.getCategory().getName() : null)
                .categoryId(task.getCategory() != null ? task.getCategory().getId() : null)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
} 