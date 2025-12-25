/**
 * External Libraries Module (Fixed)
 * Handles MixItUp Refresh & GLightbox
 */
export class LibsManager {
    constructor() {
        this.mixers = []; // Store mixer instances with their config
    }

    init() {
        this.initMixItUp();
        this.initGLightbox();

        // Listen for Content Updates (Load More)
        window.addEventListener('content:updated', () => {
            this.handleContentUpdate();
        });
    }

    handleContentUpdate() {
        // 1. Refresh ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();

        // 2. Refresh MixItUp (Destroy & Re-init to catch new items)
        this.mixers.forEach(item => {
            const { selector, config, instance } = item;
            const container = document.querySelector(selector);
            
            if (container && instance) {
                // Save current filter state
                const activeFilter = instance.getState().activeFilter.selector;
                
                // Destroy old instance
                instance.destroy();

                // Create new instance with same config
                const newInstance = mixitup(container, {
                    ...config,
                    load: { filter: activeFilter } // Keep user's selected filter
                });

                // Update our reference
                item.instance = newInstance;
            }
        });

        // 3. Re-init Lightbox for new images
        setTimeout(() => this.initGLightbox(), 100);
    }

    initMixItUp() {
        if (typeof mixitup === 'undefined') return;

        const targets = [".project-grid-active", "#works-grid", "#blog-grid"];

        targets.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                const config = {
                    selectors: { target: '.mix' },
                    animation: { 
                        duration: 400, 
                        effects: "fade translateZ(-30px)",
                        nudge: false 
                    }
                };
                
                const instance = mixitup(el, config);
                
                // Store everything needed to restart it later
                this.mixers.push({ selector, config, instance });
            }
        });
    }

    initGLightbox() {
        if (typeof GLightbox !== 'undefined') {
            // Re-init to find new .glightbox links
            const selector = ".popup-video, .popup-video-1, .glightbox";
            if (document.querySelector(selector)) {
                GLightbox({
                    selector: selector,
                    touchNavigation: true,
                    loop: false,
                    autoplayVideos: true,
                    zoomable: true
                });
            }
        }
    }
}