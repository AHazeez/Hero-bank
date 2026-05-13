# Hero Bank System - Complete Banking Platform

A modern, production-ready banking system with React frontend and Spring Boot backend with Oracle database.

## 🏗️ Project Structure

```
Bank_System/
├── frontend/          # React TypeScript frontend
├── backend/           # Spring Boot Java backend
├── docker-compose.yml # Development environment setup
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Java 17+**
3. **Maven 3.6+**
4. **Docker & Docker Compose** (for Oracle DB)
5. **Git**

### Installation & Setup

#### 1. Clone and Setup Environment
```bash
git clone <repository-url>
cd Bank_System
```

#### 2. Start Oracle Database
```bash
cd backend
docker compose up -d
```
*Wait for Oracle DB to initialize (2-3 minutes)*

#### 3. Start Backend
```bash
cd backend
tools/apache-maven-3.9.9/bin/mvn.cmd clean spring-boot:run
```
Backend will be available at: http://localhost:8080

#### 4. Install Frontend Dependencies
```bash
cd frontend
npm install
```

#### 5. Start Frontend
```bash
cd frontend
npm start
```
Frontend will be available at: http://localhost:3000

## 📋 Features

### Frontend (React + TypeScript)
- ✅ Modern React 18 with TypeScript
- ✅ TailwindCSS for styling with custom banking theme
- ✅ React Router for navigation
- ✅ Axios for API communication
- ✅ Authentication flow (Login/Register)
- ✅ Responsive dashboard with real-time data
- ✅ Account management
- ✅ Transaction history
- ✅ Transfer functionality
- ✅ Card management
- ✅ Analytics and reporting
- ✅ Loan management
- ✅ Settings and profile management

### Backend (Spring Boot + Oracle)
- ✅ Spring Boot 3.3.5 with Java 17
- ✅ Oracle Database integration
- ✅ JWT-based authentication
- ✅ RESTful API design
- ✅ Account management
- ✅ Transaction processing
- ✅ User management
- ✅ Security best practices
- ✅ Error handling and validation
- ✅ Health checks

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test                # Run all tests
npm run test:coverage   # Run with coverage
npm run lint           # Run ESLint
npm run type-check     # TypeScript type checking
```

### Backend Tests
```bash
cd backend
tools/apache-maven-3.9.9/bin/mvn.cmd test
tools/apache-maven-3.9.9/bin/mvn.cmd test-coverage
```

## 🔧 Development

### Environment Variables

#### Frontend (.env)
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
REACT_APP_ENV=development
```

#### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:oracle:thin:@//localhost:1521/XEPDB1
    username: hero_bank
    password: hero_bank
```

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

#### Accounts
- `GET /api/v1/accounts` - List all accounts
- `POST /api/v1/accounts` - Create new account
- `GET /api/v1/accounts/{id}` - Get account details
- `POST /api/v1/accounts/transfer` - Transfer funds

#### Transactions
- `GET /api/v1/transactions` - List transactions
- `GET /api/v1/accounts/{id}/transactions` - Account transactions

## 🏦 Banking Features

### Account Types
- ✅ Savings Accounts
- ✅ Current Accounts
- ✅ Fixed Deposits

### Transaction Types
- ✅ NEFT transfers
- ✅ IMPS transfers
- ✅ RTGS transfers
- ✅ UPI payments

### Security Features
- ✅ Password hashing (BCrypt)
- ✅ JWT token authentication
- ✅ Session management
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection

## 📊 Analytics & Reports

### Dashboard Metrics
- Total balance across accounts
- Monthly income/spending analysis
- Savings rate calculation
- Transaction trends
- Category-wise spending

### Reports
- Transaction history
- Account statements
- Spending analytics
- Loan summaries

## 🎯 Production Deployment

### Docker Production Setup
```bash
# Build and deploy all services
docker compose -f docker-compose.prod.yml up -d
```

### Environment Configuration
- Production database configuration
- SSL/TLS setup
- Environment variables
- Logging configuration
- Monitoring setup

## 🛠️ Troubleshooting

### Common Issues

#### Oracle DB Connection Issues
```bash
# Check Oracle container status
docker ps | grep oracle

# View Oracle logs
docker logs hero-bank-oracle

# Restart Oracle if needed
docker compose restart oracle-db
```

#### Frontend Build Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Backend Compilation Issues
```bash
# Clean and rebuild
mvn clean compile
mvn clean package
```

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Security Guide](./docs/security.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Email: support@herobank.com
- Documentation: [Wiki](./docs)

---

**Note**: This is a demonstration project. For production use, ensure proper security audits, compliance checks, and regulatory requirements are met.
