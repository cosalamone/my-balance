# 🚀 Deploy MyBalance en Railway

## Archivos agregados para Railway

✅ `Dockerfile` - Construcción del contenedor backend
✅ `.dockerignore` - Excluye archivos innecesarios del build
✅ `railway.toml` - Configuración de Railway
✅ `appsettings.Production.json` - Configuración para producción

---

## 📋 Pasos para desplegar en Railway

### 1. Crear cuenta en Railway

- Ve a https://railway.app
- Regístrate con GitHub (recomendado)

### 2. Crear nuevo proyecto

1. Click en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Autoriza Railway a acceder a tu repo
4. Selecciona el repositorio `my-balance`

### 3. Configurar el Backend (.NET)

**Configurar Root Directory:**

1. En el servicio del backend, ve a **Settings**
2. En **Root Directory** pon: `back`
3. Railway detectará automáticamente el `Dockerfile`

**Variables de entorno requeridas:**
En el dashboard de Railway, ve a **Variables** y agrega:

```bash
# Database Provider
DatabaseProvider=MySql

# JWT Secret (genera uno único para producción)
Jwt__Secret=TU_SECRET_SUPER_SEGURO_AQUI_CAMBIAR_ESTO

# ASPNET Core
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:8080
```

**Importante:** NO agregues `ConnectionStrings__DefaultConnection` todavía, lo haremos después de crear la base de datos.

### 4. Agregar MySQL Database

1. En tu proyecto de Railway, click en **"+ New"**
2. Selecciona **"Database"** → **"Add MySQL"**
3. Railway creará automáticamente la base de datos

**Obtener la conexión:**

1. Click en el servicio MySQL
2. Ve a la pestaña **"Connect"**
3. Copia el **"MySQL Connection URL"** (formato: `mysql://user:pass@host:port/railway`)

**Convertir a formato ADO.NET:**
Railway te da algo como:

```
mysql://root:password@containers-us-west-xx.railway.app:6543/railway
```

Conviértelo a:

```
server=containers-us-west-xx.railway.app;port=6543;database=railway;user=root;password=password;
```

**Agregar variable de entorno:**
En el servicio del **backend**, agrega:

```bash
ConnectionStrings__DefaultConnection=server=HOST;port=PORT;database=railway;user=root;password=PASS;
```

(Reemplaza HOST, PORT y PASS con los valores de Railway)

### 5. Aplicar Migraciones

**Opción A: Desde tu máquina local (recomendado)**

1. Copia la cadena de conexión de Railway
2. En tu terminal local:

```bash
cd back

# Aplicar migraciones a la BD de Railway
dotnet ef database update \
  --project MyBalance.Infrastructure \
  --startup-project MyBalance.API \
  --context AppDbContext \
  --connection "server=HOST;port=PORT;database=railway;user=root;password=PASS;"
```

**Opción B: Desde Railway (avanzado)**

Puedes crear un script de inicio que aplique migraciones automáticamente al desplegar. (Requiere más configuración)

### 6. Deploy del Frontend (Angular)

**Crear servicio para el frontend:**

1. En Railway, click **"+ New"** → **"Empty Service"**
2. Conecta el mismo repositorio de GitHub
3. En **Settings** → **Root Directory**: `front`

**Variables de entorno del frontend:**

```bash
# URL del backend (Railway te la provee después del deploy)
API_URL=https://tu-backend.railway.app
```

**Configurar build:**
Railway detectará automáticamente Angular, pero asegúrate:

- **Build Command:** `npm install && npm run build:prod`
- **Start Command:** El frontend es estático, Railway lo servirá automáticamente

**Actualizar el frontend para usar la variable:**
En `front/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://tu-backend.railway.app/api',
};
```

### 7. Configurar CORS

En `Program.cs` del backend, actualiza CORS para incluir la URL del frontend de Railway:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", builder =>
    {
        builder.WithOrigins(
            "http://localhost:4200",
            "http://localhost:4201",
            "https://tu-frontend.railway.app"  // Agregar esta línea
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});
```

### 8. Verificar el Deploy

1. **Backend:** Ve a la URL de tu backend + `/swagger`

   - Ejemplo: `https://mybalance-backend.up.railway.app/swagger`

