package com.herobank.system.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(min = 3) String fullName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String password
) {
}
