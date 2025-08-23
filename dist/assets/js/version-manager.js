/* Version: 1.0.0 | Hash: 5891b8f8 | Build: 2025-08-23T04:38:22.835Z */
// CSS Version Manager - Sistema de versionado automático
(function() {
    'use strict';
    
    // Configuración del versionador
    const VERSION_CONFIG = {
        // Versión actual del sitio (cambiar manualmente cuando hagas cambios importantes)
        SITE_VERSION: '1.0.0',
        
        // Timestamp de build (se actualiza automáticamente)
        BUILD_TIMESTAMP: Date.now(),
        
        // Archivos que requieren versionado
        VERSIONED_FILES: {
            css: [
                '/assets/css/style.css',
                '/assets/css/fontawesome.css'
            ],
            js: [
                '/assets/js/script.js',
                '/assets/js/contact-form.js',
                '/assets/js/analytics.js',
                '/assets/js/performance.js'
            ],
            images: [
                // Imágenes críticas que pueden cambiar
                '/images/face-img.png',
                '/images/logo.png'
            ]
        },
        
        // Parámetros de cache
        CACHE_CONFIG: {
            // Tiempo de cache para archivos versionados (en segundos)
            VERSIONED_CACHE_TIME: 31536000, // 1 año
            // Tiempo de cache para archivos no versionados (en segundos)
            DEFAULT_CACHE_TIME: 86400, // 1 día
            // Tiempo de cache para HTML (en segundos)
            HTML_CACHE_TIME: 3600 // 1 hora
        }
    };
    
    // Generar hash único para archivos
    function generateFileHash(filePath) {
        const timestamp = VERSION_CONFIG.BUILD_TIMESTAMP;
        const version = VERSION_CONFIG.SITE_VERSION;
        return `${filePath}?v=${version}&t=${timestamp}`;
    }
    
    // Versionar archivos CSS
    function versionCSS() {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Verificar si es un archivo que requiere versionado
            if (VERSION_CONFIG.VERSIONED_FILES.css.some(cssFile => href.includes(cssFile))) {
                const versionedHref = generateFileHash(href);
                link.setAttribute('href', versionedHref);
                
                // Agregar atributos de cache
                link.setAttribute('data-version', VERSION_CONFIG.SITE_VERSION);
                link.setAttribute('data-timestamp', VERSION_CONFIG.BUILD_TIMESTAMP);
                
                console.log(`CSS versionado: ${href} -> ${versionedHref}`);
            }
        });
    }
    
    // Versionar archivos JavaScript
    function versionJavaScript() {
        const scripts = document.querySelectorAll('script[src]');
        
        scripts.forEach(script => {
            const src = script.getAttribute('src');
            
            // Verificar si es un archivo que requiere versionado
            if (VERSION_CONFIG.VERSIONED_FILES.js.some(jsFile => src.includes(jsFile))) {
                const versionedSrc = generateFileHash(src);
                script.setAttribute('src', versionedSrc);
                
                // Agregar atributos de versionado
                script.setAttribute('data-version', VERSION_CONFIG.SITE_VERSION);
                script.setAttribute('data-timestamp', VERSION_CONFIG.BUILD_TIMESTAMP);
                
                console.log(`JavaScript versionado: ${src} -> ${versionedSrc}`);
            }
        });
    }
    
    // Versionar imágenes críticas
    function versionImages() {
        const images = document.querySelectorAll('img[src]');
        
        images.forEach(img => {
            const src = img.getAttribute('src');
            
            // Verificar si es una imagen que requiere versionado
            if (VERSION_CONFIG.VERSIONED_FILES.images.some(imgFile => src.includes(imgFile))) {
                const versionedSrc = generateFileHash(src);
                img.setAttribute('src', versionedSrc);
                
                // Agregar atributos de versionado
                img.setAttribute('data-version', VERSION_CONFIG.SITE_VERSION);
                img.setAttribute('data-timestamp', VERSION_CONFIG.BUILD_TIMESTAMP);
                
                console.log(`Imagen versionada: ${src} -> ${versionedSrc}`);
            }
        });
    }
    
    // Agregar headers de cache para Service Worker
    function addCacheHeaders() {
        // Crear meta tags para cache
        const metaCache = document.createElement('meta');
        metaCache.setAttribute('name', 'cache-control');
        metaCache.setAttribute('content', `public, max-age=${VERSION_CONFIG.CACHE_CONFIG.VERSIONED_CACHE_TIME}`);
        document.head.appendChild(metaCache);
        
        // Meta tag para versión del sitio
        const metaVersion = document.createElement('meta');
        metaVersion.setAttribute('name', 'site-version');
        metaVersion.setAttribute('content', VERSION_CONFIG.SITE_VERSION);
        document.head.appendChild(metaVersion);
        
        // Meta tag para timestamp de build
        const metaTimestamp = document.createElement('meta');
        metaTimestamp.setAttribute('name', 'build-timestamp');
        metaTimestamp.setAttribute('content', VERSION_CONFIG.BUILD_TIMESTAMP);
        document.head.appendChild(metaTimestamp);
    }
    
    // Función para forzar recarga de CSS (útil para desarrollo)
    function forceCSSReload() {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href.includes('style.css') || href.includes('fontawesome.css')) {
                // Agregar timestamp único para forzar recarga
                const newHref = href.includes('?') 
                    ? `${href}&force=${Date.now()}` 
                    : `${href}?force=${Date.now()}`;
                
                link.setAttribute('href', newHref);
                console.log(`CSS forzado a recargar: ${href}`);
            }
        });
    }
    
    // Función para obtener información de versionado
    function getVersionInfo() {
        return {
            siteVersion: VERSION_CONFIG.SITE_VERSION,
            buildTimestamp: VERSION_CONFIG.BUILD_TIMESTAMP,
            buildDate: new Date(VERSION_CONFIG.BUILD_TIMESTAMP).toISOString(),
            versionedFiles: VERSION_CONFIG.VERSIONED_FILES,
            cacheConfig: VERSION_CONFIG.CACHE_CONFIG
        };
    }
    
    // Función para actualizar versión (útil para deployment)
    function updateVersion(newVersion) {
        VERSION_CONFIG.SITE_VERSION = newVersion;
        VERSION_CONFIG.BUILD_TIMESTAMP = Date.now();
        
        // Recargar la página para aplicar nueva versión
        window.location.reload();
    }
    
    // Inicializar versionador
    function initVersionManager() {
        console.log('🚀 Iniciando CSS Version Manager...');
        console.log(`📦 Versión del sitio: ${VERSION_CONFIG.SITE_VERSION}`);
        console.log(`⏰ Timestamp de build: ${new Date(VERSION_CONFIG.BUILD_TIMESTAMP).toISOString()}`);
        
        // Aplicar versionado
        versionCSS();
        versionJavaScript();
        versionImages();
        addCacheHeaders();
        
        console.log('✅ CSS Version Manager inicializado correctamente');
        
        // Exponer funciones globalmente para debugging
        window.CSSVersionManager = {
            getVersionInfo,
            forceCSSReload,
            updateVersion,
            versionCSS,
            versionJavaScript,
            versionImages
        };
    }
    
    // Inicializar cuando DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVersionManager);
    } else {
        initVersionManager();
    }
    
})();
