package com.axora.backend.service;

import com.axora.backend.dto.auth.AuthRequest;
import com.axora.backend.dto.auth.AuthResponse;
import com.axora.backend.dto.auth.RegisterRequest;
import com.axora.backend.entity.Role;
import com.axora.backend.entity.User;
import com.axora.backend.repository.UserRepository;
import com.axora.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

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
} 