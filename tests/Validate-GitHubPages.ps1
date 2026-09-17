[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Owner,

    [Parameter(Mandatory = $true)]
    [string]$Repository,

    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,

    [Parameter(Mandatory = $true)]
    [AllowEmptyString()]
    [string]$BasePath,

    [string]$OutRoot = (Join-Path $PSScriptRoot '..\out'),
    [string]$WorkflowPath = (Join-Path $PSScriptRoot '..\.github\workflows\deploy-pages.yml')
)

$ErrorActionPreference = 'Stop'
$failures = [System.Collections.Generic.List[string]]::new()
$ArticleSlugs = @(
    'ai-agent-security',
    'prompt-injection-prevention',
    'secure-ai-inference',
    'llm-data-leakage',
    'excessive-agency',
    'ai-audit-trails'
)
$Routes = @('/', '/about/', '/products/', '/services/', '/blog/') +
    @($ArticleSlugs | ForEach-Object { "/blog/$_/" })

function Add-Failure([string]$Message) {
    if (-not $script:failures.Contains($Message)) { $script:failures.Add($Message) }
}

function Get-Attribute([string]$Attributes, [string]$Name) {
    $match = [regex]::Match($Attributes, "(?:^|\s)$([regex]::Escape($Name))\s*=\s*([\x22\x27])([\s\S]*?)\1", 'IgnoreCase')
    if ($match.Success) { return [System.Net.WebUtility]::HtmlDecode($match.Groups[2].Value) }
    return $null
}

function Get-TagAttributes([string]$Html, [string]$Tag) {
    return @([regex]::Matches($Html, "<$Tag\b([^>]*)>", 'IgnoreCase') | ForEach-Object { $_.Groups[1].Value })
}

function Get-Canonical([string]$Html) {
    foreach ($attrs in (Get-TagAttributes $Html 'link')) {
        if ((Get-Attribute $attrs 'rel') -eq 'canonical') { return (Get-Attribute $attrs 'href') }
    }
    return $null
}

function Get-Meta([string]$Html, [string]$Property) {
    foreach ($attrs in (Get-TagAttributes $Html 'meta')) {
        if ((Get-Attribute $attrs 'property') -eq $Property -or (Get-Attribute $attrs 'name') -eq $Property) {
            return (Get-Attribute $attrs 'content')
        }
    }
    return $null
}

function Resolve-RouteFile([string]$Route, [string]$Root) {
    if ($Route -eq '/') { return (Join-Path $Root 'index.html') }
    $relative = $Route.Trim('/') -replace '/', [System.IO.Path]::DirectorySeparatorChar
    return (Join-Path (Join-Path $Root $relative) 'index.html')
}

function Join-SiteRoute([string]$RootUrl, [string]$Route) {
    $root = $RootUrl.TrimEnd('/')
    if ($Route -eq '/') { return "$root/" }
    return "$root/$($Route.TrimStart('/'))"
}

if ($Owner -notmatch '^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$') {
    Add-Failure "Invalid GitHub owner: $Owner"
}
if ($Repository -notmatch '^[A-Za-z0-9._-]+$' -or $Repository -match '[@\\/\s]') {
    Add-Failure "Invalid GitHub repository slug: $Repository"
}

$isUserSite = $Repository.Equals("$Owner.github.io", [System.StringComparison]::OrdinalIgnoreCase)
$expectedBasePath = if ($isUserSite) { '' } else { "/$Repository" }
if ($BasePath -ne $expectedBasePath) {
    Add-Failure "BasePath must be '$expectedBasePath' for owner/repository $Owner/$Repository; received '$BasePath'"
}

$siteUri = $null
if (-not [uri]::TryCreate($SiteUrl, [uriKind]::Absolute, [ref]$siteUri) -or
    $siteUri.Scheme -ne 'https' -or
    $siteUri.Host -ne "$Owner.github.io" -or
    $siteUri.Query -or
    $siteUri.Fragment) {
    Add-Failure "SiteUrl must be an HTTPS GitHub Pages URL for ${Owner}: $SiteUrl"
} else {
    $expectedPath = if ($isUserSite) { '' } else { "/$Repository" }
    $actualPath = $siteUri.AbsolutePath.TrimEnd('/')
    if ($actualPath -ne $expectedPath) {
        Add-Failure "SiteUrl path must be '$expectedPath'; received '$($siteUri.AbsolutePath)'"
    }
}

