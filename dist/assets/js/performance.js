/* Version: 1.0.0 | Hash: 7f96c793 | Build: 2025-08-23T04:38:22.835Z */
// Performance Optimization and Core Web Vitals
(function() {
    'use strict';
    
    // Lazy loading for images
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // Preload critical resources
    function preloadCriticalResources() {
        const criticalResources = [
            '/assets/css/style.css',
            '/assets/css/fontawesome.css',
            '/assets/js/bootstrap.bundle.js'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
    
    // Optimize font loading
    function optimizeFontLoading() {
        // Preload critical fonts
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        fontLinks.forEach(link => {
            link.rel = 'preload';
            link.as = 'font';
            link.crossOrigin = 'anonymous';
        });
        
        // Add font-display: swap for better performance
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Open Sans';
                font-display: swap;
            }
            @font-face {
                font-family: 'PT Serif';
                font-display: swap;
            }
            @font-face {
                font-family: 'Libre Franklin';
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Optimize images
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" for images below the fold
            if (!img.classList.contains('above-fold')) {
                img.loading = 'lazy';
            }
            
            // Add alt text if missing
            if (!img.alt) {
                img.alt = 'Image';
            }
            
            // Optimize image dimensions
            if (img.naturalWidth && img.naturalHeight) {
                // Aplicar dimensiones 100% para ocupar todo el contenedor
                // Excluir face-img e imágenes de herramientas para que mantengan su tamaño natural
                if (!img.style.width && !img.style.height && 
                    !img.src.includes('face-img') && 
                    !img.src.includes('img-tool')) {
                    img.style.width = '100%';
                    img.style.height = '100%';
                }
            }
        });
    }
    
    // Monitor Core Web Vitals
    function monitorCoreWebVitals() {
        if ('web-vital' in window) {
            // LCP (Largest Contentful Paint)
            webVitals.getLCP(metric => {
                console.log('LCP:', metric.value);
                if (metric.value > 2500) {
                    console.warn('LCP is above recommended threshold');
                }
            });
            
            // FID (First Input Delay)
            webVitals.getFID(metric => {
                console.log('FID:', metric.value);
                if (metric.value > 100) {
                    console.warn('FID is above recommended threshold');
                }
            });
            
            // CLS (Cumulative Layout Shift)
            webVitals.getCLS(metric => {
                console.log('CLS:', metric.value);
                if (metric.value > 0.1) {
                    console.warn('CLS is above recommended threshold');
                }
            });
        }
    }
    
    // Optimize CSS delivery
    function optimizeCSSDelivery() {
        const criticalCSS = `
            .s-intro { min-height: 60vh; }
            .navbar { position: fixed; top: 0; width: 100%; }
            .container { max-width: 1200px; margin: 0 auto; }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }
    
    // Initialize performance optimizations
    function initPerformance() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPerformance);
            return;
        }
        
        initLazyLoading();
        preloadCriticalResources();
        optimizeFontLoading();
        optimizeImages();
        optimizeCSSDelivery();
        
        // Monitor performance after page load
        window.addEventListener('load', () => {
            setTimeout(monitorCoreWebVitals, 1000);
        });
    }
    
    // Start performance optimizations
    initPerformance();
    
})();
