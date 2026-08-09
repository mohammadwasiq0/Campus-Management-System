#!/bin/bash
# Smart Campus ERP - Database Restore Script
set -e

BACKUP_FILE="${1}"
if [ -z "${BACKUP_FILE}" ]; then
  echo "Usage: $0 <backup-file.tar.gz>"
  exit 1
fi

BACKUP_DIR="/backups/restore"
mkdir -p "${BACKUP_DIR}"
tar -xzf "${BACKUP_FILE}" -C "${BACKUP_DIR}"

# Restore PostgreSQL
PGPASSWORD="${DB_PASSWORD:-postgres}" pg_restore \
  -h postgres \
  -U postgres \
  -d smart_campus_erp \
  --clean \
  --if-exists \
  "${BACKUP_DIR}/database.dump"

# Restore Redis
cp "${BACKUP_DIR}/redis.rdb" /data/dump.rdb
redis-cli -h redis FLUSHALL
redis-cli -h redis RESTORE

# Restore uploads
tar -xzf "${BACKUP_DIR}/uploads.tar.gz" -C /app/uploads 2>/dev/null || true

rm -rf "${BACKUP_DIR}"
echo "Restore completed from ${BACKUP_FILE}"
