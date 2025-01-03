package com.axora.backend.repository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.axora.backend.entity.Role;
import com.axora.backend.entity.User;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldLoadContext() {
        assertThat(userRepository).isNotNull();
    }

    @Test
    void findByEmail_ShouldReturnUser() {
        // Given
        User user = User.builder()
            .name("Test User")
            .email("test@example.com")
            .password("password")
            .role(Role.ROLE_USER)
            .active(true)
            .build();
        userRepository.save(user);

        // When
        Optional<User> found = userRepository.findByEmail("test@example.com");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("test@example.com");
    }

    @Test
    void existsByEmail_ShouldReturnTrueForExistingEmail() {
        // Given
        User user = User.builder()
            .name("Test User")
            .email("test@example.com")
            .password("password")
            .role(Role.ROLE_USER)
            .active(true)
            .build();
        userRepository.save(user);

        // When
        boolean exists = userRepository.existsByEmail("test@example.com");

        // Then
        assertThat(exists).isTrue();
    }

    @Test
    void existsByEmail_ShouldReturnFalseForNonExistingEmail() {
        // When
        boolean exists = userRepository.existsByEmail("nonexistent@example.com");

        // Then
        assertThat(exists).isFalse();
    }
} 