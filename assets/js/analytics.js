// Google Analytics Configuration for Static Site
(function() {
    'use strict';
    
    // Google Analytics ID
    const GA_ID = 'G-X271RK6RRK';
    
    // Initialize Google Analytics for static site
    function initGA() {
        if (typeof gtag !== 'undefined') {
            // Standard page view tracking for static site
            gtag('config', GA_ID, {
                'page_title': document.title,
                'page_location': window.location.href,
                'custom_map': {
                    'custom_parameter_1': 'user_type',
                    'custom_parameter_2': 'content_type'
                }
            });
            // Explicitly send a page_view event so we have a single controlled initial view
            try {
                gtag('event', 'page_view', {
                    'page_title': document.title,
                    'page_location': window.location.href,
                    'send_to': GA_ID
                });
            } catch (e) {
                // if gtag isn't ready for some reason, the retry wrapper will try again
                console.warn('Failed to send explicit page_view:', e);
            }
            
            console.log('Google Analytics initialized for static site');
        }
    }

    // Retry initGA until gtag is available (prevents losing the initial config if gtag is slow)
    function initGAWithRetry(retries = 10, delay = 500) {
        if (typeof gtag !== 'undefined') {
            initGA();
            return;
        }

        let attempts = 0;
        const t = setInterval(() => {
            attempts++;
            if (typeof gtag !== 'undefined') {
                clearInterval(t);
                initGA();
            } else if (attempts >= retries) {
                clearInterval(t);
                console.warn('GA init skipped: gtag not available after retries');
            }
        }, delay);
    }
    
    // Track custom events
    function trackEvent(eventName, eventCategory, eventAction, eventLabel, value) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'event_category': eventCategory,
                'event_action': eventAction,
                'event_label': eventLabel,
                'value': value
            });
            
            console.log('GA Event tracked:', eventName, eventCategory, eventAction, eventLabel);
        }
    }
    
    // Track form interactions
    function trackFormEvents() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            // Track form open
            const modal = document.getElementById('contactModal');
            if (modal) {
                modal.addEventListener('show.bs.modal', function() {
                    trackEvent('contact_form', 'engagement', 'form_open', 'contact_modal', 1);
                });
            }
            
            // Track form submission start
            contactForm.addEventListener('submit', function(e) {
                trackEvent('contact_form', 'engagement', 'form_submit_start', 'contact_form', 1);
            });
            
            // Track form validation errors
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('invalid', function() {
                    trackEvent('contact_form', 'error', 'validation_error', input.name, 1);
                });
            });
        }
    }
    
    // Track navigation clicks for static site
    function trackNavigation() {
        // Track scroll-to-section navigation (internal anchors)
        const navLinks = document.querySelectorAll('a[href^="#"], .fullscreen-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const text = this.textContent.trim();
                
                if (href && href.startsWith('#')) {
                    const sectionName = href.replace('#', '');
                    trackEvent('navigation', 'engagement', 'scroll_to_section', sectionName, 1);
                }
            });
        });
        
        // Track external links
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        externalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Track external links (not same domain)
                if (!href.includes(window.location.hostname)) {
                    const linkText = this.textContent.trim() || 'External Link';
                    trackEvent('navigation', 'engagement', 'external_link', href, 1);
                }
                
                // Track social media links
                if (href.includes('linkedin.com') || href.includes('behance.net') || href.includes('zeeg.me')) {
                    trackEvent('social', 'engagement', 'social_click', href, 1);
                }
            });
        });
        
        // Track portfolio project clicks
        const portfolioLinks = document.querySelectorAll('a[href*="portfolio/"], a[href*=".html"]');
        portfolioLinks.forEach(link => {
            link.addEventListener('click', function() {
                const href = this.getAttribute('href');
                const projectName = this.textContent.trim() || 'Portfolio Project';
                trackEvent('portfolio', 'engagement', 'project_view', projectName, 1);
            });
        });
    }
    
    // Track section views using Intersection Observer
    function trackSectionViews() {
        const sections = document.querySelectorAll('#intro, #about, #work, #resume, #contact');
        
        if (sections.length > 0) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
                        trackEvent('section_view', 'engagement', 'section_visited', sectionName, 1);
                    }
                });
            }, {
                threshold: 0.5, // Track when 50% of section is visible
                rootMargin: '0px 0px -100px 0px'
            });
            
            sections.forEach(section => {
                sectionObserver.observe(section);
            });
        }
    }
    
    // Track fullscreen menu usage
    function trackMenuUsage() {
        const menuToggler = document.querySelector('.navbar-toggler');
        const fullscreenMenu = document.getElementById('fullscreenMenu');
        
        if (menuToggler && fullscreenMenu) {
            // Track menu open
            fullscreenMenu.addEventListener('show.bs.collapse', function() {
                trackEvent('menu', 'engagement', 'fullscreen_menu_open', 'hamburger_click', 1);
            });
            
            // Track menu close
            fullscreenMenu.addEventListener('hide.bs.collapse', function() {
                trackEvent('menu', 'engagement', 'fullscreen_menu_close', 'menu_close', 1);
            });
        }
    }
    
    // Track time on page
    function trackTimeOnPage() {
        let startTime = Date.now();
        
        window.addEventListener('beforeunload', function() {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            trackEvent('engagement', 'time_on_page', 'page_exit', document.title, timeOnPage);
        });
    }
    
    // Track contact form success
    function trackContactSuccess() {
        // This will be called from contact-form.js when form is successfully submitted
        window.trackContactSuccess = function() {
            trackEvent('contact_form', 'conversion', 'form_submit_success', 'contact_form', 1);
        };
    }
    
    // Initialize all tracking when DOM is ready
    function initTracking() {
        // Try to initialize GA but don't block other trackers — retry if gtag isn't loaded yet
        initGAWithRetry();
        trackFormEvents();
        trackNavigation();
        trackSectionViews();
        trackMenuUsage();
        trackTimeOnPage();
        trackContactSuccess();
        
        console.log('Google Analytics tracking initialized for static site');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTracking);
    } else {
        initTracking();
    }
    
    // Export functions for external use
    window.GATracking = {
        trackEvent: trackEvent,
        trackContactSuccess: function() {
            trackEvent('contact_form', 'conversion', 'form_submit_success', 'contact_form', 1);
        }
    };
    
})();
