[CmdletBinding()]
param(
    [string]$DistRoot = (Join-Path $PSScriptRoot '..\dist')
)

$ErrorActionPreference = 'Stop'
$resolvedDist = [System.IO.Path]::GetFullPath($DistRoot).TrimEnd([System.IO.Path]::DirectorySeparatorChar)
$failures = [System.Collections.Generic.List[string]]::new()

$pageContracts = @(
    @{ Path = 'index.html'; Title = 'Home'; Current = 'Home' },
    @{ Path = 'products.html'; Title = 'Products'; Current = 'Products' },
    @{ Path = 'services.html'; Title = 'Services'; Current = 'Services' },
    @{ Path = 'about.html'; Title = 'About'; Current = 'About' },
    @{ Path = 'blog\index.html'; Title = 'Blog'; Current = 'Blog' }
)

function Add-Failure {
    param([string]$Message)
    $script:failures.Add($Message)
}

function Assert-True {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) { Add-Failure $Message }
}

function Assert-Contains {
    param([string]$Text, [string]$Literal, [string]$Message)
    Assert-True ($Text.IndexOf($Literal, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) $Message
}

function Assert-Matches {
    param([string]$Text, [string]$Pattern, [string]$Message)
    Assert-True ([regex]::IsMatch($Text, $Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) $Message
}

function Read-RequiredFile {
    param([string]$RelativePath)
    $path = Join-Path $resolvedDist $RelativePath
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        Add-Failure "Missing required file: $path"
        return ''
    }
    if ((Get-Item -LiteralPath $path).Length -eq 0) {
        Add-Failure "Required file is empty: $path"
        return ''
    }
    return Get-Content -LiteralPath $path -Raw -Encoding utf8
}

function Get-VisibleText {
    param([string]$Html)
    $withoutNonContent = [regex]::Replace($Html, '<(?:script|style)\b[^>]*>[\s\S]*?</(?:script|style)>', ' ', 'IgnoreCase')
    $withoutTags = [regex]::Replace($withoutNonContent, '<[^>]+>', ' ')
    $decoded = [System.Net.WebUtility]::HtmlDecode($withoutTags)
    return [regex]::Replace($decoded, '\s+', ' ').Trim()
}

function Get-Ids {
    param([string]$Html)
    return @([regex]::Matches($Html, '\bid=[\x22\x27]([^\x22\x27]+)[\x22\x27]', 'IgnoreCase') | ForEach-Object { $_.Groups[1].Value })
}

function Resolve-LocalTarget {
    param([string]$PageRelativePath, [string]$Reference)
    $pathPart = ($Reference -split '[?#]', 2)[0]
    if ([string]::IsNullOrWhiteSpace($pathPart)) {
        return Join-Path $resolvedDist $PageRelativePath
    }
    if ($pathPart.EndsWith('/')) { $pathPart += 'index.html' }
    $pageDirectory = Split-Path -Parent (Join-Path $resolvedDist $PageRelativePath)
    return [System.IO.Path]::GetFullPath((Join-Path $pageDirectory ($pathPart -replace '/', [System.IO.Path]::DirectorySeparatorChar)))
}

function Assert-ReferenceIsLocalAndExists {
    param([string]$PageRelativePath, [string]$Reference, [string]$Kind)
    if ([string]::IsNullOrWhiteSpace($Reference) -or $Reference -eq '#') {
        Add-Failure "$PageRelativePath contains an empty $Kind reference"
        return
    }
    if ($Reference -match '^(?:https?:)?//' -or $Reference -match '^(?:data|javascript):') {
        Add-Failure "$PageRelativePath contains a non-local or unsafe $Kind reference: $Reference"
        return
    }
    if ($Reference -match '^(?:mailto|tel):') { return }

    try { $target = Resolve-LocalTarget $PageRelativePath $Reference }
    catch {
        Add-Failure "$PageRelativePath contains an invalid $Kind reference: $Reference"
        return
    }

    $insideDist = $target.Equals($resolvedDist, [System.StringComparison]::OrdinalIgnoreCase) -or
        $target.StartsWith($resolvedDist + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)
    if (-not $insideDist) {
        Add-Failure "$PageRelativePath $Kind escapes dist: $Reference"
        return
    }
    if (-not (Test-Path -LiteralPath $target -PathType Leaf)) {
        Add-Failure "$PageRelativePath has a broken $Kind reference: $Reference -> $target"
        return
    }

    $fragmentParts = $Reference -split '#', 2
    if ($fragmentParts.Count -eq 2 -and -not [string]::IsNullOrWhiteSpace($fragmentParts[1])) {
        $targetHtml = Get-Content -LiteralPath $target -Raw -Encoding utf8
        if ((Get-Ids $targetHtml) -notcontains $fragmentParts[1]) {
            Add-Failure "$PageRelativePath has a broken fragment in $Kind reference: $Reference"
        }
    }
}

function Assert-NoAffirmativeClaim {
    param([string]$Text, [string]$Pattern, [string]$Label)
    foreach ($match in [regex]::Matches($Text, $Pattern, 'IgnoreCase')) {
        $prefixStart = [Math]::Max(0, $match.Index - 110)
        $prefix = $Text.Substring($prefixStart, $match.Index - $prefixStart)
        $isNegated = [regex]::IsMatch($prefix, '(?:\bnot\b|\bnever\b|\bwithout\b|\bdoes\s+not\b|\bdo\s+not\b|\bis\s+not\b|\bare\s+not\b)[^.!?]{0,90}$', 'IgnoreCase')
        if (-not $isNegated) { Add-Failure "Affirmative unsupported claim matched ($Label): $($match.Value)" }
    }
}

$pages = @{}
foreach ($contract in $pageContracts) {
    $html = Read-RequiredFile $contract.Path
    $pages[$contract.Path] = $html
    if ($html.Length -eq 0) { continue }

    $visible = Get-VisibleText $html
    Assert-Matches $html '^\s*<!doctype\s+html>' "$($contract.Path) must start with an HTML5 doctype"
    Assert-Matches $html '<html\b[^>]*\blang=[\x22\x27]en[\x22\x27]' "$($contract.Path) must declare lang=en"
    Assert-Matches $html '<meta\b[^>]*charset=[\x22\x27]?utf-8' "$($contract.Path) must declare UTF-8"
    Assert-Matches $html '<meta\b[^>]*name=[\x22\x27]viewport[\x22\x27][^>]*content=[\x22\x27][^\x22\x27]*width=device-width' "$($contract.Path) needs a responsive viewport"
    Assert-Matches $html '<title>[^<]*Buckleson[^<]*</title>' "$($contract.Path) title must identify Buckleson"

    $h1Matches = [regex]::Matches($html, '<h1\b[^>]*>([\s\S]*?)</h1>', 'IgnoreCase')
    Assert-True ($h1Matches.Count -eq 1) "$($contract.Path) must contain exactly one h1; found $($h1Matches.Count)"
    foreach ($landmark in @('header', 'main', 'footer')) {
        Assert-Matches $html "<$landmark\b" "$($contract.Path) is missing <$landmark>"
    }
    Assert-Matches $html '<nav\b[^>]*aria-label=[\x22\x27](?:Primary|Main)[^\x22\x27]*[\x22\x27]' "$($contract.Path) needs a labelled primary nav"
    Assert-Matches $html '<a\b[^>]*class=[\x22\x27][^\x22\x27]*skip-link[^\x22\x27]*[\x22\x27][^>]*href=[\x22\x27]#main-content[\x22\x27]|<a\b[^>]*href=[\x22\x27]#main-content[\x22\x27][^>]*class=[\x22\x27][^\x22\x27]*skip-link' "$($contract.Path) needs a skip link to #main-content"
    Assert-Matches $html '<main\b[^>]*id=[\x22\x27]main-content[\x22\x27]|<main\b[^>]*id=[\x22\x27]main-content[\x22\x27]' "$($contract.Path) main must expose id=main-content"
    $currentLinks = @([regex]::Matches($html, '<a\b([^>]*)>([\s\S]*?)</a>', 'IgnoreCase') | Where-Object {
        [regex]::IsMatch($_.Groups[1].Value, '\baria-current=[\x22\x27]page[\x22\x27]', 'IgnoreCase')
    })
    Assert-True ($currentLinks.Count -eq 1) "$($contract.Path) must contain exactly one aria-current=page link; found $($currentLinks.Count)"
    if ($currentLinks.Count -eq 1) {
        Assert-Contains (Get-VisibleText $currentLinks[0].Groups[2].Value) $contract.Current "$($contract.Path) current-page link must identify $($contract.Current)"
    }

    $headingLevels = @([regex]::Matches($html, '<h([1-6])\b', 'IgnoreCase') | ForEach-Object { [int]$_.Groups[1].Value })
    Assert-True ($headingLevels.Count -ge 2) "$($contract.Path) needs an h1 followed by at least one section heading"
    if ($headingLevels.Count -gt 0) {
        Assert-True ($headingLevels[0] -eq 1) "$($contract.Path) first heading must be h1"
        for ($headingIndex = 1; $headingIndex -lt $headingLevels.Count; $headingIndex++) {
            if ($headingLevels[$headingIndex] -gt ($headingLevels[$headingIndex - 1] + 1)) {
                Add-Failure "$($contract.Path) skips a heading level from h$($headingLevels[$headingIndex - 1]) to h$($headingLevels[$headingIndex])"
            }
        }
    }

    $ids = Get-Ids $html
    foreach ($duplicate in ($ids | Group-Object | Where-Object Count -gt 1)) {
        Add-Failure "$($contract.Path) contains duplicate id: $($duplicate.Name)"
    }

    foreach ($anchor in [regex]::Matches($html, '<a\b([^>]*)>([\s\S]*?)</a>', 'IgnoreCase')) {
        $attributes = $anchor.Groups[1].Value
        $linkText = Get-VisibleText $anchor.Groups[2].Value
        $hasName = $linkText.Length -gt 0 -or [regex]::IsMatch($attributes, '\baria-label=[\x22\x27][^\x22\x27]+[\x22\x27]', 'IgnoreCase')
        Assert-True $hasName "$($contract.Path) contains a link without an accessible name"
        $hrefMatch = [regex]::Match($attributes, '\bhref=[\x22\x27]([^\x22\x27]*)[\x22\x27]', 'IgnoreCase')
        Assert-True $hrefMatch.Success "$($contract.Path) contains an anchor without href"
        if ($hrefMatch.Success) { Assert-ReferenceIsLocalAndExists $contract.Path $hrefMatch.Groups[1].Value 'link' }
    }

    $resolvedAssets = [System.Collections.Generic.List[string]]::new()
    foreach ($asset in [regex]::Matches($html, '<(?:link|script)\b[^>]*(?:href|src)=[\x22\x27]([^\x22\x27]+)[\x22\x27][^>]*>', 'IgnoreCase')) {
        Assert-ReferenceIsLocalAndExists $contract.Path $asset.Groups[1].Value 'asset'
        try { $resolvedAssets.Add([System.IO.Path]::GetRelativePath($resolvedDist, (Resolve-LocalTarget $contract.Path $asset.Groups[1].Value))) }
        catch { }
    }
    foreach ($requiredAsset in @('assets\wireframe.css', 'vendor\oat\oat.min.css', 'vendor\oat\oat.min.js')) {
        Assert-True ($resolvedAssets -contains $requiredAsset) "$($contract.Path) must load local asset $requiredAsset"
    }
    foreach ($img in [regex]::Matches($html, '<img\b([^>]*)>', 'IgnoreCase')) {
        Assert-True ([regex]::IsMatch($img.Groups[1].Value, '\balt=[\x22\x27][^\x22\x27]+[\x22\x27]', 'IgnoreCase')) "$($contract.Path) contains an image without non-empty alt text"
    }

    foreach ($unsafe in @('\son[a-z]+\s*=', '(?:href|src)\s*=\s*[\x22\x27]javascript:', '<script\b(?![^>]*\bsrc=)', 'target=[\x22\x27]_blank[\x22\x27]')) {
        if ([regex]::IsMatch($html, $unsafe, 'IgnoreCase')) { Add-Failure "$($contract.Path) contains unsafe inline/external behavior: $unsafe" }
    }

    $requiredRoutes = @('index.html', 'products.html', 'services.html', 'about.html', 'blog\index.html')
    $navMatch = [regex]::Match($html, '<nav\b[^>]*aria-label=[\x22\x27](?:Primary|Main)[^\x22\x27]*[\x22\x27][^>]*>([\s\S]*?)</nav>', 'IgnoreCase')
    if ($navMatch.Success) {
        $resolvedNavTargets = @([regex]::Matches($navMatch.Groups[1].Value, '\bhref=[\x22\x27]([^\x22\x27]+)[\x22\x27]', 'IgnoreCase') | ForEach-Object {
            try { [System.IO.Path]::GetRelativePath($resolvedDist, (Resolve-LocalTarget $contract.Path $_.Groups[1].Value)) }
            catch { '' }
        })
        foreach ($route in $requiredRoutes) {
            Assert-True ($resolvedNavTargets -contains $route) "$($contract.Path) primary nav must link to real page $route"
        }
    }
}

$homeHtml = $pages['index.html']
$homeText = if ($homeHtml) { Get-VisibleText $homeHtml } else { '' }
if ($homeHtml) {
    foreach ($phrase in @(
        'We help you use AI safely',
        'A Trust & Execution Layer for AI Infrastructure',
        'We secure how AI runs — not what AI thinks'
    )) { Assert-Contains $homeText $phrase "Homepage is missing approved first-glance copy: $phrase" }

    $homeH1 = [regex]::Match($homeHtml, '<h1\b[^>]*>([\s\S]*?)</h1>', 'IgnoreCase')
    if ($homeH1.Success) {
        $homeH1Text = Get-VisibleText $homeH1.Groups[1].Value
        Assert-True ($homeH1Text.Length -le 60) "Homepage h1 must stay concise (maximum 60 characters); found $($homeH1Text.Length)"
        Assert-Contains $homeH1Text 'We help you use AI safely' 'Homepage h1 must carry the concise approved promise'
    }

    foreach ($id in @('risk-funnel', 'blockchain', 'products', 'services', 'assessment', 'industries', 'traction', 'company', 'contact')) {
        Assert-Matches $homeHtml "\bid=[\x22\x27]$([regex]::Escape($id))[\x22\x27]" "Homepage is missing required section/diagram id: $id"
    }
    foreach ($removed in @('Hyper Wallet', 'A controlled request path')) {
        Assert-True ($homeText.IndexOf($removed, [System.StringComparison]::OrdinalIgnoreCase) -lt 0) "Removed homepage content returned: $removed"
    }
    foreach ($removedId in @('how-it-works', 'controlled-request', 'request-path')) {
        Assert-True (-not [regex]::IsMatch($homeHtml, "\bid=[\x22\x27]$removedId[\x22\x27]", 'IgnoreCase')) "Removed homepage section id returned: $removedId"
    }

    $funnel = [regex]::Match($homeHtml, '<figure\b[^>]*id=[\x22\x27]risk-funnel[\x22\x27][^>]*>([\s\S]*?)</figure>', 'IgnoreCase')
    Assert-True $funnel.Success 'Homepage risk funnel must be a semantic figure with id=risk-funnel'
    if ($funnel.Success) {
        $funnelHtml = $funnel.Value
        $funnelText = Get-VisibleText $funnelHtml
        Assert-Matches $funnelHtml '<figure\b[^>]*aria-labelledby=[\x22\x27][^\x22\x27]+[\x22\x27]' 'Risk funnel figure needs aria-labelledby'
        Assert-Matches $funnelHtml '<figcaption\b' 'Risk funnel figure needs a figcaption'
        $stageMatches = [regex]::Matches($funnelHtml, '\bdata-stage=[\x22\x27](agents|attacks|buckleson|destinations)[\x22\x27]', 'IgnoreCase')
        $stageValues = @($stageMatches | ForEach-Object { $_.Groups[1].Value.ToLowerInvariant() })
        Assert-True (($stageValues -join ',') -eq 'agents,attacks,buckleson,destinations') "Risk funnel stages must be ordered agents,attacks,buckleson,destinations; found $($stageValues -join ',')"
        foreach ($phrase in @(
            'AI agents', 'Prompt Injection', 'Sensitive Information Disclosure', 'Excessive Agency',
            'Intent Breaking & Goal Manipulation', 'Agentic T6', 'Tool Misuse', 'Agentic T2',
            'Memory Poisoning', 'Agentic T1', 'Buckleson', 'users', 'servers', 'applications', 'devices'
        )) { Assert-Contains $funnelText $phrase "Risk funnel is missing required stage text: $phrase" }
    }

    $blockchain = [regex]::Match($homeHtml, '<section\b[^>]*id=[\x22\x27]blockchain[\x22\x27][^>]*>([\s\S]*?)</section>', 'IgnoreCase')
    Assert-True $blockchain.Success 'Homepage requires a blockchain section with id=blockchain'
    if ($blockchain.Success) {
        $blockchainText = Get-VisibleText $blockchain.Value
        foreach ($phrase in @('Hyper-ABS', 'protects', 'data exposure', 'Hyper-0x', 'in-house blockchain', 'tamper-evident', 'execution records', 'audit', 'settlement', 'Designed for')) {
            Assert-Contains $blockchainText $phrase "Blockchain section is missing required qualified explanation: $phrase"
        }
    }
}

$productsText = if ($pages['products.html']) { Get-VisibleText $pages['products.html'] } else { '' }
foreach ($product in @('Hyper Tern', 'Hyper-ABS', 'Hyper-0x')) {
    Assert-Contains $productsText $product "Products page is missing $product"
}

$servicesText = if ($pages['services.html']) { Get-VisibleText $pages['services.html'] } else { '' }
foreach ($service in @('AI Security', 'Secure Inference', 'Custom AI', 'fine-tuning')) {
    Assert-Contains $servicesText $service "Services page is missing $service"
}
Assert-Matches $servicesText 'Secure Inference.{0,500}(?:controls?|protection).{0,200}(?:around|surrounding) inference|(?:controls?|protection).{0,200}(?:around|surrounding) inference.{0,500}Secure Inference' 'Services page must describe Secure Inference as controls/protection around inference'

$aboutText = if ($pages['about.html']) { Get-VisibleText $pages['about.html'] } else { '' }
foreach ($phrase in @('Mission', 'Vision', 'MVP', 'pilot', 'Current capability')) {
    Assert-Contains $aboutText $phrase "About page is missing qualified company context: $phrase"
}

$blogText = if ($pages['blog\index.html']) { Get-VisibleText $pages['blog\index.html'] } else { '' }
foreach ($phrase in @('OWASP', 'Agentic AI', 'LLM', 'educational')) {
    Assert-Contains $blogText $phrase "Blog index is missing risk-library context: $phrase"
}

$siteText = Get-VisibleText (($pages.Values | Where-Object { $_ }) -join "`n")
Assert-True ($siteText.IndexOf('Hyper Wallet', [System.StringComparison]::OrdinalIgnoreCase) -lt 0) 'Hyper Wallet must not appear anywhere in the revised site'

foreach ($claim in @(
    @{ Pattern = '100\s*%\s*secure'; Label = 'absolute security' },
    @{ Pattern = 'privacy\s+(?:is\s+)?guaranteed|guarantees?\s+privacy'; Label = 'guaranteed privacy' },
    @{ Pattern = '(?:solves?|covers?|mitigates?)\s+(?:all|every)\s+OWASP\s+risk'; Label = 'universal OWASP coverage' },
    @{ Pattern = '(?:complete|full)\s+OWASP\s+(?:coverage|protection)'; Label = 'complete OWASP coverage' },
    @{ Pattern = 'eliminates?\s+(?:all|every)\s+(?:AI|LLM|agentic)\s+risk'; Label = 'universal risk elimination' },
    @{ Pattern = 'blockchain\s+(?:proves?|verifies?|validates?)\s+(?:AI\s+)?(?:output|answer|truth)'; Label = 'blockchain AI-truth verification' },
    @{ Pattern = 'confidential\s+computing'; Label = 'confidential computing' },
    @{ Pattern = 'trusted\s+execution\s+environment|\bTEE(?:s)?\b'; Label = 'trusted execution environment' },
    @{ Pattern = 'homomorphic\s+encryption'; Label = 'homomorphic encryption' }
)) { Assert-NoAffirmativeClaim $siteText $claim.Pattern $claim.Label }

foreach ($confidential in @('fundrais(?:ing|e)', '\brunway\b', 'use\s+of\s+funds', 'revenue\s+projection', 'invest(?:ment|or)\s+ask')) {
    if ([regex]::IsMatch($siteText, $confidential, 'IgnoreCase')) { Add-Failure "Confidential finance material must not appear: $confidential" }
}

$css = Read-RequiredFile 'assets\wireframe.css'
$oatCss = Read-RequiredFile 'vendor\oat\oat.min.css'
$oatJs = Read-RequiredFile 'vendor\oat\oat.min.js'
if ($css) {
    Assert-Matches $css ':focus-visible\s*\{' 'Shared CSS must preserve visible keyboard focus'
    Assert-Matches $css '@media\s*\([^)]*max-width\s*:\s*(?:48rem|768px)' 'Shared CSS needs a mobile breakpoint at 48rem/768px'
    Assert-Matches $css '@media\s*\([^)]*prefers-reduced-motion\s*:\s*reduce' 'Shared CSS must respect reduced-motion preference'
    Assert-Matches $css '(overflow-wrap|word-break)\s*:' 'Shared CSS must wrap long content'
    foreach ($selector in @('.risk-funnel', '.funnel-stage', '.product-grid', '.service-grid')) {
        Assert-Contains $css $selector "Shared CSS is missing responsive layout hook $selector"
    }
    foreach ($remote in @('@import\s+(?:url\()?\s*[\x22\x27]?https?://', 'url\(\s*[\x22\x27]?https?://')) {
        if ([regex]::IsMatch($css, $remote, 'IgnoreCase')) { Add-Failure "Shared CSS contains a remote dependency: $remote" }
    }
}
if ($oatCss) { Assert-Matches $oatCss '(button|\[role=.?button.?\]|:root)' 'Vendored Oat CSS does not appear to contain component styles' }
if ($oatJs) { Assert-Matches $oatJs '(customElements|class|function|=>)' 'Vendored Oat JavaScript does not appear executable' }

if ($failures.Count -gt 0) {
    Write-Host "FAIL: Buckleson multi-page wireframe validation ($($failures.Count) assertion(s))" -ForegroundColor Red
    foreach ($failure in $failures) { Write-Host " - $failure" -ForegroundColor Red }
    exit 1
}

Write-Host 'PASS: Buckleson multi-page wireframe validation' -ForegroundColor Green
exit 0
