// ===== МОБИЛЬНЫЙ JAVASCRIPT =====

// Определяем мобильное устройство
const isMobileDevice = () => {
    return window.innerWidth <= 767 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Запускаем только на мобильных
if (isMobileDevice()) {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Мобильная версия загружена');
        
        // ===== МОБИЛЬНОЕ МЕНЮ =====
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav');
        const body = document.body;
        
        if (burger && nav) {
            burger.addEventListener('click', function(e) {
                e.stopPropagation();
                burger.classList.toggle('active');
                nav.classList.toggle('active');
                
                // Блокировка скролла при открытом меню
                if (nav.classList.contains('active')) {
                    body.style.overflow = 'hidden';
                    body.style.height = '100vh';
                } else {
                    body.style.overflow = '';
                    body.style.height = '';
                }
            });
            
            // Закрытие меню при клике на ссылку
            document.querySelectorAll('.nav__link').forEach(link => {
                link.addEventListener('click', () => {
                    burger.classList.remove('active');
                    nav.classList.remove('active');
                    body.style.overflow = '';
                    body.style.height = '';
                });
            });
            
            // Закрытие меню при клике вне его
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('active')) {
                    burger.classList.remove('active');
                    nav.classList.remove('active');
                    body.style.overflow = '';
                    body.style.height = '';
                }
            });
            
            // Закрытие меню при свайпе
            let touchStartX = 0;
            nav.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            });
            
            nav.addEventListener('touchmove', (e) => {
                if (touchStartX && e.touches[0].clientX < touchStartX - 100) {
                    burger.classList.remove('active');
                    nav.classList.remove('active');
                    body.style.overflow = '';
                    body.style.height = '';
                    touchStartX = 0;
                }
            });
        }
        
        // ===== ФИКС ДЛЯ 100VH НА IOS =====
        function setVH() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
        
        // ===== КНОПКА БЫСТРОГО ЗВОНКА =====
        const callBtn = document.getElementById('mobileCallBtn');
        if (callBtn) {
            // Показываем кнопку после скролла
            let lastScrollTop = 0;
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > 300) {
                    callBtn.classList.add('visible');
                }
                
                // Скрываем при скролле вниз, показываем при скролле вверх
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    callBtn.style.transform = 'translateY(100px)';
                } else {
                    callBtn.style.transform = 'translateY(0)';
                }
                lastScrollTop = scrollTop;
            });
            
            // Анимация пульсации каждые 10 секунд
            setInterval(() => {
                callBtn.classList.add('pulse-animation');
                setTimeout(() => {
                    callBtn.classList.remove('pulse-animation');
                }, 2000);
            }, 10000);
        }
        
        // ===== УЛУЧШЕННАЯ НАВИГАЦИЯ ПО ТЕЛЕФОННЫМ НОМЕРАМ =====
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const phoneNumber = this.href.replace('tel:', '');
                
                // Анимация клика
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
                
                // Логирование для аналитики
                console.log('Позвонить:', phoneNumber);
                
                // Для iOS открываем стандартный звонок
                if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
                    window.location.href = this.href;
                    e.preventDefault();
                }
            });
        });
        
        // ===== ОПТИМИЗАЦИЯ ДЛЯ МЕДЛЕННЫХ СОЕДИНЕНИЙ =====
        if (navigator.connection) {
            const connection = navigator.connection;
            
            if (connection.saveData === true || connection.effectiveType.includes('2g')) {
                // Отключаем тяжелые анимации
                document.body.classList.add('slow-connection');
                
                // Отключаем автоматическую загрузку видео
                const videos = document.querySelectorAll('video[autoplay]');
                videos.forEach(video => {
                    video.removeAttribute('autoplay');
                    video.poster = video.getAttribute('data-poster') || '';
                });
            }
        }
        
        // ===== ФИКС ДЛЯ КЛАВИАТУРЫ НА МОБИЛЬНЫХ =====
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                // Прокручиваем к инпуту при фокусе
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
        
        // ===== ПРЕДОТВРАЩЕНИЕ ZOOM НА ДВОЙНОЙ ТАП =====
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // ===== ИНТЕРАКТИВНЫЕ КАРТОЧКИ ДЛЯ ТАЧ-УСТРОЙСТВ =====
        document.querySelectorAll('.service-card, .feature-card, .review-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('touchstart', function() {
                this.classList.add('touched');
            });
            
            card.addEventListener('touchend', function() {
                this.classList.remove('touched');
            });
        });
        
        // ===== ДЕТЕКЦИЯ ОРИЕНТАЦИИ =====
        function handleOrientation() {
            if (window.innerHeight > window.innerWidth) {
                // Портретная ориентация
                document.body.classList.add('portrait');
                document.body.classList.remove('landscape');
            } else {
                // Альбомная ориентация
                document.body.classList.add('landscape');
                document.body.classList.remove('portrait');
            }
        }
        
        window.addEventListener('orientationchange', handleOrientation);
        window.addEventListener('resize', handleOrientation);
        handleOrientation(); // Инициализация
        
        // ===== LAZY LOAD ДЛЯ ИЗОБРАЖЕНИЙ =====
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
        
        // ===== ОПТИМИЗАЦИЯ АНИМАЦИЙ =====
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reducedMotion.matches) {
            document.body.classList.add('reduced-motion');
        }
        
        // ===== СОХРАНЕНИЕ ПОЗИЦИИ ПРИ ПЕРЕЗАГРУЗКЕ =====
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('scrollPosition', window.pageYOffset);
        });
        
        if (sessionStorage.getItem('scrollPosition')) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(sessionStorage.getItem('scrollPosition')));
                sessionStorage.removeItem('scrollPosition');
            }, 100);
        }
        
        // ===== ФИКС ДЛЯ IOS INPUT FOCUS =====
        document.body.addEventListener('focusin', () => {
            document.body.classList.add('keyboard-open');
        });
        
        document.body.addEventListener('focusout', () => {
            document.body.classList.remove('keyboard-open');
        });
    });
    
    // ===== ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ МОБИЛЬНЫХ =====
    
    // Вибрация при клике (если поддерживается)
    function vibrate(duration = 50) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }
    
    // Проверка онлайн статуса
    window.addEventListener('online', () => {
        showToast('Соединение восстановлено', 'success');
    });
    
    window.addEventListener('offline', () => {
        showToast('Отсутствует интернет-соединение', 'error');
    });
    
    // Функция показа уведомлений
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `mobile-toast mobile-toast--${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 70px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#2ecc71' : '#3498db'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transition: all 0.3s ease;
            max-width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}