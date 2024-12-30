package com.axora.backend.dto.task;

import com.axora.backend.dto.category.CategoryResponse;
import com.axora.backend.dto.user.UserSummary;
import com.axora.backend.entity.TaskPriority;
import com.axora.backend.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private CategoryResponse category;
    private UserSummary assignedUser;
    private UserSummary createdBy;
    private java.time.LocalDateTime dueDate;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
} 