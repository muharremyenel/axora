package com.axora.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axora.backend.dto.auth.AuthRequest;
import com.axora.backend.dto.auth.AuthResponse;
import com.axora.backend.dto.auth.ForgotPasswordRequest;
import com.axora.backend.dto.auth.RegisterRequest;
import com.axora.backend.dto.auth.ResetPasswordRequest;
import com.axora.backend.dto.common.MessageResponse;
import com.axora.backend.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        // Hata yönetimi burada olabilir
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        authService.sendPasswordResetEmail(request.getEmail());
        return ResponseEntity.ok(new MessageResponse("Şifre sıfırlama linki mail adresinize gönderildi"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getPassword());
        return ResponseEntity.ok(new MessageResponse("Şifreniz başarıyla değiştirildi"));
    }
} 