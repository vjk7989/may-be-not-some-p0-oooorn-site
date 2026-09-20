[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Owner,
    [Parameter(Mandatory = $true)][string]$Repository,
    [Parameter(Mandatory = $true)][string]$SiteUrl,
    [Parameter(Mandatory = $true)][AllowEmptyString()][string]$BasePath,
    [string]$OutRoot = (Join-Path $PSScriptRoot '..\out'),
    [string]$WorkflowPath = (Join-Path $PSScriptRoot '..\.github\workflows\deploy-pages.yml')
)

$ErrorActionPreference = 'Stop'
$failures = [System.Collections.Generic.List[string]]::new()
function Fail([string]$Message) { if (-not $script:failures.Contains($Message)) { $script:failures.Add($Message) } }

$projectSlugs = @('cigna-smart-health-systems', 'aetna-health-data-ecosystem', 'anthem-neural-care-network', 'cvs-smart-supply-chain-hub', 'united-ai-security-protocol')
$articleSlugs = @('the-sovereign-cloud-why-on-premise-ai-is-the-future-of-data-privacy', 'the-architecture-of-autonomy-scaling-ai-within-legacy-frameworks', 'human-centric-automation-designing-ai-that-empowers-your-workforce')
$routes = @('/', '/digital-brain/', '/project/', '/about/', '/articles/', '/contact/', '/policies/terms-conditions/', '/policies/privacy-policy/') +
    @($projectSlugs | ForEach-Object { "/project/$_/" }) + @($articleSlugs | ForEach-Object { "/articles/$_/" })

$expectedBase = if ($Repository -eq "$Owner.github.io") { '' } else { "/$Repository" }
if ($BasePath -ne $expectedBase) { Fail "Expected BasePath '$expectedBase', received '$BasePath'." }
$expectedSite = "https://$Owner.github.io$expectedBase"
if ($SiteUrl.TrimEnd('/') -ne $expectedSite) { Fail "Expected SiteUrl '$expectedSite', received '$SiteUrl'." }

$workflow = [System.IO.Path]::GetFullPath($WorkflowPath)
if (-not (Test-Path -LiteralPath $workflow -PathType Leaf)) { Fail 'Missing Pages workflow.' }
else {
    $yaml = Get-Content -LiteralPath $workflow -Raw
    foreach ($required in @('actions/configure-pages@', 'actions/upload-pages-artifact@', 'actions/deploy-pages@', 'pages: write', 'id-token: write', 'Invoke-WorkspaceNodeTool.ps1 npm run build')) {
        if (-not $yaml.Contains($required)) { Fail "Workflow missing: $required" }
    }
    if ($yaml -match 'pull_request_target|write-all|peaceiris/actions-gh-pages') { Fail 'Workflow contains an unsafe or obsolete deployment pattern.' }
}

$out = [System.IO.Path]::GetFullPath($OutRoot)
if (-not (Test-Path -LiteralPath $out -PathType Container)) { Fail "Missing export directory: $out" }
else {
    foreach ($route in $routes) {
        $relative = if ($route -eq '/') { 'index.html' } else { (($route.Trim('/') -replace '/', [System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar + 'index.html') }
        $file = Join-Path $out $relative
        if (-not (Test-Path -LiteralPath $file -PathType Leaf)) { Fail "Missing exported route: $route"; continue }
        $html = Get-Content -LiteralPath $file -Raw
        $expectedCanonical = "$($SiteUrl.TrimEnd('/'))$route"
        if ($html -notmatch "rel=[\x22\x27]canonical[\x22\x27][^>]+href=[\x22\x27]$([regex]::Escape($expectedCanonical))[\x22\x27]") { Fail "Incorrect canonical for $route" }
        foreach ($match in [regex]::Matches($html, '(?:href|src)=[\x22\x27](/[^\x22\x27#?]+)')) {
            $reference = $match.Groups[1].Value
            if ($reference.StartsWith('//')) { Fail "Protocol-relative URL on $route`: $reference"; continue }
            if ($BasePath -and -not ($reference -eq $BasePath -or $reference.StartsWith("$BasePath/"))) { Fail "Unprefixed root URL on $route`: $reference" }
            if ($BasePath -and $reference.StartsWith("$BasePath$BasePath/")) { Fail "Double-prefixed URL on $route`: $reference" }
        }
    }
    foreach ($file in @('.nojekyll', '404.html', 'sitemap.xml', 'robots.txt', 'favicon.svg')) {
        if (-not (Test-Path -LiteralPath (Join-Path $out $file) -PathType Leaf)) { Fail "Missing exported file: $file" }
    }
    $sitemap = Get-Content -LiteralPath (Join-Path $out 'sitemap.xml') -Raw
    foreach ($route in $routes) { if ($sitemap -notmatch "<loc>$([regex]::Escape("$($SiteUrl.TrimEnd('/'))$route"))</loc>") { Fail "Sitemap missing $route" } }
    $robots = Get-Content -LiteralPath (Join-Path $out 'robots.txt') -Raw
    if ($robots -notmatch "Sitemap:\s*$([regex]::Escape("$($SiteUrl.TrimEnd('/'))/sitemap.xml"))") { Fail 'robots.txt has the wrong sitemap URL.' }
}

if ($failures.Count) { $failures | ForEach-Object { Write-Host "FAIL: $_" -ForegroundColor Red }; exit 1 }
Write-Host "PASS: GitHub Pages validation ($($routes.Count) routes)" -ForegroundColor Green
