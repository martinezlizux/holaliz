(function(){

    'use strict';


    var $projects = $('.projects');

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

    $('.card').mouseenter(function(){

        $(this).find('.card-overlay').css({'top': '-100%'});
        $(this).find('.card-hover').css({'top':'0'});

    }).mouseleave(function(){

        $(this).find('.card-overlay').css({'top': '0'});
        $(this).find('.card-hover').css({'top':'100%'});

    });

})(jQuery);

// Animación de máquina de escribir para el título
$(document).ready(function() {
    const titles = ['UX Designer', 'Product Designer', 'Creative Problem Solver', 'Research-Driven', 'Full-Stack Designer', 'Innovative Thinker', 'Adaptable & Agile', 'Passionate Creator', 'Detail-Oriented'];
    const $titleElement = $('#rotatingTitle');
    let currentIndex = 0;
    
    console.log('Iniciando animación de máquina de escribir...', $titleElement.length);
    
    if ($titleElement.length > 0) {
        function typeWriter(text, element, callback) {
            let i = 0;
            element.text('');
            
            function type() {
                if (i < text.length) {
                    element.text(element.text() + text.charAt(i));
                    i++;
                    setTimeout(type, 100); // Velocidad de tipeo: 100ms por letra
                } else if (callback) {
                    setTimeout(callback, 2000); // Pausa 2 segundos después de completar
                }
            }
            type();
        }
        
        function eraseText(element, callback) {
            const currentText = element.text();
            let i = currentText.length;
            
            function erase() {
                if (i > 0) {
                    element.text(currentText.substring(0, i - 1));
                    i--;
                    setTimeout(erase, 50); // Velocidad de borrado: 50ms por letra
                } else if (callback) {
                    setTimeout(callback, 500); // Pausa 500ms después de borrar
                }
            }
            erase();
        }
        
        function startTypewriterCycle() {
            currentIndex = (currentIndex + 1) % titles.length;
            const nextTitle = titles[currentIndex];
            
            console.log('Escribiendo:', nextTitle);
            
            // Borrar el texto actual y luego escribir el nuevo
            eraseText($titleElement, function() {
                typeWriter(nextTitle, $titleElement, function() {
                    // Después de escribir, esperar antes del próximo ciclo
                    setTimeout(startTypewriterCycle, 3000); // Esperar 3 segundos antes del próximo cambio
                });
            });
        }
        
        // Iniciar el primer ciclo después de 3 segundos
        setTimeout(startTypewriterCycle, 3000);
        
        console.log('Animación de máquina de escribir configurada correctamente');
    } else {
        console.error('No se encontró el elemento con ID rotatingTitle');
    }
});

// Single Page Application (SPA) System
$(document).ready(function() {
    const contentContainer = $('#dynamic-content');
    const menuItems = $('.navbar-nav a[data-page]');
    
    // Variable para rastrear la página actual
    let currentPage = null;
    
    // Función para cargar contenido dinámicamente
    function loadContent(page) {
        const contentArea = $('#dynamic-content');
        const previousPage = currentPage;
        
        // Actualizar menú activo
        menuItems.removeClass('active');
        $(`a[data-page="${page}"]`).addClass('active');
        
        // Fade out del contenido actual
        contentArea.fadeOut(300, function() {
            // Cargar nuevo contenido con AJAX
            $.ajax({
                url: `content/${page}.html`,
                type: 'GET',
                success: function(data) {
                    // Reemplazar contenido y hacer fade in
                    contentArea.html(data).addClass('content-fade-in').fadeIn(400, function() {
                        // Una vez que el contenido se ha cargado completamente, rastrear en GA
                        if (window.GATracking) {
                            // Rastrear navegación si hay página previa
                            if (previousPage && previousPage !== page) {
                                window.GATracking.trackSPANavigation(previousPage, page);
                            }
                            
                            // Rastrear vista de página virtual
                            window.GATracking.trackSPAPageView(page);
                        }
                        
                        // Actualizar página actual
                        currentPage = page;
                    });
                },
                error: function() {
                    // Mostrar mensaje de error con fade in
                    const errorContent = '<div class="alert alert-danger text-center">Error loading content. Please try again.</div>';
                    contentArea.html(errorContent).addClass('content-fade-in').fadeIn(400);
                    
                    // Rastrear error en GA
                    if (window.GATracking) {
                        window.GATracking.trackEvent('error', 'ajax_load_failed', page, page, 1);
                    }
                }
            });
        });
    }
    
    // Manejar clicks en el menú
    menuItems.on('click', function(e) {
        e.preventDefault();
        const page = $(this).data('page');
        
        // Actualizar URL sin recargar la página
        history.pushState({page: page}, '', `#${page}`);
        
        // Cargar contenido
        loadContent(page);
    });
    
    // Manejar navegación del navegador (botón atrás/adelante)
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.page) {
            const page = e.state.page;
            loadContent(page);
            
            // Rastrear navegación desde historial
            if (window.GATracking) {
                window.GATracking.trackEvent('engagement', 'browser_back_navigation', page, page, 1);
            }
        } else {
            // Si no hay estado, cargar la página de trabajo por defecto
            loadContent('work');
        }
    });
    
    // Cargar contenido inicial basado en la URL
    function loadInitialContent() {
        const hash = window.location.hash.substring(1); // Remover el #
        const page = hash || 'work'; // Por defecto cargar 'work'
        
        // Establecer estado inicial
        history.replaceState({page: page}, '', `#${page}`);
        
        // Cargar contenido inicial
        loadContent(page);
        
        // Rastrear carga inicial de la aplicación
        if (window.GATracking) {
            window.GATracking.trackEvent('engagement', 'spa_app_loaded', page, document.title, 1);
        }
    }
    
    // Inicializar la aplicación
    loadInitialContent();
    
    console.log('Sistema SPA inicializado correctamente');
});