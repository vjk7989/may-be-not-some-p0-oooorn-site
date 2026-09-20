[CmdletBinding()]
param(
    [string]$OutRoot = (Join-Path $PSScriptRoot '..\out'),
    [ValidateSet('All', 'Content', 'Links', 'Seo')]
    [string]$Mode = 'All',
    [switch]$SelfTest
)

$ErrorActionPreference = 'Stop'
$CalendarUrl = 'https://cal.com/buckleson-group/30min'
$ArticleSlugs = @(
    'ai-agent-security',
    'prompt-injection-prevention',
    'secure-ai-inference',
    'llm-data-leakage',
    'excessive-agency',
    'ai-audit-trails'
)
$ProductSlugs = @('hyper-tern', 'hyper-abs', 'hyper-0x')
$Routes = @('/', '/products', '/services', '/about', '/blog') +
    @($ProductSlugs | ForEach-Object { "/products/$_" }) +
    @($ArticleSlugs | ForEach-Object { "/blog/$_" })
$failures = [System.Collections.Generic.List[string]]::new()

function Add-Failure([string]$Message) { $script:failures.Add($Message) }

function Get-VisibleText([string]$Html) {
    $value = [regex]::Replace($Html, '<(?:script|style|template)\b[^>]*>[\s\S]*?</(?:script|style|template)>', ' ', 'IgnoreCase')
    $value = [regex]::Replace($value, '<[^>]+>', ' ')
    $value = [System.Net.WebUtility]::HtmlDecode($value)
    return [regex]::Replace($value, '\s+', ' ').Trim()
}

function Get-Attribute([string]$Attributes, [string]$Name) {
    $match = [regex]::Match($Attributes, "(?:^|\s)$([regex]::Escape($Name))\s*=\s*([\x22\x27])([\s\S]*?)\1", 'IgnoreCase')
    if ($match.Success) { return $match.Groups[2].Value }
    return $null
}

function Get-TagAttributes([string]$Html, [string]$Tag) {
    return @([regex]::Matches($Html, "<$Tag\b([^>]*)>", 'IgnoreCase') | ForEach-Object { $_.Groups[1].Value })
}

function Get-MetaContent([string]$Html, [string]$Key, [string]$Value) {
    $results = @()
    foreach ($attrs in (Get-TagAttributes $Html 'meta')) {
        $actual = Get-Attribute $attrs $Key
        if ($null -ne $actual -and $actual.Equals($Value, [System.StringComparison]::OrdinalIgnoreCase)) {
            $results += (Get-Attribute $attrs 'content')
        }
    }
    return @($results)
}

function Get-CanonicalLinks([string]$Html) {
    $results = @()
    foreach ($attrs in (Get-TagAttributes $Html 'link')) {
        $rel = Get-Attribute $attrs 'rel'
        if ($null -ne $rel -and @($rel -split '\s+') -contains 'canonical') { $results += (Get-Attribute $attrs 'href') }
    }
    return @($results)
}

function Get-JsonLdBlocks([string]$Html) {
    return @([regex]::Matches($Html, '<script\b([^>]*)>([\s\S]*?)</script>', 'IgnoreCase') | Where-Object {
        (Get-Attribute $_.Groups[1].Value 'type') -eq 'application/ld+json'
    } | ForEach-Object { $_.Groups[2].Value.Trim() })
}

function Get-H1Texts([string]$Html) {
    return @([regex]::Matches($Html, '<h1\b[^>]*>([\s\S]*?)</h1>', 'IgnoreCase') | ForEach-Object { Get-VisibleText $_.Groups[1].Value })
}

