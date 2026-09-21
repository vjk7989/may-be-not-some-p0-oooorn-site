[CmdletBinding()]
param(
    [ValidateSet('Source', 'Output', 'All')]
    [string] $Mode = 'All'
)

$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$failures = [Collections.Generic.List[string]]::new()

function Fail([string] $Message) {
    $script:failures.Add($Message)
}

function Assert-True([bool] $Condition, [string] $Message) {
    if (-not $Condition) { Fail $Message }
}

function Read-TreeText([string[]] $Paths, [string[]] $Extensions) {
    $files = foreach ($relative in $Paths) {
        $path = Join-Path $root $relative
        if (Test-Path -LiteralPath $path) {
            Get-ChildItem -LiteralPath $path -Recurse -File | Where-Object {
                $Extensions -contains $_.Extension.ToLowerInvariant()
            }
        }
    }
    return (($files | Sort-Object FullName -Unique | ForEach-Object {
        Get-Content -LiteralPath $_.FullName -Raw
    }) -join "`n")
}

function Validate-Source {
    $removed = @(
        'src/pages/fr',
        'src/copy/fr.ts',
        'src/data_files/fr',
        'src/content/blog/fr',
        'src/content/products/fr',
        'src/content/insights/fr',
        'src/content/docs/de',
        'src/content/docs/es',
        'src/content/docs/fa',
        'src/content/docs/fr',
        'src/content/docs/ja',
        'src/content/docs/zh-cn'
    )
    foreach ($relative in $removed) {
        Assert-True (-not (Test-Path -LiteralPath (Join-Path $root $relative))) "Removed locale path still exists: $relative"
    }

    $expectedCollections = @{
        'src/content/products/en' = @('hyper-tern.md', 'hyper-abs.md', 'hyper-0x.md', 'hyper-wallet.md')
        'src/content/blog/en' = @('ai-agent-security.md', 'prompt-injection-prevention.md', 'secure-ai-inference.md')
        'src/content/insights/en' = @('ai-audit-trails.md', 'excessive-agency.md', 'llm-data-leakage.md')
    }
    foreach ($entry in $expectedCollections.GetEnumerator()) {
        $path = Join-Path $root $entry.Key
        $actual = if (Test-Path -LiteralPath $path) {
            @(Get-ChildItem -LiteralPath $path -File | Select-Object -ExpandProperty Name | Sort-Object)
        } else { @() }
        $expected = @($entry.Value | Sort-Object)
        Assert-True (($actual -join '|') -eq ($expected -join '|')) "Unexpected content inventory in $($entry.Key): $($actual -join ', ')"
    }

    $customerText = Read-TreeText @('src/copy', 'src/data_files', 'src/content') @('.ts', '.json', '.md', '.mdx')
    foreach ($required in @('Buckleson', 'Hyper Tern', 'Hyper-ABS', 'Hyper-0x', 'Hyper Wallet', 'agent credential', 'not a digital-asset custody or payment product', 'does not guarantee secure outcomes')) {
        Assert-True ($customerText.IndexOf($required, [StringComparison]::OrdinalIgnoreCase) -ge 0) "Required Buckleson content missing: $required"
    }
    foreach ($prohibited in @('ScrewFast', 'Spartan AI', 'hardware tools', 'construction equipment', 'cryptocurrency custody')) {
        Assert-True ($customerText.IndexOf($prohibited, [StringComparison]::OrdinalIgnoreCase) -lt 0) "Prohibited customer content remains: $prohibited"
    }

    $runtimeText = Read-TreeText @('src/components', 'src/views', 'src/layouts', 'src/pages', 'astro.config.mjs') @('.astro', '.ts', '.mjs')
    foreach ($remote in @('images.unsplash.com', 'screwfast.uk', 'spartanai.framer.website')) {
        Assert-True ($runtimeText.IndexOf($remote, [StringComparison]::OrdinalIgnoreCase) -lt 0) "Remote runtime reference remains: $remote"
    }

    foreach ($legacy in @('next.config.mjs', 'next-env.d.ts', 'src/app', 'out')) {
        Assert-True (-not (Test-Path -LiteralPath (Join-Path $root $legacy))) "Legacy Next path remains: $legacy"
    }

    $package = Get-Content -LiteralPath (Join-Path $root 'package.json') -Raw | ConvertFrom-Json
    Assert-True ($package.name -eq 'buckleson-site') 'package.json must identify buckleson-site'
    Assert-True (-not $package.dependencies.next) 'Next.js dependency must be absent'

    $hashes = @{
        'public/brand/buckleson-logo.jpg' = '19C1C8EA72D395660AD59BFB05BBBD02F3473DE2C614D4740B3B2F67C1CD3481'
        'public/brand/hyper-0x-logo.png' = 'D54E012E3A323D284E5CF0AB9A41522F89A92B3AA3DF4D10316E5A06B267B6F8'
        'public/media/source/buckleson-execution-boundary.png' = 'E375DF267A960110697F20303EF08492E096B9113B19C8A2B4F39793C74AB1C2'
        'public/media/source/hyper-0x-evidence.png' = '5704DC057C85E7D961066364B71329E985D97A14D3DE87AE8CA6292A1A807775'
        'public/media/source/hyper-abs-chamber.png' = '8E8CC5771FD10AD7623B1C5AFBA5B415C6C3A3812B10EB6FDE275F7A7C34DE62'
        'public/media/source/hyper-tern-boundary.png' = 'D6E25D616CF4025D01827EEE986833722D3F4545A7E3A9B0AB4665CB029D57EC'
    }
    foreach ($entry in $hashes.GetEnumerator()) {
        $path = Join-Path $root $entry.Key
        Assert-True (Test-Path -LiteralPath $path) "Required source asset missing: $($entry.Key)"
        if (Test-Path -LiteralPath $path) {
            $actual = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash
            Assert-True ($actual -eq $entry.Value) "Source asset hash mismatch: $($entry.Key)"
        }
    }

    $workflow = Get-Content -LiteralPath (Join-Path $root '.github/workflows/deploy-pages.yml') -Raw
    foreach ($needle in @('Invoke-WorkspaceNodeTool.ps1', 'path: dist', 'BASE_PATH: /may-be-not-some-p0-oooorn-site/')) {
        Assert-True ($workflow.Contains($needle)) "Deployment workflow missing: $needle"
    }
}

