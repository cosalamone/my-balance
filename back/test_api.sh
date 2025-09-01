#!/bin/bash

echo "Probando API MyBalance - Endpoints"
echo "=================================="

# Función para hacer peticiones POST
test_endpoint() {
    local endpoint=$1
    local data=$2
    local description=$3
    
    echo ""
    echo "Probando: $description"
    echo "Endpoint: $endpoint"
    echo "Datos: $data"
    echo "---"
    
    response=$(curl -s -w "\n%{http_code}" -X POST "$endpoint" \
        -H "Content-Type: application/json" \
        -d "$data")
    
    # Separar el código de estado del cuerpo de la respuesta
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)
    
    echo "HTTP Status: $http_code"
    echo "Response: $response_body"
    echo "---"
}

# Esperar a que la API esté lista
echo "Esperando a que la API esté lista..."
sleep 3

# Test 1: Registro de usuario
test_endpoint "http://localhost:5019/api/auth/register" \
'{
    "email": "test@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "password": "Test123456!"
}' \
"Registro de usuario"

# Test 2: Login
test_endpoint "http://localhost:5019/api/auth/login" \
'{
    "email": "test@example.com",
    "password": "Test123456!"
}' \
"Login de usuario"

echo ""
echo "Pruebas completadas!"
