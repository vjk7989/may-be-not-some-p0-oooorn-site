[CmdletBinding()]
param(
    [string]$OutRoot = (Join-Path $PSScriptRoot '..\out'),
    [string]$SourceRoot = (Join-Path $PSScriptRoot '..\src'),
    [string]$PublicRoot = (Join-Path $PSScriptRoot '..\public'),
    [string]$BasePath = ''
)

$ErrorActionPreference = 'Stop'
$failures = [System.Collections.Generic.List[string]]::new()

function Add-Failure([string]$Message) { $script:failures.Add($Message) }

function Assert-Contains([string]$Text, [string]$Value, [string]$Message) {
    if ($Text.IndexOf($Value, [StringComparison]::OrdinalIgnoreCase) -lt 0) {
        Add-Failure $Message
    }
}

function Assert-Matches([string]$Text, [string]$Pattern, [string]$Message) {
    if (-not [regex]::IsMatch($Text, $Pattern, 'IgnoreCase')) { Add-Failure $Message }
}

function Get-VisibleText([string]$Html) {
    $value = [regex]::Replace($Html, '<(?:script|style|template)\b[^>]*>[\s\S]*?</(?:script|style|template)>', ' ', 'IgnoreCase')
    $value = [regex]::Replace($value, '<[^>]+>', ' ')
    $value = [Net.WebUtility]::HtmlDecode($value)
    return [regex]::Replace($value, '\s+', ' ').Trim()
}

function Get-AllSourceText([string]$Root) {
    if (-not (Test-Path -LiteralPath $Root -PathType Container)) { return '' }
    return @(
        Get-ChildItem -LiteralPath $Root -Recurse -File |
            Where-Object { $_.Extension -in @('.ts', '.tsx', '.css') } |
            ForEach-Object { Get-Content -LiteralPath $_.FullName -Raw -Encoding utf8 }
    ) -join "`n"
}

function Get-SourceFiles([string]$Root) {
    if (-not (Test-Path -LiteralPath $Root -PathType Container)) { return @() }
    return @(Get-ChildItem -LiteralPath $Root -Recurse -File |
        Where-Object { $_.Extension -in @('.ts', '.tsx') })
}

$resolvedOut = [IO.Path]::GetFullPath($OutRoot)
$resolvedSource = [IO.Path]::GetFullPath($SourceRoot)
$resolvedPublic = [IO.Path]::GetFullPath($PublicRoot)
$notFoundPath = Join-Path $resolvedOut '404.html'

if (-not (Test-Path -LiteralPath $notFoundPath -PathType Leaf)) {
    Add-Failure "Missing static 404 export: $notFoundPath"
} else {
    $html = Get-Content -LiteralPath $notFoundPath -Raw -Encoding utf8
    $visible = Get-VisibleText $html
    foreach ($copy in @(
        'ERROR / 404',
        'This path left the boundary.',
        'The page may have moved, or the address may be wrong. Return home to continue exploring Buckleson.',
        'Return to homepage'
    )) {
        Assert-Contains $visible $copy "404 export is missing approved visible copy: $copy"
    }
    Assert-Matches $html '<title\b[^>]*>\s*Page not found(?:\s*(?:—|-|&mdash;)\s*Buckleson)?\s*</title>' '404 title must identify the missing page and Buckleson'
    Assert-Matches $html '<meta\b(?=[^>]*\bname=[\x22\x27]robots[\x22\x27])(?=[^>]*\bcontent=[\x22\x27][^\x22\x27]*noindex)' '404 export must include robots noindex'
    Assert-Matches $html '<main\b[^>]*class=[\x22\x27][^\x22\x27]*not-found-page' '404 export needs the isolated not-found main boundary'
    Assert-Matches $html '<svg\b[^>]*data-not-found-visual' '404 export needs the complete static SVG first frame'
    Assert-Matches $html 'data-request-token' '404 SVG needs marked request tokens'
    Assert-Matches $html 'data-checkpoint' '404 SVG needs marked protection/control/evidence checkpoints'
    Assert-Matches $html 'data-broken-route' '404 SVG needs the marked broken route'
    Assert-Matches $html 'data-resolve-route' '404 SVG needs the marked resolved route'

    $socialNav = [regex]::Matches($html, '<nav\b[^>]*aria-label=[\x22\x27]Social links[\x22\x27]', 'IgnoreCase').Count
    if ($socialNav -ne 0) { Add-Failure 'Empty social configuration must not render a social navigation landmark' }
    Assert-Matches $html '<a\b(?=[^>]*\bhref=[\x22\x27][^\x22\x27]*\/[^\x22\x27]*[\x22\x27])[^>]*>(?:(?!</a>)[\s\S])*?Return to homepage(?:(?!</a>)[\s\S])*?</a>' '404 recovery action must be an anchor'

    if ($BasePath) {
        $normalizedBasePath = '/' + $BasePath.Trim('/')
        $rootOnlyInternal = [regex]::Matches($html, '(?:href|src)=[\x22\x27](\/(?!\/)[^\x22\x27]*)[\x22\x27]', 'IgnoreCase') |
            ForEach-Object { $_.Groups[1].Value } |
            Where-Object {
                $_ -ne $normalizedBasePath -and
                -not $_.StartsWith("$normalizedBasePath/", [StringComparison]::OrdinalIgnoreCase)
            }
        if (@($rootOnlyInternal).Count -gt 0) {
            Add-Failure "404 export contains root-only internal URLs outside base path '$normalizedBasePath': $(@($rootOnlyInternal | Select-Object -Unique) -join ', ')"
        }
    }
}

