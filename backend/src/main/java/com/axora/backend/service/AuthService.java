package com.axora.backend.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.axora.backend.dto.auth.AuthRequest;
import com.axora.backend.dto.auth.AuthResponse;
import com.axora.backend.dto.auth.RegisterRequest;
import com.axora.backend.entity.PasswordResetToken;
import com.axora.backend.entity.Role;
import com.axora.backend.entity.User;
import com.axora.backend.repository.PasswordResetTokenRepository;
import com.axora.backend.repository.UserRepository;
import com.axora.backend.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Bu e-posta adresi zaten kullanılıyor");
        }

        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .active(true)
                .build();

        var savedUser = userRepository.save(user);
        var token = jwtService.generateToken(savedUser);
        return AuthResponse.fromUser(savedUser, token);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı"));
        
        if (!user.isActive()) {
            throw new IllegalArgumentException("Hesabınız aktif değil");
        }

        var token = jwtService.generateToken(user);
        return AuthResponse.fromUser(user, token);
    }

    public void sendPasswordResetEmail(String email) {
        User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

    // Eski token varsa sil
        tokenRepository.deleteByUser(user);

    // Yeni token oluştur
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
            .user(user)
            .token(token)
            .expiryDate(LocalDateTime.now().plusHours(24))
            .build();

        tokenRepository.save(resetToken);
        emailService.sendPasswordResetEmail(email, token);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
        .orElseThrow(() -> new RuntimeException("Geçersiz veya süresi dolmuş token"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Token süresi dolmuş");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }
} 