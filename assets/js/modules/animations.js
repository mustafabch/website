/**
 * Animations Module (Fixed)
 * Listens for content updates to animate new items
 */
export class AnimationManager {
    constructor() {
        this.isRtl = document.documentElement.dir === "rtl";
        this.initializedElements = new Set();
    }

    init() {
        if (typeof gsap === 'undefined') return;
        this.registerPlugins();
        this.runAll();

        // ✅ IMPORTANT: Listen for new content
        window.addEventListener('content:updated', () => {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                ScrollTrigger.refresh();
                this.animateImages(); // Run on new items
            }, 100);
        });
    }

    registerPlugins() {
        gsap.registerPlugin(ScrollTrigger);
        if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);
    }

    runAll() {
        this.animateImages();
        this.animateTitles();
        this.animateSkewUp();
        this.animateSections();
        this.animateCounters();
    }

    // --- 1. Image Reveal Animation (Optimized & Robust) ---
    animateImages() {
        const containers = document.querySelectorAll(".vre-reveal-container");
        if (!containers.length) return;

        containers.forEach(el => {
            if (this.initializedElements.has(el)) return;
            this.initializedElements.add(el);

            const img = el.querySelector(".vre-reveal-image");
            const overlay = el.querySelector(".vre-content-overlay");
            const title = el.querySelector("h5");
            const direction = el.getAttribute("data-entrance") || el.getAttribute("data-direction") || "left";

            // Determine Start Clip Path
            let startClip;
            switch (direction) {
                case "top": startClip = "inset(0 0 100% 0)"; break;
                case "bottom": startClip = "inset(100% 0 0 0)"; break;
                case "left": startClip = this.isRtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)"; break;
                case "right": startClip = this.isRtl ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)"; break;
                default: startClip = "inset(0 100% 0 0)";
            }
            const endClip = "inset(0 0 0 0)";

            // 1. Set Initial State Immediately
            gsap.set(el, { autoAlpha: 1 }); // Ensure visibility
            if (img) gsap.set(img, { scale: 1.3, filter: "brightness(0.8)" });
            if (overlay) gsap.set(overlay, { autoAlpha: 0 });
            if (title) gsap.set(title, { autoAlpha: 0, y: 30 });

            // 2. Create Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });

            // 3. Animate using fromTo to force start state and avoid delay/jerk
            tl.fromTo(el,
                { clipPath: startClip },
                {
                    clipPath: endClip,
                    duration: 1.4,
                    ease: "power2.inOut",
                    clearProps: "clipPath"
                }
            );

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
                tl.to(overlay, { autoAlpha: 1, duration: 1.0 }, "-=1.0");

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
    }

    // --- 2. Title Animation (SplitText) ---
    animateTitles() {
        if (window.innerWidth < 768 || typeof SplitText === 'undefined') return;

        document.querySelectorAll(".split-collab").forEach(el => {
            if (this.initializedElements.has(el)) return;
            this.initializedElements.add(el);

            const split = new SplitText(el, { type: "words,lines" });
            gsap.from(split.words, {
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
                autoAlpha: 0,
                x: this.isRtl ? -50 : 50,
                duration: 0.9,
                stagger: 0.1,
                ease: "back.out(1)",
                onComplete: () => split.revert()
            });
        });
    }

    // --- 3. Skew Up Animation ---
    animateSkewUp() {
        if (window.innerWidth < 768) return;

        document.querySelectorAll(".skew-up").forEach(el => {
            if (this.initializedElements.has(el)) return;
            this.initializedElements.add(el);

            // استخدام SplitType إذا لم تتوفر مكتبة GSAP المدفوعة
            if (typeof SplitType !== 'undefined') new SplitType(el, { types: "lines,words" });

            const targets = el.querySelectorAll(".word");
            gsap.from(targets, {
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
                y: "100%",
                skewX: this.isRtl ? 5 : -5,
                duration: 1.2,
                stagger: 0.05,
                ease: "expo.out"
            });
        });
    }

    // --- 4. General Sections Fade ---
    animateSections() {
        document.querySelectorAll(".vre-slide-up-gsap").forEach(el => {
            if (this.initializedElements.has(el)) return;
            this.initializedElements.add(el);

            gsap.from(el, {
                scrollTrigger: { trigger: el, start: "top 90%", once: true },
                y: 60,
                autoAlpha: 0,
                duration: 1.2
            });
        });
    }

    // --- 5. Number Counters ---
    animateCounters() {
        document.querySelectorAll(".counter").forEach(el => {
            if (el.classList.contains("counted")) return;
            el.classList.add("counted");

            gsap.from(el, {
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
                textContent: 0,
                duration: 2,
                ease: "power1.out",
                snap: { textContent: 1 }
            });
        });
    }
}