function Test-PageMetadata([string]$Html, [string]$Route) {
    $issues = [System.Collections.Generic.List[string]]::new()
    $titles = @([regex]::Matches($Html, '<title\b[^>]*>([\s\S]*?)</title>', 'IgnoreCase') | ForEach-Object { Get-VisibleText $_.Groups[1].Value })
    if ($titles.Count -ne 1) { $issues.Add('title-count') }
    elseif ($titles[0].Length -lt 15 -or $titles[0].Length -gt 65) { $issues.Add('title-length') }

    $descriptions = @(Get-MetaContent $Html 'name' 'description')
    if ($descriptions.Count -ne 1) { $issues.Add('description-count') }
    elseif ($descriptions[0].Length -lt 70 -or $descriptions[0].Length -gt 170) { $issues.Add('description-length') }

    $canonicals = @(Get-CanonicalLinks $Html)
    if ($canonicals.Count -ne 1) { $issues.Add('canonical-count') }
    else {
        $uri = $null
        $valid = [System.Uri]::TryCreate($canonicals[0], [System.UriKind]::Absolute, [ref]$uri) -and
            $uri.Scheme -eq 'https' -and $uri.Host -notin @('localhost', '127.0.0.1')
        if (-not $valid) { $issues.Add('canonical-invalid') }
        elseif ($uri.AbsolutePath.TrimEnd('/') -ne $Route.TrimEnd('/')) { $issues.Add('canonical-route') }
    }

    $robots = @(Get-MetaContent $Html 'name' 'robots')
    if ($robots.Count -ne 1) { $issues.Add('robots-count') }
    elseif ($robots[0] -match '\bnoindex\b') { $issues.Add('robots-noindex') }

    $h1s = Get-H1Texts $Html
    if ($h1s.Count -ne 1 -or ($h1s.Count -eq 1 -and [string]::IsNullOrWhiteSpace($h1s[0]))) { $issues.Add('h1-count') }

    foreach ($block in (Get-JsonLdBlocks $Html)) {
        if ($block.Contains('<')) { $issues.Add('jsonld-raw-angle') }
        try { $null = $block | ConvertFrom-Json -Depth 50 }
        catch { $issues.Add('jsonld-invalid') }
    }
    return @($issues | Select-Object -Unique)
}

function Invoke-SelfTest {
    $fixturePath = Join-Path $PSScriptRoot 'fixtures\production-metadata-cases.json'
    if (-not (Test-Path -LiteralPath $fixturePath -PathType Leaf)) {
        Add-Failure "Missing validator fixture: $fixturePath"
    } else {
        $cases = Get-Content -LiteralPath $fixturePath -Raw -Encoding utf8 | ConvertFrom-Json
        foreach ($case in $cases) {
            $actual = @(Test-PageMetadata $case.html $case.route | Sort-Object)
            $expected = @($case.expectedIssues | Sort-Object)
            if (($actual -join ',') -ne ($expected -join ',')) {
                Add-Failure "Fixture '$($case.name)' expected [$($expected -join ',')] but received [$($actual -join ',')]"
            }
        }
    }
    if ($failures.Count -gt 0) {
        Write-Host "FAIL: production validator self-test ($($failures.Count) assertion(s))" -ForegroundColor Red
        $failures | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
        exit 1
    }
    Write-Host 'PASS: production validator self-test' -ForegroundColor Green
    exit 0
}

if ($SelfTest) { Invoke-SelfTest }

$resolvedOut = [System.IO.Path]::GetFullPath($OutRoot).TrimEnd([System.IO.Path]::DirectorySeparatorChar)
if (-not (Test-Path -LiteralPath $resolvedOut -PathType Container)) {
    Add-Failure "Static export directory does not exist: $resolvedOut"
}

function Resolve-RouteFile([string]$Route) {
    if ($Route -eq '/') { $candidates = @('index.html') }
    else {
        $clean = $Route.Trim('/') -replace '/', [System.IO.Path]::DirectorySeparatorChar
        $candidates = @("$clean.html", (Join-Path $clean 'index.html'))
    }
    foreach ($candidate in $candidates) {
        $path = Join-Path $resolvedOut $candidate
        if (Test-Path -LiteralPath $path -PathType Leaf) { return $path }
    }
    return $null
}

