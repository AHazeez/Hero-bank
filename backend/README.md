# Hero Bank System Backend (Java + Oracle)

Production-style Spring Boot backend with Oracle database persistence, login/register, and post-login account creation.

## Features

- Oracle-backed user and account persistence (JPA/Hibernate)
- User registration and login with hashed passwords
- Session token persistence in database
- Auth-protected account creation and account listing
- Basic web portal page at `/` for login and account creation flow

## Project Structure

```
src/main/java/com/herobank/system
  common/
    api/
    exception/
  config/
  modules/
    auth/
    accounts/
    users/
src/main/resources
  application.yml
  static/index.html
```

## Start Oracle Database (Docker)

From `backend/`:

```bash
docker compose up -d
```

Oracle connection used by default:
- URL: `jdbc:oracle:thin:@localhost:1521/XEPDB1`
- Username: `hero_bank`
- Password: `hero_bank`

## Run Backend

Use local Maven binary already downloaded in this project:

```bash
tools/apache-maven-3.9.9/bin/mvn.cmd clean spring-boot:run
```

Then open:
- App: `http://localhost:8080`
- Health: `http://localhost:8080/api/v1/health`

## API Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/accounts` (Authorization required)
- `GET /api/v1/accounts/{accountId}` (Authorization required)
- `POST /api/v1/accounts` (Authorization required)

## Sample Payloads

Register:

```json
{
  "fullName": "Arjun Kumar",
  "email": "arjun.k@email.com",
  "password": "Hero@1234"
}
```

Create account:

```json
{
  "type": "SAVINGS",
  "initialDeposit": 1000,
  "currency": "INR"
}
```
