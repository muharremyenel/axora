package com.axora.backend.unit.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import com.axora.backend.event.PasswordResetEvent;
import com.axora.backend.exception.EmailException;
import com.axora.backend.service.EmailService;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @Test
    void handlePasswordResetEvent_ShouldSendEmail() {
        // Given
        ReflectionTestUtils.setField(emailService, "fromEmail", "test@axora.com");
        PasswordResetEvent event = new PasswordResetEvent("Test User", "test@example.com", "http://reset-link");

        // When
        emailService.handlePasswordResetEvent(event);

        // Then
        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void handlePasswordResetEvent_WhenMailError_ShouldThrowEmailException() {
        // Given
        ReflectionTestUtils.setField(emailService, "fromEmail", "test@axora.com");
        PasswordResetEvent event = new PasswordResetEvent("Test User", "test@example.com", "http://reset-link");
        doThrow(new MailException("Mail error") {}).when(mailSender).send(any(SimpleMailMessage.class));

        // When & Then
        assertThrows(EmailException.class, () -> emailService.handlePasswordResetEvent(event));
    }
} 