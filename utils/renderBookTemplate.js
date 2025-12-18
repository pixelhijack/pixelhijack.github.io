import { escapeHtml } from './renderTemplate.js';

/**
 * Render a complete book reading experience as standalone HTML
 * @param {Object} bookData - Compiled book data (meta, styling, chapters, settings)
 * @param {Object} manifest - Project manifest for nav/logo
 * @param {String} bookId - Book identifier for localStorage keys
 * @returns {String} Complete HTML document
 */
export default function renderBookTemplate(bookData, manifest, bookId) {
  const { meta, styling, chapters, settings } = bookData;
  
  // Generate font links
  const fontLinks = (styling.fonts || [])
    .map(url => `<link href="${url}" rel="stylesheet">`)
    .join('\n  ');
  
  // Generate chapters HTML
  const chaptersHtml = chapters
    .map(chapter => `
      <div class="book-chapter" data-chapter-id="${chapter.id}">
        <h1 class="chapter-title">${chapter.title}</h1>
        <div class="chapter-content">${chapter.html}</div>
      </div>
    `)
    .join('\n');
  
  // Build book data for client
  const bookDataJson = JSON.stringify({
    meta,
    chapters: chapters.map(ch => ({ id: ch.id, title: ch.title })),
    settings
  });
  
  const firstChapterId = chapters[0]?.id || '1';
  
  return `<!DOCTYPE html>
<html lang="${meta.language || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(meta.title)} - ${escapeHtml(meta.author)}</title>
  
  <link href="/output.css" rel="stylesheet">
  ${fontLinks}
  
  <style>
    /* Book-specific styling */
    body {
      background: ${styling.theme?.pageBackground || '#fef9f3'};
      color: ${styling.theme?.textColor || '#2d2d2d'};
      font-family: 'Crimson Pro', serif;
      margin: 0;
      padding: 0;
    }
    
    /* Minimal nav for book mode */
    .book-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 1rem 2rem;
      background: transparent;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .book-nav .logo {
      font-size: 1.5rem;
      font-weight: bold;
      opacity: 0.5;
      transition: opacity 0.3s;
      text-decoration: none;
      color: inherit;
    }
    
    .book-nav .logo:hover {
      opacity: 1;
    }
    
    /* Book container - Paginated reading mode with CSS columns */
    #book-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      
      /* Hide scrollbar */
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    
    #book-container::-webkit-scrollbar {
      display: none;
    }
    
    /* Wrapper for columned content */
    .book-page-content {
      /* CSS columns create pages */
      height: 100vh;
      box-sizing: border-box;
      padding: 5rem 3rem 5rem;
      
      /* Multi-column layout - each column is a "page" */
      column-width: 100vw;
      column-gap: 0;
      column-fill: auto;
      
      /* Prevent column breaks within elements */
      orphans: 3;
      widows: 3;
    }
    
    /* Desktop: Multiple columns side-by-side */
    @media (min-width: 1400px) {
      .book-page-content {
        /* 3 columns on wide screens */
        column-width: calc(100vw / 3);
        padding: 5rem 4rem 5rem;
      }
    }
    
    @media (min-width: 769px) and (max-width: 1399px) {
      .book-page-content {
        /* 2 columns on tablets/medium screens */
        column-width: calc(100vw / 2);
        padding: 5rem 3rem 5rem;
      }
    }
    
    /* Mobile: Single column (one page at a time) */
    @media (max-width: 768px) {
      .book-page-content {
        width: 100vw;
        column-width: 100vw;
        padding: 5rem 2rem 5rem;
      }
    }
    
    .book-header {
      text-align: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid ${styling.theme?.accentColor || '#8b4513'};
    }
    
    .book-title {
      font-size: 2.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    @media (max-width: 768px) {
      .book-title {
        font-size: 2rem;
      }
    }
    
    .book-author {
      font-size: 1.5rem;
      font-style: italic;
      opacity: 0.8;
    }
    
    @media (max-width: 768px) {
      .book-author {
        font-size: 1.25rem;
      }
    }
    
    /* Chapters */
    .book-chapter {
      line-height: 1.8;
    }
    
    .book-chapter:not(.active) {
      display: none;
    }
    
    .chapter-title {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: ${styling.theme?.accentColor || '#8b4513'};
    }
    
    .chapter-content {
      font-size: 1.25rem;
    }
    
    @media (max-width: 768px) {
      .chapter-content {
        font-size: 1.1rem;
      }
    }
    
    .chapter-content h1 {
      font-size: 1.75rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .chapter-content h1 {
        font-size: 1.5rem;
      }
    }
    
    .chapter-content h2 {
      font-size: 1.5rem;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
    }
    
    .chapter-content h3 {
      font-size: 1.25rem;
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    .chapter-content p {
      margin-bottom: 1.5rem;
      break-inside: avoid-column;
    }
    
    /* Prevent awkward breaks */
    .chapter-content h1,
    .chapter-content h2,
    .chapter-content h3 {
      break-after: avoid-column;
    }
    
    .chapter-content blockquote,
    .chapter-content ul,
    .chapter-content ol {
      break-inside: avoid-column;
    }
    
    .chapter-content blockquote {
      margin: 2rem 0;
      padding: 1rem 1.5rem;
      border-left: 4px solid ${styling.theme?.accentColor || '#8b4513'};
      background: rgba(0, 0, 0, 0.02);
      font-style: italic;
    }
    
    .chapter-content blockquote p:last-child {
      margin-bottom: 0;
    }
    
    .chapter-content ul,
    .chapter-content ol {
      margin: 1.5rem 0;
      padding-left: 2rem;
    }
    
    .chapter-content li {
      margin-bottom: 0.5rem;
    }
    
    .chapter-content code {
      background: rgba(0, 0, 0, 0.05);
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    
    .chapter-content pre {
      background: rgba(0, 0, 0, 0.05);
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
      margin: 1.5rem 0;
    }
    
    .chapter-content pre code {
      background: none;
      padding: 0;
    }
    
    .chapter-content hr {
      margin: 2rem 0;
      border: none;
      border-top: 2px solid rgba(0, 0, 0, 0.1);
    }
    
    .chapter-content strong {
      font-weight: 600;
    }
    
    .chapter-content em {
      font-style: italic;
    }
    
    /* Chapter navigation links */
    .chapter-link {
      color: ${styling.theme?.accentColor || '#8b4513'};
      text-decoration: none;
      font-weight: 600;
      border-bottom: 2px solid ${styling.theme?.accentColor || '#8b4513'};
      transition: opacity 0.3s;
    }
    
    .chapter-link:hover {
      opacity: 0.7;
    }
    
    /* Progress indicator */
    .book-progress {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.05);
      text-align: center;
      font-size: 0.9rem;
      opacity: 0.7;
      z-index: 50;
      pointer-events: none;
    }

  </style>
</head>
<body>
  <nav class="book-nav">
    <a href="/" class="logo">${manifest.meta?.logo || 'Home'}</a>
  </nav>
  
  <div id="book-container">
    <div class="book-page-content">
      <div class="book-header">
        <h1 class="book-title">${escapeHtml(meta.title)}</h1>
        <p class="book-author">by ${escapeHtml(meta.author)}</p>
      </div>
      <div id="chapters-container">
        ${chaptersHtml}
      </div>
    </div>
  </div>
  
  <div class="book-progress">
    <span id="progress-text">Chapter 1</span>
  </div>
  
  <script>
    (function() {
      // Book reader JavaScript
      const bookData = ${bookDataJson};
      let currentChapterId = '${firstChapterId}';
      const container = document.getElementById('book-container');
      let currentPage = 0;
      
      // Initialize - show first chapter
      function showChapter(chapterId) {
        const allChapters = document.querySelectorAll('.book-chapter');
        allChapters.forEach(function(ch) {
          ch.classList.remove('active');
          ch.style.display = 'none';
        });
        
        const chapter = document.querySelector('[data-chapter-id="' + chapterId + '"]');
        if (chapter) {
          chapter.style.display = 'block';
          chapter.classList.add('active');
          currentChapterId = chapterId;
          
          // Update progress
          const chapterIndex = bookData.chapters.findIndex(function(ch) { return ch.id === chapterId; });
          const chapterTitle = bookData.chapters[chapterIndex] ? bookData.chapters[chapterIndex].title : 'Chapter';
          document.getElementById('progress-text').textContent = 
            'Chapter ' + (chapterIndex + 1) + ' of ' + bookData.chapters.length + ': ' + chapterTitle;
          
          // Reset scroll to top
          container.scrollTo(0, 0);
          currentPage = 0;
          
          // Save progress
          if (bookData.settings && bookData.settings.enableProgress) {
            localStorage.setItem('book:${bookId}:progress', JSON.stringify({
              currentChapter: chapterId,
              lastRead: new Date().toISOString()
            }));
          }
        }
      }
      
      // Page navigation - horizontal scroll by viewport width
      function nextPage() {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const pageWidth = window.innerWidth;
        
        if (container.scrollLeft < maxScroll - 10) {
          container.scrollBy({ left: pageWidth, behavior: 'smooth' });
          currentPage++;
        }
      }
      
      function prevPage() {
        const pageWidth = window.innerWidth;
        
        if (container.scrollLeft > 10) {
          container.scrollBy({ left: -pageWidth, behavior: 'smooth' });
          currentPage--;
        }
      }
      
      // Keyboard navigation
      document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          nextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          prevPage();
        }
      });
      
      // Handle chapter link clicks
      document.addEventListener('click', function(e) {
        if (e.target.classList.contains('chapter-link')) {
          e.preventDefault();
          const chapterId = e.target.dataset.chapter;
          if (chapterId) {
            showChapter(chapterId);
          }
        }
      });
      
      // Touch swipe support for mobile - horizontal swipe
      let touchStartX = 0;
      let touchEndX = 0;
      
      container.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      container.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
      
      function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            nextPage(); // Swipe left = next page
          } else {
            prevPage(); // Swipe right = prev page
          }
        }
      }
      
      // Load saved progress
      if (bookData.settings && bookData.settings.enableProgress) {
        const saved = localStorage.getItem('book:${bookId}:progress');
        if (saved) {
          try {
            const progress = JSON.parse(saved);
            if (progress.currentChapter) {
              showChapter(progress.currentChapter);
            }
          } catch (e) {
            console.error('Failed to load progress:', e);
          }
        }
      }
      
      // Show first chapter
      showChapter(currentChapterId);
    })();
  </script>
</body>
</html>`;
}
