import { getItemById } from '../utils/api.js';
import { getQueryParam } from '../utils/helpers.js';
import { createRelatedCard } from '../utils/templates.js';
import { renderNavigation } from '../utils/navigation.js';

export class DetailsManager {
    constructor() {
        this.id = getQueryParam('id');
    }

    async init() {
        if (!this.id) return;

        const path = window.location.pathname;
        const isProject = path.includes('project-details');
        const isCaseStudy = path.includes('case-study');
        const isBlog = path.includes('blog-details');

        let filename = '';
        if (isProject) filename = 'works.json';
        else if (isCaseStudy) filename = 'case-studies.json';
        else if (isBlog) filename = 'blog.json';
        else return;

        // 1. Fetch Data (Using API Utility)
        const result = await getItemById(filename, this.id);

        if (result && result.item) {
            this.render(result.item, result.allItems, { isProject, isCaseStudy, isBlog });
            document.body.classList.add('details-loaded');
        } else {
            window.location.href = '/ar/pages/404.html';
        }
    }

    render(item, allItems, context) {
        document.title = `${item.title} - Graphixy`;
        this.bindData(item);

        // Navigation (Using Utility)
        renderNavigation(item, allItems);

        // Related Items
        if (context.isBlog || context.isCaseStudy) {
            this.renderRelated(item, allItems, context.isCaseStudy);
        }

        // Sidebar Widgets (Blog Only)
        if (context.isBlog) {
            this.renderSidebar(allItems);
        }

        // Gallery
        if (item.gallery) this.renderGallery(item.gallery);
    }

    bindData(item) {
        document.querySelectorAll('[data-bind]').forEach(el => {
            const key = el.getAttribute('data-bind');
            if (!item[key]) return;

            if (el.tagName === 'IMG') {
                el.src = item[key];
                el.alt = item.title;
            } else if (el.tagName === 'A' && key === 'link') {
                el.href = item[key];
            } else if (Array.isArray(item[key])) {
                if (key === 'technologies') {
                    el.innerHTML = item[key].map(tech => `<span class="tech-tag">${tech}</span>`).join('');
                } else {
                    el.textContent = item[key].join(' • ');
                }
            } else {
                el.textContent = item[key];
            }
        });

        // Hero BG
        const heroBg = document.querySelector('.details-hero-bg');
        if (heroBg && item.image) heroBg.style.backgroundImage = `url(${item.image})`;
    }

    renderRelated(currentItem, allItems, isCaseStudy) {
        const container = document.getElementById('related-posts-container');
        if (!container) return;

        const limit = isCaseStudy ? 2 : 3;
        const related = allItems
            .filter(i => i.category === currentItem.category && String(i.id) !== String(currentItem.id))
            .slice(0, limit);

        if (related.length === 0) {
            document.querySelector('.related-section-title')?.remove();
            container.innerHTML = '';
            return;
        }

        // Generate HTML using Template Utility
        container.innerHTML = related.map(item => createRelatedCard(item, isCaseStudy)).join('');
    }

    renderGallery(gallery) {
        const container = document.getElementById('project-gallery-container');
        if (!container) return;

        container.innerHTML = gallery.map(imgSrc => `
            <div class="col-md-6 mb-4">
                <a href="${imgSrc}" class="glightbox">
                    <img src="${imgSrc}" class="img-fluid rounded-3 hover-scale w-100 shadow-sm" alt="Gallery">
                </a>
            </div>
        `).join('');

        setTimeout(() => typeof GLightbox !== 'undefined' && GLightbox({ selector: '.glightbox' }), 200);
    }

    renderSidebar(allItems) {
        // 1. Categories Widget
        const catsContainer = document.getElementById('blog-categories-list');
        if (catsContainer) {
            const counts = {};
            allItems.forEach(item => {
                const cat = item.category || 'غير مصنف';
                counts[cat] = (counts[cat] || 0) + 1;
            });

            catsContainer.innerHTML = Object.entries(counts).map(([cat, count]) => `
                <li><a href="/ar/blog/?category=${encodeURIComponent(cat)}">${cat} <span>(${count})</span></a></li>
            `).join('');
        }

        // 2. Recent Posts Widget
        const recentContainer = document.getElementById('blog-recent-posts');
        if (recentContainer) {
            // Helper to parse "15 ديسمبر 2025"
            const parseDate = (dateStr) => {
                const months = [
                    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
                    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
                ];
                const parts = dateStr.split(' ');
                if (parts.length < 3) return new Date();

                const day = parseInt(parts[0]);
                const monthIndex = months.indexOf(parts[1]);
                const year = parseInt(parts[2]);

                if (monthIndex === -1) return new Date();
                return new Date(year, monthIndex, day);
            };

            // Sort by Date Descending
            const sortedParams = [...allItems].sort((a, b) => {
                return parseDate(b.date) - parseDate(a.date);
            });

            const recent = sortedParams.slice(0, 3);

            recentContainer.innerHTML = recent.map(post => `
                <div class="recent-post-item d-flex gap-3 mb-3">
                   <div class="thumb" style="flex: 0 0 80px;">
                      <img src="${post.image}" alt="${post.title}" class="rounded-3" style="width: 80px; height: 80px; object-fit: cover;">
                   </div>
                   <div class="content">
                      <span class="date font-size-1-12 opacity-50 display-block mb-1">${post.date}</span>
                      <h5 class="font-size-1-16 mb-0"><a href="/ar/blog/blog-details.html?id=${post.id}" class="text-reset hover-under">${post.title}</a></h5>
                   </div>
                </div>
            `).join('');
        }
    }
}