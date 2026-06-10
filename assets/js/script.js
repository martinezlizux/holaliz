/**
 * Main Entry Point - Portfolio Orchestrator
 * Modularized on 2026-06-09
 */

import { initThemeToggle } from './modules/theme.js';
import { initFullscreenMenu } from './modules/menu.js';
import { 
    initHeroAnimations, 
    initProjectsScrollAnimations, 
    initAboutAnimations, 
    initExperienceAnimations 
} from './modules/animations.js';
import { 
    initLazyVideos, 
    initScrollReveal, 
    initProjectScrollSpy 
} from './modules/utils.js';
import { initAnalyticsTracking } from './modules/analytics.js';

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Core Interactivity
    initThemeToggle();
    initFullscreenMenu();
    
    // 2. Visual Enhancements & Utilities
    initLazyVideos();
    initScrollReveal();
    initProjectScrollSpy();
    
    // 3. GSAP Animations
    initHeroAnimations();
    initProjectsScrollAnimations();
    initAboutAnimations();
    initExperienceAnimations();
    
    // 4. Analytics
    initAnalyticsTracking();

    console.log('Portfolio modules initialized successfully');
});

/**
 * Global Helpers (Maintaining compatibility with inline HTML calls)
 */
import { scrollToSection } from './modules/menu.js';
window.scrollToSection = scrollToSection;

// Legacy Isotope initialization (keeping jQuery dependency for now to avoid breaking changes)
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
