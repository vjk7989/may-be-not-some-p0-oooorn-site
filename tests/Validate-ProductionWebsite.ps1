param(
    [ValidateSet('All', 'Content', 'Links', 'Seo')]
    [string]$Mode = 'All',
    [switch]$SelfTest,
    [string]$OutDir = (Join-Path $PSScriptRoot '..\out')
)

$ErrorActionPreference = 'Stop'
$resolvedOut = [System.IO.Path]::GetFullPath($OutDir)
$workspace = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
if (-not $resolvedOut.StartsWith($workspace)) { throw 'OutDir must remain inside the workspace.' }

$projectSlugs = @(
    'cigna-smart-health-systems', 'aetna-health-data-ecosystem',
    'anthem-neural-care-network', 'cvs-smart-supply-chain-hub',
    'united-ai-security-protocol'
)
$articleSlugs = @(
    'the-sovereign-cloud-why-on-premise-ai-is-the-future-of-data-privacy',
    'the-architecture-of-autonomy-scaling-ai-within-legacy-frameworks',
    'human-centric-automation-designing-ai-that-empowers-your-workforce'
)
$routes = @('', 'digital-brain', 'project', 'about', 'articles', 'contact',
    'policies/terms-conditions', 'policies/privacy-policy') +
    @($projectSlugs | ForEach-Object { "project/$_" }) +
    @($articleSlugs | ForEach-Object { "articles/$_" })
$failures = [System.Collections.Generic.List[string]]::new()

