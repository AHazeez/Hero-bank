import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, User, Account, CreateAccountRequest, TransferRequest } from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data!;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data.data!;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  }

  async getAccounts(): Promise<Account[]> {
    const response = await this.client.get<ApiResponse<Account[]>>('/accounts');
    return response.data.data!;
  }

  async getAccount(accountId: string): Promise<Account> {
    const response = await this.client.get<ApiResponse<Account>>(`/accounts/${accountId}`);
    return response.data.data!;
  }

  async createAccount(accountData: CreateAccountRequest): Promise<Account> {
    const response = await this.client.post<ApiResponse<Account>>('/accounts', accountData);
    return response.data.data!;
  }

  async transfer(transferData: TransferRequest): Promise<void> {
    await this.client.post('/accounts/transfer', transferData);
  }

  async getTransactions(accountId?: string): Promise<any[]> {
    const url = accountId ? `/accounts/${accountId}/transactions` : '/transactions';
    const response = await this.client.get<ApiResponse<any[]>>(url);
    return response.data.data!;
  }

  async getHealth(): Promise<string> {
    const response = await this.client.get<ApiResponse<string>>('/health');
    return response.data.data!;
  }
}

export const apiService = new ApiService();
export default apiService;
