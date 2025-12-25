import { ComponentLoader } from './loader.js';
import { UIManager } from '../modules/ui.js';
import { AnimationManager } from '../modules/animations.js';
import { initSliders } from '../modules/sliders.js';
import { LibsManager } from '../modules/libs.js';
import { ContentEngine } from './content-engine.js';
import { DetailsManager } from './details-manager.js';
import { ContactManager } from './contact-manager.js';
import { BreadcrumbManager } from '../modules/breadcrumb-manager.js';
import { DynamicContentManager } from '../modules/dynamic-content-manager.js';

class App {
    constructor() {
        this.loader = new ComponentLoader();
        this.loader.loadAll();

        window.addEventListener('components:loaded', () => {
            this.onSystemReady();
        });
    }

    async onSystemReady() {
        console.log("🚀 System Ready: HTML Components Loaded");

        // 1. ✅ تفعيل واجهة المستخدم فوراً (هذا يحل مشكلة الأزرار الميتة)
        this.ui = new UIManager();

        // 2. تفعيل القائمة النشطة
        if (typeof window.initActiveMenu === 'function') window.initActiveMenu();

        // 3. تفعيل التحميل الكسول للصور
        if (typeof LazyLoader !== 'undefined') new LazyLoader();

        // 4. تحميل البيانات (في الخلفية بالتوازي)
        const contentEngine = new ContentEngine();
        const detailsManager = new DetailsManager();

        try {
            // نستخدم Promise.all لكي لا ننتظر الملفات واحداً تلو الآخر
            const dynamicContent = new DynamicContentManager();
            await Promise.all([
                contentEngine.init(),
                detailsManager.init(),
                dynamicContent.init()
            ]);
        } catch (e) {
            console.error("⚠️ Non-critical data loading error:", e);
        }

        // 5. باقي التفعيلات (بعد وصول البيانات)
        new ContactManager();

        // Initialize Breadcrumbs
        const breadcrumbManager = new BreadcrumbManager();
        breadcrumbManager.init();

        initSliders();

        const libs = new LibsManager();
        libs.init();

        const anim = new AnimationManager();
        anim.init();

        // 6. إخفاء شاشة التحميل
        this.hidePreloader();
    }

    hidePreloader() {
        const preloader = document.querySelector(".loader-wrapper");
        if (preloader) {
            preloader.style.transition = 'opacity 0.5s ease';
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});