package com.axora.backend.dto.task;

import com.axora.backend.entity.TaskPriority;
import com.axora.backend.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private TaskPriority priority;
    private TaskStatus status;
    private String assignedUser;
    private Long assignedUserId;
    private String category;
    private Long categoryId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 