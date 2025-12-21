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
      ${styling.coverImage ? `
      background-image: url('${styling.coverImage}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      ` : ''}
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
    
    .chapter-link {
      color: ${styling.theme?.accentColor || '#8b4513'};
      border-bottom-color: ${styling.theme?.accentColor || '#8b4513'};
    }
    
    /* Smooth scrolling for anchor links and page navigation */
    #book-container {
      scroll-behavior: smooth;
    }
  </style>
</head>
<body>
  <nav class="book-nav">
    <a href="/" class="logo"> ☜ </a>
    <div id="page-counter" class="page-counter">1 / 1</div>
  </nav>
  
  <div id="book-container">
    <div class="book-page-content">
      <div class="book-header">
        <h1 class="book-title">${escapeHtml(meta.title)}</h1>
        <p class="book-author">${escapeHtml(meta.author)}</p>
      </div>
      <div id="chapters-container">
        ${chaptersHtml}
      </div>
    </div>
  </div>
  
  <div class="book-progress">
    <span id="progress-text">Fejezet 1</span>
    <button id="chapters-btn" class="chapters-btn">Tartalom</button>
  </div>
  
  <div id="toc-overlay" class="toc-overlay hidden">
    <div class="toc-container">
      <div class="toc-header">
        <h2>Tartalom</h2>
        <button id="close-toc" class="close-toc">&times;</button>
      </div>
      <ul class="toc-list">
        ${chapters.map((ch, idx) => `<li><a href="#" class="toc-link" data-chapter="${ch.id}">${idx + 1}. ${escapeHtml(ch.title)}</a></li>`).join('\n        ')}
      </ul>
    </div>
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
            'Fejezet ' + (chapterIndex + 1) + ' / ' + bookData.chapters.length + ': ' + chapterTitle;
          
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
      
      // Handle chapter link clicks
      document.addEventListener('click', function(e) {
        if (e.target.classList.contains('chapter-link')) {
          e.preventDefault();
          const chapterId = e.target.dataset.chapter;
          if (chapterId) {
            showChapter(chapterId);
          }
        }
        
        // Handle TOC chapter clicks
        if (e.target.classList.contains('toc-link')) {
          e.preventDefault();
          const chapterId = e.target.dataset.chapter;
          if (chapterId) {
            showChapter(chapterId);
            document.getElementById('toc-overlay').classList.add('hidden');
          }
        }
      });
      
      // Long press / tap to show/hide nav and progress
      let tapTimer = null;
      let isNavVisible = false;
      const nav = document.querySelector('.book-nav');
      const progress = document.querySelector('.book-progress');
      
      function showControls() {
        nav.classList.add('show');
        progress.classList.add('show');
        isNavVisible = true;
      }
      
      function hideControls() {
        nav.classList.remove('show');
        progress.classList.remove('show');
        isNavVisible = false;
      }
      
      function toggleControls() {
        if (isNavVisible) {
          hideControls();
        } else {
          showControls();
        }
      }
      
      // Tap/click on container to toggle controls
      container.addEventListener('click', function(e) {
        // Don't toggle if clicking on a link or button
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
          return;
        }
        toggleControls();
      });
      
      // Auto-hide controls after 3 seconds when shown via tap
      let hideTimeout = null;
      function scheduleAutoHide() {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(function() {
          hideControls();
        }, 3000);
      }
      
      // When controls are shown, schedule auto-hide
      const originalShowControls = showControls;
      showControls = function() {
        originalShowControls();
        scheduleAutoHide();
      };
      
      // Page navigation helpers
      function nextPage() {
        var pageHeight = window.innerHeight * 0.92; // 92% to keep some context
        var currentScroll = container.scrollTop;
        var targetScroll = currentScroll + pageHeight;
        container.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
      
      function prevPage() {
        var pageHeight = window.innerHeight * 0.92; // 92% to keep some context
        var currentScroll = container.scrollTop;
        var targetScroll = currentScroll - pageHeight;
        if (targetScroll < 0) targetScroll = 0;
        container.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
      
      // Keyboard navigation (always enabled)
      document.addEventListener('keydown', function(e) {
        // Only handle if not typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          return;
        }
        
        // Down arrow, right arrow, page down, or space = next page
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault();
          nextPage();
        }
        // Up arrow, left arrow, or page up = previous page
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          prevPage();
        }
      });
      
      // Detect mobile for touch navigation
      var isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Touch/swipe navigation for mobile
      if (isMobile) {
        var touchStartY = 0;
        var touchStartX = 0;
        var touchStartTime = 0;
        var touchStartScroll = 0;
        var isIntentionalSwipe = false;
        
        container.addEventListener('touchstart', function(e) {
          touchStartY = e.touches[0].clientY;
          touchStartX = e.touches[0].clientX;
          touchStartTime = Date.now();
          touchStartScroll = container.scrollTop;
          isIntentionalSwipe = false;
        }, { passive: true });
        
        container.addEventListener('touchend', function(e) {
          var touchEndY = e.changedTouches[0].clientY;
          var touchEndTime = Date.now();
          var deltaY = touchStartY - touchEndY;
          var deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX);
          var deltaTime = touchEndTime - touchStartTime;
          var velocity = Math.abs(deltaY) / deltaTime;
          var scrollMoved = Math.abs(container.scrollTop - touchStartScroll);
          
          // Only trigger page turn if:
          // 1. Mostly vertical (not horizontal swipe)
          // 2. Fast velocity (> 1.0 px/ms) OR significant distance (> 100px)
          // 3. User didn't scroll much during the gesture (< 50px natural scroll)
          var isVertical = Math.abs(deltaY) > deltaX * 2;
          var isFastSwipe = velocity > 1.0;
          var isLongSwipe = Math.abs(deltaY) > 100;
          var didntScrollMuch = scrollMoved < 50;
          
          if (isVertical && (isFastSwipe || isLongSwipe) && didntScrollMuch) {
            // This looks like an intentional page turn
            e.preventDefault();
            
            if (deltaY > 0) {
              // Swiped up - next page
              nextPage();
            } else {
              // Swiped down - previous page
              prevPage();
            }
          }
          // Otherwise let normal scrolling happen
        }, { passive: false });
      }
      
      // TOC toggle
      document.getElementById('chapters-btn').addEventListener('click', function() {
        document.getElementById('toc-overlay').classList.remove('hidden');
      });
      
      document.getElementById('close-toc').addEventListener('click', function() {
        document.getElementById('toc-overlay').classList.add('hidden');
      });
      
      // Close TOC on overlay click
      document.getElementById('toc-overlay').addEventListener('click', function(e) {
        if (e.target.id === 'toc-overlay') {
          this.classList.add('hidden');
        }
      });
      
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
      
      // Page counter tracking for vertical scroll
      function updatePageCounter() {
        const scrollTop = container.scrollTop;
        const viewportHeight = window.innerHeight;
        const totalHeight = container.scrollHeight;
        
        // Calculate current page and total pages
        const currentPage = Math.floor(scrollTop / viewportHeight) + 1;
        const totalPages = Math.ceil(totalHeight / viewportHeight);
        
        document.getElementById('page-counter').textContent = currentPage + ' / ' + totalPages;
      }
      
      // Update on scroll (debounced to avoid showing controls)
      let scrollUpdateTimeout = null;
      container.addEventListener('scroll', function() {
        if (scrollUpdateTimeout) clearTimeout(scrollUpdateTimeout);
        scrollUpdateTimeout = setTimeout(updatePageCounter, 150);
      }, { passive: true });
      
      // Update on resize
      window.addEventListener('resize', function() {
        setTimeout(updatePageCounter, 100);
      });
      
      // Initial update
      setTimeout(updatePageCounter, 100);
    })();
  </script>
</body>
</html>`;
}
