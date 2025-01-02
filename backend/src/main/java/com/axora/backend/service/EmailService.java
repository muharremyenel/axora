package com.axora.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.axora.backend.config.RabbitMQConfig;
import com.axora.backend.event.PasswordResetEvent;
import com.axora.backend.exception.EmailException;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_PASSWORD_RESET)
    public void handlePasswordResetEvent(PasswordResetEvent event) {
        try {
            log.info("Şifre sıfırlama maili gönderiliyor: {}", event.getEmail());
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(event.getEmail());
            message.setSubject("Şifre Sıfırlama");
            message.setText("Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:\n\n" + 
                event.getResetLink());
            
            mailSender.send(message);
            
            log.info("Şifre sıfırlama maili gönderildi: {}", event.getEmail());
        } catch (MailException e) {
            log.error("Mail gönderimi başarısız: {}", e.getMessage());
            throw new EmailException("Mail gönderilemedi", e);
        }
    }
}