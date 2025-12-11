// ============================================
// ДОПОЛНИТЕЛЬНАЯ ОПТИМИЗАЦИЯ
// ============================================

// 1. Предотвращение быстрых кликов на мобильных
(function() {
    let lastTouchTime = 0;
    document.addEventListener('touchstart', function() {
        lastTouchTime = new Date().getTime();
    }, false);
    
    document.addEventListener('click', function(e) {
        const now = new Date().getTime();
        if (now - lastTouchTime < 500) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);
})();

// 2. Оптимизация скролла
(function() {
    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                // Логика для параллакса или анимаций
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
})();

// 3. Кэширование часто используемых элементов
const DOMCache = {
    get: function(selector) {
        if (!this[selector]) {
            this[selector] = document.querySelector(selector);
        }
        return this[selector];
    }
};

// 4. Оптимизация таймеров
const TimerManager = {
    timers: [],
    setTimeout: function(fn, delay) {
        const timer = setTimeout(fn, delay);
        this.timers.push(timer);
        return timer;
    },
    clearAll: function() {
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers = [];
    }
};

// 5. Ленивая загрузка CSS
function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = function() {
        this.media = 'all';
    };
    document.head.appendChild(link);
}

// Загружаем не критичные стили после загрузки страницы
window.addEventListener('load', function() {
    setTimeout(() => {
        // loadCSS('css/non-critical.css');
    }, 2000);
});