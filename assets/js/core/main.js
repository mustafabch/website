/**
 * ========================================================================
 * GRAPHIXY AGENCY - MAIN JAVASCRIPT
 * ========================================================================
 * Version: 4.7.0 (Restored Image Animations)
 * ========================================================================
 */

(function () {
  "use strict";

  const CONFIG = {
    isRtl: document.documentElement.dir === "rtl",
    selectors: {
      portfolioSlider: ".portfolio-slider",
      testiSlider: ".client-say-home-3",
      teamSlider: ".team-area-slider-home-2",
      projectGrid: ".project-grid-active",
      worksGridId: "#works-grid",
      blogGridId: "#blog-grid",
      popupVideo: ".popup-video, .popup-video-1",
      scrollProgress: "#progress",
      stickyHeader: ".header-main",
      mobileMenu: ".nft-mobile-menu",
      searchPopup: ".search-bar",
      preloader: ".loader-wrapper"
    }
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // --- State Management ---
  const State = {
    isGSAPLoaded: () => typeof gsap !== 'undefined',
    isSwiperLoaded: () => typeof Swiper !== 'undefined',
    isMixItUpLoaded: () => typeof mixitup !== 'undefined',
    initializedElements: new Set() // To prevent double animation
  };

  // ========================================================================
  // CORE ENGINE
  // ========================================================================
  const Graphixy = {
    init: function () {
      console.log("🚀 Graphixy: System Start");
      this.initPreloader();
      this.registerPlugins();

      this.loadSystem().then(() => {
        console.log("🚀 System Loaded: Initializing UI...");
        this.initActiveMenu();
        this.initComponents();
        this.initGlobalListeners();
      });
    },

    loadSystem: async function () {
      if (window.ComponentsLoader) await window.ComponentsLoader.loadAll();
      if (window.contentEngine) await window.contentEngine.init();
    },

    registerPlugins: function () {
      if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);
      }
    },

    initComponents: function () {
      this.initSwipers();
      this.initMixItUp();
      this.initGLightbox();
      this.initScrollToTop();
      this.runAnimations(); // This triggers GSAP
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    },

    initActiveMenu: function () {
      if (window.initActiveMenu) window.initActiveMenu();
    },

    // ========================================================================
    // ANIMATIONS (Here is the Missing Part)
    // ========================================================================

    runAnimations: function () {
      if (!State.isGSAPLoaded()) return;

      // 1. تشغيل انيميشن الصور (الذي كان مفقوداً)
      this.animateImages();

      // 2. انيميشن النصوص والعناوين
      this.animateTitles();
      this.animateSkewUp();

      // 3. انيميشن الأقسام والأرقام
      this.animateSections();
      this.animateCounters();
    },

    // --- Image Reveal Animation (Corrected) ---
    // --- Image Reveal Animation (Directional Clip Reveal) ---
    animateImages: function () {
      const containers = $$(".vre-reveal-container");
      if (containers.length === 0) return;

      containers.forEach(el => {
        if (State.initializedElements.has(el)) return;
        State.initializedElements.add(el);

        const img = $(".vre-reveal-image", el);
        const overlay = $(".vre-content-overlay", el);
        const title = $("h5", overlay);

        // Determine Direction
        // Default to left if not specified
        const entrance = el.getAttribute("data-entrance") || "left";

        // Logic:
        // top: inset(0 0 100% 0) -> inset(0 0 0 0) (Unveils from top down)
        // bottom: inset(100% 0 0 0) -> inset(0 0 0 0) (Unveils from bottom up)
        // left: inset(0 100% 0 0) -> inset(0 0 0 0) (Unveils L->R)
        // right: inset(0 0 0 100%) -> inset(0 0 0 0) (Unveils R->L)

        let startClip;
        switch (entrance) {
          case "top": startClip = "inset(0 0 100% 0)"; break;
          case "bottom": startClip = "inset(100% 0 0 0)"; break;
          case "left": startClip = CONFIG.isRtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)"; break;
          case "right": startClip = CONFIG.isRtl ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)"; break;
          default: startClip = "inset(0 100% 0 0)";
        }

        const endClip = "inset(0 0 0 0)";

        // 1. Initial State
        // Ensure container is clipped and image is scaled
        gsap.set(el, { clipPath: startClip, autoAlpha: 1 });
        if (img) gsap.set(img, { scale: 1.3, filter: "brightness(0.8)" });
        if (overlay) gsap.set(overlay, { autoAlpha: 0 }); // Gradient hidden initially
        if (title) gsap.set(title, { autoAlpha: 0, y: 30 }); // Text hidden

        // 2. Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 85%", // Trigger early
            end: "bottom 15%",
            once: true // Play once
          }
        });

        // Reveal Container (Un-clip)
        tl.to(el, {
          clipPath: endClip,
          duration: 1.4,
          ease: "power2.inOut"
        });

        // Scale Image Down (Parallax Effect)
        if (img) {
          tl.to(img, {
            scale: 1,
            filter: "brightness(1)",
            duration: 1.4,
            ease: "power2.out"
          }, "<");
        }

        // Overlay & Text Entrance
        if (overlay) {
          // Fade in gradient overlay
          tl.to(overlay, { autoAlpha: 1, duration: 1.0 }, "-=1.0");

          // Slide Text Up
          if (title) {
            tl.to(title, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "back.out(1.2)"
            }, "-=0.6");
          }
        }
      });
    },

    // --- Title Animation ---
    animateTitles: function () {
      if (CONFIG.isMobile || typeof SplitText === 'undefined') return;
      $$(".split-collab").forEach(el => {
        if (State.initializedElements.has(el)) return;
        State.initializedElements.add(el);
        const split = new SplitText(el, { type: "words,lines" });
        gsap.from(split.words, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          autoAlpha: 0, x: CONFIG.isRtl ? -50 : 50, duration: 0.9, stagger: 0.1, ease: "back.out(1)",
          onComplete: () => split.revert()
        });
      });
    },

    animateSkewUp: function () {
      if (CONFIG.isMobile) return;
      $$(".skew-up").forEach(el => {
        if (State.initializedElements.has(el)) return;
        State.initializedElements.add(el);
        if (typeof SplitType !== 'undefined') new SplitType(el, { types: "lines,words" });
        const targets = $$(".word", el);
        gsap.from(targets, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          y: "100%", skewX: CONFIG.isRtl ? 5 : -5, duration: 1.2, stagger: 0.05, ease: "expo.out"
        });
      });
    },

    animateSections: function () {
      $$(".vre-slide-up-gsap").forEach(el => {
        if (State.initializedElements.has(el)) return;
        State.initializedElements.add(el);
        gsap.from(el, { scrollTrigger: { trigger: el, start: "top 90%", once: true }, y: 60, autoAlpha: 0, duration: 1.2 });
      });
    },

    animateCounters: function () {
      $$(".counter").forEach(el => {
        if (el.classList.contains("counted")) return;
        el.classList.add("counted");
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          textContent: 0, duration: 2, ease: "power1.out", snap: { textContent: 1 }
        });
      });
    },

    // ========================================================================
    // COMPONENTS INIT
    // ========================================================================

    initSwipers: function () {
      if (!State.isSwiperLoaded()) return;
      const initSafe = (selector, options) => {
        const el = $(selector);
        if (el && !el.classList.contains('swiper-initialized')) {
          new Swiper(selector, options);
        }
      };
      // Portfolio
      initSafe(CONFIG.selectors.portfolioSlider, {
        slidesPerView: 1, spaceBetween: 30, loop: true, rtl: CONFIG.isRtl, speed: 800,
        autoplay: { delay: 5000, disableOnInteraction: false },
        navigation: { nextEl: ".swiper-button-next-c", prevEl: ".swiper-button-prev-c" },
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: { 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }
      });
      // Testimonials
      initSafe(CONFIG.selectors.testiSlider, {
        slidesPerView: 1, spaceBetween: 30, loop: true, rtl: CONFIG.isRtl,
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
      });
      // Team
      initSafe(CONFIG.selectors.teamSlider, {
        slidesPerView: 1, spaceBetween: 30, loop: true, rtl: CONFIG.isRtl,
        breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 991: { slidesPerView: 3 } },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
      });
    },

    initMixItUp: function () {
      if (!State.isMixItUpLoaded()) return;
      const initMixer = (selector) => {
        const el = $(selector);
        if (el && !el.classList.contains('mixitup-ready')) {
          el.classList.add('mixitup-ready');
          mixitup(el, {
            selectors: { target: '.mix' },
            animation: { duration: 400, effects: "fade translateZ(-30px)" },
            callbacks: { onMixEnd: () => typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh() }
          });
        }
      };
      initMixer(CONFIG.selectors.projectGrid);
      initMixer(CONFIG.selectors.blogGrid);
      initMixer(CONFIG.selectors.worksGridId);
      initMixer(CONFIG.selectors.blogGridId);
    },

    initGLightbox: function () {
      if (typeof GLightbox !== 'undefined' && $(CONFIG.selectors.popupVideo)) {
        GLightbox({ selector: CONFIG.selectors.popupVideo, touchNavigation: true, loop: false, autoplayVideos: true });
      }
    },

    initPreloader: function () {
      const pre = $(CONFIG.selectors.preloader);
      if (pre) {
        setTimeout(() => {
          pre.style.opacity = '0';
          setTimeout(() => pre.style.display = 'none', 500);
        }, 1000);
      }
    },

    initScrollToTop: function () {
      const progress = $(CONFIG.selectors.scrollProgress);
      if (!progress) return;
      if (progress.dataset.init) return;
      progress.dataset.init = "true";

      window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const percent = height > 0 ? (scrollTop * 100) / height : 0;
        progress.style.background = `conic-gradient(#6A82FB ${percent}%, #ffffff ${percent}%)`;
        progress.classList.toggle("active-progress", scrollTop > 300);
      }, { passive: true });

      progress.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    },

    // --- Global Listeners ---
    initGlobalListeners: function () {
      window.addEventListener("scroll", () => {
        const header = $(CONFIG.selectors.stickyHeader);
        if (header) header.classList.toggle("sticky-on", window.pageYOffset > 80);
      }, { passive: true });

      document.addEventListener("click", (e) => {
        const faqBtn = e.target.closest(".accordion-header");
        if (faqBtn) {
          e.preventDefault();
          const content = faqBtn.nextElementSibling;
          const parent = faqBtn.closest(".accordion-list");
          if (parent) {
            parent.querySelectorAll(".accordion-header.active").forEach(o => {
              if (o !== faqBtn) { o.classList.remove("active"); o.nextElementSibling.style.maxHeight = "0"; }
            });
          }
          faqBtn.classList.toggle("active");
          if (content) content.style.maxHeight = faqBtn.classList.contains("active") ? content.scrollHeight + "px" : "0";
        }

        if (e.target.closest(".menu-bar-btn")) {
          e.preventDefault();
          $(CONFIG.selectors.mobileMenu)?.classList.add("mobile-menu-active");
        }
        if (e.target.closest(".close-menu") || e.target.closest(".mobile-menu-overlay")) {
          $(CONFIG.selectors.mobileMenu)?.classList.remove("mobile-menu-active");
        }

        if (e.target.closest(".header-search-bar")) {
          e.preventDefault();
          $(CONFIG.selectors.searchPopup)?.classList.add("active");
        }
        if (e.target.closest(".search-popup-close")) {
          $(CONFIG.selectors.searchPopup)?.classList.remove("active");
        }

        if (e.target.closest(".project-grid-btn li")) {
          const btn = e.target.closest("li");
          btn.parentElement.querySelectorAll("li").forEach(el => el.classList.remove("is-active"));
          btn.classList.add("is-active");
        }

        // Language Switcher Logic
        const langBtn = e.target.closest(".flag-selector-btn");
        if (langBtn) {
          e.preventDefault(); e.stopPropagation();
          const selector = langBtn.closest(".language-selector");
          $$(".language-selector.open").forEach(el => { if (el !== selector) el.classList.remove("open"); });
          if (selector) selector.classList.toggle("open");
        } else if (!e.target.closest(".language-selector")) {
          $$(".language-selector.open").forEach(el => el.classList.remove("open"));
        }

        const langLink = e.target.closest('[data-lang]');
        if (langLink) {
          e.preventDefault();
          const targetLang = langLink.getAttribute('data-lang');
          const currentPath = window.location.pathname;
          if (currentPath.includes(`/${targetLang}/`)) return;
          let newPath;
          if (currentPath.includes('/ar/')) newPath = currentPath.replace('/ar/', `/${targetLang}/`);
          else if (currentPath.includes('/en/')) newPath = currentPath.replace('/en/', `/${targetLang}/`);
          else if (currentPath.includes('/fr/')) newPath = currentPath.replace('/fr/', `/${targetLang}/`);
          else newPath = `/${targetLang}/index.html`;
          window.location.href = newPath;
        }
      });
    }
  };

  document.addEventListener("DOMContentLoaded", () => Graphixy.init());
  window.Graphixy = Graphixy;

})();