function Assert-Contains([string]$Text, [string]$Value, [string]$Message) {
    if ($Text.IndexOf($Value, [System.StringComparison]::OrdinalIgnoreCase) -lt 0) { Add-Failure $Message }
}

function Assert-Ordered([string]$Text, [string[]]$Values, [string]$Message) {
    $position = -1
    foreach ($value in $Values) {
        $next = $Text.IndexOf($value, $position + 1, [System.StringComparison]::OrdinalIgnoreCase)
        if ($next -lt 0) { Add-Failure "$Message (missing or out of order: $value)"; return }
        $position = $next
    }
}

function Get-JsonLdTypes($Value) {
    $types = [System.Collections.Generic.List[string]]::new()
    if ($null -eq $Value) { return @() }
    if ($Value -is [System.Collections.IEnumerable] -and $Value -isnot [string] -and $Value -isnot [pscustomobject]) {
        foreach ($item in $Value) { foreach ($type in (Get-JsonLdTypes $item)) { $types.Add($type) } }
    } elseif ($Value -is [pscustomobject]) {
        if ($Value.PSObject.Properties.Name -contains '@type') {
            foreach ($type in @($Value.'@type')) { if ($type) { $types.Add([string]$type) } }
        }
        foreach ($property in $Value.PSObject.Properties) {
            if ($property.Name -ne '@type') { foreach ($type in (Get-JsonLdTypes $property.Value)) { $types.Add($type) } }
        }
    }
    return @($types)
}

function Get-JsonLdNodes($Value) {
    $nodes = [System.Collections.Generic.List[object]]::new()
    if ($null -eq $Value) { return @() }
    if ($Value -is [System.Collections.IEnumerable] -and $Value -isnot [string] -and $Value -isnot [pscustomobject]) {
        foreach ($item in $Value) { foreach ($node in (Get-JsonLdNodes $item)) { $nodes.Add($node) } }
    } elseif ($Value -is [pscustomobject]) {
        if ($Value.PSObject.Properties.Name -contains '@type') { $nodes.Add($Value) }
        foreach ($property in $Value.PSObject.Properties) {
            if ($property.Name -ne '@type') { foreach ($node in (Get-JsonLdNodes $property.Value)) { $nodes.Add($node) } }
        }
    }
    return @($nodes)
}

