<#
  Um comando na máquina nova (PowerShell):

    irm https://raw.githubusercontent.com/renatotiezzi/sap-public-projects/main/claude-sap-setup/baixar.ps1 | iex

  Baixa o SETUP para %USERPROFILE%\claude-sap-setup e roda o instalar.ps1 (pré-requisitos, espaço em
  %USERPROFILE%\Trabalho, regras, skills, mod e MCPs). Para outro destino: $env:SETUP_DESTINO = 'C:\Trabalho' antes.
#>
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$repo = 'renatotiezzi/sap-public-projects'
$sub = 'claude-sap-setup'
$pasta = if ($env:SETUP_PASTA) { $env:SETUP_PASTA } else { Join-Path $env:USERPROFILE 'claude-sap-setup' }
$destino = if ($env:SETUP_DESTINO) { $env:SETUP_DESTINO } else { Join-Path $env:USERPROFILE 'Trabalho' }
$zip = Join-Path $env:TEMP 'claude-sap-setup.zip'

Write-Host "Baixando github.com/$repo ..."
Invoke-WebRequest -UseBasicParsing "https://github.com/$repo/archive/refs/heads/main.zip" -OutFile $zip
# Só a pasta do SETUP sai do ZIP (o Expand-Archive do PowerShell 5.1 aborta com nome acentuado de outra pasta do repositório).
Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path $pasta) { Remove-Item $pasta -Recurse -Force }
$arquivo = [IO.Compression.ZipFile]::OpenRead($zip)
try {
  $n = 0
  foreach ($e in $arquivo.Entries) {
    $partes = $e.FullName -split '/', 3
    if ($partes.Count -lt 3 -or $partes[1] -ne $sub -or $partes[2] -eq '') { continue }
    $alvo = Join-Path $pasta ($partes[2] -replace '/', '\')
    if ($e.FullName.EndsWith('/')) { New-Item -ItemType Directory -Force $alvo | Out-Null; continue }
    New-Item -ItemType Directory -Force (Split-Path $alvo -Parent) | Out-Null
    [IO.Compression.ZipFileExtensions]::ExtractToFile($e, $alvo, $true)
    $n++
  }
} finally { $arquivo.Dispose() }
Remove-Item $zip -Force -ErrorAction SilentlyContinue
if (-not (Test-Path (Join-Path $pasta 'instalar.ps1'))) { throw "Não achei $sub no pacote baixado." }
Write-Host "SETUP em $pasta ($n arquivos)"
if ($env:SETUP_SO_BAIXAR) { return }

powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $pasta 'instalar.ps1') -Destino $destino -Mcp
