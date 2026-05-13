package com.herobank.system.modules.accounts.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record CreateAccountRequest(
        @NotNull AccountTypeInput type,
        @PositiveOrZero double initialDeposit,
        @NotBlank String currency
) {
}
