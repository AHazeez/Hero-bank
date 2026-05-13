package com.herobank.system.modules.accounts.controller;

import com.herobank.system.common.api.ApiResponse;
import com.herobank.system.modules.accounts.dto.AccountResponse;
import com.herobank.system.modules.accounts.dto.CreateAccountRequest;
import com.herobank.system.modules.auth.service.AuthService;
import com.herobank.system.modules.accounts.service.AccountService;
import com.herobank.system.modules.users.model.User;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {
    private final AccountService accountService;
    private final AuthService authService;

    public AccountController(AccountService accountService, AuthService authService) {
        this.accountService = accountService;
        this.authService = authService;
    }

    @GetMapping
    public ApiResponse<List<AccountResponse>> listByUser(@RequestHeader("Authorization") String authorizationHeader) {
        User user = authService.requireUserFromAuthHeader(authorizationHeader);
        return ApiResponse.ok(accountService.getByUser(user));
    }

    @GetMapping("/{accountId}")
    public ApiResponse<AccountResponse> getOne(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long accountId
    ) {
        authService.requireUserFromAuthHeader(authorizationHeader);
        return ApiResponse.ok(accountService.getOne(accountId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AccountResponse> create(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody CreateAccountRequest request
    ) {
        User user = authService.requireUserFromAuthHeader(authorizationHeader);
        return ApiResponse.ok("Account created successfully", accountService.create(user, request));
    }
}
