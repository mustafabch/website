/**
 * LazyLoader Module
 * يتعامل مع الصور والخلفيات (Lazy Loading)
 */
export class LazyLoader {
  constructor() {
    this.init();
  }

  init() {
    this.handleImages();
    this.handleBackgrounds();
  }

  handleImages() {
    // إضافة loading="lazy" للصور التي لا تملكها
    const images = document.querySelectorAll('img:not([loading="lazy"])');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  }

  handleBackgrounds() {
    const lazyBackgrounds = document.querySelectorAll('.lazy-bg');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const src = el.getAttribute('data-bg');
            if (src) {
              el.style.backgroundImage = `url('${src}')`;
              el.classList.remove('lazy-bg');
              el.removeAttribute('data-bg');
              obs.unobserve(el);
            }
          }
        });
      });

      lazyBackgrounds.forEach(bg => observer.observe(bg));
    } else {
      // Fallback للمتصفحات القديمة
      lazyBackgrounds.forEach(bg => {
        const src = bg.getAttribute('data-bg');
        if (src) bg.style.backgroundImage = `url('${src}')`;
      });
    }
  }
}