# 🚀 Lizbeth Martinez Portfolio - Developer Guide

Este es el repositorio central de mi portafolio profesional. Aquí puedes encontrar la estructura del proyecto, los comandos necesarios para el desarrollo y guías de mantenimiento.

---

## ⚡ Guía Rápida de Comandos (Cheat Sheet)

Guarda estos comandos para usarlos en tu terminal cuando trabajes en el proyecto:

| Acción | Comando | Descripción |
| :--- | :--- | :--- |
| **Iniciar Desarrollo** | `npm run dev` | Abre el sitio en el navegador y auto-recarga cuando guardas cambios. |
| **Forzar Caché** | `npm run cache:bump` | Actualiza la versión de CSS/JS para que todos vean la última versión. |
| **Compilar CSS** | `npm run compile:sass` | Solo compila los archivos SASS a CSS (sin servidor). |
| **Optimizar Imágenes** | `npm run generate:webp` | Convierte imágenes pesadas a formato WebP ligero. |

---

## 📂 Estructura del Proyecto

Para mantener el orden, usa estas carpetas:

-   **`assets/css/`**: Archivos finales de estilo (no editar directamente).
-   **`assets/js/`**: Scripts de lógica y animaciones.
-   **`assets/images/`**: Todas las fotos, iconos y videos.
-   **`scss/`**: Código fuente de los estilos (editar aquí para cambiar el diseño).
-   **`portfolio/`**: Páginas individuales de cada proyecto (Case Studies).
-   **`scripts/`**: Automatizaciones internas.

---

## 💡 Recordatorios Importantes

1.  **Nunca edites `assets/css/style.css`**: Siempre haz los cambios en la carpeta `scss/` y deja que el compilador haga su trabajo.
2.  **Rutas Relativas**: Si trabajas en un archivo dentro de `portfolio/`, recuerda usar `../assets/...` para llegar a las imágenes.
3.  **SEO**: Si agregas una página nueva, no olvides actualizar el `title` y la `meta description` en el `<head>`.

---

*Para más detalles técnicos, consulta [ASSETS.md](./ASSETS.md).*
