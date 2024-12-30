package com.axora.backend.dto.team;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamRequest {
    
    @NotBlank(message = "Takım adı boş bırakılamaz")
    @Size(min = 2, max = 50, message = "Takım adı 2-50 karakter arasında olmalıdır")
    private String name;
    
    @Size(max = 500, message = "Açıklama en fazla 500 karakter olabilir")
    private String description;
    
    private Set<Long> memberIds;
} 