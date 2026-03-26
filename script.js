
// ── Register GSAP plugins globally ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
        const plugins = [ScrollTrigger, Draggable].filter(Boolean);
        if (plugins.length) gsap.registerPlugin(...plugins);
    }
});

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
    
    // Inicializar Hero Animations
    initHeroAnimations();
    
    // Inicializar Projects Scroll Animations
    initProjectsScrollAnimations();

    // Inicializar About Me Animations
    initAboutAnimations();

    // Inicializar Experience Animations
    initExperienceAnimations();

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

// Hero GSAP Animations
function initHeroAnimations() {
    // Make sure GSAP is loaded
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
    
    // Initial state: hide elements
    gsap.set(".hero-logo", { y: -20, opacity: 0 });
    gsap.set(".nav-links a", { y: -20, opacity: 0 });
    gsap.set(".btn-lets-talk", { y: -20, opacity: 0 });
    gsap.set(".hero-huge-title", { y: 60, opacity: 0, scale: 0.95 });
    gsap.set(".hero-subtitle", { y: 30, opacity: 0 });
    gsap.set(".btn-lime", { y: 30, opacity: 0, scale: 0.9 });

    // Play Sequence
    tl.to(".hero-logo", { y: 0, opacity: 1, duration: 0.8 })
      .to(".nav-links a, .btn-lets-talk", { 
          y: 0, 
          opacity: 1, 
          duration: 0.6,
          stagger: 0.1 
      }, "-=0.6")
      .to(".hero-huge-title", {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "expo.out"
      }, "-=0.2")
      .to(".hero-subtitle", {
          y: 0,
          opacity: 1,
          duration: 0.8
      }, "-=0.8")
      .to(".btn-lime", {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.5)"
      }, "-=0.6");
}

// Projects Transition & Horizontal Scroll Animations
function initProjectsScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // 1. Background Color Transition
    // Animate background color of transition section smoothly
    const transitionSection = document.getElementById("projects-transition");
    if (transitionSection) {
        gsap.to(transitionSection, {
            scrollTrigger: {
                trigger: transitionSection,
                start: "top center",
                end: "center center",
                scrub: 1
            },
            backgroundColor: "#F2EEFC", // final color
            ease: "none"
        });
    }

    // 2. Horizontal Scroll Section
    const horizontalSection = document.getElementById("projects-horizontal");
    const wrapper = document.getElementById("horizontalScrollWrapper");
    
    if (horizontalSection && wrapper) {
        function getScrollAmount() {
            let wrapperWidth = wrapper.scrollWidth;
            // Subtract innerWidth so the last card aligns with the right edge
            // We can also subtract padding to keep margins
            return -(wrapperWidth - window.innerWidth + 100); 
        }

        ScrollTrigger.matchMedia({
            // Desktop & Tablet (Horizontal scroll)
            "(min-width: 768px)": function() {
                const tween = gsap.to(wrapper, {
                    x: getScrollAmount,
                    ease: "none"
                });

                ScrollTrigger.create({
                    trigger: horizontalSection,
                    start: "top top",
                    end: () => `+=${getScrollAmount() * -1}`,
                    pin: true,
                    animation: tween,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    markers: false
                });
            },
            
            // Mobile Phone (Vertical stack animations)
            "(max-width: 767px)": function() {
                const mobileCards = gsap.utils.toArray('.new-project-card, .horizontal-intro');
                
                mobileCards.forEach(card => {
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none none"
                        },
                        y: 40,
                        opacity: 0,
                        duration: 0.7,
                        ease: "power2.out"
                    });
                });
            }
        });
    }
}


