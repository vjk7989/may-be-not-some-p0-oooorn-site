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
$requiredRoot = [IO.Path]::GetFullPath('D:\high-quality')
if (-not $workspaceRoot.Equals($requiredRoot, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Workspace Node tools may run only from $requiredRoot; resolved $workspaceRoot"
}

$cachePath = Join-Path $workspaceRoot '.cache\npm'
$tempPath = Join-Path $workspaceRoot '.tmp'
$userConfigPath = Join-Path $workspaceRoot '.npmrc'

New-Item -ItemType Directory -Force -Path $cachePath, $tempPath | Out-Null

$env:NPM_CONFIG_CACHE = $cachePath
$env:NPM_CONFIG_USERCONFIG = $userConfigPath
$env:TEMP = $tempPath
$env:TMP = $tempPath

$nodeDirectory = Join-Path (
    [Environment]::GetFolderPath([Environment+SpecialFolder]::ProgramFiles)
) 'nodejs'
$commandPath = Join-Path $nodeDirectory ($Tool + '.cmd')

if (-not (Test-Path -LiteralPath $commandPath -PathType Leaf)) {
    throw "Unsupported or unavailable Node tool: $Tool"
}

& $commandPath @ToolArguments
exit $LASTEXITCODE
