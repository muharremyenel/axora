package com.axora.backend.dto.auth;

import com.axora.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private UserDTO user;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserDTO {
        private Long id;
        private String name;
        private String email;
        private String role;
        private boolean active;
        private String createdAt;
        private String updatedAt;
    }

    public static AuthResponse fromUser(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .user(UserDTO.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .active(user.isActive())
                        .createdAt(user.getCreatedAt().toString())
                        .updatedAt(user.getUpdatedAt().toString())
                        .build())
                .build();
    }
} 