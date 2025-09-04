@echo off
title My Balance Backend
color 0A
echo.
echo ========================================
echo   🚀 MY BALANCE BACKEND SERVER
echo ========================================
echo.

cd /d "%~dp0"
echo 📂 Directorio actual: %CD%
echo.

:: Verificar si .NET está instalado
if not exist "C:\Program Files\dotnet\dotnet.exe" (
    echo ❌ Error: .NET no encontrado en C:\Program Files\dotnet\
    echo.
    echo 💡 Descarga .NET 8.0 desde:
    echo    https://dotnet.microsoft.com/download/dotnet/8.0
    echo.
    pause
    exit /b 1
)

echo ✅ .NET encontrado
"C:\Program Files\dotnet\dotnet.exe" --version
echo.

echo 🔥 Iniciando backend en puerto 5019...
echo 🌐 Swagger UI: http://localhost:5019/swagger
echo 📱 API Base: http://localhost:5019/api
echo.
echo 💡 Para detener el servidor, presiona Ctrl+C
echo.

"C:\Program Files\dotnet\dotnet.exe" run --project MyBalance.API

echo.
echo 🛑 Backend detenido
echo.
pause
