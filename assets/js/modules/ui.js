/**
 * UI Manager (Final Fix)
 * يدير الهيدر، الموبايل منيو، القوائم الفرعية (Legacy Support)، واللغات.
 */
export class UIManager {
    constructor() {
        this.selectors = {
            header: ".header-main",
            mobileMenu: ".nft-mobile-menu",
            mobileMenuToggle: ".menu-bar-btn",
            mobileMenuClose: ".close-menu",
            mobileMenuOverlay: ".mobile-menu-overlay",

            // محددات اللغات
            languageSelectorBtn: ".flag-selector-btn",
            languageSelector: ".language-selector",
            langLink: "[data-lang]", // يعمل للموبايل والديسكتوب

            // محددات الأكورديون
            accordionHeader: ".accordion-header"
        };

        // ✅ هام جداً: تعريف الدالة القديمة لكي تعمل روابط HTML الموجودة
        // هذا يحل مشكلة "توسيع الروابط" في الموبايل
        window.toggleSubMenu = (element) => this.handleMobileSubmenu(element);
        window.toggleMobileMenu = () => this.toggleMobileMenu();

        this.init();
    }

    init() {
        this.handleStickyHeader();
        this.handleScrollToTop();
        this.initThemeManager(); // New Theme Manager
        this.initGlobalListeners();
        console.log("✅ UI Manager Initialized (Mobile + Theme Fixed)");
    }

    // --- 0. Theme Manager ---
    initThemeManager() {
        const savedTheme = localStorage.getItem('theme');
        // Check saved theme or system preference
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        // Add Listener
        const toggleBtn = document.getElementById('themeToggleBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        if (newTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        }
    }

    // --- 1. منطق القائمة الجانبية (Submenu) ---
    handleMobileSubmenu(linkElement) {
        const parentLi = linkElement.closest("li");
        const submenu = parentLi.querySelector("ul"); // البحث عن القائمة الفرعية

        if (submenu) {
            // التحقق من الحالة الحالية (هل هي ظاهرة أم مخفية؟)
            const isHidden = window.getComputedStyle(submenu).display === "none";

            if (isHidden) {
                submenu.style.display = "block"; // إظهار
                parentLi.classList.add("active"); // تدوير السهم
            } else {
                submenu.style.display = "none"; // إخفاء
                parentLi.classList.remove("active");
            }
        }
    }

    toggleMobileMenu() {
        const menu = document.querySelector(this.selectors.mobileMenu);
        if (menu) {
            menu.classList.toggle("mobile-menu-active");
            // منع السكرول في الخلفية عند فتح القائمة
            document.body.style.overflow = menu.classList.contains("mobile-menu-active") ? "hidden" : "";
        }
    }

    // --- 2. باقي الوظائف (كما هي) ---
    handleStickyHeader() {
        const header = document.querySelector(this.selectors.header);
        if (header) {
            window.addEventListener("scroll", () => {
                header.classList.toggle("sticky-on", window.scrollY > 80);
            }, { passive: true });
        }
    }

    handleScrollToTop() {
        const progressPath = document.querySelector("#progress");
        if (progressPath) {
            window.addEventListener('scroll', () => {
                const scrollPos = window.scrollY;
                const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const calcHeight = scrollPos * 100 / winHeight;
                progressPath.classList.toggle('active-progress', scrollPos > 100);
                progressPath.style.background = `conic-gradient(#6A82FB ${calcHeight}%, var(--bg-muted) ${calcHeight}%)`;
            });
            progressPath.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    initGlobalListeners() {
        document.addEventListener("click", (e) => {
            const target = e.target;

            // أ) معالجة تغيير اللغة (موبايل + ديسكتوب)
            const langLink = target.closest(this.selectors.langLink);
            if (langLink) {
                e.preventDefault(); // منع الرابط العادي
                const targetLang = langLink.getAttribute('data-lang');
                console.log("🌍 Switching Language to:", targetLang);
                this.switchLanguage(targetLang);
                return;
            }

            // ب) زر فتح/إغلاق قائمة اللغات (ديسكتوب)
            const langBtn = target.closest(this.selectors.languageSelectorBtn);
            if (langBtn) {
                e.preventDefault();
                e.stopPropagation();
                const selector = langBtn.closest(this.selectors.languageSelector);
                if (selector) selector.classList.toggle("open");
                return;
            }

            // إغلاق قائمة اللغات عند النقر خارجها
            if (!target.closest(this.selectors.languageSelector)) {
                document.querySelectorAll(".language-selector.open").forEach(el => el.classList.remove("open"));
            }

            // ج) إغلاق قائمة الموبايل عند النقر على زر الإغلاق أو الخلفية
            if (target.closest(this.selectors.mobileMenuClose) || target.closest(this.selectors.mobileMenuOverlay)) {
                this.toggleMobileMenu();
            }

            // د) الأكورديون (FAQ)
            const faqBtn = target.closest(this.selectors.accordionHeader);
            if (faqBtn) {
                e.preventDefault();
                const content = faqBtn.nextElementSibling;
                const parent = faqBtn.closest(".accordion-list");

                if (parent) {
                    parent.querySelectorAll(".accordion-header.active").forEach(btn => {
                        if (btn !== faqBtn) {
                            btn.classList.remove("active");
                            if (btn.nextElementSibling) btn.nextElementSibling.style.maxHeight = "0";
                        }
                    });
                }
                faqBtn.classList.toggle("active");
                if (content) content.style.maxHeight = faqBtn.classList.contains("active") ? content.scrollHeight + "px" : "0";
            }
        });


    }

    switchLanguage(targetLang) {
        let currentPath = window.location.pathname;

        // إذا كنا بالفعل في نفس اللغة، لا تفعل شيئاً
        if (currentPath.includes(`/${targetLang}/`)) return;

        const langRegex = /\/(ar|en|fr)\//;
        let newPath;

        if (langRegex.test(currentPath)) {
            // استبدال اللغة الموجودة باللغة الجديدة (مثلاً /ar/ إلى /en/)
            newPath = currentPath.replace(langRegex, `/${targetLang}/`);
        } else {
            // إذا كنا في الجذر (Root)، أضف اللغة ورابط الصفحة
            // مثال: /index.html -> /ar/index.html
            let filename = currentPath.split('/').pop() || 'index.html';
            newPath = `/${targetLang}/${filename}`;
        }

        window.location.href = newPath;
    }
}