function Validate-Output {
    $dist = Join-Path $root 'dist'
    Assert-True (Test-Path -LiteralPath $dist) 'dist/ does not exist; run the production build first'
    if (-not (Test-Path -LiteralPath $dist)) { return }

    $routes = @(
        'index.html', 'products/index.html', 'products/hyper-tern/index.html',
        'products/hyper-abs/index.html', 'products/hyper-0x/index.html',
        'products/hyper-wallet/index.html', 'services/index.html', 'blog/index.html',
        'blog/ai-agent-security/index.html', 'blog/prompt-injection-prevention/index.html',
        'blog/secure-ai-inference/index.html', 'insights/ai-audit-trails/index.html',
        'insights/excessive-agency/index.html', 'insights/llm-data-leakage/index.html',
        'contact/index.html', 'welcome-to-docs/index.html', 'guides/intro/index.html',
        'guides/getting-started/index.html', 'guides/first-project-checklist/index.html',
        'tools/tool-guides/index.html', 'tools/equipment-care/index.html',
        'construction/service-overview/index.html', 'construction/project-planning/index.html',
        'construction/safety/index.html', 'construction/custom-solutions/index.html',
        'advanced/technical-specifications/index.html', '404.html', 'manifest.json',
        'favicon.ico', 'robots.txt', 'sitemap-index.xml'
    )
    foreach ($relative in $routes) {
        Assert-True (Test-Path -LiteralPath (Join-Path $dist $relative)) "Generated route or asset missing: $relative"
    }
    foreach ($locale in @('fr', 'de', 'es', 'fa', 'ja', 'zh-cn')) {
        Assert-True (-not (Test-Path -LiteralPath (Join-Path $dist $locale))) "Translated output must not exist: /$locale/"
    }

    $outputText = Read-TreeText @('dist') @('.html', '.xml', '.json', '.txt')
    foreach ($required in @('Buckleson', 'Hyper Wallet', 'not a digital-asset custody or payment product')) {
        Assert-True ($outputText.IndexOf($required, [StringComparison]::OrdinalIgnoreCase) -ge 0) "Generated output missing: $required"
    }
    foreach ($prohibited in @('ScrewFast', 'Spartan AI', 'images.unsplash.com', 'screwfast.uk', '/fr/')) {
        Assert-True ($outputText.IndexOf($prohibited, [StringComparison]::OrdinalIgnoreCase) -lt 0) "Generated output contains prohibited value: $prohibited"
    }

    $manifestPath = Join-Path $dist 'manifest.json'
    if (Test-Path -LiteralPath $manifestPath) {
        $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
        $expectedBase = [string]$manifest.start_url
        foreach ($htmlFile in Get-ChildItem -LiteralPath $dist -Filter '*.html' -Recurse) {
            $html = Get-Content -LiteralPath $htmlFile.FullName -Raw
            foreach ($match in [regex]::Matches($html, '(?i)(?:href|src)\s*=\s*["'']([^"'']+)["'']')) {
                $url = $match.Groups[1].Value
                if ($url.StartsWith('/') -and -not $url.StartsWith('//')) {
                    Assert-True ($url.StartsWith($expectedBase, [StringComparison]::Ordinal)) "Base-path escape in $($htmlFile.FullName): $url (expected prefix $expectedBase)"
                }
            }
        }
    }
}

if ($Mode -in @('Source', 'All')) { Validate-Source }
if ($Mode -in @('Output', 'All')) { Validate-Output }

if ($failures.Count -gt 0) {
    $failures | ForEach-Object { Write-Host "FAIL: $_" -ForegroundColor Red }
    throw "Buckleson ScrewFast validation failed with $($failures.Count) issue(s)."
}

Write-Host "PASS: Buckleson ScrewFast $Mode validation" -ForegroundColor Green