$pages = @{}
$canonicalOrigin = $null
foreach ($route in $Routes) {
    $path = if (Test-Path -LiteralPath $resolvedOut -PathType Container) { Resolve-RouteFile $route } else { $null }
    if ($null -eq $path) { Add-Failure "Missing required route: $route"; continue }
    if ((Get-Item -LiteralPath $path).Length -eq 0) { Add-Failure "Required route is empty: $route ($path)"; continue }
    $html = Get-Content -LiteralPath $path -Raw -Encoding utf8
    $pages[$route] = @{ Html = $html; Path = $path; Text = (Get-VisibleText $html) }

    foreach ($issue in (Test-PageMetadata $html $route)) { Add-Failure "$route metadata issue: $issue" }
    if (-not [regex]::IsMatch($html, '^\s*<!doctype\s+html>', 'IgnoreCase')) { Add-Failure "$route needs an HTML5 doctype" }
    if (-not [regex]::IsMatch($html, '<html\b[^>]*\blang=[\x22\x27]en[\x22\x27]', 'IgnoreCase')) { Add-Failure "$route must declare lang=en" }
    if (-not [regex]::IsMatch($html, '<meta\b[^>]*charset=[\x22\x27]?utf-8', 'IgnoreCase')) { Add-Failure "$route must declare UTF-8" }
    foreach ($landmark in @('header', 'main', 'footer')) {
        if (-not [regex]::IsMatch($html, "<$landmark\b", 'IgnoreCase')) { Add-Failure "$route is missing <$landmark>" }
    }
    if (-not [regex]::IsMatch($html, '<main\b[^>]*\bid=[\x22\x27]main-content[\x22\x27]', 'IgnoreCase')) { Add-Failure "$route main must expose id=main-content" }
    if (-not [regex]::IsMatch($html, '<a\b[^>]*href=[\x22\x27]#main-content[\x22\x27]', 'IgnoreCase')) { Add-Failure "$route needs a skip link to #main-content" }
    if (-not [regex]::IsMatch($html, '<nav\b[^>]*aria-label=[\x22\x27][^\x22\x27]+[\x22\x27]', 'IgnoreCase')) { Add-Failure "$route needs a labelled navigation landmark" }

    foreach ($img in (Get-TagAttributes $html 'img')) {
        if ($null -eq (Get-Attribute $img 'alt')) { Add-Failure "$route contains an image without alt" }
        if ($null -eq (Get-Attribute $img 'width') -or $null -eq (Get-Attribute $img 'height')) { Add-Failure "$route image needs width and height to prevent layout shift" }
    }
    foreach ($anchor in [regex]::Matches($html, '<a\b([^>]*)>([\s\S]*?)</a>', 'IgnoreCase')) {
        $attrs = $anchor.Groups[1].Value
        $name = Get-VisibleText $anchor.Groups[2].Value
        if ([string]::IsNullOrWhiteSpace($name) -and [string]::IsNullOrWhiteSpace((Get-Attribute $attrs 'aria-label'))) { Add-Failure "$route contains a link without an accessible name" }
        if ($null -eq (Get-Attribute $attrs 'href')) { Add-Failure "$route contains a link without href" }
    }
    foreach ($button in [regex]::Matches($html, '<button\b([^>]*)>([\s\S]*?)</button>', 'IgnoreCase')) {
        if ([string]::IsNullOrWhiteSpace((Get-VisibleText $button.Groups[2].Value)) -and [string]::IsNullOrWhiteSpace((Get-Attribute $button.Groups[1].Value 'aria-label'))) { Add-Failure "$route contains a button without an accessible name" }
    }
    if ([regex]::IsMatch($html, '\son[a-z]+\s*=|(?:href|src)\s*=\s*[\x22\x27]javascript:', 'IgnoreCase')) { Add-Failure "$route contains unsafe inline behavior or a javascript URL" }

    $canon = @(Get-CanonicalLinks $html)
    if ($canon.Count -eq 1) {
        try {
            $origin = ([uri]$canon[0]).GetLeftPart([System.UriPartial]::Authority)
            if ($null -eq $canonicalOrigin) { $canonicalOrigin = $origin }
            elseif ($origin -ne $canonicalOrigin) { Add-Failure "$route canonical origin differs from $canonicalOrigin" }
        } catch { }
    }
    foreach ($requiredOg in @('og:title', 'og:description', 'og:url', 'og:type', 'og:image')) {
        if ((Get-MetaContent $html 'property' $requiredOg).Count -ne 1) { Add-Failure "$route requires exactly one $requiredOg meta tag" }
    }
}

if ($pages.ContainsKey('/')) {
    $homeTypes = @()
    foreach ($block in (Get-JsonLdBlocks $pages['/'].Html)) {
        try { foreach ($type in (Get-JsonLdTypes ($block | ConvertFrom-Json -Depth 50))) { $homeTypes += $type } } catch { }
    }
    foreach ($requiredType in @('Organization', 'WebSite')) {
        if (-not (@($homeTypes) -contains $requiredType)) { Add-Failure "Homepage needs $requiredType JSON-LD" }
    }
}

