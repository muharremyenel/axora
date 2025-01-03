package com.axora.backend.unit.service;

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
import org.springframework.security.crypto.password.PasswordEncoder;

import com.axora.backend.dto.user.ChangePasswordRequest;
import com.axora.backend.dto.user.UserRequest;
import com.axora.backend.dto.user.UserResponse;
import com.axora.backend.entity.Role;
import com.axora.backend.entity.User;
import com.axora.backend.repository.UserRepository;
import com.axora.backend.service.UserService;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void createUser_ShouldCreateAndReturnUser() {
        // Given
        UserRequest request = new UserRequest();
        request.setName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setRole(Role.ROLE_USER);

        User savedUser = User.builder()
            .id(1L)
            .name(request.getName())
            .email(request.getEmail())
            .password("encodedPassword")
            .role(request.getRole())
            .active(true)
            .build();

        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        UserResponse response = userService.createUser(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Test User");
        assertThat(response.getEmail()).isEqualTo("test@example.com");
        assertThat(response.getRole()).isEqualTo(Role.ROLE_USER);
        assertThat(response.isActive()).isTrue();
        verify(userRepository).save(any(User.class));
    }

    @Test
    void getAllUsers_ShouldReturnAllUsers() {
        // Given
        User user = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .role(Role.ROLE_USER)
            .active(true)
            .build();

        when(userRepository.findAll()).thenReturn(List.of(user));

        // When
        List<UserResponse> users = userService.getAllUsers();

        // Then
        assertThat(users).isNotEmpty();
        assertThat(users.get(0).getName()).isEqualTo("Test User");
    }

    @Test
    void getUserById_ShouldReturnUser() {
        // Given
        User user = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .role(Role.ROLE_USER)
            .active(true)
            .build();

        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));

        // When
        UserResponse response = userService.getUserById(1L);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getName()).isEqualTo("Test User");
    }

    @Test
    void getCurrentUser_ShouldReturnCurrentUser() {
        // Given
        User currentUser = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .role(Role.ROLE_USER)
            .active(true)
            .build();

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        
        when(authentication.getName()).thenReturn("test@example.com");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(userRepository.findByEmail("test@example.com")).thenReturn(java.util.Optional.of(currentUser));

        // When
        User result = userService.getCurrentUser();

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    void updateUser_ShouldUpdateAndReturnUser() {
        // Given
        User existingUser = User.builder()
            .id(1L)
            .name("Old Name")
            .email("old@example.com")
            .password("oldPassword")
            .role(Role.ROLE_USER)
            .active(true)
            .build();

        UserRequest request = new UserRequest();
        request.setName("Updated Name");
        request.setEmail("new@example.com");
        request.setPassword("newPassword");
        request.setRole(Role.ROLE_ADMIN);
        request.setActive(true);

        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(existingUser));
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        // When
        UserResponse response = userService.updateUser(1L, request);

        // Then
        assertThat(response).isNotNull();
        verify(userRepository).save(any(User.class));
    }

    @Test
    void deleteUser_ShouldDeactivateUser() {
        // Given
        User user = User.builder()
            .id(1L)
            .name("Test User")
            .active(true)
            .build();

        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // When
        userService.deleteUser(1L);

        // Then
        verify(userRepository).save(any(User.class));
    }

    @Test
    void getCurrentUserProfile_ShouldReturnUserProfile() {
        // Given
        User currentUser = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .role(Role.ROLE_USER)
            .active(true)
            .build();

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        
        when(authentication.getName()).thenReturn("test@example.com");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(userRepository.findByEmail("test@example.com")).thenReturn(java.util.Optional.of(currentUser));

        // When
        UserResponse response = userService.getCurrentUserProfile();

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    void updateCurrentUserProfile_ShouldUpdateProfile() {
        // Given
        User currentUser = User.builder()
            .id(1L)
            .name("Old Name")
            .email("old@example.com")
            .role(Role.ROLE_USER)
            .active(true)
            .build();

        UserRequest request = new UserRequest();
        request.setName("Updated Name");
        request.setEmail("new@example.com");

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        
        when(authentication.getName()).thenReturn("old@example.com");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(userRepository.findByEmail("old@example.com")).thenReturn(java.util.Optional.of(currentUser));
        when(userRepository.findByEmail("new@example.com")).thenReturn(java.util.Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(currentUser);

        // When
        UserResponse response = userService.updateCurrentUserProfile(request);

        // Then
        assertThat(response).isNotNull();
        verify(userRepository).save(any(User.class));
    }

    @Test
    void changePassword_ShouldUpdatePassword() {
        // Given
        User currentUser = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .password("encodedOldPassword")
            .role(Role.ROLE_USER)
            .active(true)
            .build();

        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("oldPassword");
        request.setNewPassword("newPassword");

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        
        when(authentication.getName()).thenReturn("test@example.com");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(userRepository.findByEmail("test@example.com")).thenReturn(java.util.Optional.of(currentUser));
        when(passwordEncoder.matches("oldPassword", "encodedOldPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(currentUser);

        // When
        userService.changePassword(request);

        // Then
        verify(passwordEncoder).matches("oldPassword", "encodedOldPassword");
        verify(passwordEncoder).encode("newPassword");
        verify(userRepository).save(any(User.class));
    }
} 