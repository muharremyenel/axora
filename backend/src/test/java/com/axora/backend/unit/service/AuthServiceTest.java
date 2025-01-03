package com.axora.backend.unit.service;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.axora.backend.dto.auth.AuthRequest;
import com.axora.backend.dto.auth.AuthResponse;
import com.axora.backend.dto.auth.RegisterRequest;
import com.axora.backend.entity.PasswordResetToken;
import com.axora.backend.entity.Role;
import com.axora.backend.entity.User;
import com.axora.backend.repository.PasswordResetTokenRepository;
import com.axora.backend.repository.UserRepository;
import com.axora.backend.security.JwtService;
import com.axora.backend.service.AuthService;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordResetTokenRepository tokenRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_ShouldRegisterNewUser() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        User savedUser = User.builder()
            .id(1L)
            .name(request.getName())
            .email(request.getEmail())
            .password("encodedPassword")
            .role(Role.ROLE_USER)
            .active(true)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(java.util.Optional.empty());
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(savedUser)).thenReturn("jwt.token.here");

        // When
        AuthResponse response = authService.register(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("jwt.token.here");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void login_ShouldAuthenticateUser() {
        // Given
        AuthRequest request = new AuthRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        User user = User.builder()
            .id(1L)
            .email("test@example.com")
            .role(Role.ROLE_USER)
            .active(true)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(java.util.Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("jwt.token.here");

        // When
        AuthResponse response = authService.login(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("jwt.token.here");
        verify(authenticationManager).authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
    }

    @Test
    void sendPasswordResetEmail_ShouldCreateTokenAndSendEmail() {
        // Given
        String email = "test@example.com";
        User user = User.builder()
            .id(1L)
            .email(email)
            .build();

        when(userRepository.findByEmail(email)).thenReturn(java.util.Optional.of(user));
        when(tokenRepository.save(any(PasswordResetToken.class))).thenReturn(new PasswordResetToken());

        // When
        authService.sendPasswordResetEmail(email);

        // Then
        verify(tokenRepository).deleteByUser(user);
        verify(tokenRepository).save(any(PasswordResetToken.class));
        verify(rabbitTemplate).convertAndSend(
            any(String.class),  // exchange
            any(String.class),  // routing key
            any(Object.class)   // message
        );
    }

    @Test
    void resetPassword_ShouldUpdatePassword() {
        // Given
        String token = UUID.randomUUID().toString();
        String newPassword = "newPassword123";

        User user = User.builder()
            .id(1L)
            .email("test@example.com")
            .build();

        PasswordResetToken resetToken = PasswordResetToken.builder()
            .token(token)
            .user(user)
            .expiryDate(LocalDateTime.now().plusHours(1))
            .build();

        when(tokenRepository.findByToken(token)).thenReturn(java.util.Optional.of(resetToken));
        when(passwordEncoder.encode(newPassword)).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // When
        authService.resetPassword(token, newPassword);

        // Then
        verify(userRepository).save(any(User.class));
        verify(tokenRepository).delete(resetToken);
    }

    @Test
    void resetPassword_ShouldThrowException_WhenTokenExpired() {
        // Given
        String token = UUID.randomUUID().toString();
        String newPassword = "newPassword123";

        PasswordResetToken resetToken = PasswordResetToken.builder()
            .token(token)
            .expiryDate(LocalDateTime.now().minusHours(1))
            .build();

        when(tokenRepository.findByToken(token)).thenReturn(java.util.Optional.of(resetToken));

        // When/Then
        assertThatThrownBy(() -> authService.resetPassword(token, newPassword))
            .isInstanceOf(RuntimeException.class)
            .hasMessage("Token süresi dolmuş");
    }

    @Test
    void login_WithInactiveUser_ShouldThrowException() {
        // Given
        AuthRequest request = new AuthRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        User testUser = User.builder()
            .id(1L)
            .email("test@example.com")
            .active(false)
            .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(java.util.Optional.of(testUser));

        // When & Then
        assertThatThrownBy(() -> authService.login(request))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Hesabınız aktif değil");
    }

    @Test
    void login_WithNonExistentUser_ShouldThrowException() {
        // Given
        AuthRequest request = new AuthRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(java.util.Optional.empty());

        // When & Then
        assertThatThrownBy(() -> authService.login(request))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Kullanıcı bulunamadı");
    }
} 
