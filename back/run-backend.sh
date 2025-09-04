#!/bin/bash

# Colores para el output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================"
echo -e "  🚀 MY BALANCE BACKEND SERVER"
echo -e "========================================${NC}"
echo ""

# Cambiar al directorio del script
cd "$(dirname "$0")"
echo -e "${BLUE}📂 Directorio actual: $(pwd)${NC}"

# Configurar PATH para .NET
export PATH="/c/Program Files/dotnet:$PATH"

# Verificar que dotnet está disponible
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED}❌ Error: .NET no encontrado${NC}"
    echo -e "${YELLOW}💡 Asegúrate de que .NET 8.0 esté instalado en:${NC}"
    echo -e "${YELLOW}   C:\\Program Files\\dotnet${NC}"
    echo ""
    echo -e "${YELLOW}📥 Descarga desde: https://dotnet.microsoft.com/download/dotnet/8.0${NC}"
    echo ""
    read -p "Presiona Enter para salir..."
    exit 1
fi

echo -e "${GREEN}✅ .NET encontrado: $(dotnet --version)${NC}"
echo ""

echo -e "${PURPLE}� Iniciando backend en puerto 5019...${NC}"
echo -e "${CYAN}🌐 Swagger UI: http://localhost:5019/swagger${NC}"
echo -e "${CYAN}� API Base: http://localhost:5019/api${NC}"
echo ""
echo -e "${YELLOW}💡 Para detener el servidor, presiona Ctrl+C${NC}"
echo ""

# Ejecutar el backend
dotnet run --project MyBalance.API

echo ""
echo -e "${RED}🛑 Backend detenido${NC}"
echo ""
read -p "Presiona Enter para salir..."
