// Animación de máquina de escribir para el título
$(document).ready(function() {
    const titles = ['UX Designer', 'Product Designer', 'Creative Problem Solver', 'Research-Driven', 'Full-Stack Designer', 'Innovative Thinker', 'Adaptable & Agile', 'Passionate Creator', 'Detail-Oriented'];
    const $titleElement = $('#rotatingTitle');
    let currentIndex = 0;
    
    console.log('Iniciando animación de máquina de escribir...', $titleElement.length);
    
    if ($titleElement.length > 0) {
        function startTypewriterCycle() {
            currentIndex = (currentIndex + 1) % titles.length;
            const nextTitle = titles[currentIndex];
            
            console.log('Escribiendo:', nextTitle);
            
            // Usar transición directa sin borrado para evitar saltos
            // Fade out, cambiar texto, fade in
            $titleElement.css('opacity', '0');
            
            setTimeout(function() {
                $titleElement.text(nextTitle);
                $titleElement.css('opacity', '1');
                
                // Después de mostrar, esperar antes del próximo ciclo
                setTimeout(startTypewriterCycle, 3000);
            }, 300); // 300ms para el fade
        }
        
        // Iniciar el primer ciclo después de 3 segundos
        setTimeout(startTypewriterCycle, 3000);
        
        console.log('Animación de máquina de escribir configurada correctamente');
    } else {
        console.error('No se encontró el elemento con ID rotatingTitle');
    }
});

// Función para manejar el menú hamburguesa
function initFullscreenMenu() {
    const toggler = document.querySelector('.navbar-toggler');
    const fullscreenMenu = document.getElementById('fullscreenMenu');
    const navbar = document.querySelector('.navbar');
    const menuLinks = document.querySelectorAll('.fullscreen-nav-link');
    
    if (toggler && fullscreenMenu) {
        console.log('Inicializando menú fullscreen');
        
        // Asegurar estado inicial correcto
        toggler.classList.add('collapsed');
        toggler.setAttribute('aria-expanded', 'false');
        
        // Escuchar eventos de Bootstrap collapse
        fullscreenMenu.addEventListener('show.bs.collapse', function() {
            // Preparar el menú para la animación
            fullscreenMenu.style.display = 'flex';
            
            // Agregar clase inmediatamente para evitar el salto
            if (navbar) {
                navbar.classList.add('menu-open');
            }
            
            // Usar requestAnimationFrame para asegurar que el DOM se actualice
            requestAnimationFrame(() => {
                toggler.classList.remove('collapsed');
                document.body.style.overflow = 'hidden';
            });
        });
        
        fullscreenMenu.addEventListener('shown.bs.collapse', function() {
            // El menú está completamente abierto
            console.log('Menú fullscreen completamente abierto');
        });
        
        fullscreenMenu.addEventListener('hide.bs.collapse', function() {
            // Iniciar animación de cierre
            toggler.classList.add('collapsed');
        });
        
        fullscreenMenu.addEventListener('hidden.bs.collapse', function() {
            // El menú está completamente cerrado
            document.body.style.overflow = '';
            
            // Usar requestAnimationFrame para suavizar la transición
            requestAnimationFrame(() => {
                // Remover clase del navbar después de la animación
                if (navbar) {
                    navbar.classList.remove('menu-open');
                }
            });
            
            console.log('Menú fullscreen completamente cerrado');
        });
        
        // Cerrar menú al hacer click en un enlace
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (fullscreenMenu.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(fullscreenMenu, {
                        toggle: false
                    });
                    bsCollapse.hide();
                }
            });
        });
        
        console.log('Menú fullscreen configurado correctamente');
    }
}

// Smooth scroll navigation system
function scrollToSection(event, sectionId) {
    event.preventDefault();
    
    // Cerrar el menú fullscreen si está abierto
    const fullscreenMenu = document.getElementById('fullscreenMenu');
    if (fullscreenMenu && fullscreenMenu.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(fullscreenMenu, {
            toggle: false
        });
        bsCollapse.hide();
        
        // Resetear el estado del hamburger
        const toggler = document.querySelector('.navbar-toggler');
        if (toggler) {
            toggler.classList.add('collapsed');
            toggler.setAttribute('aria-expanded', 'false');
        }
    }
    
    // Scroll suave a la sección correspondiente
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Rastrear evento en GA
        if (window.GATracking) {
            window.GATracking.trackEvent('navigation', `scroll_to_${sectionId}`, `${sectionId}_section`, 'internal_link', 1);
        }
    }
}

