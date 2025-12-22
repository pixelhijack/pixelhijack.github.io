import { escapeHtml } from './renderTemplate.js';

/**
 * Render a single chapter with route-based navigation
 * @param {Object} bookData - Compiled book metadata and styling
 * @param {Object} chapterData - Current chapter {id, title, html}
 * @param {Object} manifest - Project manifest for nav/logo
 * @param {String} bookId - Book identifier
 * @param {Boolean} isEmbedded - Whether this is embedded in another page (hides nav)
 * @returns {String} Complete HTML document
 */
export default function renderSingleChapterTemplate(bookData, chapterData, manifest, bookId, isEmbedded = false) {
  const { meta, styling, toc, settings } = bookData;
  
  // Generate font links
  const fontLinks = (styling.fonts || [])
    .map(url => `<link href="${url}" rel="stylesheet">`)
    .join('\n  ');
  
  // Find current chapter index for navigation
  const currentIndex = toc.findIndex(ch => ch.id === chapterData.id);
  const prevChapter = currentIndex > 0 ? toc[currentIndex - 1] : null;
  const nextChapter = currentIndex < toc.length - 1 ? toc[currentIndex + 1] : null;
  
  // Build book data for client (for chapter selector)
  const bookDataJson = JSON.stringify({
    meta,
    chapters: toc.map(ch => ({ id: ch.id, title: ch.title })),
    settings,
    currentChapterId: chapterData.id
  });
  
  // Cover image styling if first chapter
  const coverImageStyle = (currentIndex === 0 && styling.coverImage)
    ? `background-image: url('${styling.coverImage}');
       background-size: cover;
       background-position: center;
       background-repeat: no-repeat;`
    : '';
  
  // No need for separate title overlay - book-header handles it via CSS
  const titleOverlayStyle = styling.coverImage ? 'color: white;' : '';
  
  return `<!DOCTYPE html>
<html lang="${meta.language || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(chapterData.title)} - ${escapeHtml(meta.title)}</title>
  
  <link href="/output.css" rel="stylesheet">
  <link href="/book.css" rel="stylesheet">
  <link href="/books/${bookId}/book.css" rel="stylesheet">
  ${fontLinks}
  
  <style>
    /* Apply theme colors from book.json */
    body {
      background: ${styling.theme?.pageBackground || '#fef9f3'};
      color: ${styling.theme?.textColor || '#2d2d2d'};
    }
    
    .book-header {
      border-bottom-color: ${styling.theme?.accentColor || '#8b4513'};
    }
    
    ${styling.coverImage ? `
    /* Cover image overlay styling */
    .book-header .book-title,
    .book-header .book-author {
      color: white;
    }
    ` : ''}
    
    .chapter-title {
      color: ${styling.theme?.accentColor || '#8b4513'};
    }
    
    .chapter-content blockquote {
      border-left-color: ${styling.theme?.accentColor || '#8b4513'};
    }
    
    a.chapter-link {
      color: ${styling.theme?.accentColor || '#8b4513'};
      text-decoration: none;
      border-bottom: 1px solid currentColor;
      transition: opacity 0.2s;
    }
    
    a.chapter-link:hover {
      opacity: 0.7;
    }
    
    /* Single chapter uses same structure as all-chapters for consistency */
    .book-chapter {
      display: block !important; /* Override the display:none from book.css */
    }
    
    /* Smooth scrolling for anchor links and page navigation */
    #book-container {
      scroll-behavior: smooth;
    }
    
    ${isEmbedded ? `
    /* Embedded mode: hide navigation and adjust layout */
    body {
      margin: 0;
      padding: 0;
    }
    
    .book-nav,
    .chapter-navigation,
    .chapter-selector-trigger {
      display: none !important;
    }
    ` : ''}
    
    /* Chapter navigation buttons */
    .chapter-navigation {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 1rem;
      z-index: 100;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 1rem 2rem;
      border-radius: 2rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .chapter-nav-btn {
      padding: 0.5rem 1.5rem;
      background: ${styling.theme?.accentColor || '#8b4513'};
      color: white;
      text-decoration: none;
      border-radius: 1rem;
      font-family: "EB Garamond", serif;
      transition: opacity 0.2s;
    }
    
    .chapter-nav-btn:hover {
      opacity: 0.8;
    }
    
    .chapter-nav-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    
    @media (max-width: 768px) {
      .chapter-content-wrapper {
        padding: 3rem 1.5rem;
      }
      
      .chapter-navigation {
        bottom: 1rem;
        padding: 0.75rem 1.5rem;
        font-size: 0.9rem;
      }
    }
  </style>
</head>
<body>
  ${!isEmbedded ? `<!-- Book Navigation -->
  <nav class="book-nav show">
    <a href="/" class="logo"> ☜ </a>
    
    <div style="display: flex; gap: 1.5rem; align-items: center;">
      <div class="chapter-selector-trigger" style="cursor: pointer; opacity: 0.6; transition: opacity 0.3s;">
        <span style="font-size: 0.9rem;">Chapters ▾</span>
      </div>
      ${settings?.enableProgress ? `<div class="page-counter">${currentIndex + 1} / ${toc.length}</div>` : ''}
    </div>
  </nav>` : ''}

  ${!isEmbedded ? `<!-- Chapter Selector Dropdown -->
  <div class="chapter-selector" style="
    position: fixed;
    top: 4rem;
    right: 2rem;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    border-radius: 0.5rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    padding: 1rem;
    max-height: 70vh;
    overflow-y: auto;
    z-index: 600;
    display: none;
  ">
    <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; opacity: 0.7;">Chapters</h3>
    <div class="chapter-list" style="display: flex; flex-direction: column; gap: 0.5rem;">
      ${toc.map(ch => `
        <a href="/books/${bookId}/${ch.id}" 
           style="
             padding: 0.5rem 1rem;
             text-decoration: none;
             color: ${ch.id === chapterData.id ? styling.theme?.accentColor || '#8b4513' : 'inherit'};
             background: ${ch.id === chapterData.id ? 'rgba(139, 69, 19, 0.1)' : 'transparent'};
             border-radius: 0.25rem;
             transition: background 0.2s;
             font-weight: ${ch.id === chapterData.id ? '600' : '400'};
           "
           onmouseover="this.style.background='rgba(139, 69, 19, 0.1)'"
           onmouseout="this.style.background='${ch.id === chapterData.id ? 'rgba(139, 69, 19, 0.1)' : 'transparent'}'"
        >${escapeHtml(ch.title)}</a>
      `).join('\n')}
    </div>
  </div>` : ''}

  <!-- Single Chapter Content -->
  <div id="book-container">
    <div class="book-page-content">
      ${currentIndex === 0 ? `
      <div class="book-header" style="${coverImageStyle}">
        <h1 class="book-title" style="${titleOverlayStyle}">${escapeHtml(meta.title)}</h1>
        <p class="book-author" style="${titleOverlayStyle}">${escapeHtml(meta.author)}</p>
      </div>
      ` : ''}
      
      <div class="book-chapter active" data-chapter-id="${chapterData.id}">
        <h1 class="chapter-title">${escapeHtml(chapterData.title)}</h1>
        <div class="chapter-content">
          ${chapterData.html}
        </div>
      </div>
    </div>
  </div>

  <!-- Chapter Navigation -->
  ${!isEmbedded && (prevChapter || nextChapter) ? `
  <div class="chapter-navigation">
    ${prevChapter 
      ? `<a href="/books/${bookId}/${prevChapter.id}" class="chapter-nav-btn">← Previous</a>` 
      : '<span class="chapter-nav-btn" style="opacity: 0.3; cursor: not-allowed;">← Previous</span>'}
    ${nextChapter 
      ? `<a href="/books/${bookId}/${nextChapter.id}" class="chapter-nav-btn">Next →</a>` 
      : '<span class="chapter-nav-btn" style="opacity: 0.3; cursor: not-allowed;">Next →</span>'}
  </div>
  ` : ''}

  <script>
    // Store book data for client-side chapter selection
    window.bookData = ${bookDataJson};
    
    ${!isEmbedded ? `
    // Chapter selector toggle (only in non-embedded mode)
    const trigger = document.querySelector('.chapter-selector-trigger');
    const selector = document.querySelector('.chapter-selector');
    
    if (trigger && selector) {
      let selectorVisible = false;
      
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        selectorVisible = !selectorVisible;
        selector.style.display = selectorVisible ? 'block' : 'none';
      });
      
      // Close selector when clicking outside
      document.addEventListener('click', (e) => {
        if (selectorVisible && !selector.contains(e.target) && !trigger.contains(e.target)) {
          selectorVisible = false;
          selector.style.display = 'none';
        }
      });
    }
    ` : ''}
    
    // Page navigation helpers
    const container = document.getElementById('book-container');
    
    function nextPage() {
      const pageHeight = window.innerHeight * 0.92; // 92% to keep some context
      const currentScroll = container.scrollTop;
      const targetScroll = currentScroll + pageHeight;
      container.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
    
    function prevPage() {
      const pageHeight = window.innerHeight * 0.92; // 92% to keep some context
      const currentScroll = container.scrollTop;
      const targetScroll = currentScroll - pageHeight;
      container.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Up/Down arrows, PageUp/PageDown, Space = scroll within chapter
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevPage();
      }
      // Left/Right arrows = navigate between chapters
      ${prevChapter ? `
      else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        window.location.href = '/books/${bookId}/${prevChapter.id}';
      }
      ` : ''}
      ${nextChapter ? `
      else if (e.key === 'ArrowRight') {
        e.preventDefault();
        window.location.href = '/books/${bookId}/${nextChapter.id}';
      }
      ` : ''}
    });
    
    // Save reading progress to localStorage
    if (window.bookData.settings?.enableProgress) {
      const storageKey = 'book_progress_${bookId}';
      localStorage.setItem(storageKey, JSON.stringify({
        currentChapter: '${chapterData.id}',
        timestamp: new Date().toISOString()
      }));
    }
  </script>
</body>
</html>`;
}