$allSource = Get-AllSourceText $resolvedSource
$animeImportRecords = [System.Collections.Generic.List[object]]::new()
foreach ($sourceFile in (Get-SourceFiles $resolvedSource)) {
    $sourceText = Get-Content -LiteralPath $sourceFile.FullName -Raw -Encoding utf8
    $staticImports = @([regex]::Matches($sourceText, "(?:import|export)\s+[\s\S]*?\sfrom\s+['\x22]animejs(?:\/[^'\x22]+)?['\x22]", 'IgnoreCase'))
    $dynamicImports = @([regex]::Matches($sourceText, "\bimport\s*\(\s*['\x22]animejs(?:\/[^'\x22]+)?['\x22]\s*\)", 'IgnoreCase'))
    foreach ($match in $staticImports) {
        $animeImportRecords.Add([pscustomobject]@{ Path = $sourceFile.FullName; Kind = 'static'; Value = $match.Value })
    }
    foreach ($match in $dynamicImports) {
        $animeImportRecords.Add([pscustomobject]@{ Path = $sourceFile.FullName; Kind = 'dynamic'; Value = $match.Value })
    }
}
$allowedAnimeImports = @{
    'not-found-motion' = @('animejs')
    'hero-execution-sphere' = @('animejs/animation', 'animejs/scope', 'animejs/engine')
}
$animeImportsByComponent = $animeImportRecords | Group-Object {
    [IO.Path]::GetFileNameWithoutExtension([string]$_.Path)
}
foreach ($componentGroup in @($animeImportsByComponent)) {
    if (-not $allowedAnimeImports.ContainsKey($componentGroup.Name)) {
        Add-Failure "Anime.js import found outside an approved route-local motion component: $($componentGroup.Group[0].Path)"
        continue
    }
    $actualSpecifiers = @($componentGroup.Group | ForEach-Object {
        if ($_.Value -match "['\x22](animejs(?:/[^'\x22]+)?)['\x22]") { $Matches[1] }
    } | Sort-Object -Unique)
    $expectedSpecifiers = @($allowedAnimeImports[$componentGroup.Name] | Sort-Object)
    if (($actualSpecifiers -join '|') -ne ($expectedSpecifiers -join '|')) {
        Add-Failure "Unexpected Anime.js imports in $($componentGroup.Name): $($actualSpecifiers -join ', ')"
    }
}
foreach ($expectedComponent in $allowedAnimeImports.Keys) {
    if (-not ($animeImportsByComponent.Name -contains $expectedComponent)) {
        Add-Failure "Missing approved route-local Anime.js imports in $expectedComponent"
    }
}
foreach ($staticImport in @($animeImportRecords | Where-Object { $_.Kind -eq 'static' })) {
    Add-Failure "Top-level Anime.js imports break route isolation: $($staticImport.Path)"
}
Assert-Matches $allSource 'pauseOnDocumentHidden\s*=\s*true|pauseOnDocumentHidden\s*:\s*true' '404 motion must explicitly pause when the document is hidden'
Assert-Matches $allSource '\b(?:scope|timeline)\.revert\s*\(' '404 motion must revert its Anime.js scope or timeline during cleanup'
if ($allSource -match 'Math\.random\s*\(|Date\.now\s*\(|new\s+Date\s*\(') {
    Add-Failure '404/performance implementation must not introduce random or clock-driven motion'
}

$sourceAssets = @(
    @{ Path = Join-Path $resolvedPublic 'brand\buckleson-logo.jpg'; Hash = '19C1C8EA72D395660AD59BFB05BBBD02F3473DE2C614D4740B3B2F67C1CD3481' },
    @{ Path = Join-Path $resolvedPublic 'brand\hyper-0x-logo.png'; Hash = 'D54E012E3A323D284E5CF0AB9A41522F89A92B3AA3DF4D10316E5A06B267B6F8' }
)
foreach ($asset in $sourceAssets) {
    if (-not (Test-Path -LiteralPath $asset.Path -PathType Leaf)) {
        Add-Failure "Missing preserved source asset: $($asset.Path)"
        continue
    }
    $actual = (Get-FileHash -LiteralPath $asset.Path -Algorithm SHA256).Hash
    if ($actual -ne $asset.Hash) { Add-Failure "Source asset hash changed: $($asset.Path)" }
}

if ($failures.Count -gt 0) {
    Write-Host "FAIL: animated 404/performance validation ($($failures.Count) assertion(s))" -ForegroundColor Red
    $failures | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
    exit 1
}

Write-Host 'PASS: animated 404/performance validation' -ForegroundColor Green
exit 0
