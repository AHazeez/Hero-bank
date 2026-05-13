# Hero Bank System - Deployment Guide

## Overview

This guide covers deploying the Hero Bank System to various environments including development, staging, and production.

## Prerequisites

- Docker and Docker Compose
- Kubernetes (for production deployment)
- SSL certificates (for production)
- Environment variables configuration
- Database backup strategy

## Environment Setup

### Development Environment

#### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd Bank_System

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Manual Setup
```bash
# Start Oracle Database
cd backend
docker-compose up -d oracle-db

# Start Backend
tools/apache-maven-3.9.9/bin/mvn.cmd spring-boot:run

# Start Frontend (separate terminal)
cd frontend
npm install
npm start
```

### Staging Environment

#### Docker Compose
```bash
# Use staging configuration
docker-compose -f docker-compose.staging.yml up -d
```

#### Environment Variables
```env
# Backend
SPRING_PROFILES_ACTIVE=staging
ORACLE_DB_URL=jdbc:oracle:thin:@staging-db:1521/XEPDB1
ORACLE_DB_USER=hero_bank_staging
ORACLE_DB_PASSWORD=staging_password

# Frontend
REACT_APP_API_BASE_URL=https://staging-api.herobank.com/v1
REACT_APP_ENV=staging
```

### Production Environment

#### Kubernetes Deployment

**Namespace:**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: hero-bank-prod
```

**ConfigMap:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: hero-bank-config
  namespace: hero-bank-prod
data:
  SPRING_PROFILES_ACTIVE: "production"
  REACT_APP_API_BASE_URL: "https://api.herobank.com/v1"
  REACT_APP_ENV: "production"
```

**Secret:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: hero-bank-secrets
  namespace: hero-bank-prod
type: Opaque
data:
  ORACLE_DB_USER: aGVyb19iYW5r  # base64 encoded
  ORACLE_DB_PASSWORD: cHJvZF9wYXNz  # base64 encoded
```

**Backend Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hero-bank-backend
  namespace: hero-bank-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hero-bank-backend
  template:
    metadata:
      labels:
        app: hero-bank-backend
    spec:
      containers:
      - name: backend
        image: herobank/backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          valueFrom:
            configMapKeyRef:
              name: hero-bank-config
              key: SPRING_PROFILES_ACTIVE
        - name: ORACLE_DB_USER
          valueFrom:
            secretKeyRef:
              name: hero-bank-secrets
              key: ORACLE_DB_USER
        - name: ORACLE_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: hero-bank-secrets
              key: ORACLE_DB_PASSWORD
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
```

**Frontend Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hero-bank-frontend
  namespace: hero-bank-prod
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hero-bank-frontend
  template:
    metadata:
      labels:
        app: hero-bank-frontend
    spec:
      containers:
      - name: frontend
        image: herobank/frontend:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
```

**Services:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: hero-bank-backend-service
  namespace: hero-bank-prod
spec:
  selector:
    app: hero-bank-backend
  ports:
  - protocol: TCP
    port: 8080
    targetPort: 8080
  type: ClusterIP

---
apiVersion: v1
kind: Service
metadata:
  name: hero-bank-frontend-service
  namespace: hero-bank-prod
spec:
  selector:
    app: hero-bank-frontend
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
  type: ClusterIP
```

**Ingress:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hero-bank-ingress
  namespace: hero-bank-prod
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - herobank.com
    - api.herobank.com
    secretName: hero-bank-tls
  rules:
  - host: herobank.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: hero-bank-frontend-service
            port:
              number: 3000
  - host: api.herobank.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: hero-bank-backend-service
            port:
              number: 8080
```

## Database Setup

### Oracle Database Production

**Docker Compose Production:**
```yaml
version: '3.8'
services:
  oracle-db:
    image: gvenzl/oracle-free:23-slim
    container_name: hero-bank-oracle-prod
    ports:
      - "1521:1521"
    environment:
      ORACLE_PASSWORD: ${ORACLE_DB_PASSWORD}
      APP_USER: ${ORACLE_DB_USER}
      APP_USER_PASSWORD: ${ORACLE_DB_PASSWORD}
    volumes:
      - oracle_data_prod:/opt/oracle/oradata
      - ./oracle/init:/docker-entrypoint-initdb.d
    restart: always
    networks:
      - bank-network

volumes:
  oracle_data_prod:

networks:
  bank-network:
    driver: bridge
```

**Database Initialization Scripts:**
```sql
-- /oracle/init/01-create-user.sql
CREATE USER hero_bank IDENTIFIED BY "secure_password";
GRANT CONNECT, RESOURCE, DBA TO hero_bank;
ALTER USER hero_bank QUOTA UNLIMITED ON USERS;

-- /oracle/init/02-create-tables.sql
-- Tables are created automatically by Hibernate DDL
```

## Security Configuration

### SSL/TLS Setup

**Generate SSL Certificates:**
```bash
# Generate private key
openssl genrsa -out private.key 2048

# Generate CSR
openssl req -new -key private.key -out certificate.csr

# Generate self-signed certificate (for testing)
openssl x509 -req -days 365 -in certificate.csr -signkey private.key -out certificate.crt

