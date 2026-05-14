package com.herobank.system.service;

import com.herobank.system.common.exception.AppException;
import com.herobank.system.modules.accounts.dto.AccountResponse;
import com.herobank.system.modules.accounts.dto.AccountTypeInput;
import com.herobank.system.modules.accounts.dto.CreateAccountRequest;
import com.herobank.system.modules.accounts.model.Account;
import com.herobank.system.modules.accounts.model.AccountType;
import com.herobank.system.modules.accounts.repository.AccountRepository;
import com.herobank.system.modules.accounts.service.AccountService;
import com.herobank.system.modules.users.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

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

    @InjectMocks
    private AccountService accountService;

    private User testUser;
    private Account testAccount;

    @BeforeEach
    public void setUp() {
        testUser = new User();
        ReflectionTestUtils.setField(testUser, "id", 1L);
        testUser.setFullName("Test User");
        testUser.setEmail("test@example.com");

        testAccount = new Account();
        ReflectionTestUtils.setField(testAccount, "id", 1L);
        testAccount.initialize(
                testUser,
                AccountType.SAVINGS,
                "ACC001234567",
                1000.00,
                "INR",
                "ACTIVE"
        );
    }

    @Test
    public void testCreate() {
        CreateAccountRequest request = new CreateAccountRequest(
                AccountTypeInput.SAVINGS,
                1000.00,
                "inr"
        );

        when(accountRepository.save(any(Account.class))).thenReturn(testAccount);

        AccountResponse result = accountService.create(testUser, request);

        assertNotNull(result);
        assertEquals("SAVINGS", result.type());
        assertEquals(1000.00, result.balance());
        assertEquals("INR", result.currency());

        ArgumentCaptor<Account> accountCaptor = ArgumentCaptor.forClass(Account.class);
        verify(accountRepository).save(accountCaptor.capture());
        Account savedAccount = accountCaptor.getValue();
        assertEquals(testUser, savedAccount.getUser());
        assertEquals(AccountType.SAVINGS, savedAccount.getType());
        assertEquals(1000.00, savedAccount.getBalance());
        assertEquals("INR", savedAccount.getCurrency());
        assertEquals("ACTIVE", savedAccount.getStatus());
        assertNotNull(savedAccount.getAccountNumber());
    }

    @Test
    public void testGetByUser() {
        List<Account> accounts = Arrays.asList(testAccount);

        when(accountRepository.findByUserId(testUser.getId())).thenReturn(accounts);

        List<AccountResponse> result = accountService.getByUser(testUser);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testAccount.getId(), result.get(0).id());

        verify(accountRepository).findByUserId(testUser.getId());
    }

    @Test
    public void testGetOne() {
        when(accountRepository.findById(testAccount.getId())).thenReturn(Optional.of(testAccount));

        AccountResponse result = accountService.getOne(testAccount.getId());

        assertNotNull(result);
        assertEquals(testAccount.getId(), result.id());
        assertEquals("SAVINGS", result.type());
        assertEquals(1000.00, result.balance());

        verify(accountRepository).findById(testAccount.getId());
    }

    @Test
    public void testGetOneNotFound() {
        when(accountRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(AppException.class, () -> accountService.getOne(999L));

        verify(accountRepository).findById(999L);
    }
}
