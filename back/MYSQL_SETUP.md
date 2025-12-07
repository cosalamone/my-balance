# Configuración de MySQL para MyBalance Backend

## Resumen

El proyecto **MyBalance Backend** está configurado para usar **SQLite por defecto**, pero puede cambiar a **MySQL** modificando el archivo `appsettings.json`. El backend usa **Entity Framework Core** con el proveedor **Pomelo.EntityFrameworkCore.MySql** para conectarse a MySQL.

---

## Estado actual

✅ **Pomelo.EntityFrameworkCore.MySql** instalado (versión 9.0.0)
✅ **Microsoft.EntityFrameworkCore.Design** instalado (necesario para migraciones)
✅ **Migración `InitialCreate`** generada en `MyBalance.Infrastructure/Migrations/`
✅ **`Program.cs`** configurado para seleccionar proveedor según `DatabaseProvider` en `appsettings.json`

---

## Pasos para conectar a MySQL

### 1. **Instalar MySQL Server (si no lo tienes)**

- Descarga MySQL Community Server: https://dev.mysql.com/downloads/mysql/
- O usa Docker:
  ```bash
  docker run --name mybalance-mysql -e MYSQL_ROOT_PASSWORD=MiPassword -p 3306:3306 -d mysql:8.0
  ```

### 2. **Crear la base de datos**

Conéctate a MySQL y ejecuta:

```sql
CREATE DATABASE mybalance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Opcional: crear un usuario específico (recomendado para producción)
CREATE USER 'mybalance_user'@'localhost' IDENTIFIED BY 'MiPasswordSeguro';
GRANT ALL PRIVILEGES ON mybalance.* TO 'mybalance_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. **Actualizar `appsettings.json`**

Edita `MyBalance.API/appsettings.json` y cambia:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=mybalance;user=root;password=TU_PASSWORD_AQUI;"
  },
  "DatabaseProvider": "MySql",
  "Jwt": {
    "Secret": "MyBalanceSecretKey2024!@#$%^&*()_+<>?{}[]|\\:;\"'.,/`~"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

**Importante:** Reemplaza `TU_PASSWORD_AQUI` con tu contraseña de MySQL.

**Alternativa segura (variables de entorno):**
En lugar de guardar la contraseña en el archivo, usa variables de entorno:

```bash
export ConnectionStrings__DefaultConnection="server=localhost;port=3306;database=mybalance;user=root;password=MiPass;"
export DatabaseProvider="MySql"
```

### 4. **Aplicar migraciones a la base de datos**

Desde la carpeta `back`, ejecuta:

```bash
cd back
dotnet ef database update --project MyBalance.Infrastructure --startup-project MyBalance.API --context AppDbContext
```

Esto creará todas las tablas (`Users`, `Incomes`, `Expenses`, `Savings`) en tu base de datos MySQL.

### 5. **Ejecutar el backend**

```bash
cd back
dotnet run --project MyBalance.API
```

O usa los scripts existentes:

- Windows CMD: `run-backend.bat`
- Git Bash/WSL: `bash run-backend.sh`
- PowerShell: `.\run-backend.ps1`

### 6. **Verificar la conexión**

- Abre Swagger: http://localhost:5019/swagger
- Crea un usuario con el endpoint `POST /api/auth/register`
- Verifica que los datos se guarden en MySQL:
  ```sql
  USE mybalance;
  SELECT * FROM Users;
  ```

---

## Comandos útiles de EF Core

### Ver migraciones aplicadas

```bash
dotnet ef migrations list --project MyBalance.Infrastructure --startup-project MyBalance.API --context AppDbContext
```

### Crear una nueva migración (después de cambios en el modelo)

```bash
dotnet ef migrations add NombreDeLaMigracion --project MyBalance.Infrastructure --startup-project MyBalance.API --context AppDbContext
```

### Aplicar todas las migraciones pendientes

```bash
dotnet ef database update --project MyBalance.Infrastructure --startup-project MyBalance.API --context AppDbContext
```

### Revertir a una migración específica