// ============================================================
// ABOUT ME — GSAP Drop + Bounce + Fan + Draggable
// ============================================================
function initAboutAnimations() {
    const heading    = document.getElementById('about-heading');
    const tagline    = document.getElementById('about-tagline');
    const stats      = document.getElementById('about-stats');
    const badgesEl   = document.getElementById('about-badges');
    const cards      = document.querySelectorAll('.about-new__card');

    if (!heading || !cards.length) return;

    // -------------------------------------------------------
    // 1. TEXT — heading + tagline entrance on scroll
    // -------------------------------------------------------
    gsap.timeline({
        scrollTrigger: {
            trigger: '#about',
            start: 'top 75%',
            once: true
        }
    })
    .to(heading, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    .to(tagline, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4');

    // -------------------------------------------------------
    // 2. CARDS — fall from above, stagger, soft land, fan spread, Draggable
    // -------------------------------------------------------
    // Base positions ensuring they are fully spread out horizontally
    const isMobile = window.innerWidth < 768;
    const spreadMultiplier = isMobile ? 0.6 : 1;
    
    const basePositions = [
        { x: -220, y:  30 },   // dev      — far left
        { x: -100, y: -40 },   // adobe    — left
        { x:  100, y:  20 },   // procreate— right
        { x:  220, y: -30 },   // figma    — far right
        { x:    0, y:  10 }    // photo    — center, on top
    ];

    // Apply random offsets & scatter for organic feel
    const restingPositions = basePositions.map(pos => ({
        x: (pos.x * spreadMultiplier) + (Math.random() * (isMobile ? 30 : 60) - (isMobile ? 15 : 30)),
        y: pos.y + (Math.random() * 60 - 30),
        rotation: (Math.random() * 50 - 25)
    }));

    // Start all cards high above, invisible, straight up
    cards.forEach((card, i) => {
        const pos = restingPositions[i] || { x: 0, y: 0, rotation: 0 };
        gsap.set(card, {
            opacity: 0,
            x: pos.x,            // start at final x (falls straight down)
            y: -640,             // way above the viewport
            rotation: pos.rotation - 8,  // slight extra tilt mid-air
            transformOrigin: '50% 50%',
            zIndex: i + 1
        });
    });

    // Trigger the drop when section scrolls into view
    ScrollTrigger.create({
        trigger: '#about-stack',
        start: 'top 80%',
        once: true,
        onEnter: () => {
            cards.forEach((card, i) => {
                const pos = restingPositions[i] || { x: 0, y: 0, rotation: 0 };

                gsap.to(card, {
                    opacity: 1,
                    x: pos.x,
                    y: pos.y,
                    rotation: pos.rotation,
                    duration: 1.0,                      // longer = smoother feel
                    ease: 'power3.out',                 // elegant deceleration
                    delay: i * 0.14,
                    onComplete: () => {
                        if (i === cards.length - 1) enableDraggable();
                    }
                });
            });

            // Fade in the drag hint after the cards drop
            const dragHint = document.getElementById('drag-hint');
            if (dragHint) {
                gsap.to(dragHint, {
                    opacity: 1,
                    duration: 1.0,
                    delay: cards.length * 0.14 + 0.5,
                    ease: 'power2.out'
                });
            }
        }
    });

    // -------------------------------------------------------
    // 3. STATS + BADGES — scroll fade-in
    // -------------------------------------------------------
    gsap.timeline({
        scrollTrigger: {
            trigger: '#about-stats',
            start: 'top 85%',
            once: true
        }
    })
    .to(stats, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });

    const badgeItems = badgesEl ? badgesEl.querySelectorAll('.about-new__badge') : [];
    if (badgeItems.length) {
        gsap.timeline({
            scrollTrigger: {
                trigger: '#about-badges',
                start: 'top 90%',
                once: true
            }
        })
        .to(badgesEl, { opacity: 1, duration: 0.1 })
        .to(badgeItems, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: 'power2.out'
        }, '-=0.1');
    }

    // -------------------------------------------------------
    // 4. DRAGGABLE — called after last card lands
    // -------------------------------------------------------
    function enableDraggable() {
        if (typeof Draggable === 'undefined') return;

        Draggable.create('.about-new__card', {
            type: 'x,y',
            edgeResistance: 0.65,
            bounds: '.about-new',   // constrain inside the section
            inertia: false,
            onPress: function () {
                // Bring the grabbed card to the front
                gsap.set(this.target, { zIndex: 999 });
            },
            onRelease: function () {
                gsap.set(this.target, { zIndex: '' }); // remove forced z-index
            }
        });
    }
}

// ─── Experience Cards — GSAP Entrance & Interaction ──────────────────────────
function initExperienceAnimations() {
    const cards = document.querySelectorAll('.experience-card');
    if (!cards.length) return;

    // ── 1. ENTRANCE — fade + slide up with stagger ──
    gsap.set(cards, {
        opacity: 0,
        y: 36,
        boxShadow: '0px 0px 0px #9966E2',
    });

    ScrollTrigger.create({
        trigger: '#experience',
        start: 'top 72%',
        once: true,
        onEnter: () => {
            gsap.to(cards, {
                opacity: 1,
                y: 0,
                boxShadow: '4px 4px 0px #9966E2',
                duration: 0.5,
                ease: 'power2.out',
                stagger: 0.11,
            });
        },
    });

    // ── 2. HOVER — shadow grows, card lifts ──
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (parseFloat(gsap.getProperty(card, 'opacity')) < 0.5) return;
            gsap.to(card, {
                boxShadow: '6px 6px 0px #9966E2',
                y: '-=2',
                duration: 0.2,
                ease: 'power2.out',
                overwrite: 'auto',
            });
        });

        card.addEventListener('mouseleave', () => {
            const isExpanded = card.querySelector('.collapse.show');
            gsap.to(card, {
                boxShadow: isExpanded ? '6px 6px 0px #9966E2' : '4px 4px 0px #9966E2',
                y: 0,
                duration: 0.25,
                ease: 'power2.out',
                overwrite: 'auto',
            });
        });

        // ── 3. EXPAND — shadow grows on open, shrinks on close ──
        const collapseEl = card.querySelector('.collapse');
        if (!collapseEl) return;

        collapseEl.addEventListener('show.bs.collapse', () => {
            gsap.timeline()
                .to(card, {
                    boxShadow: '8px 8px 0px #9966E2',
                    borderColor: '#9966E2',
                    duration: 0.25,
                    ease: 'power3.out',
                })
                .to(card, {
                    boxShadow: '6px 6px 0px #9966E2',
                    duration: 0.2,
                    ease: 'power2.inOut',
                });
        });

        collapseEl.addEventListener('hide.bs.collapse', () => {
            gsap.to(card, {
                boxShadow: '4px 4px 0px #9966E2',
                borderColor: '#0b0b0b',
                duration: 0.25,
                ease: 'power2.out',
            });
        });
    });
}
