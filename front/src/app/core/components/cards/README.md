# Cards Component System - My Balance

Este sistema de componentes de tarjetas (`cards`) proporciona una base reutilizable y extensible para crear interfaces de usuario consistentes en la aplicación My Balance.

## Estructura del Sistema

```
core/
├── components/
│   └── cards/
│       ├── card-base/                    # Componente base genérico
│       ├── summary-cards/               # Tarjetas de resumen financiero
│       ├── quick-actions-card/          # Tarjeta de acciones rápidas
│       ├── activity-summary-card/       # Tarjeta de actividad reciente
│       └── index.ts                     # Exportaciones
└── models/
    └── card-base.model.ts              # Modelos y interfaces
```

## Componentes Disponibles

### 1. Card Base (`mb-card-base`)

Componente base genérico que utiliza el modelo `CardBaseModel` para crear tarjetas completamente configurables.

**Características:**
- Header configurable con título, subtítulo y botón de refresh
- Secciones con diferentes layouts (grid, flex, list)
- Soporte para diferentes tipos de contenido (text, number, icon, actions, custom)
- Acciones globales configurables
- Completamente personalizable via CSS classes

**Uso:**
```html
<mb-card-base 
  [cardModel]="cardModel"
  (refreshClicked)="onRefresh()"
  (actionClicked)="onActionClicked($event)">
</mb-card-base>
```

### 2. Summary Cards (`mb-summary-cards`)

Componente específico que muestra las 4 tarjetas principales del resumen financiero:
- Ingresos del mes
- Gastos del mes
- Ahorros del mes
- Balance neto

**Uso:**
```html
<mb-summary-cards [summary]="financialSummary"></mb-summary-cards>
```

### 3. Quick Actions Card (`mb-quick-actions-card`)

Componente que proporciona acciones rápidas para navegar a diferentes secciones de la aplicación.

**Uso:**
```html
<mb-quick-actions-card></mb-quick-actions-card>
```

### 4. Activity Summary Card (`mb-activity-summary-card`)

Componente que muestra un resumen de la actividad financiera reciente con opción de refresh.

**Uso:**
```html
<mb-activity-summary-card 
  [summary]="financialSummary"
  (refreshClicked)="onRefresh()">
</mb-activity-summary-card>
```

## Modelos

### CardBaseModel

Interfaz principal que define la estructura completa de una tarjeta:

```typescript
interface CardBaseModel {
  config: CardBaseConfig;      // Configuración general de la tarjeta
  sections: CardSection[];     // Secciones de contenido
  actions?: CardAction[];      // Acciones globales
  refreshAction?: () => void;  // Función de refresh
}
```

### CardBaseConfig

Configuración general de la tarjeta:

```typescript
interface CardBaseConfig {
  title: string;
  subtitle?: string;
  showRefreshButton?: boolean;
  containerClasses?: string;
  headerClasses?: string;
  contentClasses?: string;
  showDivider?: boolean;
}
```

### CardSection

Define una sección dentro de la tarjeta:

```typescript
interface CardSection {
  id: string;
  title?: string;
  subtitle?: string;
  contents: CardContent[];
  layout: 'grid' | 'list' | 'flex';
  gridCols?: number;
  sectionClasses?: string;
  showHeader?: boolean;
}
```

### CardContent

Define el contenido individual dentro de una sección:

```typescript
interface CardContent {
  type: 'text' | 'number' | 'icon' | 'actions' | 'custom';
  value?: any;
  label?: string;
  icon?: string;
  iconClasses?: string;
  valueClasses?: string;
  labelClasses?: string;
  containerClasses?: string;
  formatType?: 'currency' | 'number' | 'percentage' | 'text';
}
```

## Configuración de Prefijo

Todos los componentes usan el prefijo `mb-` (My Balance) en lugar del prefijo estándar `app-`. Esta configuración está definida en:

- `angular.json`: `"prefix": "mb"`

## Beneficios del Sistema

1. **Reutilización**: El componente base puede crear cualquier tipo de tarjeta
2. **Consistencia**: Todos los componentes siguen el mismo patrón de diseño
3. **Flexibilidad**: Altamente configurable via modelos
4. **Mantenibilidad**: Separación clara de responsabilidades
5. **Escalabilidad**: Fácil agregar nuevos tipos de tarjetas

## Ejemplo de Uso Avanzado

```typescript
// Crear una tarjeta personalizada usando CardBaseModel
const customCardModel: CardBaseModel = {
  config: {
    title: 'Mi Tarjeta Personalizada',
    subtitle: 'Subtítulo opcional',
    showRefreshButton: true,
    containerClasses: 'custom-container'
  },
  sections: [
    {
      id: 'metrics',
      title: 'Métricas',
      layout: 'grid',
      gridCols: 2,
      showHeader: true,
      contents: [
        {
          type: 'number',
          label: 'Total',
          value: 1500,
          formatType: 'currency',
          valueClasses: 'text-green-600'
        },
        {
          type: 'icon',
          icon: 'trending_up',
          iconClasses: 'text-blue-500',
          label: 'Tendencia',
          containerClasses: 'bg-blue-100'
        }
      ]
    }
  ],
  actions: [
    {
      label: 'Ver Más',
      icon: 'visibility',
      routerLink: '/detalles',
      color: 'primary'
    }
  ]
};
```

## Próximos Pasos

- Agregar más tipos de contenido (charts, images, etc.)
- Implementar temas personalizables
- Agregar animaciones y transiciones
- Crear más componentes específicos basados en card-base
