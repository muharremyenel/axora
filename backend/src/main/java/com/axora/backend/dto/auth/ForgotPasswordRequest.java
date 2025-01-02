package com.axora.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequest {
    @NotBlank(message = "Email boş olamaz")
    @Email(message = "Geçerli bir email adresi giriniz")
    private String email;
}