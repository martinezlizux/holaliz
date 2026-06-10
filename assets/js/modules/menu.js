/**
 * Fullscreen Menu Logic
 */
export function initFullscreenMenu() {
    const toggler = document.querySelector('.navbar-toggler');
    const fullscreenMenu = document.getElementById('fullscreenMenu');
    const navbar = document.querySelector('.navbar');
    const menuLinks = document.querySelectorAll('.fullscreen-nav-link');

    if (toggler && fullscreenMenu) {
        console.log('Inicializando menú fullscreen');

        toggler.classList.add('collapsed');
        toggler.setAttribute('aria-expanded', 'false');

        fullscreenMenu.addEventListener('show.bs.collapse', function () {
            fullscreenMenu.style.display = 'flex';
            if (navbar) {
                navbar.classList.add('menu-open');
            }
            requestAnimationFrame(() => {
                toggler.classList.remove('collapsed');
                document.body.style.overflow = 'hidden';
            });
        });

        fullscreenMenu.addEventListener('shown.bs.collapse', function () {
            console.log('Menú fullscreen completamente abierto');
        });

        fullscreenMenu.addEventListener('hide.bs.collapse', function () {
            toggler.classList.add('collapsed');
        });

        fullscreenMenu.addEventListener('hidden.bs.collapse', function () {
            document.body.style.overflow = '';
            requestAnimationFrame(() => {
                if (navbar) {
                    navbar.classList.remove('menu-open');
                }
            });
            console.log('Menú fullscreen completamente cerrado');
        });

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
    }
}

/**
 * Smooth scroll navigation system
 */
export function scrollToSection(event, sectionId) {
    event.preventDefault();

    const fullscreenMenu = document.getElementById('fullscreenMenu');
    if (fullscreenMenu && fullscreenMenu.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(fullscreenMenu, {
            toggle: false
        });
        bsCollapse.hide();

        const toggler = document.querySelector('.navbar-toggler');
        if (toggler) {
            toggler.classList.add('collapsed');
            toggler.setAttribute('aria-expanded', 'false');
        }
    }

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        if (window.GATracking) {
            window.GATracking.trackEvent('navigation', `scroll_to_${sectionId}`, `${sectionId}_section`, 'internal_link', 1);
        }
    }
}