```bash
dotnet ef database update NombreDeLaMigracion --project MyBalance.Infrastructure --startup-project MyBalance.API --context AppDbContext
```

### Eliminar la última migración (si no se aplicó)

```bash
dotnet ef migrations remove --project MyBalance.Infrastructure --startup-project MyBalance.API --context AppDbContext
```

### Generar script SQL de las migraciones

```bash
dotnet ef migrations script --project MyBalance.Infrastructure --startup-project MyBalance.API --context AppDbContext --output migration.sql
```

---

## Notas importantes

### Diferencias SQLite vs MySQL

- **SQLite:** Base de datos de archivo único (`mybalance.db`), ideal para desarrollo local.
- **MySQL:** Servidor de base de datos completo, recomendado para producción.
- El modelo de datos es compatible entre ambos para este proyecto.

### Cambiar entre SQLite y MySQL

Solo necesitas modificar dos valores en `appsettings.json`:

**Para SQLite:**

```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=mybalance.db"
},
"DatabaseProvider": "Sqlite"
```

**Para MySQL:**

```json
"ConnectionStrings": {
  "DefaultConnection": "server=localhost;port=3306;database=mybalance;user=root;password=Pass;"
},
"DatabaseProvider": "MySql"
```

### Seguridad en producción

- ❌ No uses `root` en producción
- ✅ Crea un usuario con permisos limitados solo a la BD `mybalance`
- ✅ Usa variables de entorno o Azure Key Vault para las contraseñas
- ✅ Habilita SSL en la conexión: `sslmode=Required`
- ✅ Configura backups automáticos de la base de datos

### Solución de problemas comunes

**Error: "Access denied for user 'root'@'localhost'"**

- Verifica que la contraseña en `appsettings.json` sea correcta
- Comprueba que el usuario tenga permisos: `GRANT ALL PRIVILEGES ON mybalance.* TO 'user'@'localhost';`

**Error: "Unknown database 'mybalance'"**

- Crea la base de datos: `CREATE DATABASE mybalance;`

**Error: "Table 'mybalance.Users' doesn't exist"**

- Aplica las migraciones: `dotnet ef database update ...`

**Error al generar migraciones: "More than one DbContext was found"**

- Especifica el contexto: `--context AppDbContext` (el proyecto tiene dos DbContext, usa `AppDbContext`)

---

## Arquitectura del proyecto

```
back/
├── MyBalance.API/              # Startup project, controladores, configuración
│   ├── Program.cs             # Configuración de servicios y DbContext
│   └── appsettings.json       # Cadena de conexión y proveedor
├── MyBalance.Core/            # Entidades y DTOs
│   └── Entities/              # User, Income, Expense, Savings
├── MyBalance.Application/     # Lógica de negocio
│   └── Services/              # AuthService, FinancialService
└── MyBalance.Infrastructure/  # Acceso a datos
    ├── Data/
    │   ├── AppDbContext.cs                 # DbContext principal (usado actualmente)
    │   ├── MyBalanceDbContext.cs           # DbContext alternativo (no se usa)
    │   └── DesignTimeDbContextFactory.cs   # Factory para EF tools
    ├── Migrations/                         # Migraciones de EF Core
    │   └── 20251207173118_InitialCreate.cs
    └── Repositories/                       # Implementación de repositorios
```

---

## Próximos pasos recomendados

1. ✅ **Actualizar la contraseña** en `appsettings.json` con tu contraseña MySQL real
2. ✅ **Aplicar las migraciones** con `dotnet ef database update ...`
3. ✅ **Probar el backend** ejecutando `dotnet run --project MyBalance.API`
4. ✅ **Verificar que los datos se guarden** usando Swagger y consultando la BD
5. 📝 Considerar usar `appsettings.Development.json` para desarrollo y `appsettings.Production.json` para producción
6. 🔒 Configurar variables de entorno o secretos para las credenciales en producción

---

**¿Necesitas ayuda?** Revisa los logs en la terminal cuando ejecutes el backend — EF Core muestra las queries SQL que ejecuta si el nivel de log está en `Information`.
