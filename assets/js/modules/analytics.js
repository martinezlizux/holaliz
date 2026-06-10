/**
 * Unified Analytics Tracking Module (ES Module)
 * Combines legacy page tracking with modular event tracking.
 * Avoids duplicate page views and exports GATracking globally.
 */

const GA_ID = 'G-X271RK6RRK';

// Helper to track events safely
export function trackGAEvent(eventName, params = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, params);
    } else if (window.gtag) {
        window.gtag('event', eventName, params);
    } else {
        // Fallback buffer if gtag is not ready yet
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: eventName,
            ...params
        });
    }
}

export function initAnalyticsTracking() {
    // 1. Export GATracking to window for compatibility with contact-form.js
    window.GATracking = {
        trackEvent: (eventName, category, action, label, value) => {
            trackGAEvent(eventName, {
                event_category: category,
                event_action: action,
                event_label: label,
                value: value
            });
        },
        trackContactSuccess: () => {
            trackGAEvent('contact_form_success', {
                event_category: 'Conversion',
                event_label: 'Contact Form Success'
            });
        }
    };

    // 2. Track Project Clicks
    const projectLinks = document.querySelectorAll('.card-link-wrapper, a[href*="portfolio/"]');
    projectLinks.forEach(link => {
        link.addEventListener('click', () => {
            const cardTitle = link.querySelector('.card-title')?.innerText.trim();
            const projectTitle = cardTitle || link.textContent.trim() || link.getAttribute('href');
            trackGAEvent('project_click', {
                event_category: 'Engagement',
                event_label: projectTitle,
                project_name: projectTitle
            });
        });
    });

    // 3. Track Contact Button and Email Clicks
    const contactBtns = document.querySelectorAll('[data-bs-target="#contactModal"], [data-bs-target="#exampleModal"], a[href^="mailto:"]');
    contactBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const label = btn.getAttribute('href') || 'Modal Contact Trigger';
            trackGAEvent('contact_click', {
                event_category: 'Engagement',
                event_label: label
            });
        });
    });

    // 4. Track Fullscreen Menu Usage
    const menuToggler = document.querySelector('.navbar-toggler');
    const fullscreenMenu = document.getElementById('fullscreenMenu');
    if (fullscreenMenu) {
        fullscreenMenu.addEventListener('show.bs.collapse', () => {
            trackGAEvent('menu_open', {
                event_category: 'Engagement',
                event_label: 'Fullscreen Menu Open'
            });
        });
        fullscreenMenu.addEventListener('hide.bs.collapse', () => {
            trackGAEvent('menu_close', {
                event_category: 'Engagement',
                event_label: 'Fullscreen Menu Close'
            });
        });
    }

    // 5. Track Form Interactions (Modal Show, Input Errors)
    const contactForm = document.getElementById('contactForm');
    const contactModal = document.getElementById('contactModal');
    
    if (contactModal) {
        contactModal.addEventListener('show.bs.modal', () => {
            trackGAEvent('form_open', {
                event_category: 'Engagement',
                event_label: 'Contact Modal Opened'
            });
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            trackGAEvent('form_submit_start', {
                event_category: 'Engagement',
                event_label: 'Contact Form Submission Started'
            });
        });

        // Track validation errors
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('invalid', () => {
                trackGAEvent('form_validation_error', {
                    event_category: 'Error',
                    event_label: input.name
                });
            });
        });
    }

    // 6. Track Section Views using Intersection Observer
    const sections = document.querySelectorAll('#intro, #about, #work, #resume, #contact');
    if (sections.length > 0 && 'IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
                    trackGAEvent('section_view', {
                        event_category: 'Engagement',
                        event_label: sectionName
                    });
                }
            });
        }, {
            threshold: 0.5, // 50% of the section is visible
            rootMargin: '0px 0px -100px 0px'
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // 7. Track Scroll to Bottom
    let bottomScrolled = false;
    window.addEventListener('scroll', () => {
        if (!bottomScrolled && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
            bottomScrolled = true;
            trackGAEvent('scroll_bottom', {
                event_category: 'Engagement',
                event_label: 'User reached the bottom of the page'
            });
        }
    });

    // 8. Track Navigation Clicks (anchors and external links)
    const navLinks = document.querySelectorAll('a[href^="#"], .fullscreen-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                trackGAEvent('navigation', {
                    event_category: 'Engagement',
                    event_action: 'scroll_to_section',
                    event_label: href.replace('#', '')
                });
            }
        });
    });

    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            if (href && !href.includes(window.location.hostname)) {
                trackGAEvent('external_link_click', {
                    event_category: 'Engagement',
                    event_label: href
                });
                
                // Track social specific clicks
                if (href.includes('linkedin.com') || href.includes('zeeg.me')) {
                    trackGAEvent('social_click', {
                        event_category: 'Engagement',
                        event_label: href
                    });
                }
            }
        });
    });

    // 9. Track Time on Page (beforeunload)
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackGAEvent('time_on_page', {
            event_category: 'Engagement',
            event_label: document.title,
            value: timeOnPage
        });
    });

    console.log('Unified analytics tracking module initialized successfully');
}
