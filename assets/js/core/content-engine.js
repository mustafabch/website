/**
 * Graphixy Content Engine (Fixed Links)
 * Prevents double IDs in URLs
 */
export class ContentEngine {
  constructor() {
    this.lang = document.documentElement.lang || 'ar';
    this.blogData = [];
    this.worksData = [];
    this.caseStudiesData = [];
    this.itemsPerBatch = 6;

    this.state = {
      blog: { index: 0, loaded: false },
      works: { index: 0, loaded: false },
      cases: { index: 0, loaded: false }
    };
  }

  // ✅ Smart Link Resolver
  resolveLink(item) {
    if (!item.link) return '#';
    // If link already has 'id=', do NOT add it again
    if (item.link.includes('?id=') || item.link.includes('&id=')) {
      return item.link;
    }
    // Otherwise, add it
    return `${item.link}?id=${item.id}`;
  }

  async init() {
    const hasBlog = document.getElementById('blog-grid');
    const hasWorks = document.getElementById('works-grid');
    const hasCaseStudies = document.getElementById('case-studies-grid');
    const hasFeatured = document.getElementById('featured-post-container');
    const hasSidebarSearch = document.querySelector('.sidebar-search-form'); // Check for sidebar

    const promises = [];
    // Cache busting (?v=...) ensures we get fresh data
    const ts = new Date().getTime();

    // Load Blog Data if Blog Grid OR Featured OR Sidebar Search exists
    if (hasBlog || hasFeatured || hasSidebarSearch) promises.push(this.loadData(`/data/blog.json?v=${ts}`, 'blogData'));

    // Load Works Data if Grid OR Home Slider exists
    const hasHomePortfolio = document.getElementById('home-portfolio-wrapper');
    if (hasWorks || hasHomePortfolio) promises.push(this.loadData(`/data/works.json?v=${ts}`, 'worksData'));
    if (hasCaseStudies) promises.push(this.loadData(`/data/case-studies.json?v=${ts}`, 'caseStudiesData'));

    await Promise.all(promises);

    if (hasFeatured) this.renderFeaturedPost();

    // Mode A: Blog Index (Grid Filtering)
    if (hasBlog) {
      this.initSection('blog');
      this.setupSearchMode('index');
    }

    // Mode B: Sidebar (Autocomplete)
    if (hasSidebarSearch) {
      this.setupSearchMode('sidebar');
    }

    if (hasWorks) this.initSection('works');
    if (hasCaseStudies) this.initSection('cases');

    // Mode C: Home Portfolio
    if (hasHomePortfolio) this.loadHomePortfolio();

    return true;
  }

  async loadData(url, targetProp) {
    try {
      const res = await fetch(url);
      if (res.ok) this[targetProp] = await res.json();
    } catch (e) {
      console.error(`❌ Error loading ${url}`, e);
    }
  }

  initSection(type) {
    this.renderBatch(type);
    this.setupLoadMoreButton(type);
  }

