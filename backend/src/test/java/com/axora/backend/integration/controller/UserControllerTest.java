package com.axora.backend.integration.controller;

import com.axora.backend.controller.UserController;

import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.axora.backend.dto.user.UserRequest;
import com.axora.backend.dto.user.UserResponse;
import com.axora.backend.entity.Role;
import com.axora.backend.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.axora.backend.dto.user.ChangePasswordRequest;
import com.axora.backend.security.JwtAuthenticationFilter;
import com.axora.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationProvider;
import com.axora.backend.repository.UserRepository;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @MockBean
    private UserService userService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthFilter;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private AuthenticationProvider authenticationProvider;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllUsers_ShouldReturnUserList() throws Exception {
        // Given
        List<UserResponse> users = Arrays.asList(
            createUserResponse(1L),
            createUserResponse(2L)
        );

        when(userService.getAllUsers()).thenReturn(users);

        // When & Then
        mockMvc.perform(get("/api/users")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void getUserById_ShouldReturnUser() throws Exception {
        // Given
        UserResponse user = createUserResponse(1L);
        when(userService.getUserById(1L)).thenReturn(user);

        // When & Then
        mockMvc.perform(get("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Test User"))
            .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void createUser_ShouldReturnCreatedUser() throws Exception {
        // Given
        UserRequest request = createUserRequest();
        UserResponse response = createUserResponse(1L);

        when(userService.createUser(any(UserRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Test User"));
    }

    @Test
    void updateUser_ShouldReturnUpdatedUser() throws Exception {
        // Given
        UserRequest request = createUserRequest();
        UserResponse response = createUserResponse(1L);

        when(userService.updateUser(eq(1L), any(UserRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Test User"));
    }

    @Test
    void deleteUser_ShouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(userService).deleteUser(1L);

        // When & Then
        mockMvc.perform(delete("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    void getProfile_ShouldReturnCurrentUserProfile() throws Exception {
        // Given
        UserResponse response = createUserResponse(1L);
        when(userService.getCurrentUserProfile()).thenReturn(response);

        // When & Then
        mockMvc.perform(get("/api/users/profile")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Test User"))
            .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void updateProfile_ShouldReturnUpdatedProfile() throws Exception {
        // Given
        UserRequest request = createUserRequest();
        UserResponse response = createUserResponse(1L);

        when(userService.updateCurrentUserProfile(any(UserRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(put("/api/users/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Test User"));
    }

    @Test
    void updateProfile_ShouldReturnError_WhenEmailExists() throws Exception {
        // Given
        UserRequest request = createUserRequest();
        when(userService.updateCurrentUserProfile(any(UserRequest.class)))
            .thenThrow(new RuntimeException("Bu e-posta adresi zaten kullanılıyor"));

        // When & Then
        mockMvc.perform(put("/api/users/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Bu e-posta adresi zaten kullanılıyor"));
    }

    @Test
    void changePassword_ShouldReturnSuccess() throws Exception {
        // Given
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("oldPassword");
        request.setNewPassword("newPassword123");

        doNothing().when(userService).changePassword(any(ChangePasswordRequest.class));

        // When & Then
        mockMvc.perform(put("/api/users/profile/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk());
    }

    @Test
    void changePassword_ShouldReturnError_WhenCurrentPasswordWrong() throws Exception {
        // Given
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("wrongPassword");
        request.setNewPassword("newPassword123");

        doThrow(new RuntimeException("Mevcut şifre yanlış"))
            .when(userService).changePassword(any(ChangePasswordRequest.class));

        // When & Then
        mockMvc.perform(put("/api/users/profile/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Mevcut şifre yanlış"));
    }

    private UserRequest createUserRequest() {
        return UserRequest.builder()
            .name("Test User")
            .email("test@example.com")
            .password("password123")
            .role(Role.ROLE_USER)
            .active(true)
            .build();
    }

    private UserResponse createUserResponse(Long id) {
        return UserResponse.builder()
            .id(id)
            .name("Test User")
            .email("test@example.com")
            .role(Role.ROLE_USER)
            .active(true)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
    }
}