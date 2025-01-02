package com.axora.backend.dto.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentRequest {
    @NotBlank(message = "Yorum boş olamaz")
    @Size(max = 1000, message = "Yorum 1000 karakterden uzun olamaz")
    private String content;
} 