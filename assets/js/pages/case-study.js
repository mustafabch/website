/**
 * Case Study Page Interactions
 * Streamlined to work with main.js and global libraries
 */

document.addEventListener('DOMContentLoaded', function () {

  // 1. Initialize Gallery Swiper
  if (typeof Swiper !== 'undefined') {
    const gallerySwiper = new Swiper('.cs-gallery-slider', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }

  // 2. Initialize GLightbox for Gallery
  if (typeof GLightbox !== 'undefined') {
    const lightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
    });
  }

  // 3. Scroll Animations (if GSAP is available)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

    // Hero Image Scale
    gsap.from(".cs-hero-image-wrapper", {
      scale: 0.9,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.2
    });

    // Stats Stagger
    gsap.from(".cs-stat-item", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.7)",
      delay: 0.5
    });

    // Feature Items Stagger
    gsap.from(".feature-item", {
      scrollTrigger: {
        trigger: ".cs-solution-features",
        start: "top 85%",
      },
      opacity: 0.8,
      duration: 0.8,
      stagger: 0.08,
      ease: "power2.out"
    });

    // Radial Progress Animation
    const radials = document.querySelectorAll('.radial-progress');
    radials.forEach(radial => {
      const percent = radial.getAttribute('data-percent');
      const circle = radial.querySelector('.progress-circle');
      const valueText = radial.querySelector('.radial-value');

      // Circumference is 2 * pi * 70 = ~440
      const circumference = 440;
      const offset = circumference - (percent / 100) * circumference;

      gsap.to(circle, {
        scrollTrigger: {
          trigger: radial,
          start: "top 85%",
        },
        strokeDashoffset: offset,
        duration: 2,
        ease: "power3.out",
        onUpdate: function () {
          // Animate the text counter manually if needed, or simple snap
          // For smooth text counter:
          const progress = 1 - (this.targets()[0].style.strokeDashoffset.replace('px', '') / circumference);
          // This is complicated to calc back from dashoffset in simple tween
        }
      });

      // Animate Text Counter Separately
      let counter = { val: 0 };
      gsap.to(counter, {
        scrollTrigger: {
          trigger: radial,
          start: "top 85%"
        },
        val: percent,
        duration: 2,
        ease: "power3.out",
        onUpdate: function () {
          valueText.innerText = Math.round(counter.val) + "%";
        }
      });
    });
  }

  // 4. Reading Progress Bar
  const progressBar = document.getElementById('progress-value');

  const readingBar = document.createElement('div');
  readingBar.style.position = 'fixed';
  readingBar.style.top = '0';
  readingBar.style.left = '0';
  readingBar.style.height = '4px';
  readingBar.style.backgroundColor = 'var(--brand-accent-1)';
  readingBar.style.zIndex = '9999';
  readingBar.style.width = '0%';
  readingBar.style.transition = 'width 0.1s ease';
  document.body.appendChild(readingBar);

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    readingBar.style.width = scrollPercent + '%';
  });

});
