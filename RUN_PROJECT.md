# 🚀 How to Run Hero Bank System - Complete Guide

## Prerequisites Checklist

Before you start, ensure you have these installed:

### Required Software:
- ✅ **Node.js** (v18 or higher)
- ✅ **Java 17+**
- ✅ **Maven 3.6+**
- ✅ **Docker & Docker Compose**
- ✅ **Git**

### Check Installation:
```bash
# Check Node.js
node --version

# Check Java
java -version

# Check Maven
mvn --version

# Check Docker
docker --version
docker-compose --version
```

---

## 📋 Step-by-Step Running Guide

### Step 1: Navigate to Project Directory
```bash
cd d:\Bank_System
```

### Step 2: Start Oracle Database
```bash
cd backend
docker compose up -d
```

**⏳ Wait for Oracle to initialize (2-3 minutes)**

Check if Oracle is ready:
```bash
docker compose ps
```

You should see `hero-bank-oracle` container running with `healthy` status.

### Step 3: Start Backend Application
```bash
# In the same backend directory
tools\apache-maven-3.9.9\bin\mvn.cmd clean spring-boot:run
```

**Wait for Spring Boot to start** - you'll see output like:
```
Started HeroBankSystemApplication in X.XXX seconds
```

**Test Backend:**
Open browser or use curl:
```bash
curl http://localhost:8080/api/v1/health
```

Should return: `{"success":true,"data":"System is healthy"}`

### Step 4: Install Frontend Dependencies
Open **NEW terminal window**:
```bash
cd d:\Bank_System\frontend
```

Install dependencies:
```bash
npm install
```

### Step 5: Start Frontend Application
```bash
npm start
```

**Frontend will automatically open at:** http://localhost:3000

---

## 🎯 Access Points

Once everything is running:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main banking application |
| **Backend API** | http://localhost:8080 | REST API endpoints |
| **Health Check** | http://localhost:8080/api/v1/health | Backend health status |
| **Oracle DB** | localhost:1521 | Database connection |

---

## 🔑 Default Login Credentials

### Option 1: Register New User
1. Go to http://localhost:3000
2. Click "Don't have an account? Sign up"
3. Enter:
   - **Full Name**: Arjun Kumar
   - **Email**: arjun.k@email.com
   - **Password**: Hero@1234

### Option 2: Use Existing Test Data
The system comes with sample data for testing.

---

## 🧪 Test the System

### Test Registration:
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

### Test Login:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

### Test Accounts:
```bash
# Get token from login response first
TOKEN="your-jwt-token-here"

curl -X GET http://localhost:8080/api/v1/accounts \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🛠️ Troubleshooting

### Common Issues & Solutions:

#### 1. Oracle Database Not Starting
```bash
# Check Docker status
docker ps

# View Oracle logs
docker logs hero-bank-oracle

# Restart Oracle
docker compose restart oracle-db
```

#### 2. Backend Fails to Connect to Database
```bash
# Wait longer for Oracle to fully initialize
# Oracle can take 2-3 minutes on first start

# Check if Oracle is responding
docker exec hero-bank-oracle bash -c 'echo "SELECT 1 FROM DUAL;" | sqlplus -s hero_bank/hero_bank@XEPDB1'
```

#### 3. Frontend Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Port Already in Use
```bash
# Check what's using port 8080
netstat -ano | findstr :8080

# Kill the process
taskkill /PID <PID_NUMBER> /F

# Or change backend port in application.yml
```

#### 5. Maven Build Issues
```bash
# Clean and rebuild
mvn clean
mvn compile
mvn spring-boot:run
```

---

## 🔄 Stop the System

### Stop All Services:
```bash
# Stop backend (Ctrl+C in terminal)
# Stop frontend (Ctrl+C in terminal)

# Stop Oracle database
cd backend
docker compose down
```

### Quick Stop Script:
```bash
# In project root directory
./stop.sh
```

---

## 📱 What You Can Do

Once running, you can:

1. **Register/Login** - Create account or sign in
2. **View Dashboard** - See balance, transactions, analytics
3. **Manage Accounts** - Create and view bank accounts
4. **Transfer Money** - Send funds between accounts
5. **View Transactions** - See transaction history
6. **Manage Cards** - View and control debit/credit cards
7. **Analytics** - View spending insights and reports
8. **Settings** - Update profile and preferences

---

## 🎯 Success Indicators

You know everything is working when:

- ✅ Oracle container is running and healthy
- ✅ Backend starts without errors on port 8080
- ✅ Frontend loads at http://localhost:3000
- ✅ Health check returns success
- ✅ You can register and login successfully
- ✅ Dashboard loads with sample data

---

## 🆘 Get Help

If you encounter issues:

1. **Check logs** - Look at terminal output for error messages
2. **Verify prerequisites** - Ensure all software is installed
3. **Check ports** - Make sure 8080, 3000, 1521 are available
4. **Restart services** - Try stopping and starting again
5. **Check documentation** - Refer to docs/ folder for detailed guides

---

## 🎉 Ready to Go!

Follow these steps and you'll have a fully functional banking system running locally. The system includes:

- Modern React frontend with banking UI
- Spring Boot backend with Oracle database
- Complete authentication system
- Account management features
- Transaction processing
- Real-time analytics
- Professional security features

**🚀 Start with Step 1 and work through each step systematically!**
