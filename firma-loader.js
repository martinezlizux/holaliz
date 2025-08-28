/**
 * Función para cargar e insertar la firma al final de un caso de estudio
 * @param {string} contenedorId - ID del elemento donde se insertará la firma
 */
function cargarFirma(contenedorId) {
    // Obtener el elemento contenedor
    const contenedor = document.getElementById(contenedorId);
    
    // Si no existe el contenedor, salir de la función
    if (!contenedor) {
        console.warn(`No se encontró el contenedor con ID: ${contenedorId}`);
        return;
    }
    
    // Determinar la ruta correcta para la imagen
    // Esto maneja diferentes niveles de carpetas
    let rutaImagen = 'images/face-img.png';
    const pathDepth = window.location.pathname.split('/').length - 2;
    if (pathDepth > 0) {
        rutaImagen = '../'.repeat(pathDepth) + 'images/face-img.png';
    }
    
    // Contenido HTML de la firma (incrustado para evitar problemas de CORS)
    const firmaHTML = `
        <div class="signature-container">
            <img src="${rutaImagen}" alt="Foto de Lizbeth Martinez" class="signature-image">
            <div class="signature-content">
                <h3 class="signature-name">Lizbeth Martinez</h3>
                <p class="signature-title">UX Designer</p>
            </div>
        </div>
    `;
    
    // Insertar la firma directamente en el contenedor
    contenedor.innerHTML = firmaHTML;
}

/**
 * Función para cargar la firma al final del documento
 */
function cargarFirmaAlFinal() {
    // Crear un contenedor para la firma al final del cuerpo
    const firmaContainer = document.createElement('div');
    firmaContainer.id = 'firma-contenedor';
    document.body.appendChild(firmaContainer);
    
    // Cargar la firma en el contenedor
    cargarFirma('firma-contenedor');
}