# For production, use Let's Encrypt or your CA
```

**Nginx SSL Configuration:**
```nginx
server {
    listen 443 ssl http2;
    server_name herobank.com;

    ssl_certificate /etc/ssl/certs/certificate.crt;
    ssl_certificate_key /etc/ssl/private/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Firewall Configuration

```bash
# UFW setup
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

## Monitoring and Logging

### Prometheus Monitoring

**Prometheus Configuration:**
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'hero-bank-backend'
    static_configs:
      - targets: ['backend:8080']
    metrics_path: '/actuator/prometheus'
    scrape_interval: 30s
```

**Grafana Dashboard:**
- Application metrics
- JVM metrics
- Database connection pool
- API response times
- Error rates

### Log Aggregation

**ELK Stack Setup:**
```yaml
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:8.5.0
    ports:
      - "5044:5044"
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline

  kibana:
    image: docker.elastic.co/kibana/kibana:8.5.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
```

## Backup and Recovery

### Database Backup

**Automated Backup Script:**
```bash
#!/bin/bash
# backup-oracle.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/oracle"
CONTAINER_NAME="hero-bank-oracle-prod"

# Create backup directory
mkdir -p $BACKUP_DIR

# Export database
docker exec $CONTAINER_NAME bash -c "
expdp hero_bank/\"secure_password\"@XEPDB1 \
full=yes \
directory=DATA_PUMP_DIR \
dumpfile=hero_bank_backup_$DATE.dmp \
logfile=hero_bank_backup_$DATE.log
"

# Copy backup file
docker cp $CONTAINER_NAME:/opt/oracle/admin/XEPDB1/dpdump/hero_bank_backup_$DATE.dmp $BACKUP_DIR/

# Compress backup
gzip $BACKUP_DIR/hero_bank_backup_$DATE.dmp

# Remove old backups (keep last 7 days)
find $BACKUP_DIR -name "*.dmp.gz" -mtime +7 -delete

echo "Backup completed: hero_bank_backup_$DATE.dmp.gz"
```

**Cron Job:**
```bash
# Add to crontab (daily at 2 AM)
0 2 * * * /path/to/backup-oracle.sh >> /var/log/oracle-backup.log 2>&1
```

### Application Backup

**Docker Volumes Backup:**
```bash
#!/bin/bash
# backup-app.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/application"

# Backup frontend build
docker run --rm -v hero-bank-frontend-build:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/frontend-build-$DATE.tar.gz -C /data .

# Backup application logs
docker run --rm -v hero-bank-logs:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/application-logs-$DATE.tar.gz -C /data .
```

## Performance Optimization

### Database Optimization

**Oracle Performance Tuning:**
```sql
-- Create indexes
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_date ON transactions(date);

-- Analyze tables
EXEC DBMS_STATS.GATHER_TABLE_STATS('HERO_BANK', 'ACCOUNTS');
EXEC DBMS_STATS.GATHER_TABLE_STATS('HERO_BANK', 'TRANSACTIONS');

-- Check performance
SELECT * FROM v$sql WHERE elapsed_time > 1000000 ORDER BY elapsed_time DESC;
```

### Application Optimization

**JVM Tuning:**
```bash
# Production JVM settings
JAVA_OPTS="-Xms512m -Xmx2g -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+PrintGC -XX:+PrintGCDetails"
```

**Connection Pool Optimization:**
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      max-lifetime: 1200000
      connection-timeout: 20000
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check Oracle container
   docker logs hero-bank-oracle-prod
   
   # Test connection
   docker exec hero-bank-oracle-prod sqlplus hero_bank/password@XEPDB1
   ```

2. **Application Not Starting**
   ```bash
   # Check application logs
   docker logs hero-bank-backend-prod
   
   # Check resource usage
   docker stats
   ```

3. **High Memory Usage**
   ```bash
   # Check JVM memory
   docker exec hero-bank-backend-prod jstat -gc <pid>
   
   # Check system memory
   free -h
   ```

### Health Checks

**Application Health:**
```bash
# Backend health
curl https://api.herobank.com/api/v1/health

# Frontend health
curl https://herobank.com
```

**Database Health:**
```bash
# Oracle health check
docker exec hero-bank-oracle-prod bash -c "
echo 'SELECT 1 FROM DUAL;' | sqlplus -s hero_bank/password@XEPDB1
"
```

## Rollback Strategy

### Application Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/hero-bank-backend -n hero-bank-prod
kubectl rollout undo deployment/hero-bank-frontend -n hero-bank-prod

# Check rollback status
kubectl rollout status deployment/hero-bank-backend -n hero-bank-prod
```

### Database Rollback

```bash
# Restore from backup
gunzip /backups/oracle/hero_bank_backup_YYYYMMDD_HHMMSS.dmp.gz

# Import database
docker exec hero-bank-oracle-prod bash -c "
impdp hero_bank/\"secure_password\"@XEPDB1 \
full=yes \
directory=DATA_PUMP_DIR \
dumpfile=hero_bank_backup_YYYYMMDD_HHMMSS.dmp
"
```

## Maintenance

### Regular Tasks

1. **Daily:**
   - Check application health
   - Review error logs
   - Monitor resource usage

2. **Weekly:**
   - Apply security patches
   - Review performance metrics
   - Clean up old logs

3. **Monthly:**
   - Update dependencies
   - Review backup integrity
   - Security audit

4. **Quarterly:**
   - Disaster recovery testing
   - Performance tuning
   - Capacity planning

### Update Process

```bash
# Update application
docker pull herobank/backend:latest
docker pull herobank/frontend:latest

# Deploy updates
kubectl set image deployment/hero-bank-backend backend=herobank/backend:latest -n hero-bank-prod
kubectl set image deployment/hero-bank-frontend frontend=herobank/frontend:latest -n hero-bank-prod

# Verify deployment
kubectl rollout status deployment/hero-bank-backend -n hero-bank-prod
kubectl rollout status deployment/hero-bank-frontend -n hero-bank-prod
```

This deployment guide provides comprehensive instructions for deploying the Hero Bank System across different environments with proper security, monitoring, and maintenance procedures.
