package com.herobank.system.modules.accounts.dto;

import com.herobank.system.modules.accounts.model.Account;

public record AccountResponse(
        Long id,
        String type,
        String accountNumber,
        double balance,
        String currency,
        String status
) {
    public static AccountResponse from(Account account) {
        return new AccountResponse(
                account.getId(),
                account.getType().name(),
                account.getAccountNumber(),
                account.getBalance(),
                account.getCurrency(),
                account.getStatus()
        );
    }
}
