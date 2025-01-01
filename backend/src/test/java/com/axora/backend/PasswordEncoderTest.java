package com.axora.backend;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordEncoderTest {
    
    @Test
    public void generatePassword() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("Encoded password: " + encoder.encode("admin123"));
    }
} 