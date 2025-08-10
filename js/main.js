// Funcionalidad para el botón de WhatsApp y tema oscuro
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando funcionalidades...');
    
    // ===== FUNCIONALIDAD WHATSAPP =====
    // Elementos del formulario de WhatsApp
    const servicioSelect = document.getElementById('whatsapp-servicio');
    const whatsappButton = document.getElementById('whatsapp-button');
    
    // Número de WhatsApp
    const whatsappNumber = '593992827109';
    
    // Actualizar el enlace de WhatsApp cuando cambie el servicio seleccionado
    if (servicioSelect && whatsappButton) {
        servicioSelect.addEventListener('change', function() {
            updateWhatsAppLink();
        });
        
        // Función para actualizar el enlace de WhatsApp
        function updateWhatsAppLink() {
            const selectedService = servicioSelect.value;
            let message = 'Hola, estoy interesado en sus servicios';
            
            // Si se seleccionó un servicio específico, personalizar el mensaje
            if (selectedService) {
                message = `Hola, estoy interesado en sus servicios de ${selectedService}. Me gustaría recibir más información.`;
            }
            
            // Codificar el mensaje para URL
            const encodedMessage = encodeURIComponent(message);
            
            // Actualizar el enlace del botón
            whatsappButton.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        }
        
        // Inicializar el enlace
        updateWhatsAppLink();
    }
    
    // ===== FUNCIONALIDAD TEMA OSCURO =====
    initializeDarkMode();
    
    function initializeDarkMode() {
        console.log('Inicializando modo oscuro...');
        
        // Esperar un poco más para asegurar que todo esté cargado
        setTimeout(() => {
            const darkModeToggle = document.getElementById('darkModeToggle');
            
            if (!darkModeToggle) {
                console.error('Botón de modo oscuro no encontrado');
                return;
            }
            
            console.log('Botón de modo oscuro encontrado:', darkModeToggle);
            
            // Verificar tema guardado al cargar la página
            const savedTheme = localStorage.getItem('yakuwasi-theme') || 'light';
            console.log('Tema guardado:', savedTheme);
            
            // Aplicar tema inicial
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                updateDarkModeIcon(true);
            } else {
                document.body.classList.remove('dark-mode');
                updateDarkModeIcon(false);
            }
            
            // Función para alternar tema
            function toggleDarkMode() {
                console.log('Alternando tema...');
                
                document.body.classList.toggle('dark-mode');
                const isDarkMode = document.body.classList.contains('dark-mode');
                
                console.log('Modo oscuro activo:', isDarkMode);
                
                const newTheme = isDarkMode ? 'dark' : 'light';
                localStorage.setItem('yakuwasi-theme', newTheme);
                updateDarkModeIcon(isDarkMode);
                
                console.log('Tema cambiado a:', newTheme);
            }
            
            // Múltiples eventos para asegurar compatibilidad
            darkModeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Click detectado');
                toggleDarkMode();
            });
            
            // Usamos solo 'click' para evitar toggles dobles por eventos táctiles
            
            // Función para actualizar el icono del botón
            function updateDarkModeIcon(isDarkMode) {
                const icon = darkModeToggle.querySelector('i');
                if (icon) {
                    icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
                    console.log('Icono actualizado:', icon.className);
                }
                // ARIA state
                darkModeToggle.setAttribute('aria-pressed', String(isDarkMode));
            }
            
            // Test de funcionamiento
            console.log('Modo oscuro inicializado correctamente');
            
        }, 100);
    }
    
    // Función global para alternar tema (método de respaldo)
    window.toggleDarkModeGlobal = function() {
        console.log('Función global de tema ejecutada');
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('yakuwasi-theme', isDarkMode ? 'dark' : 'light');
        
        const btn = document.getElementById('darkModeToggle');
        const icon = btn ? btn.querySelector('i') : null;
        if (icon) {
            icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
    };
    
    // ===== FUNCIONALIDAD GENERAL DEL SITIO =====
    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(function() {
                preloader.style.opacity = '0';
                preloader.style.transition = 'opacity 0.5s ease';
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            }, 300);
        }
    });
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            const expanded = mobileMenu.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', String(expanded));
            mobileMenuBtn.setAttribute('aria-label', expanded ? 'Cerrar menú' : 'Abrir menú');
            
            // Toggle icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Initialize AOS Animation
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
    
    // Water Canvas Animation
    const canvas = document.getElementById('water-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        function resizeCanvas() {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        const waves = {
            count: 5,
            y: height / 2,
            length: reduceMotion ? 80 : 100,
            amplitude: reduceMotion ? 10 : 20,
            frequency: reduceMotion ? 0.005 : 0.01
        };
        
        let time = 0;
        
    function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, width, height);
            
            // Draw waves
            for (let i = 0; i < waves.count; i++) {
                ctx.beginPath();
                ctx.moveTo(0, height);
                
                const waveLength = waves.length + i * 50;
                const amplitude = waves.amplitude - i * 3;
                const frequency = waves.frequency;
                const yOffset = height - (height / 3) + (i * 50);
                
                for (let x = 0; x < width; x += 10) {
                    const y = yOffset + Math.sin((x * frequency) + time + i) * amplitude;
                    ctx.lineTo(x, y);
                }
                
                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                ctx.closePath();
                
                const alpha = 0.5 - (i * 0.1);
                ctx.fillStyle = `rgba(100, 150, 200, ${alpha})`;
                ctx.fill();
            }
            
            time += reduceMotion ? 0.02 : 0.05;
        }
        
        animate();
    }
    
    // Active Navigation Link
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavLink);
    window.addEventListener('load', setActiveNavLink);
    
    // Custom Cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mousedown', function() {
        cursor.classList.add('cursor-active');
    });
    
    document.addEventListener('mouseup', function() {
        cursor.classList.remove('cursor-active');
    });
    
    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .team-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.classList.add('cursor-hover');
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.classList.remove('cursor-hover');
        });
    });
});
