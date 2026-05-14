package com.herobank.system.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.herobank.system.common.exception.AppException;
import com.herobank.system.modules.auth.controller.AuthController;
import com.herobank.system.modules.auth.dto.AuthResponse;
import com.herobank.system.modules.auth.dto.LoginRequest;
import com.herobank.system.modules.auth.dto.RegisterRequest;
import com.herobank.system.modules.auth.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FakeAuthService authService;

    @BeforeEach
    public void setup() {
        authService.reset();
    }

    @Test
    public void testRegisterUser() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "Test User",
                "test@example.com",
                "Test@1234"
        );
        authService.registerResponse = new AuthResponse("token-123", 1L, "Test User", "test@example.com");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("token-123"))
                .andExpect(jsonPath("$.data.fullName").value("Test User"))
                .andExpect(jsonPath("$.data.email").value("test@example.com"));

        assertEquals(registerRequest, authService.lastRegisterRequest);
    }

    @Test
    public void testRegisterUserWithDuplicateEmail() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "Test User",
                "test@example.com",
                "Test@1234"
        );
        authService.registerException = new AppException("Email already registered", HttpStatus.CONFLICT);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email already registered"));
    }

    @Test
    public void testLoginUser() throws Exception {
        LoginRequest loginRequest = new LoginRequest(
                "test@example.com",
                "Test@1234"
        );
        authService.loginResponse = new AuthResponse("token-123", 1L, "Test User", "test@example.com");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("token-123"))
                .andExpect(jsonPath("$.data.email").value("test@example.com"));

        assertEquals("test@example.com", authService.lastLoginEmail);
        assertEquals("Test@1234", authService.lastLoginPassword);
    }

    @Test
    public void testLoginWithInvalidCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest(
                "nonexistent@example.com",
                "wrongpassword"
        );
        authService.loginException = new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    public void testRegisterWithInvalidData() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "",
                "invalid-email",
                "123"
        );

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @TestConfiguration
    static class AuthControllerTestConfig {
        @Bean
        FakeAuthService authService() {
            return new FakeAuthService();
        }
    }

    static class FakeAuthService extends AuthService {
        private AuthResponse registerResponse;
        private AppException registerException;
        private RegisterRequest lastRegisterRequest;
        private AuthResponse loginResponse;
        private AppException loginException;
        private String lastLoginEmail;
        private String lastLoginPassword;

        FakeAuthService() {
            super(null, null, null);
        }

        void reset() {
            registerResponse = null;
            registerException = null;
            lastRegisterRequest = null;
            loginResponse = null;
            loginException = null;
            lastLoginEmail = null;
            lastLoginPassword = null;
        }

        @Override
        public AuthResponse register(RegisterRequest request) {
            lastRegisterRequest = request;
            if (registerException != null) {
                throw registerException;
            }
            return registerResponse;
        }

        @Override
        public AuthResponse login(String email, String password) {
            lastLoginEmail = email;
            lastLoginPassword = password;
            if (loginException != null) {
                throw loginException;
            }
            return loginResponse;
        }
    }
}
