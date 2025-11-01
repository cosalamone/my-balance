# Common Model (Button) — diseño, implementación y flujo

Este documento describe la lógica y el uso del patrón "common model" aplicado a botones en la aplicación (el `ButtonModelBase` y su renderer `mb-common-button`). Está pensado para desarrolladores que migran componentes o quieren reutilizar el patrón.

## Resumen

- Patrón principal: modelo + renderer.
  - `ButtonModelBase`: objeto que describe la intención de un botón (acción, icono, label, estado disabled, permisos, etc.). Implementado con Signals para reactividad.
  - `ButtonCommonComponent` (selector: `mb-common-button`): componente presentacional que dibuja el botón usando Material/Tailwind según las propiedades del modelo.
  - `ButtonBaseComponent` (host): pieza encargada de conectar `input<>()` Signals y sincronizar internamente señales del modelo (efectos, targetId, etc.).
- Ventajas:
  - Centraliza comportamiento (tooltip, loading, permisos, estilos).
  - Facilita migraciones desde botones nativos o configuraciones antiguas.
  - Mejora reusabilidad y consistencia visual.

## Archivos clave

- `src/app/core/models/button-base.model.ts` — clase `ButtonModelBase` (modelo canonical).
- `src/app/core/components/buttons/common-button/common-button.ts` — `ButtonCommonComponent` (renderer).
- `src/app/core/components/buttons/button-base.component.ts` — host que conecta `input<>()` y efectos.
- `src/app/core/services/form-config.service.ts` — contiene factory helpers para crear modelos comunes (ej. `getSaveButtonModel()`), actúa como adaptador temporal.
- `src/app/core/components/cards/card-base/*` — utiliza una función `getButtonModel(action)` para convertir acciones de card en `ButtonModelBase` (caching sobre el objeto acción).

> Nota: Comprueba estos paths si tu árbol de proyecto difiere ligeramente.

## `ButtonModelBase` — campos y significado

Los proyectos del repo usan una implementación basada en Signals que expone (resumen):

- action: (target?) => void — función que se ejecuta al hacer click. Recibe opcionalmente `targetId` (ej. drawer) si se requiere.
- label?: string — texto del botón.
- iconName?: string — icono Material a mostrar.
- style?: 'icon' | 'filled' | 'outline' | ... — ayuda a renderizar la variante visual.
- optionDisabled / $optionDisabled: boolean | WritableSignal<boolean> — estado deshabilitado reactivo.
- permissionSignal?: Signal<boolean> — señal que determina si el botón está autorizado para mostrarse/activarse.
- tooltipMessage?: string — texto del tooltip.
- buttonType?: ComponentType — opcional para forzar qué renderer o variante usar.
- meta/extra?: any — campo libre para almacenar datos extra (ej. referencia a la acción original).

Internamente `ButtonModelBase` expone señales/propiedades que el `ButtonBaseComponent` y `ButtonCommonComponent` consumen.

## Componentes y responsabilidades

### ButtonBaseComponent (host)

- Define `input<>()` para recibir `buttonModel` y `targetId` de manera segura con Signals.
- Crea efectos que sincronizan cambios entre el modelo y el host (por ejemplo, copiar `optionDisabled` en el `$optionDisabled` del modelo si fuera necesario).
- Maneja limpieza (ngOnDestroy) para destruir efectos.

Importante: los efectos deben inicializarse en contexto de inyección (no dentro de `ngOnInit`) para evitar errores de runtime (ej. NG0203). En este repo se movió ese efecto a un initializer de campo.

### ButtonCommonComponent (renderer)

- Renderiza un `<button>` con clases/material apropiadas según `model.style`.
- Resuelve `disabled` combinando `model.$optionDisabled` y `permissionSignal`.
- Muestra icono y label según `model.iconName` y `model.label`.
- Al hacer click ejecuta `model.action(targetId)`.
- Soporta `targetId` (pasado por `ButtonBaseComponent` como `input<HTMLElement | MatSidenav>`), útil para botones que manipulan elementos externos (ej. abrir/cerrar drawer).

## Cómo crear y usar modelos (patrones)

1. Factory / Service (recomendado para consistencia)

- `FormConfigService` provee helpers como `getSaveButtonModel(disabled?, hideLabel?)` que retornan `ButtonModelBase` ya configurados (icono, estilo, label, permisos si aplica).
- Ventaja: evita duplicar `new ButtonModelBase({ ... })` y mantiene labels/estilos consistentes.

Ejemplo (pseudocódigo):

```ts
this.saveButtonModel = this.formConfig.getSaveButtonModel(false, false);
this.saveButtonModel.action = () => this.onSubmit();
```

2. Instanciación directa

- Para toggles rápidos o botones locales es válido instanciar directamente:

```ts
this.passwordToggleModel = new ButtonModelBase({
  action: () => (this.hidePassword = !this.hidePassword),
  style: 'icon',
  iconName: this.hidePassword ? 'visibility_off' : 'visibility',
  tooltipMessage: 'Mostrar / ocultar contraseña',
});
```

