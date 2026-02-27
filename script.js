
// Theme Toggle Logic
function initThemeToggle() {
    const toggleButton = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;

    // Force light theme initially per user request
    htmlElement.setAttribute('data-theme', 'light');
    htmlElement.setAttribute('data-bs-theme', 'light');
    localStorage.setItem('theme', 'light');

    if (!toggleButton || !themeIcon) return;

    // Function to set theme for the toggle (if we re-enable it later)
    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        htmlElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            themeIcon.classList.remove('bi-moon-stars-fill');
            themeIcon.classList.add('bi-sun-fill');
            themeIcon.style.color = 'var(--color-white)'; // Sun is white/light
            toggleButton.setAttribute('aria-label', 'Switch to light mode');
        } else {
            themeIcon.classList.remove('bi-sun-fill');
            themeIcon.classList.add('bi-moon-stars-fill');
            themeIcon.style.color = ''; // Reset to default (inherit) or dark
            toggleButton.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    // Set initial icon state based on light theme
    setTheme('light');

    // Force light theme initially per user request
    setTheme('light');

    toggleButton.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

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
        fullscreenMenu.addEventListener('show.bs.collapse', function () {
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

        fullscreenMenu.addEventListener('shown.bs.collapse', function () {
            // El menú está completamente abierto
            console.log('Menú fullscreen completamente abierto');
        });

        fullscreenMenu.addEventListener('hide.bs.collapse', function () {
            // Iniciar animación de cierre
            toggler.classList.add('collapsed');
        });

        fullscreenMenu.addEventListener('hidden.bs.collapse', function () {
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
            link.addEventListener('click', function () {
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
$(document).ready(function () {
    var $projects = $('.projects');

    if ($projects.length > 0) {
        $projects.isotope({
            itemSelector: '.item',
            layoutMode: 'fitRows'
        });

        $('ul.filters > li').on('click', function (e) {
            e.preventDefault();

            var filter = $(this).attr('data-filter');

            $('ul.filters > li').removeClass('active');
            $(this).addClass('active');

            $projects.isotope({ filter: filter });
        });
    }

    $('.card').mouseenter(function () {
        $(this).find('.card-overlay').css({ 'top': '-100%' });
        $(this).find('.card-hover').css({ 'top': '0' });
    }).mouseleave(function () {
        $(this).find('.card-overlay').css({ 'top': '0' });
        $(this).find('.card-hover').css({ 'top': '100%' });
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
                    v.play && v.play().catch(() => { });
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
$(document).ready(function () {
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

    // Inicializar theme toggle
    initThemeToggle();

    // Inicializar scroll spy para navegaciones de proyectos
    initProjectScrollSpy();

    // Inicializar animaciones de revelado al scroll
    initScrollReveal();

    console.log('Sistema con animaciones y menú fullscreen inicializado correctamente');
});

// Function to handle reveal on scroll animations
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add class to trigger CSS animation
                entry.target.classList.add('is-visible');
                // Once it has revealed, we can stop observing this specific element
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        // Start animation a bit before it enters the viewport fully (20% threshold or margin)
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// Function for scroll spy to highlight active section in project navigation
function initProjectScrollSpy() {
    const navLinks = document.querySelectorAll('.project-nav-list .nav-link');
    if (!navLinks || navLinks.length === 0) return;

    // Obtener las secciones correspondientes a los enlaces
    const sectionIds = Array.from(navLinks).map(link => {
        const href = link.getAttribute('href');
        return href && href.startsWith('#') ? href.substring(1) : null;
    }).filter(id => id);

    const sections = sectionIds.map(id => document.getElementById(id)).filter(section => section);

    if (sections.length === 0) return;

    // Options for the IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -40% 0px', // Ajustado para activar sección desde el top
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        // Encontrar cual de las entradas intersecting tiene mayor intersección (handle overlapping)
        let activeEntry = entries.find(entry => entry.isIntersecting);

        // Si hay varios entrando a la vez, podríamos priorizar
        if (activeEntry) {
            const currentId = activeEntry.target.id;

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // Agregar smooth scroll a los clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    // El observer lo ajustará luego, pero lo activamos de inmediato para reaccionar al click
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');

                    // Consider the nav bar height (if sticky/fixed) to offset the scroll
                    const navHeight = document.querySelector('.project-nav')?.offsetHeight || 0;

                    // Smooth scroll con offset (si es necesario)
                    const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}