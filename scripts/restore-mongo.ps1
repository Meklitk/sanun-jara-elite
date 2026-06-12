param(
  [Parameter(Mandatory = $true)]
  [string]$Archive
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$path = if ([System.IO.Path]::IsPathRooted($Archive)) { $Archive } else { Join-Path $root $Archive }

if (-not (Test-Path $path)) {
  Write-Error "Archive not found: $path"
}

Write-Host "Restoring $path into sanun_jara_elite (existing data will be replaced) ..."
Push-Location $root
Get-Content -Path $path -AsByteStream -Raw | docker compose exec -T mongo mongorestore --archive --gzip --drop
Pop-Location

if ($LASTEXITCODE -ne 0) {
  Write-Error "Restore failed."
}

Write-Host "Restore complete. Restart the API if needed."
