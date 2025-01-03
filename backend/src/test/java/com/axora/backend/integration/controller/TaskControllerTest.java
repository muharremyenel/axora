package com.axora.backend.integration.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.doNothing;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import com.axora.backend.dto.task.TaskRequest;
import com.axora.backend.dto.task.TaskStatusUpdateRequest;
import com.axora.backend.dto.task.TaskResponse;
import com.axora.backend.entity.TaskPriority;
import com.axora.backend.entity.TaskStatus;
import com.axora.backend.service.TaskService;
import com.axora.backend.controller.TaskController;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.axora.backend.security.JwtAuthenticationFilter;
import com.axora.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationProvider;

@WebMvcTest(TaskController.class)
@AutoConfigureMockMvc(addFilters = false)
class TaskControllerTest {

    @MockBean
    private TaskService taskService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthFilter;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private AuthenticationProvider authenticationProvider;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllTasks_ShouldReturnTaskList() throws Exception {
        // Given
        List<TaskResponse> tasks = Arrays.asList(
            createTaskResponse(1L),
            createTaskResponse(2L)
        );
        when(taskService.getAllTasks()).thenReturn(tasks);

        // When & Then
        mockMvc.perform(get("/tasks")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void getTaskById_ShouldReturnTask() throws Exception {
        // Given
        TaskResponse response = createTaskResponse(1L);
        when(taskService.getTaskById(1L)).thenReturn(response);

        // When & Then
        mockMvc.perform(get("/tasks/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.title").value("Test Task"));
    }

    @Test
    void createTask_ShouldReturnCreatedTask() throws Exception {
        // Given
        TaskRequest request = createTaskRequest();
        TaskResponse response = createTaskResponse(1L);
        when(taskService.createTask(any(TaskRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.title").value("Test Task"));
    }

    @Test
    void updateTaskStatus_ShouldReturnUpdatedTask() throws Exception {
        // Given
        TaskStatusUpdateRequest request = new TaskStatusUpdateRequest();
        request.setStatus(TaskStatus.IN_PROGRESS);
        TaskResponse response = createTaskResponse(1L);
        response.setStatus(TaskStatus.IN_PROGRESS);

        when(taskService.updateTaskStatus(eq(1L), any(TaskStatus.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(patch("/tasks/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }

    @Test
    void getTaskById_ShouldReturnError_WhenTaskNotFound() throws Exception {
        // Given
        when(taskService.getTaskById(99L))
            .thenThrow(new RuntimeException("Görev bulunamadı"));

        // When & Then
        mockMvc.perform(get("/tasks/99")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Görev bulunamadı"));
    }

    @Test
    void createTask_ShouldReturnError_WhenAssignedUserNotFound() throws Exception {
        // Given
        TaskRequest request = createTaskRequest();
        when(taskService.createTask(any(TaskRequest.class)))
            .thenThrow(new RuntimeException("Kullanıcı bulunamadı"));

        // When & Then
        mockMvc.perform(post("/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Kullanıcı bulunamadı"));
    }

    @Test
    void deleteTask_ShouldReturnOk() throws Exception {
        // Given
        doNothing().when(taskService).deleteTask(1L);

        // When & Then
        mockMvc.perform(delete("/tasks/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    private TaskRequest createTaskRequest() {
        return TaskRequest.builder()
            .title("Test Task")
            .description("Test Description")
            .priority(TaskPriority.MEDIUM)
            .categoryId(1L)
            .assignedUserId(1L)
            .dueDate(LocalDate.now().plusDays(7))
            .build();
    }

    private TaskResponse createTaskResponse(Long id) {
        return TaskResponse.builder()
            .id(id)
            .title("Test Task")
            .description("Test Description")
            .priority(TaskPriority.MEDIUM)
            .status(TaskStatus.TODO)
            .assignedUser("Test User")
            .assignedUserId(1L)
            .category("Test Category")
            .categoryId(1L)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
    }
}