# GitHub Pages Configuration

Este repositorio está configurado para desplegar automáticamente en GitHub Pages.

## Configuración necesaria:

1. **Habilitar GitHub Pages:**
   - Ve a Settings > Pages en tu repositorio
   - En "Source", selecciona "GitHub Actions"

2. **Permisos del workflow:**
   - Ve a Settings > Actions > General
   - En "Workflow permissions", selecciona "Read and write permissions"
   - Marca "Allow GitHub Actions to create and approve pull requests"

3. **El sitio estará disponible en:**
   - `https://cosalamone.github.io/my-balance-front/`

## Funcionamiento:

- Cada push a la rama `main` trigger el build y deploy automático
- El workflow se puede ejecutar manualmente desde la pestaña Actions
- El build se hace con configuración de producción
- Se configura automáticamente el `base-href` para GitHub Pages

## Archivos del workflow:

- `.github/workflows/deploy.yml` - Configuración del workflow de deploy