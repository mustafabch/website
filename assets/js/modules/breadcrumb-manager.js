/**
 * BreadcrumbManager Class
 * Handles dynamic updates of the breadcrumb component based on the current page.
 */
export class BreadcrumbManager {
    constructor() {
        this.pageMap = {
            'contact.html': {
                title: 'تواصل معنا',
                link: 'تواصل معنا'
            },
            'contact': { // Handle extensionless URLs just in case
                title: 'تواصل معنا',
                link: 'تواصل معنا'
            },
            'privacy-policy.html': {
                title: 'سياسة الخصوصية',
                link: 'سياسة الخصوصية'
            },
            'privacy-policy': {
                title: 'سياسة الخصوصية',
                link: 'سياسة الخصوصية'
            },
            'terms-and-conditions.html': {
                title: 'الشروط والأحكام',
                link: 'الشروط والأحكام'
            },
            'terms-and-conditions': {
                title: 'الشروط والأحكام',
                link: 'الشروط والأحكام'
            },
            'faq.html': {
                title: 'الأسئلة الشائعة',
                link: 'الأسئلة الشائعة'
            },
            'faq': {
                title: 'الأسئلة الشائعة',
                link: 'الأسئلة الشائعة'
            },
                        'pricing.html': {
                title: 'الباقات والتسعير',
                link: 'جدول الأسعار'
            },
            'pricing': {
                title: 'الباقات والتسعير',
                link: 'جدول الأسعار'
            },
                        'nda.html': {
                title: 'اتفاقية عدم الإفصاح',
                link: 'اتفاقية عدم الإفصاح'
            },
            'nda': {
                title: 'اتفاقية عدم الإفصاح',
                link: 'اتفاقية عدم الإفصاح'
            }

        };
    }

    init() {
        const titleEl = document.getElementById('breadcrumb-page-title');
        const linkEl = document.getElementById('breadcrumb-current-link');

        if (!titleEl || !linkEl) {
            // Component might not be loaded yet or not present on this page
            return;
        }

        const path = window.location.pathname;
        const pageName = path.split('/').pop();

        const config = this.pageMap[pageName];

        if (config) {
            titleEl.textContent = config.title;
            // Re-apply split-text class if needed, or if the animation runs on existing text, 
            // we might need to refresh it. TextContent update is usually enough if done early.

            linkEl.textContent = config.link;
            linkEl.href = "#"; // Current page link usually triggers nothing or reload
        }
    }
}
