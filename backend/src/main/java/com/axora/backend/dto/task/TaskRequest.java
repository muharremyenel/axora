package com.axora.backend.dto.task;

import com.axora.backend.entity.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {
    
    @NotBlank(message = "Görev başlığı boş bırakılamaz")
    @Size(min = 3, max = 100, message = "Görev başlığı 3-100 karakter arasında olmalıdır")
    private String title;
    
    @Size(max = 2000, message = "Açıklama en fazla 2000 karakter olabilir")
    private String description;
    
    private TaskPriority priority;
    
    private Long categoryId;
    
    private Long assignedUserId;
    
    private java.time.LocalDateTime dueDate;
} 