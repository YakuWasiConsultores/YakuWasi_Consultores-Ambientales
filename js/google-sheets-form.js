// Script para conectar el formulario con Google Sheets
document.addEventListener('DOMContentLoaded', function() {
    const scriptURL = 'GOOGLE_SCRIPT_URL'; // URL del script de Google Apps Script
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const initialButtonText = submitButton.innerHTML;
    
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        // Validación del formulario
        const nombre = document.getElementById('nombre').value;
        const correo = document.getElementById('correo').value;
        const mensaje = document.getElementById('mensaje').value;
        const servicio = document.getElementById('servicio').value;
        
        if (!nombre || !correo || !mensaje || !servicio) {
            showMessage('Por favor complete todos los campos obligatorios.', 'error');
            return;
        }
        
        // Validar formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            showMessage('Por favor ingrese un correo electrónico válido.', 'error');
            return;
        }
        
        // Cambiar estado del botón
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
        
        // Preparar datos para enviar
        const formData = new FormData(form);
        formData.append('fecha', new Date().toLocaleString());
        
        // Enviar datos a Google Sheets
        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.text();
            })
            .then(() => {
                showMessage('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
                form.reset();
            })
            .catch(error => {
                console.error('Error al enviar el formulario:', error);
                showMessage('Hubo un error al enviar el mensaje. Por favor intente nuevamente.', 'error');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = initialButtonText;
            });
    });
    
    // Función para mostrar mensajes
    function showMessage(message, type) {
        const messageContainer = document.getElementById('formMessage');
        if (!messageContainer) {
            const container = document.createElement('div');
            container.id = 'formMessage';
            container.className = type === 'success' 
                ? 'p-4 mb-4 rounded-lg bg-green-100 text-green-800' 
                : 'p-4 mb-4 rounded-lg bg-red-100 text-red-800';
            container.textContent = message;
            
            form.parentNode.insertBefore(container, form);
            
            // Eliminar mensaje después de 5 segundos
            setTimeout(() => {
                if (container.parentNode) {
                    container.parentNode.removeChild(container);
                }
            }, 5000);
        } else {
            messageContainer.className = type === 'success' 
                ? 'p-4 mb-4 rounded-lg bg-green-100 text-green-800' 
                : 'p-4 mb-4 rounded-lg bg-red-100 text-red-800';
            messageContainer.textContent = message;
        }
    }
});
