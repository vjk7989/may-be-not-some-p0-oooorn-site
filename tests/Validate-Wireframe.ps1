[CmdletBinding()]
param(
    [string]$DistRoot = (Join-Path $PSScriptRoot '..\dist')
)

$ErrorActionPreference = 'Stop'
$resolvedDist = [System.IO.Path]::GetFullPath($DistRoot)
$failures = [System.Collections.Generic.List[string]]::new()

function Add-Failure {
    param([string]$Message)
    $script:failures.Add($Message)
}

function Assert-True {
    param(
        [bool]$Condition,
        [string]$Message
    )
    if (-not $Condition) {
        Add-Failure $Message
    }
}

function Read-RequiredFile {
    param([string]$RelativePath)
    $path = Join-Path $resolvedDist $RelativePath
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        Add-Failure "Missing required file: $path"
        return ''
    }
    $item = Get-Item -LiteralPath $path
    if ($item.Length -eq 0) {
        Add-Failure "Required file is empty: $path"
        return ''
    }
    return Get-Content -LiteralPath $path -Raw
}

function Assert-Contains {
    param(
        [string]$Text,
        [string]$Literal,
        [string]$Label
    )
    Assert-True ($Text.IndexOf($Literal, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) "Missing ${Label}: $Literal"
}

function Assert-Matches {
    param(
        [string]$Text,
        [string]$Pattern,
        [string]$Message
    )
    Assert-True ([regex]::IsMatch($Text, $Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) $Message
}

function Assert-NoAffirmativeClaim {
    param(
        [string]$Text,
        [string]$Pattern,
        [string]$Label
    )

    foreach ($match in [regex]::Matches($Text, $Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
        $prefixStart = [Math]::Max(0, $match.Index - 100)
        $prefix = $Text.Substring($prefixStart, $match.Index - $prefixStart)
        $isNegated = [regex]::IsMatch(
            $prefix,
            '(?:\bnot\b|\bnever\b|\bwithout\b|\bdoes\s+not\b|\bdo\s+not\b|\bis\s+not\b|\bare\s+not\b)[^.!?]{0,80}$',
            [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
        )
        if (-not $isNegated) {
            Add-Failure "Affirmative unsupported claim matched ($Label): $($match.Value)"
        }
    }
}

$html = Read-RequiredFile 'index.html'
$css = Read-RequiredFile 'assets\wireframe.css'
$oatCss = Read-RequiredFile 'vendor\oat\oat.min.css'
$oatJs = Read-RequiredFile 'vendor\oat\oat.min.js'

if ($html.Length -gt 0) {
    Assert-Matches $html '^\s*<!doctype\s+html>' 'index.html must start with an HTML5 doctype'
    Assert-Matches $html '<html\b[^>]*\blang=[\x22\x27]en[\x22\x27]' 'The root html element must declare lang="en"'
    Assert-Matches $html '<meta\b[^>]*charset=[\x22\x27]?utf-8' 'A UTF-8 charset declaration is required'
    Assert-Matches $html '<meta\b[^>]*name=[\x22\x27]viewport[\x22\x27][^>]*content=[\x22\x27][^\x22\x27]*width=device-width' 'A responsive viewport meta tag is required'
    Assert-Matches $html '<title>[^<]*Buckleson[^<]*Wireframe[^<]*</title>' 'The title must identify the Buckleson wireframe'

    $h1Count = [regex]::Matches($html, '<h1\b', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Count
    Assert-True ($h1Count -eq 1) "Expected exactly one h1; found $h1Count"

    foreach ($landmark in @('header', 'nav', 'main', 'footer')) {
        Assert-Matches $html "<$landmark\b" "Missing semantic <$landmark> landmark"
    }

    foreach ($id in @(
        'main-content', 'platform', 'risks', 'outcomes', 'how-it-works',
        'products', 'services', 'assessment', 'industries', 'risk-library',
        'traction', 'company', 'contact', 'wireframe-notice'
    )) {
        Assert-Matches $html "\bid=[\x22\x27]$([regex]::Escape($id))[\x22\x27]" "Missing required section or anchor id: $id"
    }

    foreach ($phrase in @(
        'Control what AI can access', 'Govern what it can do', 'Prove what happened',
        'Hyper Tern', 'Hyper-ABS', 'Hyper-0x', 'Hyper Wallet',
        'AI Security', 'Secure Inference', 'Custom AI',
        'Book a Security Assessment', 'Healthcare', 'Genomics',
        'Insurance &amp; Risk', 'Enterprise Copilots',
        'helps reduce', 'controls', 'supports auditability',
        'Current capability', 'Designed for', 'Long-term vision',
        'Prompt Injection', 'Sensitive Information Disclosure', 'Excessive Agency',
        'Intent Breaking &amp; Goal Manipulation', 'Agentic T6',
        'Tool Misuse', 'Agentic T2', 'Memory Poisoning', 'Agentic T1'
    )) {
        Assert-Contains $html $phrase 'required approved copy'
    }

    Assert-Matches $html 'Hyper-0x[\s\S]{0,500}in-house blockchain|in-house blockchain[\s\S]{0,500}Hyper-0x' "Hyper-0x must be identified as Buckleson's in-house blockchain"
    foreach ($term in @('verification', 'audit', 'settlement')) {
        Assert-Matches $html "Hyper-0x[\s\S]{0,1000}$term|$term[\s\S]{0,1000}Hyper-0x" "Hyper-0x copy must mention $term"
    }
    Assert-Matches $html 'Secure Inference[\s\S]{0,600}(around|surrounding) inference' 'Secure Inference must be described as protection/control around inference'

    foreach ($claim in @(
        @{ Pattern = '100\s*%\s*secure'; Label = 'absolute security' },
        @{ Pattern = 'privacy\s+(?:is\s+)?guaranteed|guarantees?\s+privacy'; Label = 'guaranteed privacy' },
        @{ Pattern = 'solves?\s+(?:all|every)\s+OWASP\s+risk'; Label = 'universal OWASP coverage' },
        @{ Pattern = 'eliminates?\s+(?:all|every)\s+(?:AI|LLM|agentic)\s+risk'; Label = 'universal risk elimination' },
        @{ Pattern = 'confidential\s+computing'; Label = 'confidential computing' },
        @{ Pattern = 'trusted\s+execution\s+environment|\bTEE(?:s)?\b'; Label = 'trusted execution environment' },
        @{ Pattern = 'homomorphic\s+encryption'; Label = 'homomorphic encryption' }
    )) {
        Assert-NoAffirmativeClaim $html $claim.Pattern $claim.Label
    }

    foreach ($confidentialTerm in @('fundrais(?:ing|e)', '\brunway\b', 'use\s+of\s+funds', 'revenue\s+projection')) {
        if ([regex]::IsMatch($html, $confidentialTerm, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
            Add-Failure "Confidential finance material must not appear: $confidentialTerm"
        }
    }

    Assert-Matches $html '<link\b[^>]*href=[\x22\x27](?:\./)?vendor/oat/oat\.min\.css[\x22\x27]' 'index.html must load the local Oat stylesheet'
    Assert-Matches $html '<link\b[^>]*href=[\x22\x27](?:\./)?assets/wireframe\.css[\x22\x27]' 'index.html must load the local wireframe stylesheet'
    Assert-Matches $html '<script\b[^>]*src=[\x22\x27](?:\./)?vendor/oat/oat\.min\.js[\x22\x27][^>]*\bdefer\b|<script\b[^>]*\bdefer\b[^>]*src=[\x22\x27](?:\./)?vendor/oat/oat\.min\.js[\x22\x27]' 'index.html must load the local Oat script with defer'

    foreach ($remotePattern in @(
        '<(?:script|link)\b[^>]*(?:src|href)=[\x22\x27]https?://',
        '<link\b[^>]*rel=[\x22\x27](?:preconnect|dns-prefetch)[\x22\x27]',
        '@import\s+(?:url\()?\s*[\x22\x27]?https?://',
        'url\(\s*[\x22\x27]?https?://'
    )) {
        if ([regex]::IsMatch("$html`n$css", $remotePattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
            Add-Failure "Remote asset dependency is not allowed: $remotePattern"
        }
    }

    foreach ($unsafePattern in @('\son[a-z]+\s*=', '(?:href|src)\s*=\s*[\x22\x27]javascript:', '<script\b(?![^>]*\bsrc=)')) {
        if ([regex]::IsMatch($html, $unsafePattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
            Add-Failure "Unsafe inline behavior is not allowed: $unsafePattern"
        }
    }

    $ids = [regex]::Matches($html, '\bid=[\x22\x27]([^\x22\x27]+)[\x22\x27]', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase) |
        ForEach-Object { $_.Groups[1].Value }
    foreach ($duplicate in ($ids | Group-Object | Where-Object Count -gt 1)) {
        Add-Failure "Duplicate id: $($duplicate.Name)"
    }

    $fragmentLinks = [regex]::Matches($html, '\bhref=[\x22\x27]#([^\x22\x27]*)[\x22\x27]', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    foreach ($match in $fragmentLinks) {
        $target = $match.Groups[1].Value
        if ([string]::IsNullOrWhiteSpace($target)) {
            Add-Failure 'Empty fragment link href="#" is not allowed'
        } elseif ($ids -notcontains $target) {
            Add-Failure "Broken internal fragment link: #$target"
        }
    }

    foreach ($anchorMatch in [regex]::Matches($html, '<a\b([^>]*)>([\s\S]*?)</a>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
        $attributes = $anchorMatch.Groups[1].Value
        $text = [regex]::Replace($anchorMatch.Groups[2].Value, '<[^>]+>', '').Trim()
        $hasAccessibleName = $text.Length -gt 0 -or [regex]::IsMatch($attributes, '\baria-label=[\x22\x27][^\x22\x27]+[\x22\x27]', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        Assert-True $hasAccessibleName 'Every link must have visible text or an aria-label'
    }

    foreach ($imgMatch in [regex]::Matches($html, '<img\b([^>]*)>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
        Assert-True ([regex]::IsMatch($imgMatch.Groups[1].Value, '\balt=[\x22\x27][^\x22\x27]+[\x22\x27]', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) 'Every image must have non-empty alt text'
    }

    Assert-Matches $html '<a\b[^>]*class=[\x22\x27][^\x22\x27]*skip-link[^\x22\x27]*[\x22\x27][^>]*href=[\x22\x27]#main-content[\x22\x27]|<a\b[^>]*href=[\x22\x27]#main-content[\x22\x27][^>]*class=[\x22\x27][^\x22\x27]*skip-link' 'A skip link targeting #main-content is required'
    foreach ($diagramId in @('platform-diagram', 'risk-diagram')) {
        Assert-Matches $html "<figure\b[^>]*\bid=[\x22\x27]$diagramId[\x22\x27][^>]*\baria-labelledby=[\x22\x27][^\x22\x27]+[\x22\x27]" "The $diagramId figure must have an accessible name"
    }
    $figureCount = [regex]::Matches($html, '<figure\b', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Count
    $captionCount = [regex]::Matches($html, '<figcaption\b', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Count
    Assert-True ($figureCount -ge 2 -and $captionCount -ge $figureCount) 'Every diagram figure must include a figcaption'

    $stepCount = [regex]::Matches($html, '\bdata-step=[\x22\x27][1-6][\x22\x27]', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Count
    Assert-True ($stepCount -eq 6) "Controlled-execution flow must expose exactly six data-step hooks; found $stepCount"
}

if ($css.Length -gt 0) {
    Assert-Matches $css ':root\s*\{' 'wireframe.css must define root theme variables'
    foreach ($variable in @('--action-purple', '--verified-green')) {
        Assert-Contains $css $variable 'required semantic color variable'
    }
    Assert-Matches $css ':focus-visible\s*\{' 'Visible keyboard focus styling is required'
    Assert-Matches $css '@media\s*\([^)]*max-width\s*:\s*(?:48rem|768px)' 'A mobile breakpoint at 48rem/768px is required'
    Assert-Matches $css '@media\s*\([^)]*prefers-reduced-motion\s*:\s*reduce' 'Reduced-motion handling is required'
    Assert-Matches $css '(overflow-wrap|word-break)\s*:' 'Long copy must have an overflow-wrapping rule'
    foreach ($selector in @('.platform-diagram', '.risk-diagram', '.outcome-grid', '.product-grid', '.service-grid')) {
        Assert-Contains $css $selector 'required responsive layout selector'
    }
}

if ($oatCss.Length -gt 0) {
    Assert-Matches $oatCss '(button|\[role=.?button.?\]|:root)' 'Vendored Oat CSS does not appear to contain semantic component styles'
}
if ($oatJs.Length -gt 0) {
    Assert-Matches $oatJs '(customElements|class|function|=>)' 'Vendored Oat JavaScript does not appear to contain executable library code'
}

if ($failures.Count -gt 0) {
    Write-Host "FAIL: Buckleson wireframe validation ($($failures.Count) assertion(s))" -ForegroundColor Red
    foreach ($failure in $failures) {
        Write-Host " - $failure" -ForegroundColor Red
    }
    exit 1
}

Write-Host 'PASS: Buckleson wireframe validation' -ForegroundColor Green
exit 0
