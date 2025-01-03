package com.axora.backend.unit.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.axora.backend.dto.task.TaskRequest;
import com.axora.backend.dto.task.TaskResponse;
import com.axora.backend.entity.Category;
import com.axora.backend.entity.Task;
import com.axora.backend.entity.TaskStatus;
import com.axora.backend.entity.User;
import com.axora.backend.repository.CategoryRepository;
import com.axora.backend.repository.TaskRepository;
import com.axora.backend.repository.UserRepository;
import com.axora.backend.service.CategoryService;
import com.axora.backend.service.NotificationService;
import com.axora.backend.service.TaskService;
import com.axora.backend.service.UserService;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserService userService;

    @Mock
    private CategoryService categoryService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private TaskService taskService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Test
    void createTask_ShouldCreateAndReturnTask() {
        // Given
        User currentUser = User.builder()
            .id(1L)
            .name("Admin User")
            .build();

        User assignedUser = User.builder()
            .id(2L)
            .name("Assigned User")
            .build();

        Category category = Category.builder()
            .id(1L)
            .name("Test Category")
            .build();

        TaskRequest request = new TaskRequest();
        request.setTitle("Test Task");
        request.setDescription("Test Description");
        request.setDueDate(LocalDate.now().plusDays(1));
        request.setCategoryId(1L);
        request.setAssignedUserId(2L);

        Task savedTask = Task.builder()
            .id(1L)
            .title(request.getTitle())
            .description(request.getDescription())
            .dueDate(request.getDueDate())
            .category(category)
            .assignedUser(assignedUser)
            .createdBy(currentUser)
            .status(TaskStatus.TODO)
            .createdAt(LocalDateTime.now())
            .build();

        when(userService.getCurrentUser()).thenReturn(currentUser);
        when(userRepository.findById(2L)).thenReturn(java.util.Optional.of(assignedUser));
        when(categoryRepository.findById(1L)).thenReturn(java.util.Optional.of(category));
        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // When
        TaskResponse response = taskService.createTask(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("Test Task");
        assertThat(response.getStatus()).isEqualTo(TaskStatus.TODO);
        verify(notificationService).createNotification(any(), any(), any(), any(), any());
    }

    @Test
    void getAllTasks_ShouldReturnAllTasks() {
        // Given
        Task task = Task.builder()
            .id(1L)
            .title("Test Task")
            .status(TaskStatus.TODO)
            .build();

        when(taskRepository.findAll()).thenReturn(List.of(task));

        // When
        List<TaskResponse> tasks = taskService.getAllTasks();

        // Then
        assertThat(tasks).isNotEmpty();
        assertThat(tasks.get(0).getTitle()).isEqualTo("Test Task");
    }

    @Test
    void getTasksByCurrentUser_ShouldReturnUserTasks() {
        // Given
        User currentUser = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .build();

        Task task = Task.builder()
            .id(1L)
            .title("Test Task")
            .assignedUser(currentUser)
            .status(TaskStatus.TODO)
            .build();

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        
        when(authentication.getName()).thenReturn("test@example.com");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(userRepository.findByEmail("test@example.com")).thenReturn(java.util.Optional.of(currentUser));
        when(taskRepository.findByAssignedUser(currentUser)).thenReturn(List.of(task));

        // When
        List<TaskResponse> tasks = taskService.getTasksByCurrentUser();

        // Then
        assertThat(tasks).isNotEmpty();
        assertThat(tasks.get(0).getTitle()).isEqualTo("Test Task");
    }

    @Test
    void getTaskById_ShouldReturnTask() {
        // Given
        Task task = Task.builder()
            .id(1L)
            .title("Test Task")
            .status(TaskStatus.TODO)
            .build();

        when(taskRepository.findById(1L)).thenReturn(java.util.Optional.of(task));

        // When
        TaskResponse response = taskService.getTaskById(1L);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("Test Task");
    }

    @Test
    void getTasksByAssignedUser_ShouldReturnUserTasks() {
        // Given
        User user = User.builder()
            .id(1L)
            .name("Test User")
            .build();

        Task task = Task.builder()
            .id(1L)
            .title("Test Task")
            .assignedUser(user)
            .status(TaskStatus.TODO)
            .build();

        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));
        when(taskRepository.findByAssignedUser(user)).thenReturn(List.of(task));

        // When
        List<TaskResponse> tasks = taskService.getTasksByAssignedUser(1L);

        // Then
        assertThat(tasks).isNotEmpty();
        assertThat(tasks.get(0).getTitle()).isEqualTo("Test Task");
    }

    @Test
    void getTasksByCategory_ShouldReturnCategoryTasks() {
        // Given
        Category category = Category.builder()
            .id(1L)
            .name("Test Category")
            .build();

        Task task = Task.builder()
            .id(1L)
            .title("Test Task")
            .category(category)
            .status(TaskStatus.TODO)
            .build();

        when(categoryRepository.findById(1L)).thenReturn(java.util.Optional.of(category));
        when(taskRepository.findByCategory(category)).thenReturn(List.of(task));

        // When
        List<TaskResponse> tasks = taskService.getTasksByCategory(1L);

        // Then
        assertThat(tasks).isNotEmpty();
        assertThat(tasks.get(0).getTitle()).isEqualTo("Test Task");
    }

    @Test
    void updateTask_ShouldUpdateAndReturnTask() {
        // Given
        User assignedUser = User.builder()
            .id(2L)
            .name("New User")
            .build();

        Category category = Category.builder()
            .id(2L)
            .name("New Category")
            .build();

        Task existingTask = Task.builder()
            .id(1L)
            .title("Old Title")
            .build();

        TaskRequest request = new TaskRequest();
        request.setTitle("Updated Title");
        request.setAssignedUserId(2L);
        request.setCategoryId(2L);

        when(taskRepository.findById(1L)).thenReturn(java.util.Optional.of(existingTask));
        when(userRepository.findById(2L)).thenReturn(java.util.Optional.of(assignedUser));
        when(categoryRepository.findById(2L)).thenReturn(java.util.Optional.of(category));
        when(taskRepository.save(any(Task.class))).thenReturn(existingTask);

        // When
        TaskResponse response = taskService.updateTask(1L, request);

        // Then
        assertThat(response).isNotNull();
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void updateTaskStatus_ShouldUpdateStatusAndNotify() {
        // Given
        User currentUser = User.builder()
            .id(1L)
            .name("Current User")
            .build();

        User admin = User.builder()
            .id(2L)
            .name("Admin User")
            .build();

        Task task = Task.builder()
            .id(1L)
            .title("Test Task")
            .status(TaskStatus.TODO)
            .assignedUser(currentUser)
            .createdBy(admin)
            .build();

        when(taskRepository.findById(1L)).thenReturn(java.util.Optional.of(task));
        when(userService.getCurrentUser()).thenReturn(currentUser);
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        // When
        TaskResponse response = taskService.updateTaskStatus(1L, TaskStatus.IN_PROGRESS);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
        verify(notificationService).createNotification(any(), any(), any(), any(), any());
    }

    @Test
    void deleteTask_ShouldDeleteTask() {
        // Given
        when(taskRepository.existsById(1L)).thenReturn(true);

        // When
        taskService.deleteTask(1L);

        // Then
        verify(taskRepository).deleteById(1L);
    }
} 