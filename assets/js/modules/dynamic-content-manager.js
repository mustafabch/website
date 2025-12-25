/**
 * DynamicContentManager Class
 * Handles fetching and populating dynamic content (Testimonials, Clients).
 */
export class DynamicContentManager {
    constructor() {
        this.testimonialsContainer = document.querySelector('[data-dynamic="testimonials"]');
        this.clientsContainer = document.querySelector('[data-dynamic="clients"]');
    }

    async init() {
        if (this.testimonialsContainer) await this.loadTestimonials();
        if (this.clientsContainer) await this.loadClients();
    }

    async loadTestimonials() {
        try {
            const response = await fetch('/data/testimonials.json');
            if (!response.ok) throw new Error('Failed to load testimonials');

            const data = await response.json();
            const wrapper = this.testimonialsContainer.querySelector('.swiper-wrapper');

            if (!wrapper) return;

            wrapper.innerHTML = data.map(item => `
                <div class="swiper-slide">
                    <div class="testimonial-inner">
                        <p>${item.content}</p>
                        <h5 class="font-size-1-35">${item.name}</h5>
                        <span class="font-size-1-18 client-work-name">${item.role}</span>
                    </div>
                </div>
            `).join('');

            // Swiper should be initialized after this by the main slider init or we re-init it here if needed.
            // Assuming initSliders() in sliders.js finds .client-say-home and initializes it.
            // If sliders are already initialized, we might need to update().
            if (window.clientSaySlider) {
                window.clientSaySlider.update();
            }

        } catch (error) {
            console.error('Error loading testimonials:', error);
        }
    }

    async loadClients() {
        try {
            const response = await fetch('/data/clients.json');
            if (!response.ok) throw new Error('Failed to load clients');

            const data = await response.json();
            const wrapper = this.clientsContainer.querySelector('.swiper-wrapper');

            if (!wrapper) return;

            wrapper.innerHTML = data.map(item => `
                <div class="swiper-slide">
                    <div class="partner-logo-inner">
                        <a href="${item.url || '#'}" title="${item.name}">
                            <img src="${item.logo}" alt="${item.name}">
                        </a>
                    </div>
                </div>
            `).join('');

            // Initialize Swiper for Clients (Slick-like)
            this.initClientSlider();

        } catch (error) {
            console.error('Error loading clients:', error);
        }
    }

    initClientSlider() {
        // Check if Swiper is available
        if (typeof Swiper === 'undefined') return;

        new Swiper('.clients-slider', {
            slidesPerView: 2,
            spaceBetween: 30,
            loop: true,
            speed: 3000, /* Smooth continuous scroll speed */
            allowTouchMove: false, /* optional: for pure marquee effect */
            autoplay: {
                delay: 0, /* No delay for continuous marquee */
                disableOnInteraction: false,
            },
            breakpoints: {
                500: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                },
                768: {
                    slidesPerView: 4,
                    spaceBetween: 50,
                },
                1024: {
                    slidesPerView: 5,
                    spaceBetween: 80,
                },
            }
        });
    }
}
