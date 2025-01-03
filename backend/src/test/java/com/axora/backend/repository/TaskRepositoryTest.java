package com.axora.backend.repository;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.axora.backend.entity.Category;
import com.axora.backend.entity.Role;
import com.axora.backend.entity.Task;
import com.axora.backend.entity.TaskPriority;
import com.axora.backend.entity.TaskStatus;
import com.axora.backend.entity.User;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void shouldLoadContext() {
        assertThat(taskRepository).isNotNull();
    }

    @Test
    void findByAssignedUser_ShouldReturnUserTasks() {
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

        // When
        List<Task> tasks = taskRepository.findByAssignedUser(user);

        // Then
        assertThat(tasks).isNotEmpty();
        assertThat(tasks.get(0).getAssignedUser().getId()).isEqualTo(user.getId());
    }

    @Test
    void findByCategory_ShouldReturnTasksInCategory() {
        // Given
        User user = User.builder()
            .name("Test User")
            .email("test@example.com")
            .password("password")
            .role(Role.ROLE_USER)
            .active(true)
            .build();
        userRepository.save(user);

        Category category = Category.builder()
            .name("Test Category")
            .description("Test Description")
            .colorCode("#000000")
            .active(true)
            .build();
        categoryRepository.save(category);

        Task task = Task.builder()
            .title("Test Task")
            .description("Test Description")
            .assignedUser(user)
            .createdBy(user)
            .category(category)
            .status(TaskStatus.TODO)
            .priority(TaskPriority.MEDIUM)
            .build();
        taskRepository.save(task);

        // When
        List<Task> tasks = taskRepository.findByCategory(category);

        // Then
        assertThat(tasks).isNotEmpty();
        assertThat(tasks.get(0).getCategory().getId()).isEqualTo(category.getId());
    }
} 