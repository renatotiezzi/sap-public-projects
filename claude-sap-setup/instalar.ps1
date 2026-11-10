<#
  SETUP do modo de trabalho (Windows). Rode na pasta deste repositório:

    powershell -ExecutionPolicy Bypass -File .\instalar.ps1 [-Destino C:\Trabalho] [-Mcp] [-SemPrereqs] [-Forcar]

  1. Pré-requisitos pelo winget: Git, Node.js (>= 22), GitHub CLI, Python 3.12, VS Code; o Claude Code pelo instalador oficial.
  2. As extensões do VS Code (workspace/.vscode/extensions.json).
  3. O resto pelo instalar.js: o espaço de trabalho, o ~/.claude (regras, skills, mod), os MCPs (-Mcp) e a conferência.
#>
param(
  [string]$Destino = (Join-Path $env:USERPROFILE 'Trabalho'),
  [switch]$Mcp,
  [switch]$SemPrereqs,
  [switch]$Forcar
)
$ErrorActionPreference = 'Stop'
$aqui = Split-Path -Parent $MyInvocation.MyCommand.Path

function Tem($cmd) { return [bool](Get-Command $cmd -ErrorAction SilentlyContinue) }
function Recarregar-Path {
  $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
}
function Winget($id, $cmd) {
  if (Tem $cmd) { Write-Host "  ok  $cmd" ; return }
  if (-not (Tem 'winget')) { Write-Host "  FALTA $cmd (sem winget: instale $id à mão)" -ForegroundColor Yellow; return }
  Write-Host "  instalando $id ..."
  winget install --id $id -e --silent --accept-package-agreements --accept-source-agreements | Out-Null
  Recarregar-Path
  if (Tem $cmd) { Write-Host "  ok  $cmd" } else { Write-Host "  $cmd instalado; abra um terminal novo se ele não aparecer" -ForegroundColor Yellow }
}

if (-not $SemPrereqs) {
  Write-Host "`nPré-requisitos"
  Winget 'Git.Git' 'git'
  Winget 'OpenJS.NodeJS.LTS' 'node'
  Winget 'GitHub.cli' 'gh'
  Winget 'Python.Python.3.12' 'python'
  Winget 'Microsoft.VisualStudioCode' 'code'
  if (Tem 'node') {
    $maior = [int]((node -v).TrimStart('v').Split('.')[0])
    if ($maior -lt 22) { Write-Host "  O Node é v$maior; os motores pedem >= 22 (winget upgrade OpenJS.NodeJS.LTS)" -ForegroundColor Yellow }
  }
  if (-not (Tem 'claude')) {
    Write-Host '  instalando o Claude Code (instalador oficial) ...'
    Invoke-RestMethod https://claude.ai/install.ps1 | Invoke-Expression
    Recarregar-Path
  } else { Write-Host '  ok  claude' }

  if (Tem 'code') {
    Write-Host "`nExtensões do VS Code"
    $ext = (Get-Content (Join-Path $aqui 'workspace\.vscode\extensions.json') -Raw | ConvertFrom-Json).recommendations
    $ja = @(code --list-extensions)
    foreach ($e in $ext) {
      if ($ja -contains $e) { Write-Host "  ok  $e"; continue }
      code --install-extension $e --force | Out-Null
      Write-Host "  +   $e"
    }
  }
}

if (-not (Tem 'node')) { throw 'Sem o Node não dá para seguir: instale o Node.js >= 22 e rode de novo.' }

Write-Host ''
$argsJs = @((Join-Path $aqui 'instalar.js'), '--destino', $Destino)
if ($Mcp) { $argsJs += '--mcp' }
if ($Forcar) { $argsJs += '--forcar' }
node @argsJs
$codigo = $LASTEXITCODE

Write-Host @"

Próximos passos (à mão, uma vez):
  1. gh auth login                       (o board.js fala com o GitHub pelo seu login)
  2. claude                              (login na sua conta; os conectores do claude.ai vêm junto)
  3. O app Speed Up: instale pela página de download, cadastre as conexões SAP e use "Conectar IA -> Claude Code"
  4. Abra o espaço: code "$Destino"     e o primeiro GAP:  peça ao Claude "nova demanda GAP_<numero>"
"@
exit $codigo