  // ✅ New helper to filter data based on search
  getEffectiveData(type) {
    if (type === 'blog' && this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      return (this.blogData || []).filter(item =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
    }

    if (type === 'blog') return this.blogData;
    if (type === 'works') return this.worksData;
    if (type === 'cases') return this.caseStudiesData;
    return [];
  }

  setupSearchMode(mode) {
    if (mode === 'index') {
      const input = document.getElementById('blog-search-input');
      if (!input) return;

      // 1. Read URL Params (Handle Redirects)
      const params = new URLSearchParams(window.location.search);
      const queryParam = params.get('search');

      if (queryParam) {
        input.value = queryParam;
        this.searchQuery = queryParam;
        // Since this is 'index' mode, we trigger grid filter, NOT dropdown
        window.history.replaceState({}, '', window.location.pathname);
      }

      // 2. Event Listener (Grid Filter)
      input.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.state.blog.index = 0;
        const container = document.getElementById('blog-grid');
        if (container) container.innerHTML = '';
        this.renderBatch('blog');
      });
    }
    else if (mode === 'sidebar') {
      const input = document.querySelector('.sidebar-search-input');
      if (!input) return;

      // Event Listener (Dropdown)
      input.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        this.renderSearchResults(query, 'sidebar-search-results');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.sidebar-search-form')) {
          const dropdown = document.getElementById('sidebar-search-results');
          if (dropdown) dropdown.style.display = 'none';
        }
      });
    }
  }

  renderSearchResults(query, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    if (!query) {
      dropdown.style.display = 'none';
      dropdown.innerHTML = '';
      return;
    }

    // Filter titles
    const q = query.toLowerCase();
    const results = (this.blogData || []).filter(item =>
      item.title && item.title.toLowerCase().includes(q)
    );

    if (results.length === 0) {
      dropdown.style.display = 'none';
      return;
    }

    // Render Dropdown
    const html = results.map(item => {
      const link = this.resolveLink(item);
      return `<a href="${link}">${item.title}</a>`;
    }).join('');

    dropdown.innerHTML = html;
    dropdown.style.display = 'block';
  }


  renderFeaturedPost() {
    const container = document.getElementById('featured-post-container');
    if (!container || !this.blogData || !this.blogData.length) return;

    const featured = this.blogData.find(post => post.featured === true) || this.blogData[0];
    const readMore = this.lang === 'ar' ? 'اقرأ المقال كاملاً' : 'Read Article';
    const link = this.resolveLink(featured); // ✅ Use Smart Link

    container.innerHTML = `
      <div class="featured-card">
        <div class="row g-0 align-items-center">
          <div class="col-lg-7">
            <div class="featured-img hover-scale-img">
              <a href="${link}">
                <img src="${featured.image}" alt="${featured.title}" class="img-fluid w-100">
              </a>
              <span class="category-badge">${featured.category}</span>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="featured-content">
              <div class="post-meta mb-3">
                <span class="date"><i class="ri-calendar-line"></i> ${featured.date}</span>
                <span class="read-time"><i class="ri-time-line"></i> ${featured["read-time"]}</span>
              </div>
              <h2 class="title font-size-1-35 mb-3">
                <a href="${link}">${featured.title}</a>
              </h2>
              <p class="desc opacity-75 mb-4">${featured.excerpt}</p>
              <a href="${link}" class="btn-link-arrow">
                ${readMore} <i class="ri-arrow-left-line"></i>
              </a>
            </div>
          </div>
        </div>
      </div>`;

    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  renderBatch(type) {
    let containerId, renderer;

    if (type === 'blog') {
      containerId = 'blog-grid';
      renderer = (item) => this.createBlogCard(item);
    } else if (type === 'works') {
      containerId = 'works-grid';
      renderer = (item) => this.createWorkCard(item);
    } else if (type === 'cases') {
      containerId = 'case-studies-grid';
      renderer = (item) => this.createCaseStudyCard(item);
    }

    const data = this.getEffectiveData(type); // ✅ Get filtered data
    const container = document.getElementById(containerId);
    if (!container || !data) return;

    const start = this.state[type].index;
    const end = start + this.itemsPerBatch;
    const batch = data.slice(start, end);

    if (batch.length === 0 && start === 0) {
      container.innerHTML = `<h4 class="text-center w-100 mt-4 opacity-50">${this.lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}</h4>`;
      this.updateButtonVisibility(type, 0);
      return;
    }

    if (batch.length === 0) return;

    const html = batch.map(item => renderer(item)).join('');
    container.insertAdjacentHTML('beforeend', html);

    this.state[type].index += batch.length;
    this.updateButtonVisibility(type, data.length);
    window.dispatchEvent(new Event('content:updated'));
  }

  setupLoadMoreButton(type) {
    let btnId;
    if (type === 'blog') btnId = 'load-more-blog';
    else if (type === 'works') btnId = 'load-more-works';
    else if (type === 'cases') btnId = 'load-more-cases';

    const btn = document.getElementById(btnId);
    if (!btn) return;

    // Avoid duplicate listeners by cloning
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const originalText = newBtn.innerHTML;
      newBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...';
      newBtn.classList.add('disabled');

      setTimeout(() => {
        this.renderBatch(type);
        newBtn.innerHTML = originalText;
        newBtn.classList.remove('disabled');
      }, 300);
    });
  }

  updateButtonVisibility(type, totalItems) {
    let btnId;
    if (type === 'blog') btnId = 'load-more-blog';
    else if (type === 'works') btnId = 'load-more-works';
    else if (type === 'cases') btnId = 'load-more-cases';

    const btn = document.getElementById(btnId);
    if (btn) {
      btn.style.display = (this.state[type].index >= totalItems) ? 'none' : 'inline-block';
    }
  }

  slugify(text) {
    return text ? text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') : '';
  }

  // --- Templates (Using resolveLink) ---

  createBlogCard(post) {
    const categorySlug = 'cat-' + this.slugify(post.category);
    const link = this.resolveLink(post);
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
              <a href="${link}" class="read-more">${this.lang === 'ar' ? 'اقرأ المزيد' : 'Read More'}</a>
            </div>
          </div>
        </div>`;
  }

  createWorkCard(work) {
    const filterSlug = 'cat-' + this.slugify(work.filter);
    const isVideo = filterSlug.includes("motion") || filterSlug.includes("video");
    const iconClass = isVideo ? "ri-play-circle-line" : "ri-arrow-left-up-line";
    const link = this.resolveLink(work);

    return `
     <div class="col-xl-4 col-lg-4 col-md-6 mix ${filterSlug} portfolio-item-col">
        <div class="portfolio-item-card vre-reveal-container">
            <div class="portfolio-thumb" style="overflow: hidden;">
                <img src="${work.image}" class="vre-reveal-image" loading="lazy" alt="${work.title}">
                <div class="portfolio-overlay">
                    <div class="overlay-content">
                        <span class="category">${work.category}</span>
                        <h3 class="title"><a href="${link}">${work.title}</a></h3>
                        <a href="${link}" class="details-btn"><i class="${iconClass}"></i></a>
                    </div>
                </div>
            </div>
        </div>
     </div>`;
  }

  createWorkHomeSlide(work) {
    const link = this.resolveLink(work);
    // Use home-image if available, fallback to regular image
    const imageSrc = work['home-image'] || work.image || 'https://placehold.co/600x700';

    return `
      <div class="swiper-slide">
        <div class="portfolio-home-inner">
          <div class="portfolio-home-img">
            <img src="${imageSrc}" alt="${work.title}" loading="lazy">
            <a href="${link}" class="overlay-link"></a>
          </div>
          <div class="portfolio-home-thumb">
            <div class="portfolio-home-text">
              <span class="category">${work.category}</span>
              <h5 class="title"><a href="${link}">${work.title}</a></h5>
            </div>
            <a href="${link}" class="details-icon">
              <i class="ri-arrow-left-up-line"></i>
            </a>
          </div>
        </div>
      </div>`;
  }

  createCaseStudyCard(item) {
    const link = this.resolveLink(item);
    return `
      <div class="col-xl-6 col-lg-6 col-md-6 mb-4">
        <div class="case-study-card vre-reveal-container">
          <div class="case-study-thumb">
            <img src="${item.image}" class="vre-reveal-image" loading="lazy" alt="${item.title}">
              <span class="cs-floating-category">${item.category}</span>
          </div>
          <div class="case-study-content">
            <h3 class="case-study-title"><a href="${link}">${item.title}</a></h3>
            <p class="case-study-excerpt">${item.excerpt}</p>
            <div class="cs-meta-footer">
              <div class="cs-client-info">
                <div class="cs-client-icon"><i class="ri-user-star-line"></i></div>
                <div class="cs-client-name">
                  <span class="cs-client-label">${this.lang === 'ar' ? 'العميل' : 'Client'}</span>
                  <span class="cs-client-text">${item.client}</span>
                </div>
              </div>
              <a href="${link}" class="cs-arrow-btn"><i class="ri-arrow-left-line"></i></a>
            </div>
          </div>
        </div>
      </div>`;
  }

  loadHomePortfolio() {
    const wrapper = document.getElementById('home-portfolio-wrapper');
    if (!wrapper) return;

    // Use only the first 4 items for the home slider
    const homeItems = this.worksData.slice(0, 4);

    // Generate HTML for slides
    const slidesHtml = homeItems.map(item => this.createWorkHomeSlide(item)).join('');

    // Inject slides into the wrapper
    wrapper.innerHTML = slidesHtml;
    // Notify Main.js that slider content is ready
    window.dispatchEvent(new Event('portfolio:slider:ready'));
  }
}