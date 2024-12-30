package com.axora.backend.dto.team;

import com.axora.backend.dto.user.UserSummary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamResponse {
    private Long id;
    private String name;
    private String description;
    private Set<UserSummary> members;
    private boolean active;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
} 