if ($pages.ContainsKey('/')) {
    $homePageText = $pages['/'].Text
    foreach ($phrase in @(
        'We help you use AI safely.',
        'A Trust & Execution Layer for AI Infrastructure.',
        'We secure how AI runs — not what AI thinks.',
        'Buckleson helps companies, organizations, and individual users connect AI to sensitive data, tools, applications, and devices within clearer protection, policy, and evidence boundaries.'
    )) { Assert-Contains $homePageText $phrase "Homepage is missing approved copy: $phrase" }
    $homeH1 = @(Get-H1Texts $pages['/'].Html)
    if ($homeH1.Count -eq 1 -and $homeH1[0].Length -gt 60) { Add-Failure "Homepage H1 exceeds 60 characters" }
    foreach ($phrase in @('Book a Security Assessment', 'Explore the platform', 'Protect information', 'Control execution', 'Preserve evidence')) {
        Assert-Contains $homePageText $phrase "Homepage is missing: $phrase"
    }
    foreach ($risk in @(
        'Prompt Injection', 'Sensitive Information Disclosure', 'Excessive Agency',
        'Intent Breaking & Goal Manipulation (Agentic T6)', 'Tool Misuse (Agentic T2)',
        'Memory Poisoning (Agentic T1)'
    )) { Assert-Contains $homePageText $risk "Homepage Risk Landscape is missing: $risk" }
    foreach ($section in @('Why Buckleson', 'Platform responsibilities', 'Products', 'Capabilities', 'Mission', 'AI risk scenarios', 'Engagement process', 'Company principles', 'Security FAQ', 'Field notes')) { Assert-Contains $homePageText $section "Homepage is missing section: $section" }
}

if ($pages.ContainsKey('/products')) {
    $text = $pages['/products'].Text
    foreach ($phrase in @(
        'Hyper Tern', 'routing', 'identity', 'permissions', 'policy', 'tools', 'action boundaries',
        'Hyper-ABS', 'masking', 'redaction', 'tokenization', 'abstraction', 'pre-inference',
        'Hyper-0x', 'in-house blockchain', 'tamper-evident', 'execution records', 'verification', 'audit', 'settlement',
        'Current', 'Designed for', 'quantum-resistant', 'four-layer encryption'
    )) {
        Assert-Contains $text $phrase "Products page is missing product/status content: $phrase"
    }
}
if ($pages.ContainsKey('/services')) {
    $text = $pages['/services'].Text
    foreach ($phrase in @('AI Security', 'Secure Inference', 'Custom AI', 'fine-tuning')) { Assert-Contains $text $phrase "Services page is missing: $phrase" }
    if (-not [regex]::IsMatch($text, '(?:protection|controls?).{0,140}(?:around|surrounding) inference|(?:around|surrounding) inference.{0,140}(?:protection|controls?)', 'IgnoreCase')) { Add-Failure 'Secure Inference must be described as protection/control around inference' }
}
if ($pages.ContainsKey('/about')) {
    $text = $pages['/about'].Text
    foreach ($phrase in @('Mission', 'How We Protect', 'Hyper-ABS', 'Hyper Tern', 'Hyper-0x', 'Current', 'pilot', 'Designed for', 'Vision', 'human')) {
        Assert-Contains $text $phrase "About page is missing protection/status/responsibility content: $phrase"
    }
}

