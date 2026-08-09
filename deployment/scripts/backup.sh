#!/bin/bash
# Smart Campus ERP - Database Backup Script
set -e

BACKUP_DIR="/backups"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="smart_campus_erp"
DB_USER="postgres"
DB_PASSWORD="${DB_PASSWORD:-postgres}"

mkdir -p "${BACKUP_DIR}/${TIMESTAMP}"

# Backup PostgreSQL
PGPASSWORD="${DB_PASSWORD}" pg_dump \
  -h postgres \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  -F c \
  -f "${BACKUP_DIR}/${TIMESTAMP}/database.dump"

# Backup Redis
redis-cli -h redis SAVE
cp /data/dump.rdb "${BACKUP_DIR}/${TIMESTAMP}/redis.rdb"

# Backup uploads
tar -czf "${BACKUP_DIR}/${TIMESTAMP}/uploads.tar.gz" /app/uploads 2>/dev/null || true

# Compress
cd "${BACKUP_DIR}"
tar -czf "backup_${TIMESTAMP}.tar.gz" "${TIMESTAMP}"
rm -rf "${TIMESTAMP}"

# Cleanup old backups
find "${BACKUP_DIR}" -name "backup_*.tar.gz" -mtime +${RETENTION_DAYS} -delete

echo "Backup completed: backup_${TIMESTAMP}.tar.gz"
