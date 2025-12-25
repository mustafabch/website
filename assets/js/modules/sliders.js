/**
 * Sliders Module (Swiper)
 * تم نقل الإعدادات بدقة من main.js القديم
 */
export function initSliders() {
    if (typeof Swiper === 'undefined') {
        console.warn("⚠️ Swiper not loaded");
        return;
    }

    const isRtl = document.documentElement.dir === "rtl";

    // دالة مساعدة لإنشاء السلايدر بأمان
    const initSafe = (selector, options) => {
        const el = document.querySelector(selector);
        if (el && !el.classList.contains('swiper-initialized')) {
            new Swiper(selector, {
                observer: true,       // ضروري للمحتوى الديناميكي
                observeParents: true, // ضروري للمحتوى الديناميكي
                rtl: isRtl,
                ...options
            });
        }
    };

    // 1. Portfolio Slider
    initSafe(".portfolio-slider", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 800,
        autoplay: { delay: 5000, disableOnInteraction: false },
        navigation: { nextEl: ".swiper-button-next-c", prevEl: ".swiper-button-prev-c" },
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: {
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 }
        }
    });

    // 2. Testimonials Slider (client-say-home-3)
    initSafe(".client-say-home", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
    });

    // 3. Team Slider (team-area-slider-home-2)
    initSafe(".team-area-slider-home-2", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        breakpoints: {
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            991: { slidesPerView: 3 }
        }
    });
    
    console.log("✅ Sliders Initialized");
}