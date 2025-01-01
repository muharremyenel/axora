package com.axora.backend.dto.team;

import com.axora.backend.dto.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamResponse {
    private Long id;
    private String name;
    private String description;
    private boolean active;
    private Set<UserResponse> members;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 