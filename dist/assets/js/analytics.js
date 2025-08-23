/* Version: 1.0.0 | Hash: b22ae02b | Build: 2025-08-23T04:38:22.835Z */
// Google Analytics Configuration and Custom Event Tracking
(function() {
    'use strict';
    
    // Google Analytics ID
    const GA_ID = 'G-X271RK6RRK';
    
    // Initialize Google Analytics
    function initGA() {
        if (typeof gtag !== 'undefined') {
            // Page view tracking
            gtag('config', GA_ID, {
                'page_title': document.title,
                'page_location': window.location.href,
                'custom_map': {
                    'custom_parameter_1': 'user_type',
                    'custom_parameter_2': 'page_category'
                }
            });
            
            // Track page views for SPA-like behavior
            if (window.history && window.history.pushState) {
                window.addEventListener('popstate', function() {
                    gtag('config', GA_ID, {
                        'page_title': document.title,
                        'page_location': window.location.href
                    });
                });
            }
        }
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
    
    // Track navigation clicks
    function trackNavigation() {
        const navLinks = document.querySelectorAll('a[href]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const text = this.textContent.trim();
                
                // Track internal navigation
                if (href.startsWith('./') || href.startsWith('/') || href.includes('.html')) {
                    trackEvent('navigation', 'engagement', 'internal_link', text, 1);
                }
                
                // Track external links
                if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                    trackEvent('navigation', 'engagement', 'external_link', href, 1);
                }
                
                // Track social media links
                if (href.includes('linkedin.com') || href.includes('behance.net') || href.includes('zeeg.me')) {
                    trackEvent('social', 'engagement', 'social_click', href, 1);
                }
            });
        });
    }
    
    // Track portfolio project views
    function trackPortfolioViews() {
        const portfolioLinks = document.querySelectorAll('a[href*="portfolio/"]');
        portfolioLinks.forEach(link => {
            link.addEventListener('click', function() {
                const projectName = this.textContent.trim();
                trackEvent('portfolio', 'engagement', 'project_view', projectName, 1);
            });
        });
    }
    
    // Track scroll depth
    function trackScrollDepth() {
        let maxScroll = 0;
        let scrollTracked = false;
        
        window.addEventListener('scroll', function() {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track scroll milestones
                if (scrollPercent >= 25 && !scrollTracked) {
                    trackEvent('scroll', 'engagement', 'scroll_depth', '25%', 25);
                    scrollTracked = true;
                } else if (scrollPercent >= 50) {
                    trackEvent('scroll', 'engagement', 'scroll_depth', '50%', 50);
                } else if (scrollPercent >= 75) {
                    trackEvent('scroll', 'engagement', 'scroll_depth', '75%', 75);
                } else if (scrollPercent >= 90) {
                    trackEvent('scroll', 'engagement', 'scroll_depth', '90%', 90);
                }
            }
        });
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
        initGA();
        trackFormEvents();
        trackNavigation();
        trackPortfolioViews();
        trackScrollDepth();
        trackTimeOnPage();
        trackContactSuccess();
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