function Fail([string]$Message) { $script:failures.Add($Message) }
function Route-File([string]$Route) {
    if ($Route -eq '') { return Join-Path $resolvedOut 'index.html' }
    return Join-Path $resolvedOut (($Route -replace '/', [System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar + 'index.html')
}
function Visible-Text([string]$Html) {
    $text = [regex]::Replace($Html, '<script\b[^>]*>[\s\S]*?</script>', ' ', 'IgnoreCase')
    $text = [regex]::Replace($text, '<style\b[^>]*>[\s\S]*?</style>', ' ', 'IgnoreCase')
    $text = [regex]::Replace($text, '<[^>]+>', ' ')
    return [System.Net.WebUtility]::HtmlDecode(($text -replace '\s+', ' ')).Trim()
}

if (-not (Test-Path -LiteralPath $resolvedOut -PathType Container)) { Fail "Missing static export: $resolvedOut" }
$pages = @{}
foreach ($route in $routes) {
    $file = Route-File $route
    if (-not (Test-Path -LiteralPath $file -PathType Leaf)) { Fail "Missing route /$route/ at $file"; continue }
    $html = Get-Content -LiteralPath $file -Raw
    $pages[$route] = @{ Html = $html; Text = Visible-Text $html; File = $file }
}

if ($Mode -in @('All', 'Content')) {
    if ($routes.Count -ne 16) { Fail "Expected 16 public routes, found $($routes.Count)" }
    foreach ($slug in $projectSlugs) { if (-not $pages.ContainsKey("project/$slug")) { Fail "Missing project detail: $slug" } }
    foreach ($slug in $articleSlugs) { if (-not $pages.ContainsKey("articles/$slug")) { Fail "Missing article detail: $slug" } }
    $sourceAndOutput = @(
        Get-ChildItem -LiteralPath (Join-Path $workspace 'src') -Recurse -File -Include *.ts,*.tsx,*.css |
            Where-Object { $_.Name -notmatch '\.(?:test|spec)\.(?:ts|tsx)$' } |
            ForEach-Object { Get-Content -LiteralPath $_.FullName -Raw }
        Get-ChildItem -LiteralPath $resolvedOut -Recurse -File -Include *.html,*.css,*.js | ForEach-Object { Get-Content -LiteralPath $_.FullName -Raw }
    ) -join "`n"
    foreach ($pattern in @('framerusercontent\.com', 'spartanai\.framer\.website', 'contra\.com', 'Hyper-0x', 'Hyper Tern', 'Hyper-ABS')) {
        if ($sourceAndOutput -match $pattern) { Fail "Forbidden copied or legacy resource found: $pattern" }
    }
    foreach ($required in @('Scale your ideas', 'Digital Brain', 'Our Works', 'Custom engagement', 'No affiliation with the reference template creator')) {
        if (-not $pages[''].Text.Contains($required)) { Fail "Homepage missing required content: $required" }
    }
    $homepageRuntimePatterns = @(
        '<script\b(?=[^>]*\bsrc=["''][^"'']*/_next/static/chunks/[^"'']+["''])[^>]*>',
        '<link\b(?=[^>]*\brel=["'']modulepreload["''])(?=[^>]*\bhref=["''][^"'']*/_next/static/chunks/[^"'']+["''])[^>]*>',
        '<link\b(?=[^>]*\brel=["'']preload["''])(?=[^>]*\bas=["'']script["''])(?=[^>]*\bhref=["''][^"'']*/_next/static/chunks/[^"'']+["''])[^>]*>',
        'self\.__next_f'
    )
    if ($homepageRuntimePatterns | Where-Object { $pages[''].Html -match $_ }) {
        Fail 'Homepage contains unnecessary Next.js hydration runtime after static export'
    }
    if ($pages[''].Html -notmatch 'type=["'']application/ld\+json["'']' -or $pages[''].Html -notmatch 'type=["'']module["'']') {
        Fail 'Homepage static optimization removed JSON-LD or the scoped motion module'
    }
    foreach ($asset in @('spartan-signal-horizon', 'spartan-frontier', 'spartan-gateway', 'spartan-neural-core', 'spartan-evidence-grid')) {
        $matches = Get-ChildItem -LiteralPath (Join-Path $resolvedOut 'media') -File -Filter "$asset-*"
        if ($matches.Count -lt 4) { Fail "Responsive media set incomplete: $asset" }
    }
}

if ($Mode -in @('All', 'Links')) {
    foreach ($entry in $pages.GetEnumerator()) {
        foreach ($match in [regex]::Matches($entry.Value.Html, 'href=["'']([^"''#?]+)')) {
            $href = $match.Groups[1].Value
            if ($href -match '^(https?:|mailto:|tel:)' -or -not $href.StartsWith('/')) { continue }
            $clean = $href.Trim('/')
            if ($clean -match '^_next/' -or $clean -eq 'favicon.svg') { continue }
            if (-not ($routes -contains $clean)) { Fail "Broken internal link on /$($entry.Key)/: $href" }
        }
    }
    foreach ($legacy in @('products', 'services', 'blog')) {
        if (Test-Path -LiteralPath (Route-File $legacy)) { Fail "Legacy route must not be exported: /$legacy/" }
    }
}

if ($Mode -in @('All', 'Seo')) {
    foreach ($entry in $pages.GetEnumerator()) {
        $html = $entry.Value.Html
        if ($html -notmatch '<title>[^<]+</title>') { Fail "Missing title on /$($entry.Key)/" }
        if ($html -notmatch '<meta[^>]+name="description"[^>]+content="[^"]+"') { Fail "Missing description on /$($entry.Key)/" }
        if ($html -notmatch '<link[^>]+rel="canonical"[^>]+href="https://[^" ]+"') { Fail "Missing absolute canonical on /$($entry.Key)/" }
        if ([regex]::Matches($html, '<main\b', 'IgnoreCase').Count -ne 1) { Fail "Expected one main on /$($entry.Key)/" }
        if ([regex]::Matches($html, '<h1\b', 'IgnoreCase').Count -ne 1) { Fail "Expected one H1 on /$($entry.Key)/" }
    }
    foreach ($file in @('404.html', 'sitemap.xml', 'robots.txt', 'favicon.svg')) {
        if (-not (Test-Path -LiteralPath (Join-Path $resolvedOut $file) -PathType Leaf)) { Fail "Missing exported $file" }
    }
    if (Test-Path -LiteralPath (Join-Path $resolvedOut '404.html')) {
        $notFound = Get-Content -LiteralPath (Join-Path $resolvedOut '404.html') -Raw
        if ($notFound -notmatch 'outside the system' -or $notFound -notmatch 'noindex') { Fail 'Custom 404 content or noindex is missing.' }
    }
}

if ($SelfTest -and $pages.Count -ne 16) { Fail "Validator self-test expected 16 loaded pages, found $($pages.Count)" }
if ($failures.Count) {
    $failures | ForEach-Object { Write-Host "FAIL: $_" -ForegroundColor Red }
    Write-Host "FAIL: Spartan production validation ($($failures.Count) assertion(s))" -ForegroundColor Red
    exit 1
}
Write-Host "PASS: Spartan production validation ($Mode; $($pages.Count) routes)" -ForegroundColor Green
