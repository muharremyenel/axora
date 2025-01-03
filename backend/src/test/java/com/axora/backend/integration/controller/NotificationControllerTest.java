package com.axora.backend.integration.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.doNothing;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;

import com.axora.backend.dto.notification.NotificationResponse;
import com.axora.backend.entity.NotificationType;
import com.axora.backend.service.NotificationService;
import com.axora.backend.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.axora.backend.entity.Notification;
import com.axora.backend.entity.User;
import com.axora.backend.controller.NotificationController;
import com.axora.backend.security.JwtAuthenticationFilter;
import com.axora.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationProvider;
import com.axora.backend.entity.Task;

@WebMvcTest(NotificationController.class)
@AutoConfigureMockMvc(addFilters = false)
class NotificationControllerTest {

    @MockBean
    private NotificationService notificationService;

    @MockBean
    private UserService userService;

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
    void getNotifications_ShouldReturnListOfNotifications() throws Exception {
        // Given
        User currentUser = User.builder().id(1L).build();
        List<Notification> notifications = Arrays.asList(createNotification());
        List<NotificationResponse> responses = Arrays.asList(createNotificationResponse());

        when(userService.getCurrentUser()).thenReturn(currentUser);
        when(notificationService.getUserNotifications(1L)).thenReturn(notifications);
        when(notificationService.mapToResponseList(notifications)).thenReturn(responses);

        // When & Then
        mockMvc.perform(get("/api/notifications")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].title").value("Test Notification"))
            .andExpect(jsonPath("$[0].message").value("Test Message"));
    }

    @Test
    void getUnreadCount_ShouldReturnCount() throws Exception {
        // Given
        User currentUser = User.builder().id(1L).build();
        when(userService.getCurrentUser()).thenReturn(currentUser);
        when(notificationService.getUnreadCount(1L)).thenReturn(5L);

        // When & Then
        mockMvc.perform(get("/api/notifications/unread/count")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").value(5));
    }

    @Test
    void markAsRead_ShouldReturnOk() throws Exception {
        // Given
        doNothing().when(notificationService).markAsRead(1L);

        // When & Then
        mockMvc.perform(patch("/api/notifications/1/read")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    void markAllAsRead_ShouldReturnOk() throws Exception {
        // Given
        User currentUser = User.builder().id(1L).build();
        when(userService.getCurrentUser()).thenReturn(currentUser);
        doNothing().when(notificationService).markAllAsRead(1L);

        // When & Then
        mockMvc.perform(patch("/api/notifications/read-all")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    void getNotifications_ShouldReturnError_WhenUserNotFound() throws Exception {
        // Given
        when(userService.getCurrentUser())
            .thenThrow(new RuntimeException("Kullanıcı bulunamadı"));

        // When & Then
        mockMvc.perform(get("/api/notifications")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Kullanıcı bulunamadı"));
    }

    private Notification createNotification() {
        return Notification.builder()
            .id(1L)
            .title("Test Notification")
            .message("Test Message")
            .type(NotificationType.TASK_ASSIGNED)
            .task(Task.builder().id(1L).build())
            .read(false)
            .createdAt(LocalDateTime.now())
            .build();
    }

    private NotificationResponse createNotificationResponse() {
        return NotificationResponse.builder()
            .id(1L)
            .title("Test Notification")
            .message("Test Message")
            .type(NotificationType.TASK_ASSIGNED)
            .taskId(1L)
            .read(false)
            .createdAt(LocalDateTime.now())
            .build();
    }
}