// Proyecto grid filters (Isotope)
$(document).ready(function() {
    var $projects = $('.projects');

    if ($projects.length > 0) {
        $projects.isotope({
            itemSelector: '.item',
            layoutMode: 'fitRows'
        });

        $('ul.filters > li').on('click', function(e){
            e.preventDefault();

            var filter = $(this).attr('data-filter');

            $('ul.filters > li').removeClass('active');
            $(this).addClass('active');

            $projects.isotope({filter: filter});
        });
    }

    $('.card').mouseenter(function(){
        $(this).find('.card-overlay').css({'top': '-100%'});
        $(this).find('.card-hover').css({'top':'0'});
    }).mouseleave(function(){
        $(this).find('.card-overlay').css({'top': '0'});
        $(this).find('.card-hover').css({'top':'100%'});
    });
});

// Función para animaciones interesantes con efectos escalonados
function initInterestingAnimations() {
    const projectContainers = document.querySelectorAll('.project-container');
    
    // Preparar animaciones para contenedores y tarjetas
    projectContainers.forEach(container => {
        // Agregar clase de animación al contenedor
        container.classList.add('fade-animation');
        
        // Agregar clases de animación a las tarjetas dentro del contenedor
        const showCards = container.querySelectorAll('.show-card');
        showCards.forEach(card => {
            card.classList.add('card-animation');
        });
    });
    
    // Observer para contenedores principales
    const containerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animar el contenedor
                entry.target.classList.add('visible');
                
                // Animar las tarjetas con delay más rápido
                const showCards = entry.target.querySelectorAll('.show-card');
                showCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, 100 + (index * 80)); // Delay más rápido: 100ms, 180ms, 260ms...
                });
                
                // Dejar de observar para que la animación sea permanente
                containerObserver.unobserve(entry.target);
                
                // Tracking para analytics
                if (window.GATracking) {
                    const projectClass = entry.target.className.match(/p-(\w+)/);
                    if (projectClass) {
                        window.GATracking.trackEvent('engagement', 'project_container_viewed', projectClass[1], 'scroll_animation', 1);
                    }
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px' // Se activa más temprano
    });
    
    // Observar todos los contenedores
    projectContainers.forEach(container => {
        containerObserver.observe(container);
    });
    
    console.log(`Animaciones interesantes inicializadas para ${projectContainers.length} proyectos`);
}

// Lazy-load videos: set src when video enters viewport to avoid heavy initial loads
function initLazyVideos() {
    const videos = document.querySelectorAll('video.lazy-video');
    if (!videos || videos.length === 0) return;

    const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const v = entry.target;
                if (v.dataset && v.dataset.src && !v.dataset.loaded) {
                    // set poster if available (will be generated by the helper script)
                    if (v.dataset.poster) {
                        try { v.poster = v.dataset.poster; } catch (e) { /* ignore */ }
                    }

                    v.src = v.dataset.src;
                    try { v.load(); } catch (e) { /* ignore */ }
                    // attempt to autoplay (muted videos should autoplay on most browsers)
                    v.play && v.play().catch(()=>{});
                    v.dataset.loaded = '1';
                }
                observer.unobserve(v);
            }
        });
    }, { threshold: 0.2 });

    videos.forEach(v => {
        // set poster immediately (so a thumbnail appears) if provided
        if (v.dataset && v.dataset.poster) {
            try { v.poster = v.dataset.poster; } catch (e) { /* ignore */ }
        }

        // ensure no src is present so browser won't preload
        if (!v.dataset.loaded) {
            v.removeAttribute('src');
        }
        io.observe(v);
    });
}

// Initialize tracking and interesting animations when page loads
$(document).ready(function() {
    // Rastrear carga inicial del sitio estático
    if (window.GATracking) {
        window.GATracking.trackEvent('engagement', 'static_portfolio_loaded', 'home_page', document.title, 1);
    }
    
    // Inicializar animaciones interesantes
    initInterestingAnimations();
    
    // Inicializar lazy-load para videos
    initLazyVideos();
    
    // Inicializar menú fullscreen
    initFullscreenMenu();
    
    console.log('Sistema con animaciones y menú fullscreen inicializado correctamente');
});