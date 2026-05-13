package com.herobank.system.service;

import com.herobank.system.modules.accounts.dto.CreateAccountRequest;
import com.herobank.system.modules.accounts.model.Account;
import com.herobank.system.modules.accounts.model.AccountType;
import com.herobank.system.modules.accounts.repository.AccountRepository;
import com.herobank.system.modules.accounts.service.AccountService;
import com.herobank.system.modules.users.model.User;
import com.herobank.system.modules.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AccountService accountService;

    private User testUser;
    private Account testAccount;

    @BeforeEach
    public void setUp() {
        testUser = new User();
        testUser.setId("user-123");
        testUser.setFullName("Test User");
        testUser.setEmail("test@example.com");

        testAccount = new Account();
        testAccount.setId("acc-123");
        testAccount.setAccountNumber("ACC001234567");
        testAccount.setType(AccountType.SAVINGS);
        testAccount.setBalance(new BigDecimal("1000.00"));
        testAccount.setCurrency("INR");
        testAccount.setUserId(testUser.getId());
    }

    @Test
    public void testCreateAccount() {
        CreateAccountRequest request = new CreateAccountRequest();
        request.setType(AccountType.SAVINGS);
        request.setInitialDeposit(new BigDecimal("1000.00"));
        request.setCurrency("INR");

        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(accountRepository.save(any(Account.class))).thenReturn(testAccount);

        Account result = accountService.createAccount(request, testUser.getId());

        assertNotNull(result);
        assertEquals(AccountType.SAVINGS, result.getType());
        assertEquals(new BigDecimal("1000.00"), result.getBalance());
        assertEquals("INR", result.getCurrency());
        assertEquals(testUser.getId(), result.getUserId());

        verify(userRepository).findById(testUser.getId());
        verify(accountRepository).save(any(Account.class));
    }

    @Test
    public void testCreateAccountForNonExistentUser() {
        CreateAccountRequest request = new CreateAccountRequest();
        request.setType(AccountType.SAVINGS);
        request.setInitialDeposit(new BigDecimal("1000.00"));
        request.setCurrency("INR");

        when(userRepository.findById("non-existent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            accountService.createAccount(request, "non-existent");
        });

        verify(userRepository).findById("non-existent");
        verify(accountRepository, never()).save(any(Account.class));
    }

    @Test
    public void testGetAccountsByUserId() {
        List<Account> accounts = Arrays.asList(testAccount);

        when(accountRepository.findByUserId(testUser.getId())).thenReturn(accounts);

        List<Account> result = accountService.getAccountsByUserId(testUser.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testAccount.getId(), result.get(0).getId());

        verify(accountRepository).findByUserId(testUser.getId());
    }

    @Test
    public void testGetAccountById() {
        when(accountRepository.findById(testAccount.getId())).thenReturn(Optional.of(testAccount));

        Optional<Account> result = accountService.getAccountById(testAccount.getId());

        assertTrue(result.isPresent());
        assertEquals(testAccount.getId(), result.get().getId());

        verify(accountRepository).findById(testAccount.getId());
    }

    @Test
    public void testGetAccountByIdNotFound() {
        when(accountRepository.findById("non-existent")).thenReturn(Optional.empty());

        Optional<Account> result = accountService.getAccountById("non-existent");

        assertFalse(result.isPresent());

        verify(accountRepository).findById("non-existent");
    }

    @Test
    public void testUpdateAccountBalance() {
        BigDecimal newBalance = new BigDecimal("1500.00");

        when(accountRepository.findById(testAccount.getId())).thenReturn(Optional.of(testAccount));
        when(accountRepository.save(any(Account.class))).thenReturn(testAccount);

        Account result = accountService.updateAccountBalance(testAccount.getId(), newBalance);

        assertNotNull(result);
        assertEquals(newBalance, result.getBalance());

        verify(accountRepository).findById(testAccount.getId());
        verify(accountRepository).save(testAccount);
    }

    @Test
    public void testUpdateAccountBalanceNotFound() {
        BigDecimal newBalance = new BigDecimal("1500.00");

        when(accountRepository.findById("non-existent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            accountService.updateAccountBalance("non-existent", newBalance);
        });

        verify(accountRepository).findById("non-existent");
        verify(accountRepository, never()).save(any(Account.class));
    }
}
