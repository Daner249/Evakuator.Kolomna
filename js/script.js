// ===== МОБИЛЬНОЕ МЕНЮ =====
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    const body = document.body;
    const header = document.querySelector('.header');
    
    // Мобильное меню
    if (burger && nav) {
        burger.addEventListener('click', function() {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Блокировка скролла
            if (nav.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                burger.classList.remove('active');
                nav.classList.remove('active');
                body.classList.remove('menu-open');
                body.style.overflow = '';
            });
        });
        
        // Закрытие меню при клике вне его области
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !burger.contains(event.target) && nav.classList.contains('active')) {
                burger.classList.remove('active');
                nav.classList.remove('active');
                body.classList.remove('menu-open');
                body.style.overflow = '';
            }
        });
    }
    
    // ===== ИЗМЕНЕНИЕ СТИЛЯ ШАПКИ ПРИ СКРОЛЛЕ =====
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // ===== АНИМАЦИЯ ПРИ СКРОЛЛЕ =====
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .price-card, .review-card, .service-card, .contacts-block');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight * 0.8;
            
            if (elementPosition < screenPosition) {
                element.classList.add('visible');
            }
        });
    };
    
    // Инициализация анимации
    window.addEventListener('load', function() {
        const animatedElements = document.querySelectorAll('.feature-card, .price-card, .review-card, .service-card, .contacts-block');
        animatedElements.forEach(el => {
            el.classList.add('loading');
        });
        
        setTimeout(() => {
            window.addEventListener('scroll', animateOnScroll);
            animateOnScroll(); // Запуск при загрузке
        }, 300);
    });
    
    // ===== ПЛАВНАЯ ПРОКРУТКА =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || !href.startsWith('#')) return;
            
            e.preventDefault();
            const targetId = href;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== КНОПКА "НАВЕРХ" =====
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.setAttribute('aria-label', 'Наверх');
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===== ИНТЕРАКТИВНЫЕ КАРТОЧКИ УСЛУГ =====
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '100';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });
    
    // ===== АНИМАЦИЯ ТЕЛЕФОННЫХ НОМЕРОВ =====
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Анимация при клике
        link.addEventListener('click', function() {
            this.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
    
    // ===== СЧЕТЧИКИ СТАТИСТИКИ =====
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // ===== ФИКС ДЛЯ IOS =====
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.style.cursor = 'pointer';
    }
    
    // ===== ОБРАБОТЧИК ДЛЯ ФОРМ =====
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Показываем состояние загрузки
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            try {
                // Здесь будет реальная отправка формы
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Успешная отправка
                submitBtn.textContent = 'Отправлено!';
                submitBtn.style.background = 'var(--success)';
                this.reset();
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
                
            } catch (error) {
                submitBtn.textContent = 'Ошибка';
                submitBtn.style.background = 'var(--accent)';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    });
    
    // ===== LAZY LOADING ДЛЯ ИЗОБРАЖЕНИЙ =====
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback для старых браузеров
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
    
    // ===== ПАРАЛЛАКС ЭФФЕКТ =====
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // ===== PRELOADER =====
    window.addEventListener('load', function() {
        setTimeout(() => {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            }
        }, 1000);
    });
    
    // ===== ТЕМНАЯ ТЕМА =====
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Сохраняем в localStorage
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                this.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                this.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
        
        // Проверяем сохраненную тему
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        }
    }
    
    // ===== GOOGLE ANALYTICS ДЛЯ ТЕЛЕФОНОВ =====
    document.addEventListener('click', function(e) {
        const phoneLink = e.target.closest('a[href^="tel:"]');
        if (phoneLink) {
            const phoneNumber = phoneLink.href.replace('tel:', '');
            
            // Отправка в Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'phone_number': phoneNumber,
                    'event_category': 'Contact',
                    'event_label': 'Phone Call'
                });
            }
            
            // Отправка в Яндекс.Метрику
            if (typeof ym !== 'undefined') {
                ym(number, 'reachGoal', 'phone_call');
            }
            
            console.log('Позвонили по номеру:', phoneNumber);
        }
    });
});

// ===== ОБРАБОТКА ОШИБОК =====
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
});

// ===== OFFLINE DETECTION =====
window.addEventListener('online', function() {
    console.log('Соединение восстановлено');
});

window.addEventListener('offline', function() {
    console.log('Отсутствует соединение с интернетом');
});