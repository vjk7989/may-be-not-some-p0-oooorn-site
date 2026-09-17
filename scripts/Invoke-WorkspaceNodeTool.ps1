[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateSet('npm', 'npx')]
    [string] $Tool,

    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $ToolArguments
)

$ErrorActionPreference = 'Stop'

$workspaceRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
if ($IsWindows) {
    $requiredRoot = [IO.Path]::GetFullPath('D:\high-quality')
    if (-not $workspaceRoot.Equals($requiredRoot, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Workspace Node tools may run only from $requiredRoot; resolved $workspaceRoot"
    }
} elseif ($env:GITHUB_WORKSPACE) {
    $requiredRoot = [IO.Path]::GetFullPath($env:GITHUB_WORKSPACE)
    if (-not $workspaceRoot.Equals($requiredRoot, [StringComparison]::Ordinal)) {
        throw "CI Node tools may run only from $requiredRoot; resolved $workspaceRoot"
    }
}

$cachePath = Join-Path $workspaceRoot '.cache\npm'
$tempPath = Join-Path $workspaceRoot '.tmp'
$userConfigPath = Join-Path $workspaceRoot '.npmrc'

New-Item -ItemType Directory -Force -Path $cachePath, $tempPath | Out-Null

$env:NPM_CONFIG_CACHE = $cachePath
$env:NPM_CONFIG_USERCONFIG = $userConfigPath
$env:TEMP = $tempPath
$env:TMP = $tempPath

$commandPath = if ($IsWindows) {
    $nodeDirectory = Join-Path ([Environment]::GetFolderPath([Environment+SpecialFolder]::ProgramFiles)) 'nodejs'
    Join-Path $nodeDirectory ($Tool + '.cmd')
} else {
    (Get-Command $Tool -CommandType Application -ErrorAction Stop |
        Select-Object -First 1).Source
}

& $commandPath @ToolArguments
exit $LASTEXITCODE
