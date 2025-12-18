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
</head>
<body>
  <nav class="book-nav">
    <a href="/" class="logo">☜</a>
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
