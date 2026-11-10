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
$pasta = Join-Path $env:USERPROFILE 'claude-sap-setup'
$destino = if ($env:SETUP_DESTINO) { $env:SETUP_DESTINO } else { Join-Path $env:USERPROFILE 'Trabalho' }
$zip = Join-Path $env:TEMP 'claude-sap-setup.zip'
$tmp = Join-Path $env:TEMP 'claude-sap-setup-extraido'

Write-Host "Baixando github.com/$repo ..."
Invoke-WebRequest -UseBasicParsing "https://github.com/$repo/archive/refs/heads/main.zip" -OutFile $zip
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
Expand-Archive $zip -DestinationPath $tmp -Force
$raiz = Join-Path (Get-ChildItem $tmp -Directory | Select-Object -First 1).FullName $sub
if (-not (Test-Path (Join-Path $raiz 'instalar.ps1'))) { throw "Não achei $sub no pacote baixado." }
if (Test-Path $pasta) { Remove-Item $pasta -Recurse -Force }
Move-Item $raiz $pasta
Remove-Item $zip, $tmp -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "SETUP em $pasta"

powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $pasta 'instalar.ps1') -Destino $destino -Mcp
