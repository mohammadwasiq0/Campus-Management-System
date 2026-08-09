# Smart Campus ERP - Deployment Guide

## Architecture Overview

```
┌────────────────────────────────────────────────────┐
│                    Load Balancer                     │
│                   (Nginx / AWS ALB)                  │
├────────────────────────────────────────────────────┤
│                   Docker Host                         │
│  ┌──────────┐ ┌──────────┐ ┌────────────────────┐  │
│  │  Nginx   │ │  Backend │ │     Frontend       │  │
│  │  Proxy   │ │  (Nest)  │ │    (Next.js)       │  │
│  └──────────┘ └──────────┘ └────────────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌────────────────────┐  │
│  │PostgreSQL│ │  Redis   │ │   Elasticsearch    │  │
│  └──────────┘ └──────────┘ └────────────────────┘  │
└────────────────────────────────────────────────────┘
```

## Prerequisites

- Docker 24+
- Docker Compose 2.20+
- Node.js 20+ (for development)
- 4GB+ RAM (8GB+ recommended)
- 20GB+ free disk space
- Domain name with SSL certificate (production)

## Environment Setup

### 1. Clone & Configure

```bash
git clone https://github.com/yourusername/smart-campus-erp.git
cd smart-campus-erp
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file with your configuration:

```env
# Database
DATABASE_URL=postgresql://postgres:strong_password@postgres:5432/smart_campus_erp
DATABASE_PASSWORD=strong_password

# Redis
REDIS_PASSWORD=strong_redis_password

# JWT
JWT_SECRET=your-256-bit-secret-key-here
JWT_REFRESH_SECRET=your-256-bit-refresh-secret-key-here

# OpenAI (for AI features)
OPENAI_API_KEY=sk-your-openai-api-key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-smtp-password

# Domain
APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api/v1
```

### 3. SSL Certificates

```bash
# Using Let's Encrypt
docker run -it --rm -p 80:80 -p 443:443 \
  -v ./deployment/nginx/ssl:/etc/letsencrypt \
  certbot/certbot certonly --standalone \
  -d your-domain.com -d api.your-domain.com
```

## Docker Deployment

### Production Deployment

```bash
# Build and start all services
docker-compose up -d

# Run database migrations
docker exec campus-backend npx prisma migrate deploy

# Seed the database
docker exec campus-backend npx prisma db seed

# Verify deployment
curl https://your-domain.com/api/v1/health
```

### Monitor Services

```bash
# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check health
docker-compose ps

# Resource usage
docker stats
```

### Backup & Restore

```bash
# Manual backup
docker exec campus-postgres pg_dump -U postgres smart_campus_erp > backup_$(date +%Y%m%d).sql

# Restore from backup
cat backup.sql | docker exec -i campus-postgres psql -U postgres smart_campus_erp

# Automated backup (via backup service)
docker-compose logs -f backup
```

### Scaling

```bash
# Scale backend horizontally
docker-compose up -d --scale backend=3

