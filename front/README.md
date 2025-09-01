# App Gastos - Control Financiero Personal

Una aplicación moderna para el control de finanzas personales desarrollada con Angular y Tailwind CSS.

## 🚀 Características

- **Dashboard Financiero**: Visualización general de ingresos, gastos y ahorros
- **Gestión de Ingresos**: Registro detallado de diferentes tipos de ingresos (haberes, bonos, regalos, etc.)
- **Control de Gastos**: Diferenciación entre gastos fijos y variables
- **Ahorro Inteligente**: Seguimiento de diferentes categorías de ahorro (fondo de emergencia, USD, CEDEARs)
- **Reportes y Gráficos**: Análisis visual de la actividad financiera
- **Responsive Design**: Optimizado para web y móvil (especialmente Samsung S24)
- **Autenticación**: Sistema de login opcional

## 📱 Tecnologías

- **Frontend**: Angular 17+
- **UI Framework**: Angular Material + Tailwind CSS
- **Charts**: Chart.js con ng2-charts
- **Storage**: LocalStorage (datos del lado del cliente)
- **Responsive**: Mobile-first design

## 🏗️ Estructura del Proyecto

```
src/app/
├── auth/                    # Módulo de autenticación
│   ├── pages/
│   │   └── login.page.*
│   ├── services/
│   └── utils/
├── dashboard/               # Módulo del dashboard
│   ├── pages/
│   │   └── dashboard.page.*
│   ├── components/
│   ├── services/
│   └── utils/
├── ingresos/               # Módulo de ingresos
│   ├── pages/
│   │   └── ingresos.page.*
│   ├── components/
│   ├── services/
│   │   └── income-handler.service.ts
│   └── utils/
│       └── income.utils.ts
├── gastos/                 # Módulo de gastos (por implementar)
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── utils/
├── ahorros/               # Módulo de ahorros (por implementar)
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── utils/
├── reportes/              # Módulo de reportes (por implementar)
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── utils/
├── models/                # Modelos de datos compartidos
│   └── financial.models.ts
├── services/              # Servicios globales
│   ├── financial-data.service.ts
│   └── auth.service.ts
└── shared/               # Componentes compartidos
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

1. **Node.js** (versión 18 o superior)
   - Descargar desde: https://nodejs.org/
   - Verificar instalación: `node --version`

2. **npm** (incluido con Node.js)
   - Verificar instalación: `npm --version`

### Pasos de Instalación

1. **Clonar/Abrir el proyecto** en VS Code

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Instalar Angular CLI globalmente** (si no está instalado):
   ```bash
   npm install -g @angular/cli
   ```

4. **Verificar instalación**:
   ```bash
   ng version
   ```

### Ejecutar la Aplicación

```bash
# Desarrollo
npm start
# o
ng serve

# Producción
npm run build
# o
ng build --prod
```

La aplicación estará disponible en: `http://localhost:4200`

## 🔐 Credenciales de Demo

- **Email**: demo@example.com
- **Contraseña**: demo123

## 📋 Funcionalidades Implementadas

### ✅ Completado
- [x] Estructura base del proyecto con Angular
- [x] Configuración de Tailwind CSS
- [x] Sistema de autenticación básico
- [x] Dashboard con resumen financiero
- [x] Módulo completo de Ingresos
- [x] Modelos de datos TypeScript
- [x] Servicios para manejo de datos
- [x] Diseño responsive
- [x] Organización por features/módulos

### 🚧 En Desarrollo
- [ ] Módulo de Gastos
- [ ] Módulo de Ahorros
- [ ] Módulo de Reportes con gráficos
- [ ] Exportación de datos (CSV/PDF)
- [ ] Filtros avanzados
- [ ] Configuraciones de usuario

### 🔮 Futuras Mejoras
- [ ] Backend con C# (.NET)
- [ ] Base de datos
- [ ] Sincronización en la nube
- [ ] Notificaciones push
- [ ] Categorías personalizables
- [ ] Múltiples monedas

## 🎨 Diseño y UX

- **Mobile-First**: Diseño optimizado para dispositivos móviles
- **Samsung S24**: Optimizaciones específicas (411x914px)
- **Tailwind CSS**: Framework de utilidades para estilos consistentes
- **Angular Material**: Componentes UI profesionales
- **Tema Personalizado**: Colores específicos para ingresos, gastos y ahorros

## 💾 Almacenamiento de Datos

Actualmente la aplicación utiliza `localStorage` del navegador para persistir los datos. Esto significa que:

- Los datos se guardan localmente en el dispositivo
- No se requiere conexión a internet
- Los datos persisten entre sesiones
- Al limpiar el navegador se pierden los datos

## 🚀 Próximos Pasos

1. **Instalar Node.js** si no está instalado
2. **Ejecutar** `npm install` para instalar dependencias
3. **Iniciar** la aplicación con `npm start`
4. **Completar** los módulos restantes (gastos, ahorros, reportes)
5. **Implementar** backend con C# si es necesario

## 📞 Soporte

Si tienes problemas con la instalación o configuración:

1. Verificar que Node.js esté instalado correctamente
2. Asegurarse de que todas las dependencias estén instaladas
3. Revisar que no haya conflictos de puertos (4200)
4. Consultar la documentación de Angular: https://angular.io/docs

## 📄 Licencia

Este proyecto es de uso personal/educativo.

---

**¡Feliz control financiero! 💰📊**
