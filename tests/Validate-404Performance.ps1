$ErrorActionPreference = 'Stop'
$out = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\out'))
$file = Join-Path $out '404.html'
if (-not (Test-Path -LiteralPath $file -PathType Leaf)) { Write-Error 'Missing out/404.html' }
$html = Get-Content -LiteralPath $file -Raw
$failures = @()
if ($html -notmatch '<h1[^>]*>[\s\S]*outside the system') { $failures += 'Custom 404 H1 is missing.' }
if ($html -notmatch '<meta[^>]+name="robots"[^>]+content="noindex"') { $failures += 'Custom 404 must be noindex.' }
if ($html -match 'framerusercontent|spartanai\.framer|contra\.com') { $failures += 'Custom 404 references a copied remote resource.' }
if ((Get-Item -LiteralPath $file).Length -gt 200000) { $failures += 'Custom 404 HTML exceeds the 200 KB budget.' }
if ($failures.Count) { $failures | ForEach-Object { Write-Host "FAIL: $_" -ForegroundColor Red }; exit 1 }
Write-Host 'PASS: Spartan custom 404 validation' -ForegroundColor Green
