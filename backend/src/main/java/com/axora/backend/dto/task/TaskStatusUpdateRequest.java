package com.axora.backend.dto.task;

import com.axora.backend.entity.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatusUpdateRequest {
    
    @NotNull(message = "Görev durumu boş bırakılamaz")
    private TaskStatus status;
} 