package com.axora.backend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.axora.backend.dto.common.MessageResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({IllegalArgumentException.class, RuntimeException.class})
    public ResponseEntity<MessageResponse> handleException(Exception ex) {
        return ResponseEntity.badRequest()
            .body(new MessageResponse(ex.getMessage()));
    }
} 