- Si el icono depende del estado, actualiza `model.iconName` dentro de la `action` o vincula a una señal computada si prefieres reactividad pura.

3. Uso en templates

- Importar `ButtonCommonComponent` en el `imports` del componente standalone (si aplica).
- Template:

```html
<mb-common-button
  [buttonModel]="saveButtonModel"
  class="mb-btn--primary"
></mb-common-button>
```

- Para acciones que necesitan una referencia a otro elemento (ej. drawer):

```html
<mb-common-button
  [buttonModel]="toggleDrawerModel"
  [targetId]="drawer"
></mb-common-button>
```

El `targetId` es pasado desde el template y el modelo lo recibe al invocar `action(target)`.

## Flujo de ejecución (ejemplo: botón Guardar en un formulario)

1. En el componente de la página:
   - Se crea el `saveButtonModel` (vía factory o `new ButtonModelBase`).
   - Se asigna `saveButtonModel.action = () => this.onSubmit()`.
   - Se enlaza `saveButtonModel.optionDisabled` a la validez del formulario (ej. `this.form.valid ? false : true`).

2. En el template se usa `<mb-common-button [buttonModel]="saveButtonModel"></mb-common-button>`.

3. Render:
   - `ButtonCommonComponent` lee `saveButtonModel` y calcula `disabled` (combina señales y permisos).
   - Muestra icono/label y tooltip según el modelo.

4. Usuario hace click:
   - `ButtonCommonComponent` invoca `model.action(targetId)`.
   - `this.onSubmit()` (en la página) se ejecuta; si el método cambia estados (p. ej. `isLoading = true`) y el modelo observa esos estados, el botón actualizará su apariencia (ej. clase loading o disabled).

## Card actions: adaptador y caching

- En `CardBaseComponent` existe una función `getButtonModel(action)` que convierte objetos `CardAction` (antigua forma) a `ButtonModelBase` y los almacena en `action._buttonModel` para reusar la misma instancia.
- Esto evita recrear modelos en cada cambio de detección y permite que los botones en las cards usen permisos/disabled de forma local.

Ejemplo (resumen):

- `card.actions` contiene items con `{ label, icon, handler }`.
- `getButtonModel(action)` devuelve o crea `action._buttonModel = new ButtonModelBase({...})` y asigna `action._buttonModel.action = () => action.handler(item)`.

## Señales y `input<>()`

- El proyecto prefiere usar Angular Signals y `input<>()` en componentes standalone para inputs reactivamente tipados.
- `ButtonBaseComponent` declara: `buttonModel = input<ButtonModelBase>();` y `targetId = input<any>();`.
- Esto permite crear efectos que reaccionan a cambios del modelo sin necesidad de `@Input()` clásico.

Cuidado: crear `effect()` dentro de `ngOnInit` puede lanzar NG0203 (efectos deben crearse en contexto de inyección). En este repo la solución fue inicializar el efecto como un campo en la clase o crearlo inmediatamente en el constructor/initializers.

## Permisos y visibilidad

- `ButtonModelBase` puede aceptar una `permissionSignal` (Signal<boolean>) que el renderer utiliza para decidir habilitar/mostrar el botón.
- Para acciones condicionadas por permisos, pasar la señal desde un servicio de permisos o desde el contexto del componente.

## Ejemplos prácticos

1. Toggle Drawer (App shell)

- TS:

```ts
this.toggleDrawerModel = new ButtonModelBase({
  action: (drawer: MatSidenav) => drawer?.toggle(),
  style: 'icon',
  iconName: 'menu',
  tooltipMessage: 'Abrir/Cerrar menú',
});
```

- HTML:

```html
<mb-common-button
  [buttonModel]="toggleDrawerModel"
  [targetId]="drawer"
></mb-common-button>
```

2. Password visibility (Register/Login)

- TS:

```ts
this.passwordToggleModel = new ButtonModelBase({
  action: () => {
    this.hidePassword = !this.hidePassword;
    this.passwordToggleModel.iconName = this.hidePassword
      ? 'visibility_off'
      : 'visibility';
  },
  style: 'icon',
  iconName: this.hidePassword ? 'visibility_off' : 'visibility',
});
```

- HTML: `<mb-common-button [buttonModel]="passwordToggleModel" class="mat-icon-button matSuffix"></mb-common-button>`

## Migración desde `form/button` o botones nativos

- Estrategia recomendada:
  1. Crear el `ButtonModelBase` correspondiente (preferiblemente usando `FormConfigService` helpers).
  2. Reemplazar el `<button>` en la plantilla por `<mb-common-button [buttonModel]="...">` manteniendo classes (`mat-icon-button`, `matSuffix`, `mb-btn--primary`, etc.).
  3. Ejecutar `ng build` y ajustar imports (añadir `ButtonCommonComponent` a `imports` de componentes standalone).
  4. Probar casos de teclado (submit con Enter), si necesitas preservar comportamiento nativo de submit puedes mantener `<button type="submit">` y usar `mb-common-button` para acciones auxiliares.

## Troubleshooting

