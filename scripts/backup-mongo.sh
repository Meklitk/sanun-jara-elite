#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/backups"
STAMP="$(date +%Y%m%d-%H%M%S)"
ARCHIVE="$ROOT/backups/sanunjara-$STAMP.gz"
echo "Backing up sanun_jara_elite to $ARCHIVE ..."
docker compose -f "$ROOT/docker-compose.yml" exec -T mongo \
  mongodump --db sanun_jara_elite --archive --gzip > "$ARCHIVE"
echo "Done: $ARCHIVE"
