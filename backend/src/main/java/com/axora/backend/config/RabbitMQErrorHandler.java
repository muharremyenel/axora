package com.axora.backend.config;

import org.springframework.amqp.rabbit.listener.ConditionalRejectingErrorHandler;
import org.springframework.amqp.rabbit.support.ListenerExecutionFailedException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.ErrorHandler;
import org.springframework.lang.NonNull;

import com.axora.backend.exception.EmailException;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class RabbitMQErrorHandler {

    @Bean
    public ErrorHandler errorHandler() {
        return new ConditionalRejectingErrorHandler(new MyFatalExceptionStrategy());
    }

    private static class MyFatalExceptionStrategy extends ConditionalRejectingErrorHandler.DefaultExceptionStrategy {
        @Override
        public boolean isFatal(@NonNull Throwable t) {
            if (t instanceof ListenerExecutionFailedException && 
                t.getCause() instanceof EmailException) {
                log.error("Email gönderimi başarısız oldu, yeniden deneniyor...");
                return false;
            }
            return super.isFatal(t);
        }
    }
}