$allText = (($pages.Values | ForEach-Object { $_.Text }) -join "`n")
foreach ($removed in @('Hyper Wallet', 'A controlled request path')) {
    if ($allText.IndexOf($removed, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) { Add-Failure "Removed content returned: $removed" }
}
foreach ($claim in @(
    @{ Pattern = '100\s*%\s*secure'; Label = 'absolute security' },
    @{ Pattern = 'privacy\s+(?:is\s+)?guaranteed|guarantees?\s+privacy'; Label = 'guaranteed privacy' },
    @{ Pattern = '(?:solves?|covers?|mitigates?)\s+(?:all|every)\s+OWASP'; Label = 'universal OWASP coverage' },
    @{ Pattern = 'eliminates?\s+(?:all|every)\s+(?:AI|LLM|agentic)\s+risk'; Label = 'universal risk elimination' },
    @{ Pattern = 'blockchain\s+(?:proves?|verifies?|validates?)\s+(?:AI\s+)?(?:output|answer|truth)'; Label = 'AI-truth verification' },
    @{ Pattern = 'confidential\s+computing|trusted\s+execution\s+environment|\bTEE(?:s)?\b|homomorphic\s+encryption'; Label = 'unsupported confidential-computing claim' }
)) {
    foreach ($match in [regex]::Matches($allText, $claim.Pattern, 'IgnoreCase')) {
        $start = [Math]::Max(0, $match.Index - 100)
        $prefix = $allText.Substring($start, $match.Index - $start)
        if (-not [regex]::IsMatch($prefix, '(?:\bnot\b|\bnever\b|\bwithout\b|does\s+not|do\s+not|is\s+not|are\s+not)[^.!?]{0,90}$', 'IgnoreCase')) {
            Add-Failure "Unsupported affirmative claim ($($claim.Label)): $($match.Value)"
        }
    }
}
foreach ($finance in @('fundrais(?:ing|e)', '\brunway\b', 'use\s+of\s+funds', 'revenue\s+projection', 'invest(?:ment|or)\s+ask')) {
    if ([regex]::IsMatch($allText, $finance, 'IgnoreCase')) { Add-Failure "Confidential finance content matched: $finance" }
}

foreach ($route in @('/', '/products', '/services', '/about')) {
    if (-not $pages.ContainsKey($route)) { continue }
    $calendarAnchors = @([regex]::Matches($pages[$route].Html, '<a\b([^>]*)>[\s\S]*?</a>', 'IgnoreCase') | Where-Object { (Get-Attribute $_.Groups[1].Value 'href') -eq $CalendarUrl })
    if ($calendarAnchors.Count -lt 1) { Add-Failure "$route needs an assessment CTA to $CalendarUrl" }
    foreach ($anchor in $calendarAnchors) {
        $target = Get-Attribute $anchor.Groups[1].Value 'target'
        if ($null -ne $target -and $target -ne '_self') { Add-Failure "$route calendar CTA must open in the same tab" }
    }
}

if ($pages.ContainsKey('/blog')) {
    foreach ($slug in $ArticleSlugs) {
        if (-not [regex]::IsMatch($pages['/blog'].Html, "href=[\x22\x27][^\x22\x27]*$([regex]::Escape($slug))/?[\x22\x27]", 'IgnoreCase')) { Add-Failure "Blog index must link to article: $slug" }
    }
}
$expectedArticleTitles = @{
    'ai-agent-security' = 'AI Agent Security: A Practical Guide to Data, Tools, and Actions'
    'prompt-injection-prevention' = 'Prompt Injection Prevention for AI Agents'
    'secure-ai-inference' = 'Secure AI Inference: Protecting Data Around Model Execution'
    'llm-data-leakage' = 'LLM Data Leakage: How Sensitive Information Reaches AI Systems'
    'excessive-agency' = 'Excessive Agency: Applying Least Privilege to AI Agents'
    'ai-audit-trails' = 'AI Audit Trails for Agent Actions: What to Record and Why'
}
foreach ($slug in $ArticleSlugs) {
    $route = "/blog/$slug"
    if (-not $pages.ContainsKey($route)) { continue }
    $html = $pages[$route].Html
    $articleH1 = @(Get-H1Texts $html)
    if ($articleH1.Count -eq 1 -and $articleH1[0] -ne $expectedArticleTitles[$slug]) { Add-Failure "$route must use the approved article title" }
    $types = @()
    $nodes = @()
    foreach ($block in (Get-JsonLdBlocks $html)) {
        try {
            $parsed = $block | ConvertFrom-Json -Depth 50
            foreach ($type in (Get-JsonLdTypes $parsed)) { $types += $type }
            foreach ($node in (Get-JsonLdNodes $parsed)) { $nodes += $node }
        } catch { }
    }
    if (-not (@($types) -contains 'Article' -or @($types) -contains 'BlogPosting')) { Add-Failure "$route needs Article or BlogPosting JSON-LD" }
    if (-not (@($types) -contains 'BreadcrumbList')) { Add-Failure "$route needs BreadcrumbList JSON-LD" }
    $articleNodes = @($nodes | Where-Object { @($_.'@type') -contains 'Article' -or @($_.'@type') -contains 'BlogPosting' })
    if ($articleNodes.Count -eq 1) {
        $h1 = @(Get-H1Texts $html)
        if ($h1.Count -eq 1 -and $articleNodes[0].headline -ne $h1[0]) { Add-Failure "$route Article headline must match its H1" }
        if ([string]$articleNodes[0].datePublished -notmatch '^\d{4}-\d{2}-\d{2}$') { Add-Failure "$route Article datePublished must be a fixed ISO date" }
    }
    $hasProductOrServiceLink = [regex]::IsMatch($html, 'href=[\x22\x27]/(?:products|services)/?[\x22\x27]', 'IgnoreCase')
    if (-not $hasProductOrServiceLink) { Add-Failure "$route needs an internal link to the relevant Products or Services page" }
    if ($pages[$route].Text.Length -lt 1200) { Add-Failure "$route article content is too thin (minimum 1200 visible characters)" }
}

if (Test-Path -LiteralPath $resolvedOut -PathType Container) {
    foreach ($route in $Routes) {
        if (-not $pages.ContainsKey($route)) { continue }
        $html = $pages[$route].Html
        foreach ($tag in [regex]::Matches($html, '<(?:a|img|script|link)\b([^>]*)>', 'IgnoreCase')) {
            $attrs = $tag.Groups[1].Value
            $reference = Get-Attribute $attrs 'href'
            if ($null -eq $reference) { $reference = Get-Attribute $attrs 'src' }
            if ([string]::IsNullOrWhiteSpace($reference) -or $reference.StartsWith('#')) { continue }
            if ($reference -match '^https://') { continue }
            if ($reference -match '^(?:mailto:|tel:)') { continue }
            if ($reference -match '^(?:http:|//|data:|javascript:)') { Add-Failure "$route contains unsafe/non-HTTPS reference: $reference"; continue }
            $pathPart = ($reference -split '[?#]', 2)[0]
            if ([string]::IsNullOrWhiteSpace($pathPart)) { continue }
            if ($pathPart.StartsWith('/')) {
                $local = Join-Path $resolvedOut ($pathPart.TrimStart('/') -replace '/', [System.IO.Path]::DirectorySeparatorChar)
            } else {
                $local = [System.IO.Path]::GetFullPath((Join-Path (Split-Path -Parent $pages[$route].Path) ($pathPart -replace '/', [System.IO.Path]::DirectorySeparatorChar)))
            }
            $inside = $local.StartsWith($resolvedOut + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)
            if (-not $inside) { Add-Failure "$route reference escapes out/: $reference"; continue }
            if (-not (Test-Path -LiteralPath $local -PathType Leaf)) {
                $asRoute = if ($pathPart.StartsWith('/')) { $pathPart } else { $null }
                if ($null -eq $asRoute -or $null -eq (Resolve-RouteFile (($asRoute -split '[?#]', 2)[0]))) { Add-Failure "$route has a broken local reference: $reference" }
            }
        }
        foreach ($tag in [regex]::Matches($html, '<script\b([^>]*)>', 'IgnoreCase')) {
            $attrs = $tag.Groups[1].Value
            $reference = Get-Attribute $attrs 'src'
            if ($reference -match '^(?:https?:)?//') { Add-Failure "$route loads a remote script, stylesheet, or font: $reference" }
        }
        foreach ($tag in [regex]::Matches($html, '<link\b([^>]*)>', 'IgnoreCase')) {
            $attrs = $tag.Groups[1].Value
            $rel = Get-Attribute $attrs 'rel'
            $reference = Get-Attribute $attrs 'href'
            $loadsResource = @($rel -split '\s+') | Where-Object { $_ -in @('stylesheet', 'preload', 'modulepreload', 'prefetch') }
            if ($loadsResource.Count -gt 0 -and $reference -match '^(?:https?:)?//') { Add-Failure "$route loads a remote script, stylesheet, or font: $reference" }
        }
    }
}

foreach ($asset in @(
    @{ Name = 'buckleson-logo.jpg'; Hash = '19C1C8EA72D395660AD59BFB05BBBD02F3473DE2C614D4740B3B2F67C1CD3481' },
    @{ Name = 'hyper-0x-logo.png'; Hash = 'D54E012E3A323D284E5CF0AB9A41522F89A92B3AA3DF4D10316E5A06B267B6F8' }
)) {
    $matches = @(Get-ChildItem -LiteralPath $resolvedOut -Recurse -File -Filter $asset.Name -ErrorAction SilentlyContinue)
    if ($matches.Count -ne 1) { Add-Failure "Expected exactly one exported $($asset.Name); found $($matches.Count)" }
    elseif ((Get-FileHash -LiteralPath $matches[0].FullName -Algorithm SHA256).Hash -ne $asset.Hash) { Add-Failure "$($asset.Name) hash changed" }
}

$cssFiles = @(Get-ChildItem -LiteralPath $resolvedOut -Recurse -File -Filter '*.css' -ErrorAction SilentlyContinue)
if ($cssFiles.Count -eq 0) { Add-Failure 'Static export contains no CSS' }
else {
    $css = ($cssFiles | ForEach-Object { Get-Content -LiteralPath $_.FullName -Raw -Encoding utf8 }) -join "`n"
    if (-not [regex]::IsMatch($css, ':focus-visible', 'IgnoreCase')) { Add-Failure 'CSS must preserve visible keyboard focus' }
    if (-not [regex]::IsMatch($css, '@media\s*\([^)]*prefers-reduced-motion\s*:\s*reduce', 'IgnoreCase')) { Add-Failure 'CSS must include a reduced-motion mode' }
    if (-not [regex]::IsMatch($css, '@media\s*\([^)]*(?:max-width|min-width)', 'IgnoreCase')) { Add-Failure 'CSS must include a responsive breakpoint' }
    if ([regex]::IsMatch($css, '@import\s+(?:url\()?\s*[\x22\x27]?https?://|url\(\s*[\x22\x27]?https?://', 'IgnoreCase')) { Add-Failure 'CSS must not load remote styles, fonts, or images' }
}

foreach ($file in @('robots.txt', 'sitemap.xml')) {
    $path = Join-Path $resolvedOut $file
    if (-not (Test-Path -LiteralPath $path -PathType Leaf) -or (Get-Item -LiteralPath $path -ErrorAction SilentlyContinue).Length -eq 0) { Add-Failure "Missing or empty $file" }
}
$sitemapPath = Join-Path $resolvedOut 'sitemap.xml'
if (Test-Path -LiteralPath $sitemapPath -PathType Leaf) {
    $sitemap = Get-Content -LiteralPath $sitemapPath -Raw -Encoding utf8
    foreach ($route in $Routes) {
        if (-not [regex]::IsMatch($sitemap, "<loc>https://[^<]+$([regex]::Escape($route.TrimEnd('/')))/?</loc>", 'IgnoreCase')) { Add-Failure "sitemap.xml is missing route: $route" }
    }
}

if ($failures.Count -gt 0) {
    Write-Host "FAIL: Buckleson production website validation ($($failures.Count) assertion(s))" -ForegroundColor Red
    $failures | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
    exit 1
}
Write-Host 'PASS: Buckleson production website validation' -ForegroundColor Green
exit 0
