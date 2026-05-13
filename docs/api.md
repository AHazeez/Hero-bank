# Hero Bank System API Documentation

## Base URL
```
Development: http://localhost:8080/api/v1
Production: https://api.herobank.com/v1
```

## Authentication
All API endpoints (except authentication endpoints) require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "error": null
}
```

## Error Format
```json
{
  "success": false,
  "data": null,
  "message": null,
  "error": "Error description"
}
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "fullName": "Arjun Kumar",
  "email": "arjun.k@email.com",
  "password": "Hero@1234"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "fullName": "Arjun Kumar",
      "email": "arjun.k@email.com"
    }
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "arjun.k@email.com",
  "password": "Hero@1234"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "fullName": "Arjun Kumar",
      "email": "arjun.k@email.com"
    }
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "fullName": "Arjun Kumar",
    "email": "arjun.k@email.com",
    "phone": "+91 98765 43210",
    "panNumber": "ABCDE1234F"
  }
}
```

### Accounts

#### Get All Accounts
```http
GET /accounts
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "acc-001",
      "accountNumber": "ACC001234567",
      "type": "SAVINGS",
      "balance": 350000.00,
      "currency": "INR",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "acc-002",
      "accountNumber": "ACC001234568",
      "type": "CURRENT",
      "balance": 132350.00,
      "currency": "INR",
      "createdAt": "2024-02-20T14:15:00Z"
    }
  ]
}
```

#### Get Account Details
```http
GET /accounts/{accountId}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "acc-001",
    "accountNumber": "ACC001234567",
    "type": "SAVINGS",
    "balance": 350000.00,
    "currency": "INR",
    "createdAt": "2024-01-15T10:30:00Z",
    "userId": "user-123"
  }
}
```

#### Create Account
```http
POST /accounts
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "SAVINGS",
  "initialDeposit": 1000,
  "currency": "INR"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "acc-003",
    "accountNumber": "ACC001234569",
    "type": "SAVINGS",
    "balance": 1000.00,
    "currency": "INR",
    "createdAt": "2024-03-10T09:00:00Z",
    "userId": "user-123"
  }
}
```

#### Transfer Funds
```http
POST /accounts/transfer
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fromAccountId": "acc-001",
  "toAccount": "ACC001234568",
  "amount": 5000,
  "mode": "IMPS",
  "remarks": "Monthly payment"
}
```

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Transfer completed successfully"
}
```

### Transactions

#### Get All Transactions
```http
GET /transactions
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Page number (default: 0)
- `size`: Page size (default: 20)
- `type`: Transaction type (CREDIT/DEBIT, optional)
- `category`: Transaction category (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "txn-001",
        "accountId": "acc-001",
        "amount": 5000.00,
        "type": "DEBIT",
        "description": "Transfer to ACC001234568",
        "category": "TRANSFER",
        "date": "2024-03-15T10:30:00Z",
        "status": "COMPLETED",
        "balance": 345000.00
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1
  }
}
```

#### Get Account Transactions
```http
GET /accounts/{accountId}/transactions
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Page number (default: 0)
- `size`: Page size (default: 20)
- `type`: Transaction type (CREDIT/DEBIT, optional)

### Health Check

#### System Health
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "data": "System is healthy",
  "timestamp": "2024-03-15T10:30:00Z"
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

## Rate Limiting
- **Authentication endpoints**: 5 requests per minute
- **Account operations**: 100 requests per minute
- **Transaction operations**: 200 requests per minute

## Security Notes
- All passwords are hashed using BCrypt
- JWT tokens expire after 24 hours
- HTTPS is required in production
- Input validation is performed on all endpoints
- SQL injection protection is implemented