2. **Frontend:** Abre la URL de tu frontend

   - Ejemplo: `https://mybalance.up.railway.app`

3. **Probar:**
   - Registra un usuario
   - Crea un ingreso/gasto
   - Verifica en MySQL que los datos se guardaron

---

## 🔧 Configuración adicional recomendada

### Custom Domain (opcional, gratis)

1. En Railway, ve a **Settings** → **Domains**
2. Click **"Generate Domain"** para obtener `*.up.railway.app`
3. O conecta tu propio dominio

### Monitoreo

Railway incluye logs automáticamente:

- Ve a **Deployments** para ver el historial
- Click en un deploy para ver logs en tiempo real

### Database Backups

Railway hace backups automáticos de MySQL, pero puedes:

1. Configurar backups adicionales con scripts
2. Exportar manualmente desde el dashboard de MySQL

---

## 💰 Costos y límites

**Plan Starter (Gratis):**

- **$5 USD de crédito mensual**
- Suficiente para:
  - 1 backend pequeño
  - 1 frontend estático
  - 1 MySQL pequeño
  - ~10 usuarios simultáneos

**Uso aproximado:**

- Backend .NET: ~$3/mes
- Frontend Angular: ~$0.50/mes
- MySQL: ~$1/mes
- **Total: ~$4.50/mes** (dentro del free tier)

Si excedes el crédito, Railway te cobra lo adicional (~$0.000463/min de CPU)

---

## 🐛 Troubleshooting

**Error: "Database connection failed"**

- Verifica la variable `ConnectionStrings__DefaultConnection`
- Asegúrate de usar el formato ADO.NET correcto
- Confirma que las migraciones se aplicaron

**Error: "CORS policy blocked"**

- Agrega la URL del frontend de Railway a `Program.cs`
- Redeploy el backend

**Error: "Build failed"**

- Revisa los logs en Railway
- Asegúrate que el `Dockerfile` esté en `back/`
- Verifica que el Root Directory esté configurado

**App se queda "Building" forever:**

- Cancela el deploy
- Revisa los logs
- Asegúrate de tener `railway.toml` en la raíz del proyecto backend

---

## 📝 Checklist de Deploy

### Pre-deploy

- [ ] Cuenta de Railway creada
- [ ] Repositorio pusheado a GitHub
- [ ] Dockerfile creado en `back/`
- [ ] Variables de entorno preparadas

### Deploy Backend

- [ ] Proyecto creado en Railway
- [ ] Root Directory configurado: `back`
- [ ] Variables de entorno agregadas
- [ ] MySQL agregado al proyecto
- [ ] Connection string configurado
- [ ] Migraciones aplicadas
- [ ] Backend desplegado y funcionando
- [ ] Swagger accesible

### Deploy Frontend

- [ ] Servicio frontend creado
- [ ] Root Directory configurado: `front`
- [ ] API_URL configurada
- [ ] Build exitoso
- [ ] Frontend accesible
- [ ] Conexión backend-frontend funcionando

### Post-deploy

- [ ] CORS actualizado con URL de Railway
- [ ] Dominio custom configurado (opcional)
- [ ] Usuario demo creado y probado
- [ ] Datos se guardan correctamente en MySQL

---

## 🎯 Próximos pasos después del deploy

1. **Seguridad:**

   - Cambia el `Jwt__Secret` en producción
   - Habilita SSL (Railway lo hace automáticamente)
   - Configura rate limiting

2. **Monitoreo:**

   - Revisa logs regularmente
   - Configura alertas (Railway Pro)

3. **Optimización:**

   - Habilita compresión en el backend
   - Configura caching
   - Optimiza queries de EF Core

4. **Backup:**
   - Configura backups automáticos adicionales
   - Exporta datos periódicamente

---

**¿Necesitas ayuda con algún paso?** Railway tiene excelente documentación en https://docs.railway.app
