package com.axora.backend.dto.user;

import com.axora.backend.entity.Role;

import jakarta.validation.constraints.Email;
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
public class UserRequest {
    @NotBlank(message = "İsim alanı boş bırakılamaz")
    @Size(min = 3, max = 50, message = "İsim 3-50 karakter arasında olmalıdır")
    private String name;

    @NotBlank(message = "E-posta alanı boş bırakılamaz")
    @Email(message = "Geçerli bir e-posta adresi giriniz")
    private String email;

    @NotBlank(message = "Şifre alanı boş bırakılamaz")
    @Size(min = 6, message = "Şifre en az 6 karakter olmalıdır")
    private String password;

    @Builder.Default
    private Role role = Role.ROLE_USER;

    @Builder.Default
    private boolean active = true;
} 