# With Nginx load balancing (update nginx.conf)
upstream backend {
    server backend:4000;
    server backend:4001;
    server backend:4002;
}
```

## Cloud Deployment

### AWS Deployment

1. **ECS (Elastic Container Service)**
   - Push Docker images to ECR
   - Create ECS task definitions
   - Configure Application Load Balancer
   - Use RDS for PostgreSQL
   - Use ElastiCache for Redis
   - Use OpenSearch for Elasticsearch

2. **EC2 Deployment**
   ```bash
   # SSH to EC2 instance
   ssh -i your-key.pem ec2-user@your-instance
   
   # Install Docker
   sudo yum install docker
   sudo systemctl start docker
   
   # Clone and deploy
   git clone https://github.com/yourusername/smart-campus-erp.git
   cd smart-campus-erp
   docker-compose up -d
   ```

### Azure Deployment

1. **Azure Container Instances**
   - Create Container Registry
   - Deploy containers via ACI
   - Use Azure Database for PostgreSQL
   - Use Azure Cache for Redis
   - Use Azure Cognitive Search

2. **AKS (Azure Kubernetes Service)**
   ```bash
   # Create AKS cluster
   az aks create --resource-group campus-rg --name campus-cluster --node-count 3
   
   # Deploy using kubectl
   kubectl apply -f deployment/k8s/
   ```

### DigitalOcean Deployment

1. **App Platform**
   - Connect GitHub repository
   - Configure environment variables
   - Deploy with Managed Databases

2. **Droplet Deployment**
   ```bash
   # Create droplet with Docker
   docker-machine create --driver digitalocean \
     --digitalocean-size s-4vcpu-8gb \
     campus-droplet
   
   eval $(docker-machine env campus-droplet)
   docker-compose up -d
   ```

## CI/CD Pipeline

The project includes GitHub Actions CI/CD pipeline (`.github/workflows/ci-cd.yml`):

1. **Lint & TypeCheck** - ESLint + TypeScript checking
2. **Test** - Unit + E2E tests with PostgreSQL
3. **Build** - Docker image builds with caching
4. **Deploy** - Automatic deployment to staging/production
5. **Health Check** - Post-deployment verification

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `STAGING_HOST` | Staging server hostname |
| `STAGING_USERNAME` | SSH username |
| `STAGING_SSH_KEY` | SSH private key |
| `PROD_HOST` | Production server hostname |
| `PROD_USERNAME` | SSH username |
| `PROD_SSH_KEY` | SSH private key |
| `SLACK_WEBHOOK_URL` | Slack notification webhook |

## Monitoring & Logging

### Logging Stack

```yaml
# docker-compose.monitoring.yml
services:
  loki:
    image: grafana/loki:latest
    ports: ["3100:3100"]
  
  promtail:
    image: grafana/promtail:latest
    volumes:
      - /var/log:/var/log
      - ./deployment/monitoring/promtail-config.yml:/etc/promtail/config.yml
  
  grafana:
    image: grafana/grafana:latest
    ports: ["3001:3000"]
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### Health Check Endpoints

```
GET /api/v1/health          - API status
GET /api/v1/health/db       - Database status
GET /api/v1/health/redis    - Redis status
GET /api/v1/health/ai       - AI service status
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up WAF (Web Application Firewall)
- [ ] Regular security updates
- [ ] Database backup strategy
- [ ] Audit logging enabled
- [ ] API keys rotation policy
- [ ] 2FA for admin accounts

## Troubleshooting

### Common Issues

**Database Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
Solution: Ensure PostgreSQL is running and accessible.

**Redis Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
Solution: Start Redis service or check Redis configuration.

**JWT Token Expired**
```
401 Unauthorized - Token has expired
```
Solution: Refresh token via `/api/v1/auth/refresh`.

**File Upload Size Limit**
```
413 Payload Too Large
```
Solution: Increase `client_max_body_size` in Nginx config.

### Performance Optimization

1. **Database**
   - Enable connection pooling (PgBouncer)
   - Regular VACUUM and ANALYZE
   - Query optimization with EXPLAIN ANALYZE
   - Index monitoring and maintenance

2. **Cache**
   - Redis for session storage
   - Redis for API response caching
   - Implement CDN for static assets

3. **Application**
   - Enable compression (gzip)
   - Implement lazy loading
   - Code splitting for frontend
   - Database query optimization
   - Use connection pooling

## Rollback Procedure

```bash
# Docker rollback
docker-compose down
docker-compose -f docker-compose.previous.yml up -d

# Database rollback
docker exec campus-backend npx prisma migrate down

# Full rollback
git checkout <previous-tag>
docker-compose up -d --build
```

## Maintenance

### Regular Tasks

- **Daily**: Database backup verification
- **Weekly**: Log rotation and cleanup
- **Monthly**: SSL certificate renewal check
- **Quarterly**: Security audit and updates
- **Yearly**: Full system review and upgrade planning

### Update Procedure

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d

# Run new migrations
docker exec campus-backend npx prisma migrate deploy
```
