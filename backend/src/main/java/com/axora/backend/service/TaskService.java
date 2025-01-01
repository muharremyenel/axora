package com.axora.backend.service;

import com.axora.backend.dto.task.TaskRequest;
import com.axora.backend.dto.task.TaskResponse;
import com.axora.backend.entity.Category;
import com.axora.backend.entity.Task;
import com.axora.backend.entity.TaskStatus;
import com.axora.backend.entity.User;
import com.axora.backend.repository.CategoryRepository;
import com.axora.backend.repository.TaskRepository;
import com.axora.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;

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

    public TaskResponse updateTaskStatus(Long id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Görev bulunamadı"));

        task.setStatus(status);
        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
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