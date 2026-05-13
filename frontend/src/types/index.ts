export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  panNumber?: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  type: AccountType;
  balance: number;
  currency: string;
  createdAt: string;
  userId: string;
}

export enum AccountType {
  SAVINGS = 'SAVINGS',
  CURRENT = 'CURRENT',
  FIXED_DEPOSIT = 'FIXED_DEPOSIT'
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  description: string;
  category: string;
  date: string;
  status: TransactionStatus;
  balance: number;
}

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface CreateAccountRequest {
  type: AccountType;
  initialDeposit: number;
  currency: string;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccount: string;
  amount: number;
  mode: string;
  remarks?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
