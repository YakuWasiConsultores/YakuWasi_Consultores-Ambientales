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

        // Conectar botones de Departamentos y enlaces de servicios con el selector de WhatsApp
        document.querySelectorAll('[data-department-service]').forEach(trigger => {
            trigger.addEventListener('click', function() {
                const targetService = this.getAttribute('data-department-service');
                if (targetService && servicioSelect) {
                    servicioSelect.value = targetService;
                    updateWhatsAppLink();
                    // Resaltar brevemente el selector al llegar a la sección de contacto
                    setTimeout(() => {
                        servicioSelect.focus({ preventScroll: true });
                    }, 600);
                }
            });
        });
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
            duration: 700,
            easing: 'ease-out-cubic',
            once: true,
            mirror: false,
            offset: 40
        });
        window.addEventListener('load', function() {
            AOS.refresh();
        });
    }
    
    // Topographic & Hydrological Isolines Canvas (Cartografía Amazónica)
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
        
        const lineCount = 14;
        let time = 0;
        
        function drawContours() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < lineCount; i++) {
                ctx.beginPath();
                const baseRatio = (i + 1) / (lineCount + 1);
                const baseY = height * (0.12 + baseRatio * 0.78);
                const isMajorLine = i % 4 === 0;
                
                for (let x = 0; x <= width; x += 14) {
                    const n1 = Math.sin(x * 0.0022 + time + i * 0.45) * 28;
                    const n2 = Math.cos(x * 0.0055 - time * 0.6 + i * 0.8) * 14;
                    const slope = (x / Math.max(width, 1)) * 35 - 17;
                    const y = baseY + n1 + n2 + slope;
                    
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                
                if (isMajorLine) {
                    ctx.strokeStyle = 'rgba(201, 151, 70, 0.16)';
                    ctx.lineWidth = 1.2;
                } else {
                    ctx.strokeStyle = 'rgba(120, 185, 165, 0.09)';
                    ctx.lineWidth = 0.8;
                }
                ctx.stroke();
            }
            
            if (!reduceMotion) {
                time += 0.0045;
                requestAnimationFrame(drawContours);
            }
        }
        
        drawContours();
    }
    
    // Active Navigation Link & Navbar Scrolled State
    const navbar = document.querySelector('.navbar');
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (navbar) {
            navbar.classList.toggle('scrolled', window.pageYOffset > 50);
        }
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            
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
    
    // Custom Cursor (solo en dispositivos con puntero fino / escritorio)
    const hasFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (hasFinePointer) {
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
        const interactiveElements = document.querySelectorAll('a, button, .department-card, .value-card, .team-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursor.classList.add('cursor-hover');
            });
            
            element.addEventListener('mouseleave', function() {
                cursor.classList.remove('cursor-hover');
            });
        });
    }
});
