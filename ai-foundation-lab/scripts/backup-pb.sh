#!/usr/bin/env bash
# scripts/backup-pb.sh
#
# Backs up the PocketBase SQLite database using sqlite3's .backup
# command, which is transaction-safe and can run while PocketBase
# is live (unlike a plain `cp`, which can corrupt the file mid-write).
#
# Usage (from repo root):
#   ./scripts/backup-pb.sh
#
# Env overrides:
#   PB_DATA_DIR   Path to pocketbase/pb_data        (default: ./pocketbase/pb_data)
#   BACKUP_DIR    Where backups are stored          (default: ./backups/pocketbase)
#   KEEP_DAYS     How long to keep backups (days)   (default: 30)
#
# Cron example (daily at 3am):
#   0 3 * * * cd /path/to/ai-foundation-lab && ./scripts/backup-pb.sh >> /var/log/pb-backup.log 2>&1

set -euo pipefail

PB_DATA_DIR="${PB_DATA_DIR:-./pocketbase/pb_data}"
BACKUP_DIR="${BACKUP_DIR:-./backups/pocketbase}"
KEEP_DAYS="${KEEP_DAYS:-30}"

if [[ ! -f "$PB_DATA_DIR/data.db" ]]; then
  echo "❌ data.db not found at $PB_DATA_DIR/data.db" >&2
  exit 1
fi

if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "❌ sqlite3 CLI not found. On macOS: brew install sqlite" >&2
  echo "   On Debian/Ubuntu: sudo apt install sqlite3" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"

TIMESTAMP="$(date +"%Y-%m-%d_%H-%M-%S")"
BACKUP_FILE="$BACKUP_DIR/data-$TIMESTAMP.db"

echo "[$(date +"%Y-%m-%d %H:%M:%S")] 📦 Backing up to $BACKUP_FILE"
sqlite3 "$PB_DATA_DIR/data.db" ".backup '$BACKUP_FILE'"

if [[ -s "$BACKUP_FILE" ]]; then
  SIZE="$(du -h "$BACKUP_FILE" | cut -f1)"
  echo "✅ Backup complete: $SIZE"
else
  echo "❌ Backup file is empty — treating as failure" >&2
  rm -f "$BACKUP_FILE"
  exit 1
fi

# Verify integrity
if ! sqlite3 "$BACKUP_FILE" "PRAGMA integrity_check;" | grep -q "^ok$"; then
  echo "❌ Backup failed integrity check" >&2
  exit 1
fi
echo "✅ Integrity check passed"

# Prune old backups
if command -v find >/dev/null 2>&1; then
  DELETED=$(find "$BACKUP_DIR" -maxdepth 1 -name "data-*.db" -mtime +"$KEEP_DAYS" -print -delete | wc -l | tr -d ' ')
  echo "🧹 Pruned $DELETED backup(s) older than $KEEP_DAYS days"
fi

echo "[$(date +"%Y-%m-%d %H:%M:%S")] ✅ Done"