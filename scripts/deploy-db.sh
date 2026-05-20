#!/usr/bin/env bash
set -e

echo "=== Retro Collection Tracker — Deploy Script ==="
echo ""
echo "This script dumps your local database for restore to Neon."
echo ""

DB_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/retro_collection_tracker?schema=public}"

DUMP_FILE="/tmp/retro_collection_dump.dump"

echo "Dumping local database..."
export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH" 2>/dev/null || true
pg_dump "$DB_URL" --no-owner --no-privileges -F c -f "$DUMP_FILE"
echo "Dumped to: $DUMP_FILE ($(du -h "$DUMP_FILE" | cut -f1))"
echo ""
echo "To restore to Neon, run:"
echo "  pg_restore --no-owner --no-privileges -d \"YOUR_NEON_URL\" $DUMP_FILE"
echo ""
echo "Then update your .env with the Neon URL."
