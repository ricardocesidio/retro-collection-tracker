#!/usr/bin/env bash
set -e

echo "=== Retro Collection Tracker — Deploy Script ==="
echo ""
echo "This script dumps your local database for restore to Neon."
echo ""

DB_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/retro_collection_tracker?schema=public}"

DUMP_FILE="/tmp/retro_collection_dump.dump"

echo "Dumping local database..."
# macOS Postgres.app path; adjust for your OS if needed
export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:/usr/local/opt/postgresql@16/bin:$PATH" 2>/dev/null || true
pg_dump "$DB_URL" --no-owner --no-privileges -F c -f "$DUMP_FILE" 2>/dev/null
if [ $? -ne 0 ]; then
  echo "pg_dump failed. Ensure PostgreSQL is running and pg_dump is in your PATH."
  exit 1
fi
echo "Dumped to: $DUMP_FILE ($(du -h "$DUMP_FILE" | cut -f1))"
echo ""
echo "To restore to Neon, run:"
echo "  pg_restore --no-owner --no-privileges -d \"YOUR_NEON_URL\" $DUMP_FILE"
echo ""
echo "Then update your backend .env and Render env vars with the Neon URL."
