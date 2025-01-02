package com.axora.backend.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetEvent implements Serializable {
    private static final long serialVersionUID = 1L;
    private String email;
    private String token;
    private String resetLink;
}