- Error NG0203: "effect invoked outside injection context" — causa: `effect()` creado dentro de `ngOnInit`. Solución: mover la creación del efecto a un initializer de campo o al constructor/inyección.
- Error de compilación "Property 'xyz' does not exist on type 'AppComponent'": usualmente se debe a que el template usa un modelo nuevo (`toggleDrawerModel`) sin que el campo exista o esté inicializado. Solución: declarar la propiedad en el TS y inicializar en `ngOnInit`.
- Linter/strict template: Asegúrate de agregar `ButtonCommonComponent` a `imports` en componentes standalone que usan `<mb-common-button>`.

## Pruebas y validación

- Pasos rápidos:
  1. `ng build` para verificar compilación.
  2. `ng serve` y verificar visualmente que botones aparecen y responden.
  3. Probar enter en formularios (si migraste el botón submit, verifica que submit ocurre como antes). Si no, mantener `type="submit"` en un botón nativo o adaptar la lógica para `Enter`.

## Buenas prácticas

- Centraliza factories en `FormConfigService` o un `ButtonAdapter` para evitar duplicación.
- Mantén `action` como una función explícita que invoque un método del componente (no mezcles lógica pesada en la definición del modelo).
- Usa `targetId` sólo cuando haga sentido (controls externos como `MatSidenav`).
- No abuses de instanciación ad-hoc si la app necesita compartir permisos/estilos: usa factories para consistencia.

## Próximos pasos sugeridos

- Extraer la lógica de creación/adaptación de botones a un `ButtonAdapter` reutilizable.
- Añadir tests unitarios para `ButtonCommonComponent` (renderizado, disabled, click -> action).
- Documentar patrones comunes (`save`, `cancel`, `delete`) en `FormConfigService` y en este documento como ejemplos reusables.

---

## Ejemplo concreto: Register (fragmento real)

A continuación tienes un extracto real tomado del componente de registro (`register.page.ts` + su template) mostrando la creación de modelos para los toggles de contraseña y el botón de envío, y cómo se usan en el HTML.

### register.page.ts (extracto)

```ts
// inicialización en ngOnInit
this.registerButtonModel = this.formConfig.getSaveButtonModel(false, false);
this.registerButtonModel.action = () => this.onSubmit();

this.loginNavModel = this.formConfig.getCancelButtonModel();
this.loginNavModel.action = () => this.navigateToLogin();

// toggle de visibilidad de contraseña
this.passwordToggleModel = new ButtonModelBase({
  action: () => {
    this.hidePassword = !this.hidePassword;
    this.passwordToggleModel.iconName = this.hidePassword
      ? 'visibility_off'
      : 'visibility';
  },
  style: 'icon',
  buttonType: ButtonCommonComponent as any,
  iconName: this.hidePassword ? 'visibility_off' : 'visibility',
  tooltipMessage: 'Mostrar / ocultar contraseña',
} as any);

this.confirmPasswordToggleModel = new ButtonModelBase({
  action: () => {
    this.hideConfirmPassword = !this.hideConfirmPassword;
    this.confirmPasswordToggleModel.iconName = this.hideConfirmPassword
      ? 'visibility_off'
      : 'visibility';
  },
  style: 'icon',
  buttonType: ButtonCommonComponent as any,
  iconName: this.hideConfirmPassword ? 'visibility_off' : 'visibility',
  tooltipMessage: 'Mostrar / ocultar contraseña',
} as any);
```

### register.page.html (extracto)

```html
<mat-form-field appearance="outline" class="field">
  <input
    matInput
    [type]="hidePassword ? 'password' : 'text'"
    formControlName="password"
    placeholder="Contraseña"
  />
  <mb-common-button
    [buttonModel]="passwordToggleModel"
    class="mat-icon-button matSuffix"
  ></mb-common-button>
</mat-form-field>

<mat-form-field appearance="outline" class="field">
  <input
    matInput
    [type]="hideConfirmPassword ? 'password' : 'text'"
    formControlName="confirmPassword"
    placeholder="Confirmar contraseña"
  />
  <mb-common-button
    [buttonModel]="confirmPasswordToggleModel"
    class="mat-icon-button matSuffix"
  ></mb-common-button>
</mat-form-field>

<!-- botón submit model-driven -->
<mb-common-button
  [buttonModel]="registerButtonModel"
  class="mb-btn--full mb-btn mb-btn--primary"
  [ngClass]="{ 'mb-btn--loading': isLoading }"
></mb-common-button>
```

Este ejemplo muestra:

- Uso del `FormConfigService` para obtener un `save` model consistente (`getSaveButtonModel`).
- Instanciación manual de toggles con `new ButtonModelBase(...)` cuando la lógica es local y simple.
- Uso de `<mb-common-button>` en el template con `class="mat-icon-button matSuffix"` para mantener la misma apariencia que antes.

Si quieres, puedo añadir otro ejemplo (por ejemplo el fragmento real de `app.component.ts` con `toggleDrawerModel`) o generar pruebas unitarias para `ButtonCommonComponent`.
