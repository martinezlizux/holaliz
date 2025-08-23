// Service Worker para Portfolio Website
// Maneja cache y versionado de assets

const CACHE_NAME = 'holaliz-portfolio-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Archivos a cachear estáticamente
const STATIC_FILES = [
    '/',
    '/index.html',
    '/aboutme.html',
    '/resume.html',
    '/assets/css/style.css',
    '/assets/css/fontawesome.css',
    '/assets/js/script.js',
    '/assets/js/contact-form.js',
    '/assets/js/analytics.js',
    '/assets/js/performance.js',
    '/assets/js/version-manager.js',
    '/images/face-img.png',
    '/images/logo.png',
    '/robots.txt',
    '/sitemap.xml'
];

// Archivos de portfolio
const PORTFOLIO_FILES = [
    '/portfolio/Drivers-App.html',
    '/portfolio/rewards-points.html',
    '/portfolio/research-travelers.html',
    '/portfolio/Design-System.html',
    '/images/projects/BDDrivers/thumb-deep.png',
    '/images/projects/Rewards/thumb-deep.png',
    '/images/projects/Travelers-research/thumb-deep.png',
    '/images/projects/Storybook/thumb-deep.png'
];

// Estrategia de cache: Cache First para archivos estáticos
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Error en cache first:', error);
        return new Response('Network error', { status: 408 });
    }
}

// Estrategia de cache: Network First para HTML dinámico
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Network error', { status: 408 });
    }
}

// Estrategia de cache: Stale While Revalidate para CSS/JS
async function staleWhileRevalidate(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => cachedResponse);
    
    return cachedResponse || fetchPromise;
}

// Instalar Service Worker
self.addEventListener('install', event => {
    console.log('🚀 Service Worker instalando...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Cacheando archivos estáticos...');
                return cache.addAll([...STATIC_FILES, ...PORTFOLIO_FILES]);
            })
            .then(() => {
                console.log('✅ Service Worker instalado correctamente');
                return self.skipWaiting();
            })
    );
});

// Activar Service Worker
self.addEventListener('activate', event => {
    console.log('🔄 Service Worker activando...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('🗑️ Eliminando cache obsoleto:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker activado');
            return self.clients.claim();
        })
    );
});

// Interceptar requests
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Solo procesar requests del mismo origen
    if (url.origin !== location.origin) {
        return;
    }
    
    // Estrategia según tipo de archivo
    if (request.destination === 'style' || request.destination === 'script') {
        // CSS y JS: Stale While Revalidate
        event.respondWith(staleWhileRevalidate(request));
    } else if (request.destination === 'image') {
        // Imágenes: Cache First
        event.respondWith(cacheFirst(request));
    } else if (request.destination === 'document') {
        // HTML: Network First
        event.respondWith(networkFirst(request));
    } else {
        // Otros: Cache First
        event.respondWith(cacheFirst(request));
    }
});

// Manejar mensajes del cliente
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME,
            staticCache: STATIC_CACHE,
            dynamicCache: DYNAMIC_CACHE
        });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            }).then(() => {
                event.ports[0].postMessage({ success: true });
            })
        );
    }
});

// Manejar push notifications (futuro)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/images/logo.png',
            badge: '/images/logo.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Manejar clics en notifications
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});
