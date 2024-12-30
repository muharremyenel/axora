package com.axora.backend.dto.category;

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
public class CategoryRequest {
    
    @NotBlank(message = "Kategori adı boş bırakılamaz")
    @Size(min = 2, max = 50, message = "Kategori adı 2-50 karakter arasında olmalıdır")
    private String name;
    
    private String colorCode;
    
    @Size(max = 500, message = "Açıklama en fazla 500 karakter olabilir")
    private String description;
} 