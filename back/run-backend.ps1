# Script para ejecutar el backend de My Balance
Write-Host "Iniciando el backend de My Balance..." -ForegroundColor Green

# Cambiar al directorio del script
Set-Location $PSScriptRoot

# Ejecutar el backend
& "C:\Program Files\dotnet\dotnet.exe" run --project MyBalance.API

Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
