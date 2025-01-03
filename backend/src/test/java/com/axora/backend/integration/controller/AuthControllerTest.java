package com.axora.backend.integration.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.time.LocalDateTime;
import com.axora.backend.controller.AuthController;
import com.axora.backend.dto.auth.AuthRequest;
import com.axora.backend.dto.auth.AuthResponse;
import com.axora.backend.dto.auth.RegisterRequest;
import com.axora.backend.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.axora.backend.dto.auth.ForgotPasswordRequest;
import com.axora.backend.dto.auth.ResetPasswordRequest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import com.axora.backend.security.JwtAuthenticationFilter;
import com.axora.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationProvider;
import com.axora.backend.repository.UserRepository;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @MockBean
    private AuthService authService;

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
    void register_ShouldReturnAuthResponse() throws Exception {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        AuthResponse response = AuthResponse.builder()
            .token("jwt.token.here")
            .user(AuthResponse.UserDTO.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .role("ROLE_USER")
                .active(true)
                .createdAt(LocalDateTime.now().toString())
                .updatedAt(LocalDateTime.now().toString())
                .build())
            .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("jwt.token.here"));
    }

    @Test
    void login_ShouldReturnAuthResponse() throws Exception {
        // Given
        AuthRequest request = new AuthRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        AuthResponse response = AuthResponse.builder()
            .token("jwt.token.here")
            .user(AuthResponse.UserDTO.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .role("ROLE_USER")
                .active(true)
                .createdAt(LocalDateTime.now().toString())
                .updatedAt(LocalDateTime.now().toString())
                .build())
            .build();

        when(authService.login(any(AuthRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("jwt.token.here"))
            .andExpect(jsonPath("$.user.email").value("test@example.com"));
    }

    @Test
    void forgotPassword_ShouldReturnSuccessMessage() throws Exception {
        // Given
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("test@example.com");

        doNothing().when(authService).sendPasswordResetEmail(any(String.class));

        // When & Then
        mockMvc.perform(post("/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Şifre sıfırlama linki mail adresinize gönderildi"));
    }

    @Test
    void resetPassword_ShouldReturnSuccessMessage() throws Exception {
        // Given
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("valid-token");
        request.setPassword("newPassword123");

        doNothing().when(authService).resetPassword(any(String.class), any(String.class));

        // When & Then
        mockMvc.perform(post("/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Şifreniz başarıyla değiştirildi"));
    }

    @Test
    void register_ShouldReturnError_WhenEmailExists() throws Exception {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("existing@example.com");
        request.setPassword("password123");

        when(authService.register(any(RegisterRequest.class)))
            .thenThrow(new IllegalArgumentException("Bu e-posta adresi zaten kullanılıyor"));

        // When & Then
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Bu e-posta adresi zaten kullanılıyor"));
    }

    @Test
    void login_ShouldReturnError_WhenInvalidCredentials() throws Exception {
        // Given
        AuthRequest request = new AuthRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrongpassword");

        when(authService.login(any(AuthRequest.class)))
            .thenThrow(new IllegalArgumentException("Geçersiz e-posta veya şifre"));

        // When & Then
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Geçersiz e-posta veya şifre"));
    }

    @Test
    void forgotPassword_ShouldReturnError_WhenUserNotFound() throws Exception {
        // Given
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("notfound@example.com");

        doThrow(new IllegalArgumentException("Kullanıcı bulunamadı"))
            .when(authService).sendPasswordResetEmail(any(String.class));

        // When & Then
        mockMvc.perform(post("/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Kullanıcı bulunamadı"));
    }

    @Test
    void resetPassword_ShouldReturnError_WhenTokenInvalid() throws Exception {
        // Given
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("invalid-token");
        request.setPassword("newPassword123");

        doThrow(new IllegalArgumentException("Geçersiz veya süresi dolmuş token"))
            .when(authService).resetPassword(any(String.class), any(String.class));

        // When & Then
        mockMvc.perform(post("/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Geçersiz veya süresi dolmuş token"));
    }

    @Test
    void forgotPassword_ShouldReturnError_WhenInvalidEmail() throws Exception {
        // Given
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("invalid-email"); // Geçersiz email formatı

        // When & Then
        mockMvc.perform(post("/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void resetPassword_ShouldReturnError_WhenInvalidRequest() throws Exception {
        // Given
        ResetPasswordRequest request = new ResetPasswordRequest();
        // Boş token ve password

        // When & Then
        mockMvc.perform(post("/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }
}