$resolvedWorkflow = [System.IO.Path]::GetFullPath($WorkflowPath)
$wrapperPath = Join-Path $PSScriptRoot '..\scripts\Invoke-WorkspaceNodeTool.ps1'
if (-not (Test-Path -LiteralPath $wrapperPath -PathType Leaf)) {
    Add-Failure "Missing workspace Node wrapper: $wrapperPath"
} else {
    $wrapper = Get-Content -LiteralPath $wrapperPath -Raw -Encoding utf8
    if ($wrapper -notmatch 'Get-Command\s+\$Tool[\s\S]*?Select-Object\s+-First\s+1') {
        Add-Failure 'Workspace Node wrapper must select exactly the first PATH executable in CI'
    }
}

if (-not (Test-Path -LiteralPath $resolvedWorkflow -PathType Leaf)) {
    Add-Failure "Missing GitHub Pages workflow: $resolvedWorkflow"
} else {
    $workflow = Get-Content -LiteralPath $resolvedWorkflow -Raw -Encoding utf8
    if ($workflow -notmatch '(?m)^\s*push\s*:') { Add-Failure 'Workflow must trigger on push' }
    if ($workflow -notmatch '(?ms)^\s*push\s*:.*?branches\s*:\s*(?:\[\s*["'']?main["'']?\s*\]|\r?\n\s*-\s*["'']?main["'']?)') { Add-Failure 'Workflow push trigger must be limited to main' }
    if ($workflow -notmatch '(?m)^\s*workflow_dispatch\s*:') { Add-Failure 'Workflow must support workflow_dispatch' }
    if ($workflow -notmatch '(?m)^\s*contents\s*:\s*read\s*$') { Add-Failure 'Workflow permissions must include contents: read' }
    if ($workflow -notmatch '(?m)^\s*pages\s*:\s*write\s*$') { Add-Failure 'Workflow permissions must include pages: write' }
    if ($workflow -notmatch '(?m)^\s*id-token\s*:\s*write\s*$') { Add-Failure 'Workflow permissions must include id-token: write' }
    if ($workflow -match '(?m)^\s*(?:contents|actions|checks|deployments|issues|packages|pull-requests|repository-projects|security-events|statuses)\s*:\s*write\s*$') {
        Add-Failure 'Workflow grants a broad write permission outside pages and id-token'
    }
    if ($workflow -match '(?m)^\s*permissions\s*:\s*(?:write-all|read-all)\s*$') { Add-Failure 'Workflow must declare explicit least-privilege permissions' }
    if ($workflow -match '(?m)^\s*pull_request_target\s*:') { Add-Failure 'Workflow must not use pull_request_target' }
    if ($workflow -notmatch '(?ms)^\s*concurrency\s*:.*?group\s*:\s*["'']?pages["'']?.*?cancel-in-progress\s*:\s*true') {
        Add-Failure 'Workflow must use the pages concurrency group and cancel superseded runs'
    }
    if ($workflow -notmatch 'actions/setup-node@(?:v[0-9]+|[0-9a-f]{40})') { Add-Failure 'Workflow must use a pinned actions/setup-node revision' }
    if ($workflow -notmatch '(?m)^\s*node-version\s*:\s*["'']?[0-9]+["'']?\s*$') { Add-Failure 'Workflow must pin one Node major version' }
    if ($workflow -notmatch '(?m)^\s*run\s*:\s*(?:\.\/scripts\/Invoke-WorkspaceNodeTool\.ps1\s+)?npm ci\s*$') { Add-Failure 'Workflow install must use npm ci' }
    if ($workflow -notmatch 'actions/configure-pages@(?:v[0-9]+|[0-9a-f]{40})') { Add-Failure 'Workflow must use actions/configure-pages' }
    if ($workflow -notmatch 'actions/upload-pages-artifact@(?:v[0-9]+|[0-9a-f]{40})') { Add-Failure 'Workflow must use actions/upload-pages-artifact' }
    if ($workflow -notmatch 'actions/deploy-pages@(?:v[0-9]+|[0-9a-f]{40})') { Add-Failure 'Workflow must use actions/deploy-pages' }
    if ($workflow -notmatch '(?m)^\s*path\s*:\s*["'']?\.?/?out/?["'']?\s*$') { Add-Failure 'Pages artifact upload path must be exactly out/' }
    if ($workflow -match '(?i)\bgh-pages\b|peaceiris/actions-gh-pages|JamesIves/github-pages-deploy-action') { Add-Failure 'Workflow must not use branch-copy deployment actions' }
    if ($workflow -match '(?m)^\s*run\s*:.*\$\{\{\s*github\.event\.') { Add-Failure 'Workflow must not interpolate untrusted event data into shell commands' }
}

