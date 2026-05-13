package com.herobank.system.modules.accounts.service;

import com.herobank.system.common.exception.AppException;
import com.herobank.system.modules.accounts.dto.AccountResponse;
import com.herobank.system.modules.accounts.dto.CreateAccountRequest;
import com.herobank.system.modules.accounts.model.Account;
import com.herobank.system.modules.accounts.model.AccountType;
import com.herobank.system.modules.accounts.repository.AccountRepository;
import com.herobank.system.modules.users.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service
public class AccountService {
    private static final SecureRandom RANDOM = new SecureRandom();
    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public List<AccountResponse> getByUser(User user) {
        return accountRepository.findByUserId(user.getId()).stream().map(AccountResponse::from).toList();
    }

    public AccountResponse getOne(Long accountId) {
        return accountRepository.findById(accountId)
                .map(AccountResponse::from)
                .orElseThrow(() -> new AppException("Account not found", HttpStatus.NOT_FOUND));
    }

    public AccountResponse create(User user, CreateAccountRequest request) {
        Account account = new Account();
        account.initialize(
                user,
                AccountType.valueOf(request.type().name()),
                nextAccountNumber(),
                request.initialDeposit(),
                request.currency().trim().toUpperCase(),
                "ACTIVE"
        );
        return AccountResponse.from(accountRepository.save(account));
    }

    private String nextAccountNumber() {
        return "HB" + (1000000000L + Math.abs(RANDOM.nextLong() % 9000000000L));
    }
}
