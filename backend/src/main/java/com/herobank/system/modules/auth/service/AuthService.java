package com.herobank.system.modules.auth.service;

import com.herobank.system.common.exception.AppException;
import com.herobank.system.modules.auth.dto.AuthResponse;
import com.herobank.system.modules.auth.dto.RegisterRequest;
import com.herobank.system.modules.auth.model.AuthToken;
import com.herobank.system.modules.auth.repository.AuthTokenRepository;
import com.herobank.system.modules.users.model.User;
import com.herobank.system.modules.users.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final AuthTokenRepository authTokenRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, AuthTokenRepository authTokenRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authTokenRepository = authTokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        userRepository.findByEmailIgnoreCase(request.email()).ifPresent(existing -> {
            throw new AppException("Email already registered", HttpStatus.CONFLICT);
        });

        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        User savedUser = userRepository.save(user);

        return createSession(savedUser);
    }

    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        return createSession(user);
    }

    public User requireUserFromAuthHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new AppException("Missing or invalid authorization token", HttpStatus.UNAUTHORIZED);
        }
        String token = authorizationHeader.substring(7);
        return authTokenRepository.findByToken(token)
                .map(AuthToken::getUser)
                .orElseThrow(() -> new AppException("Invalid session token", HttpStatus.UNAUTHORIZED));
    }

    private AuthResponse createSession(User user) {
        AuthToken authToken = new AuthToken();
        authToken.setToken(UUID.randomUUID().toString());
        authToken.setUser(user);
        authToken.setCreatedAt(Instant.now());
        AuthToken savedToken = authTokenRepository.save(authToken);

        return new AuthResponse(savedToken.getToken(), user.getId(), user.getFullName(), user.getEmail());
    }
}
