#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ARCHIVE="${1:-}"
if [[ -z "$ARCHIVE" ]]; then
  echo "Usage: $0 backups/sanunjara-YYYYMMDD-HHMMSS.gz" >&2
  exit 1
fi
[[ "$ARCHIVE" != /* ]] && ARCHIVE="$ROOT/$ARCHIVE"
echo "Restoring $ARCHIVE ..."
docker compose -f "$ROOT/docker-compose.yml" exec -T mongo \
  mongorestore --archive --gzip --drop < "$ARCHIVE"
echo "Restore complete."
