# Configuración de Google Analytics para Single Page Application (SPA)

## Cambios Implementados para SPA

### 1. Funciones de Tracking Personalizadas

Se han añadido las siguientes funciones en `assets/js/analytics.js`:

#### `trackSPAPageView(page)`
- **Propósito**: Rastrea vistas de página virtuales en la SPA
- **Implementación**: Construye paths virtuales como `/#work`, `/#about`, `/#resume`
- **Eventos GA**: 
  - `page_view` con parámetros personalizados
  - `page_title` con el nombre de la página
  - `content_group1` con el tipo de contenido

#### `trackSPANavigation(fromPage, toPage)`
- **Propósito**: Rastrea la navegación entre páginas de la SPA
- **Implementación**: Registra transiciones como `work → about`
- **Eventos GA**:
  - `spa_navigation` evento personalizado
  - `from_page` y `to_page` como parámetros

### 2. Integración Automática

Las funciones se ejecutan automáticamente en:

- **Navegación normal**: Al hacer clic en el menú
- **Navegación del historial**: Botones atrás/adelante del navegador
- **Carga inicial**: Cuando se carga la aplicación por primera vez
- **Errores de carga**: Si falla la carga de contenido AJAX

### 3. Eventos Rastreados

#### Eventos de Página
- `page_view`: Vista virtual de página
- `spa_navigation`: Navegación entre secciones
- `spa_app_loaded`: Carga inicial de la aplicación
- `browser_back_navigation`: Navegación con botones del navegador
- `ajax_load_failed`: Errores de carga de contenido

#### Parámetros Personalizados
- `page_title`: Título de la página
- `content_group1`: Categoría del contenido
- `from_page`: Página de origen (navegación)
- `to_page`: Página de destino (navegación)

## Verificación en Google Analytics

### 1. Tiempo Real
Ve a **Informes en tiempo real** para verificar:
- Eventos personalizados apareciendo
- Páginas virtuales siendo registradas
- Navegación entre secciones

### 2. Eventos Personalizados
Navega a **Eventos > Todos los eventos** para ver:
- `spa_navigation`
- `ajax_load_failed`
- `browser_back_navigation`

### 3. Páginas Vistas
En **Informes > Engagement > Páginas y pantallas**:
- Deberías ver paths como `/#work`, `/#about`, `/#resume`
- Cada cambio de sección se cuenta como vista de página

## Configuración Adicional Recomendada

### 1. Objetivos Personalizados
Configura objetivos para:
- Navegación a página "about" (conversión de engagement)
- Descarga del CV (desde página resume)
- Envío del formulario de contacto

### 2. Audiencias Personalizadas
Crea audiencias basadas en:
- Usuarios que visitan múltiples secciones
- Tiempo en la página de portafolio
- Interacciones con proyectos específicos

### 3. Dimensiones Personalizadas
Considera añadir:
- Tipo de dispositivo (móvil/desktop)
- Fuente de tráfico
- Profundidad de navegación en portafolio

## Código de Ejemplo

### Rastreo Manual Adicional
```javascript
// Rastrear interacciones específicas
window.GATracking.trackEvent('engagement', 'portfolio_item_click', 'design-system', 'Portfolio', 1);

// Rastrear descarga de CV
window.GATracking.trackEvent('conversion', 'resume_download', 'pdf', 'Resume Download', 1);

// Rastrear envío de formulario
window.GATracking.trackEvent('conversion', 'contact_form_submit', 'contact', 'Lead Generation', 1);
```

### Verificar Estado de Analytics
```javascript
// Verificar si GA está cargado
console.log('GA Tracking disponible:', !!window.GATracking);

// Ver configuración actual
console.log('GA Tracking ID:', window.GATracking?.trackingId);
```

## Métricas Importantes a Monitorear

1. **Rutas de navegación más comunes**
2. **Tiempo promedio en cada sección**
3. **Tasa de rebote por sección**
4. **Conversiones (descargas, contactos)**
5. **Errores de carga AJAX**

## Troubleshooting

### Si no aparecen datos:
1. Verifica que `gtag` está cargado
2. Confirma que el Tracking ID es correcto
3. Revisa la consola por errores JavaScript
4. Usa Google Analytics Debugger (extensión de Chrome)

### Para debugging:
```javascript
// Activar modo debug
gtag('config', 'G-X271RK6RRK', {
    debug_mode: true
});
```

## Notas de Implementación

- Las vistas de página virtuales se registran DESPUÉS de que el contenido se carga completamente
- La navegación se rastrea tanto en clicks de menú como en navegación del historial
- Los errores AJAX también se registran para debugging
- El sistema es compatible con el tracking existente de Hotjar
