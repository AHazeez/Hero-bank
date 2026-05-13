package com.herobank.system.modules.auth.dto;

public record AuthResponse(String token, Long userId, String fullName, String email) {
}
