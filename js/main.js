// ============================================
// ОСНОВНОЙ JS ДЛЯ САЙТА
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. МОБИЛЬНОЕ МЕНЮ
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.nav-mobile');
    const body = document.body;
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            // Блокируем скролл при открытом меню
            if (mobileNav.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
        
        // Закрываем меню при клике на ссылку
        const navLinks = mobileNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                body.style.overflow = '';
            });
        });
        
        // Закрываем меню при клике вне его
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.header-container') && 
                !event.target.closest('.nav-mobile') && 
                mobileNav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
    
    // 2. ФИКСИРОВАННЫЕ КНОПКИ ДЛЯ МОБИЛОК
    function setupMobileButtons() {
        const mobileButtons = document.querySelector('.mobile-buttons');
        if (!mobileButtons) return;
        
        // Показываем/скрываем кнопки при скролле
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Скролл вниз - скрываем
                mobileButtons.style.transform = 'translateY(100%)';
            } else {
                // Скролл вверх или вверху - показываем
                mobileButtons.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        }, { passive: true });
    }
    
    // Проверяем мобильное устройство
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    if (isMobile()) {
        setupMobileButtons();
    }
    
    // Обновляем при ресайзе
    window.addEventListener('resize', function() {
        if (isMobile()) {
            setupMobileButtons();
        }
    });
    
    // 3. ПЛАВНЫЙ СКРОЛЛ
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                // Закрываем мобильное меню если открыто
                if (menuToggle && menuToggle.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                    body.style.overflow = '';
                }
                
                // Вычисляем позицию с учетом фиксированной шапки
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + 
                                      window.pageYOffset - 
                                      headerHeight - 20; // Небольшой отступ
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 4. ЛЕНИВАЯ ЗАГРУЗКА ИЗОБРАЖЕНИЙ
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.style.opacity = '1';
                        img.style.transition = 'opacity 0.3s ease';
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                img.style.opacity = '0';
                imageObserver.observe(img);
            });
        } else {
            // Fallback для старых браузеров
            images.forEach(img => {
                img.style.opacity = '1';
            });
        }
    }
    
    lazyLoadImages();
    
    // 5. ОПТИМИЗАЦИЯ ДЛЯ iOS
    function iOSOptimizations() {
        // Добавляем класс для iOS устройств
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
            document.body.classList.add('ios-device');
        }
        
        // Предотвращаем зум при фокусе на инпутах
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                if (isMobile()) {
                    setTimeout(() => {
                        this.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 300);
                }
            });
        });
    }
    
    iOSOptimizations();
    
    // 6. КЛИК ПО ТЕЛЕФОНУ НА ПК
    if (!isMobile()) {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const phoneNumber = this.getAttribute('href').replace('tel:', '');
                
                // Копируем номер в буфер обмена
                navigator.clipboard.writeText(phoneNumber).then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'Скопировано!';
                    this.style.background = '#10b981';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.background = '';
                    }, 2000);
                }).catch(() => {
                    alert('Номер телефона: ' + phoneNumber);
                });
            });
        });
    }
    
    // 7. АКТИВНЫЙ ПУНКТ МЕНЮ ПРИ СКРОЛЛЕ
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    
    // 8. АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ
    function animateOnScroll() {
        const elements = document.querySelectorAll('.advantage-card, .price-card, .review-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => {
            observer.observe(el);
        });
    }
    
    setTimeout(animateOnScroll, 500);
    
    // 9. ПРЕДЗАГРУЗКА КРИТИЧЕСКИХ ИЗОБРАЖЕНИЙ
    function preloadCriticalImages() {
        const criticalImages = [
            'images/logo.png',
            'images/photo_1_2025-12-05_21-29-49.jpg'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    preloadCriticalImages();
    
    // 10. ДЕБАУНС ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            lazyLoadImages();
            if (isMobile()) {
                setupMobileButtons();
            }
        }, 250);
    });
});

// 11. Service Worker для оффлайн работы (опционально)
if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('ServiceWorker не зарегистрирован:', error);
        });
    });
}