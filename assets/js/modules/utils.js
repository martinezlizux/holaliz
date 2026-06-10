/**
 * Utility Functions Module
 */

export function initLazyVideos() {
    const videos = document.querySelectorAll('video.lazy-video');
    if (!videos || videos.length === 0) return;

    const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const v = entry.target;
                if (v.dataset && v.dataset.src && !v.dataset.loaded) {
                    if (v.dataset.poster) {
                        try { v.poster = v.dataset.poster; } catch (e) { }
                    }
                    v.src = v.dataset.src;
                    try { v.load(); } catch (e) { }
                    v.play && v.play().catch(() => { });
                    v.dataset.loaded = '1';
                }
                observer.unobserve(v);
            }
        });
    }, { threshold: 0.2 });

    videos.forEach(v => {
        if (v.dataset && v.dataset.poster) {
            try { v.poster = v.dataset.poster; } catch (e) { }
        }
        if (!v.dataset.loaded) {
            v.removeAttribute('src');
        }
        io.observe(v);
    });
}

export function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

export function initProjectScrollSpy() {
    const navLinks = document.querySelectorAll('.project-nav-list .nav-link');
    if (!navLinks || navLinks.length === 0) return;

    const sectionIds = Array.from(navLinks).map(link => {
        const href = link.getAttribute('href');
        return href && href.startsWith('#') ? href.substring(1) : null;
    }).filter(id => id);

    const sections = sectionIds.map(id => document.getElementById(id)).filter(section => section);
    if (sections.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -40% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        let activeEntry = entries.find(entry => entry.isIntersecting);
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

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    const navHeight = document.querySelector('.project-nav')?.offsetHeight || 0;
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
