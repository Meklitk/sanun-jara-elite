# Backup local MongoDB (Docker) to backups/
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$backupDir = Join-Path $root "backups"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$archive = Join-Path $backupDir "sanunjara-$stamp.gz"

Write-Host "Backing up sanun_jara_elite to $archive ..."
Push-Location $root
docker compose exec -T mongo mongodump --db sanun_jara_elite --archive --gzip > $archive
Pop-Location

if ($LASTEXITCODE -ne 0) {
  Write-Error "Backup failed. Is Docker running? Try: docker compose up -d"
}

Write-Host "Done: $archive"