$resolvedOut = [System.IO.Path]::GetFullPath($OutRoot)
if (-not (Test-Path -LiteralPath $resolvedOut -PathType Container)) {
    Add-Failure "Static export directory does not exist: $resolvedOut"
} else {
    $noJekyll = Join-Path $resolvedOut '.nojekyll'
    if (-not (Test-Path -LiteralPath $noJekyll -PathType Leaf)) { Add-Failure 'Static export must contain out/.nojekyll' }

    $pages = @{}
    foreach ($route in $Routes) {
        $path = Resolve-RouteFile $route $resolvedOut
        if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
            Add-Failure "Missing trailing-slash route output: $route ($path)"
            continue
        }
        if ((Get-Item -LiteralPath $path).Length -eq 0) {
            Add-Failure "Route output is empty: $route"
            continue
        }
        $html = Get-Content -LiteralPath $path -Raw -Encoding utf8
        $pages[$route] = $html
        $expectedUrl = Join-SiteRoute $SiteUrl $route
        $canonical = Get-Canonical $html
        if ($canonical -ne $expectedUrl) { Add-Failure "$route canonical must be '$expectedUrl'; received '$canonical'" }
        $ogUrl = Get-Meta $html 'og:url'
        if ($ogUrl -ne $expectedUrl) { Add-Failure "$route og:url must be '$expectedUrl'; received '$ogUrl'" }
        if ($html -match 'https?://(?:localhost|127\.0\.0\.1|[^/\x22\x27<\s]+\.example)') { Add-Failure "$route contains a placeholder or local origin" }

        foreach ($tag in [regex]::Matches($html, '<(?:a|img|script|link)\b([^>]*)>', 'IgnoreCase')) {
            $attrs = $tag.Groups[1].Value
            $reference = Get-Attribute $attrs 'href'
            if ($null -eq $reference) { $reference = Get-Attribute $attrs 'src' }
            if ([string]::IsNullOrWhiteSpace($reference) -or -not $reference.StartsWith('/')) { continue }
            if ($reference.StartsWith('//')) { Add-Failure "$route contains a protocol-relative reference: $reference"; continue }
            $pathPart = ($reference -split '[?#]', 2)[0]
            if ($BasePath) {
                if (-not ($pathPart -eq $BasePath -or $pathPart.StartsWith("$BasePath/", [System.StringComparison]::Ordinal))) {
                    Add-Failure "$route has an unprefixed root-relative reference: $reference"
                    continue
                }
                if ($pathPart.StartsWith("$BasePath$BasePath/", [System.StringComparison]::Ordinal)) {
                    Add-Failure "$route has a double-prefixed reference: $reference"
                }
                $exportPath = $pathPart.Substring($BasePath.Length)
            } else {
                $exportPath = $pathPart
                if ($pathPart -eq "/$Repository" -or $pathPart.StartsWith("/$Repository/")) {
                    Add-Failure "$route user-site reference must not contain the repository name: $reference"
                }
            }
            if ($exportPath -match '^/(?:_next|brand)/') {
                $localAsset = Join-Path $resolvedOut ($exportPath.TrimStart('/') -replace '/', [System.IO.Path]::DirectorySeparatorChar)
                if (-not (Test-Path -LiteralPath $localAsset -PathType Leaf) -or (Get-Item -LiteralPath $localAsset -ErrorAction SilentlyContinue).Length -eq 0) {
                    Add-Failure "$route references a missing or empty exported asset: $reference"
                }
            }
        }
    }

    if ($pages.ContainsKey('/')) {
        $iconReferences = @()
        foreach ($attrs in (Get-TagAttributes $pages['/'] 'link')) {
            $rel = Get-Attribute $attrs 'rel'
            if (@($rel -split '\s+') -contains 'icon') {
                $iconReferences += (Get-Attribute $attrs 'href')
            }
        }
        $expectedIconReference = "$BasePath/brand/buckleson-icon-v2.svg"
        if ($iconReferences.Count -ne 1 -or $iconReferences[0] -ne $expectedIconReference) {
            Add-Failure "Home favicon must reference exactly '$expectedIconReference'; received '$($iconReferences -join ', ')'"
        }

        $exportedIcon = Join-Path $resolvedOut 'brand\buckleson-icon-v2.svg'
        if (-not (Test-Path -LiteralPath $exportedIcon -PathType Leaf) -or
            (Get-Item -LiteralPath $exportedIcon -ErrorAction SilentlyContinue).Length -eq 0) {
            Add-Failure 'Missing or empty self-contained exported favicon: out/brand/buckleson-icon-v2.svg'
        } else {
            $iconSvg = Get-Content -LiteralPath $exportedIcon -Raw -Encoding utf8
            if ($iconSvg -notmatch '<svg\b[^>]*\bviewBox=[\x22\x27][^\x22\x27]+[\x22\x27]' -or
                $iconSvg -notmatch '<image\b[^>]*(?:href|xlink:href)=[\x22\x27]data:image/jpeg;base64,[A-Za-z0-9+/=]+[\x22\x27]') {
                Add-Failure 'Exported favicon must be a self-contained SVG with an inline JPEG payload'
            }
            if ($iconSvg -match '<script\b|\bon\w+\s*=|<foreignObject\b|(?:href|xlink:href)=[\x22\x27](?:https?:|/|\.\.?/|file:)') {
                Add-Failure 'Exported favicon contains executable or external-resource markup'
            }
        }
    }

    $robotsPath = Join-Path $resolvedOut 'robots.txt'
    if (-not (Test-Path -LiteralPath $robotsPath -PathType Leaf)) {
        Add-Failure 'Missing out/robots.txt'
    } else {
        $robots = Get-Content -LiteralPath $robotsPath -Raw -Encoding utf8
        $expectedSitemap = Join-SiteRoute $SiteUrl '/sitemap.xml'
        if ($robots -notmatch "(?m)^Sitemap:\s*$([regex]::Escape($expectedSitemap))\s*$") {
            Add-Failure "robots.txt must reference '$expectedSitemap'"
        }
        if ($robots -match 'https?://(?:localhost|127\.0\.0\.1|\S+\.example)') { Add-Failure 'robots.txt contains a placeholder or local origin' }
    }

    $sitemapPath = Join-Path $resolvedOut 'sitemap.xml'
    if (-not (Test-Path -LiteralPath $sitemapPath -PathType Leaf)) {
        Add-Failure 'Missing out/sitemap.xml'
    } else {
        $sitemap = Get-Content -LiteralPath $sitemapPath -Raw -Encoding utf8
        foreach ($route in $Routes) {
            $expectedUrl = Join-SiteRoute $SiteUrl $route
            if ($sitemap -notmatch "<loc>$([regex]::Escape($expectedUrl))</loc>") { Add-Failure "sitemap.xml is missing '$expectedUrl'" }
        }
        $locations = @([regex]::Matches($sitemap, '<loc>([^<]+)</loc>', 'IgnoreCase') | ForEach-Object { $_.Groups[1].Value })
        foreach ($location in $locations) {
            if (-not $location.StartsWith($SiteUrl.TrimEnd('/') + '/', [System.StringComparison]::Ordinal)) {
                Add-Failure "sitemap.xml contains a URL outside SiteUrl: $location"
            }
        }
    }
}

if ($failures.Count -gt 0) {
    Write-Host "FAIL: GitHub Pages pre-deployment validation ($($failures.Count) assertion(s))" -ForegroundColor Red
    $failures | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
    exit 1
}

Write-Host 'PASS: GitHub Pages pre-deployment validation' -ForegroundColor Green
exit 0
