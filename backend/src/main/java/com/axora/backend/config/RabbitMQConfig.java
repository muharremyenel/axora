package com.axora.backend.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.support.converter.MessageConverter;

@Configuration
public class RabbitMQConfig {
    public static final String QUEUE_PASSWORD_RESET = "password-reset-queue";
    public static final String EXCHANGE_EMAILS = "email-exchange";
    public static final String ROUTING_KEY_PASSWORD_RESET = "password.reset";

    @Bean
    public Queue passwordResetQueue() {
        return QueueBuilder.durable(QUEUE_PASSWORD_RESET)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", "password-reset-dlq")
                .build();
    }

    @Bean
    public Queue deadLetterQueue() {
        return QueueBuilder.durable("password-reset-dlq").build();
    }

    @Bean
    public TopicExchange emailExchange() {
        return new TopicExchange(EXCHANGE_EMAILS);
    }

    @Bean
    public Binding passwordResetBinding() {
        return BindingBuilder
            .bind(passwordResetQueue())
            .to(emailExchange())
            .with(ROUTING_KEY_PASSWORD_RESET);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Primary
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}