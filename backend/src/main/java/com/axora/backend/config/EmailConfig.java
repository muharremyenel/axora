package com.axora.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class EmailConfig {
    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("localhost");
        mailSender.setPort(1026);  // MailHog port
        mailSender.setUsername("test@axora.com");
        mailSender.setPassword("");
        
        var props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", "false");
        props.put("mail.smtp.starttls.enable", "false");
        
        return mailSender;
    }
}