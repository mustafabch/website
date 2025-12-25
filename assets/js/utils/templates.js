/**
 * templates.js
 * HTML Generators for Cards and Grids.
 */
import { resolveLink, slugify } from './helpers.js';

export function createBlogCard(post, lang = 'ar') {
    const link = resolveLink(post);
    const categorySlug = 'cat-' + slugify(post.category);
    const readMore = lang === 'ar' ? 'اقرأ المزيد' : 'Read More';

    return `
    <div class="col-xl-4 col-md-6 mix ${categorySlug} st_box_animation">
      <div class="blog-card">
        <div class="blog-thumb hover-scale-img">
          <a href="${link}">
            <img src="${post.image}" alt="${post.title}" class="st-blog-thumb vre-reveal-image" loading="lazy">
          </a>
          <span class="category-tag">${post.category}</span>
        </div>
        <div class="blog-content">
          <div class="post-meta"><span>${post.date}</span></div>
          <h3 class="title font-size-1-24"><a href="${link}">${post.title}</a></h3>
          <a href="${link}" class="read-more">${readMore}</a>
        </div>
      </div>
    </div>`;
}

export function createRelatedCard(item, isCaseStudy) {
    const link = resolveLink(item);

    if (isCaseStudy) {
        return `
        <div class="col-lg-6 col-md-6">
            <div class="blog-card">
                <div class="blog-thumb">
                    <a href="${link}">
                        <img src="${item.image}" alt="${item.title}" class="img-fluid w-100 object-fit-cover" style="height: 300px;">
                    </a>
                </div>
                <div class="blog-content">
                    <h4 class="title font-size-1-20"><a href="${link}">${item.title}</a></h4>
                </div>
            </div>
        </div>`;
    } 
    
    // Default Blog Style
    return `
    <div class="col-lg-4 col-md-6">
       <div class="blog-card">
          <div class="blog-thumb">
             <a href="${link}">
                <img src="${item.image}" alt="${item.title}" class="img-fluid w-100" style="height: 240px; object-fit: cover;">
             </a>
          </div>
          <div class="blog-content">
             <h4 class="title font-size-1-20"><a href="${link}">${item.title}</a></h4>
          </div>
       </div>
    </div>`;
}

// ... Add createWorkCard and createCaseStudyCard similarly ...