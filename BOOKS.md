# Prompt

i want to create books. i am thinking of the structure how to implement this. do not implement it for me, we are just brainstorming here, i need to consider approaches first - it is ok to save your answer into a BOOKS.md. As i will have many books per projects, i think i will have a /books folder and put my books there by title, i.e. books/my-book-1/... For each book, i might need a manifest type of json for metadata, a table of contents, toc.json. And chapters, stored in .md files. (Not sure if there is a more standard way of book format on the net: as i want this to be able later to download as for example an .epub with clickable chapters, you might also suggest a standard structure of an epub and i can extend that.) I want a book to be a client-side experience: since it will be mainly text, i think i can send a complete book packaged down to the client in one row, sending down as separate chapters would only make sense for routing, to be able to easier access / bookmark chapters. My first idea is to only store this on my side, for administration, and when a book is requested by the client, the server should read the book folder, take the toc.json, take all the .md chapters, put it together into raw html and send down in one batch. On the client, it might be great if this could be cached, i.e. into localstorage, though not sure if it would not run out of the size limits of that, and also will need some stale check, but i want offline first reading experience. Chapters i want to implement a bit like Fighting Fantasy style, so within the book i need links to be clickable, for example If you turn left, continue in Chapter 328 (linked), if right, Chapter 42 (linked). I want different styling as well, per book, it might go into the toc.json or should we name book.json? or i should have a book.css? On the client-side, i would love to have all chapters and pages accessible. I am thinking of a real book experience, not long scrolling: full viewport-width-height pages would be nice, not sure if there is a declarative mainly css solution to break the texts into pages and one viewport would be one page, with the interaction to tap on the right side - go to the next page, tap on the left side go back one. for all the features i am considering here i want it as declarative and minimal / unobtrusive as possible, so mainly json / html / css, the least js is the best, no complex state management, no magic. i am thinking from where / how to access books: maybe it should be just a DOM part, like all within a div, to be able to embed anywhere, or maybe it should have its own template, a full html - not sure which has what advantages. if i want to have different fonts, stylings per book, maybe the latter. i am thinking two different approaches: 1. to have a "type": "book" in any manifest.json and it would be like an embed type of thing, a div with all the chapters etc there, or 2. a different route handling in the server.js, like for any /books/... it would send this with its own html template, populated with the book - this is closer to the standalone epub style ebook format. i do want to stay within the project's space, so navbar or at least the logo kept - maybe styled rather hidden with the :has parent selector, if it is a book, then hide the nav, only keep the logo to be able to return back. it would also be nice to keep the users progress saved to localstorage, i.e. where he was on what page, if closes. Suggest structures for this new book format

# Book System Architecture - Brainstorming

## Current Thinking

- Multiple books per project in `/books/` folder
- Each book: metadata + TOC + chapters (markdown)
- Client-side experience, offline-first
- Fighting Fantasy-style chapter navigation
- Paginated reading (viewport pages, not scrolling)
- Minimal JS, declarative approach
- Per-book styling

---

## 1. Directory Structure

### Option A: Project-scoped books

```
projects/
  skeleton/
    books/
      my-book-1/
        book.json          # metadata + TOC + styling config
        chapter-1.md
        chapter-2.md
        book.css           # optional per-book styles
        cover.jpg          # optional
      another-book/
        ...
```

### Option B: Separate books collection (if books span projects)

```
books/
  my-book-1/
    book.json
    chapters/
      001-chapter-one.md
      002-chapter-two.md
      328-the-left-path.md
    assets/
      cover.jpg
      book.css
```

**Recommendation**: Option A (project-scoped) keeps things modular and allows different projects to have different books.

---

## 2. Book Metadata Format

### book.json structure

```json
{
  "meta": {
    "title": "The Labyrinth of Choices",
    "author": "Your Name",
    "isbn": "optional",
    "language": "en",
    "description": "A Fighting Fantasy style adventure",
    "cover": "cover.jpg",
    "version": "1.0.0",
    "lastUpdated": "2024-01-15"
  },
  "styling": {
    "fonts": [
      "https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600&display=swap"
    ],
    "css": "book.css",
    "theme": {
      "pageBackground": "#fef9f3",
      "textColor": "#2d2d2d",
      "accentColor": "#8b4513"
    }
  },
  "toc": [
    { "id": "1", "file": "chapter-1.md", "title": "The Beginning" },
    { "id": "2", "file": "chapter-2.md", "title": "The First Choice" },
    { "id": "328", "file": "chapter-328.md", "title": "The Left Path" },
    { "id": "42", "file": "chapter-42.md", "title": "The Right Path" }
  ],
  "settings": {
    "enablePageMode": true,
    "wordsPerPage": 300, // or use viewport calculation
    "enableProgress": true,
    "enableBookmarks": true
  }
}
```

**Why single book.json**: Keeps all metadata together, easier to parse, aligns with manifest.json pattern you already use.

---

## 3. EPUB Compatibility

### Standard EPUB3 Structure

```
book.epub (just a zip)
├── META-INF/
│   └── container.xml
├── OEBPS/
│   ├── content.opf       # metadata + manifest + spine
│   ├── toc.ncx           # navigation
│   ├── toc.xhtml         # HTML TOC
│   ├── chapters/
│   │   ├── chapter-1.xhtml
│   │   └── chapter-2.xhtml
│   ├── css/
│   │   └── stylesheet.css
│   └── images/
│       └── cover.jpg
└── mimetype
```

**Alignment Strategy**:

- Your `book.json` maps to EPUB's `content.opf` (metadata)
- Your TOC structure maps to both `toc.ncx` and `toc.xhtml`
- Your markdown chapters can be converted to XHTML
- Your `book.css` maps to EPUB's stylesheet
- You could add an export endpoint: `/books/my-book-1/export.epub`

**Benefit**: If you align with EPUB structure, building an export is just packaging.

---

## 4. Server-Side Processing

### Approach: Pre-compile on request (with caching)

```javascript
// server.js - new endpoint
app.get("/:projectName/books/:bookId", async (req, res) => {
  const { projectName, bookId } = req.params;
  const bookPath = path.join(
    __dirname,
    "projects",
    projectName,
    "books",
    bookId
  );

  // 1. Read book.json
  const bookMeta = JSON.parse(
    fs.readFileSync(path.join(bookPath, "book.json"))
  );

  // 2. Read all chapter files according to TOC
  const chapters = await Promise.all(
    bookMeta.toc.map(async (chapter) => {
      const mdPath = path.join(bookPath, chapter.file);
      const rawMd = fs.readFileSync(mdPath, "utf8");
      return {
        id: chapter.id,
        title: chapter.title,
        html: marked.parse(rawMd), // convert to HTML
      };
    })
  );

  // 3. Package everything as JSON
  const bookData = {
    meta: bookMeta.meta,
    styling: bookMeta.styling,
    chapters: chapters,
    settings: bookMeta.settings,
  };

  // 4. Render with book template or embed in manifest
  // ...
});
```

**Optimization**: Cache compiled book data in memory/redis, invalidate on file changes.

---

## 5. Two Integration Approaches

### Option 1: Embedded Book Type (DOM component)

**In manifest.json**:

```json
{
  "slug": "books",
  "tree": {
    "type": "book",
    "source": "books/my-book-1"
  }
}
```

**Pros**:

- Keeps navbar/project context
- Easy to embed books anywhere
- Reuses existing template system

**Cons**:

- Harder to do full-viewport page mode
- Book styling conflicts with page styling
- Less "immersive" reading experience

---

### Option 2: Dedicated Book Route (standalone)

**Server routing**:

```javascript
// Special handling for /books/* routes
if (req.path.startsWith("/books/")) {
  // Use book-specific template
  return renderBookTemplate(bookData, manifest);
}
```

**book-template.html**:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>{{book.title}}</title>
    <link rel="stylesheet" href="/output.css" />
    <link rel="stylesheet" href="{{book.css}}" />
    <style>
      /* book-specific page mode styles */
    </style>
  </head>
  <body class="book-mode">
    <nav class="minimal-nav">
      <a href="/" class="logo-only">{{manifest.logo}}</a>
    </nav>
    <div id="book-container" data-book-id="{{bookId}}">
      <!-- Book reader UI -->
    </div>
    <script src="/book-reader.js"></script>
  </body>
</html>
```

**Pros**:

- Full control over layout
- Clean reading experience
- Easier to implement page-mode
- Can still keep minimal nav (logo only)

**Cons**:

- Need separate template
- More code to maintain

**Recommendation**: Go with Option 2. It's cleaner for the immersive reading experience you want, and you can use `:has()` selector to hide nav elements.

---

## 6. Client-Side Storage Strategy

### LocalStorage Structure

```javascript
// Book data cache
localStorage.setItem("book:my-book-1:data", JSON.stringify(bookData));
localStorage.setItem("book:my-book-1:version", "1.0.0");

// Reading progress
localStorage.setItem(
  "book:my-book-1:progress",
  JSON.stringify({
    currentChapter: "2",
    currentPage: 5,
    lastRead: "2024-01-15T10:30:00Z",
    bookmarks: ["1:3", "328:1"], // chapter:page format
  })
);
```

### Size Considerations

- **LocalStorage limit**: ~5-10MB per origin
- **Average book**:
  - 50,000 words ≈ 100KB text
  - With HTML markup ≈ 150KB
  - Entire book with metadata ≈ 200KB
  - **Fits easily**: You could cache 25-50 books

### Cache Strategy

```javascript
async function loadBook(bookId) {
  const cached = localStorage.getItem(`book:${bookId}:data`);
  const cachedVersion = localStorage.getItem(`book:${bookId}:version`);

  if (cached && cachedVersion) {
    // Check if version is stale
    const serverVersion = await fetch(`/books/${bookId}/version`);
    if (cachedVersion === serverVersion) {
      return JSON.parse(cached); // Use cache
    }
  }

  // Fetch fresh
  const bookData = await fetch(`/books/${bookId}`).then((r) => r.json());
  localStorage.setItem(`book:${bookId}:data`, JSON.stringify(bookData));
  localStorage.setItem(`book:${bookId}:version`, bookData.meta.version);
  return bookData;
}
```

---

## 7. CSS Pagination (Declarative Approach)

### CSS Regions (deprecated, but concept is good)

The ideal solution would be CSS Regions, but it's not widely supported.

### CSS Columns (current best option)

```css
/* Paginated reading mode */
.book-content {
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  /* Multi-column layout */
  column-width: 100vw;
  column-gap: 0;
  column-fill: auto;

  /* Snap scrolling */
  scroll-snap-type: x mandatory;
  overflow-x: scroll;
  overflow-y: hidden;
}

.book-content > * {
  scroll-snap-align: start;
  break-inside: avoid-column;
}

/* Hide scrollbar */
.book-content::-webkit-scrollbar {
  display: none;
}
```

**Interaction**:

- Use `scrollBy()` for page turns
- Tap detection zones (left 1/3, right 1/3 of screen)

```javascript
// Minimal JS for interaction
bookContainer.addEventListener("click", (e) => {
  const x = e.clientX;
  const width = window.innerWidth;

  if (x < width / 3) {
    bookContainer.scrollBy({ left: -width, behavior: "smooth" });
  } else if (x > (2 * width) / 3) {
    bookContainer.scrollBy({ left: width, behavior: "smooth" });
  }
});
```

### Alternative: Pagination.js library

If CSS approach doesn't work well, consider [Pagination.js](https://github.com/customd/jquery-pagination) or [turn.js](http://www.turnjs.com/) for page-flip effects.

**But keep it minimal**: Try CSS first, only add library if needed.

---

## 8. Chapter Cross-Linking (Fighting Fantasy Style)

### Markdown Format

```markdown
# Chapter 2: The First Choice

You stand at a crossroads in the dark forest.

If you wish to turn left and follow the overgrown path, turn to [Chapter 328](#chapter-328).

If you decide to take the right path toward the light, turn to [Chapter 42](#chapter-42).
```

### Processing

1. **Server-side**: Convert markdown links to special format

   ```html
   <a href="#" data-chapter="328" class="chapter-link">Chapter 328</a>
   ```

2. **Client-side**: Intercept clicks and navigate to chapter
   ```javascript
   document.addEventListener("click", (e) => {
     if (e.target.classList.contains("chapter-link")) {
       e.preventDefault();
       const chapterId = e.target.dataset.chapter;
       navigateToChapter(chapterId);
     }
   });
   ```

### Navigation Logic

```javascript
function navigateToChapter(chapterId) {
  // Find chapter in loaded data
  const chapter = bookData.chapters.find((ch) => ch.id === chapterId);

  // Render chapter
  renderChapter(chapter);

  // Update URL (for bookmarking)
  history.pushState({}, "", `/books/my-book-1/${chapterId}`);

  // Save progress
  saveProgress(chapterId, 1);
}
```

---

## 9. State Management (Minimal Approach)

### No Framework Needed

You can do this with vanilla JS and a simple state object:

```javascript
const BookReader = {
  currentBook: null,
  currentChapter: null,
  currentPage: 1,

  init(bookId) {
    this.loadBook(bookId);
    this.loadProgress();
    this.attachEventListeners();
  },

  loadBook(bookId) {
    // Fetch or get from cache
  },

  loadProgress() {
    const saved = localStorage.getItem(`book:${bookId}:progress`);
    if (saved) Object.assign(this, JSON.parse(saved));
  },

  saveProgress() {
    localStorage.setItem(
      `book:${bookId}:progress`,
      JSON.stringify({
        currentChapter: this.currentChapter,
        currentPage: this.currentPage,
        lastRead: new Date().toISOString(),
      })
    );
  },

  navigateToChapter(chapterId) {
    // ...
  },
};
```

**No Redux, no complex state** - just a simple object with methods.

---

## 10. Recommended Implementation Path

### Phase 1: Basic Structure

1. Create `/projects/skeleton/books/my-book-1/` structure
2. Add `book.json` with metadata + TOC
3. Add a few markdown chapters with cross-links
4. Implement server endpoint to read and compile book
5. Create minimal book template HTML

### Phase 2: Client-Side Reader

1. Create `book-reader.js` with basic state
2. Implement chapter rendering (simple, scrolling first)
3. Add chapter navigation (links work)
4. Add localStorage caching for book data
5. Add progress tracking

### Phase 3: Pagination

1. Implement CSS column-based pagination
2. Add tap zones for navigation
3. Test on mobile devices
4. Fine-tune page breaks

### Phase 4: Polish

1. Add bookmarks feature
2. Add TOC overlay/sidebar
3. Add reading settings (font size, theme)
4. Add EPUB export endpoint (optional)
5. Per-book custom styling

---

## 11. Hybrid Approach: Best of Both Worlds

**What if**: You implement both?

1. **Dedicated route** (`/books/my-book-1`) = full immersive reader
2. **Embed type** (`type: "book"`) = preview/teaser in manifest pages

Example:

```json
{
  "slug": "library",
  "tree": {
    "type": "div",
    "children": [
      {
        "type": "h1",
        "content": "My Book Collection"
      },
      {
        "type": "book-preview",
        "source": "books/my-book-1",
        "showChapters": 2,
        "linkTo": "/books/my-book-1"
      }
    ]
  }
}
```

The preview shows cover + first chapter excerpt + "Read More" link to dedicated reader.

---

## 12. Navigation & UI Components

### Minimal Book Reader UI

```
┌─────────────────────────────────┐
│ [Logo]              [TOC] [⚙]   │  ← Minimal nav
├─────────────────────────────────┤
│                                 │
│                                 │
│     Chapter Content             │
│     Paginated                   │
│                                 │
│                                 │
│     [← tap]         [tap →]     │  ← Invisible zones
├─────────────────────────────────┤
│ Chapter 2 • Page 5/12 • 45% ⬤  │  ← Progress bar
└─────────────────────────────────┘
```

### Components Needed

- **Header**: Minimal, logo + TOC button + settings
- **Content area**: Paginated chapter text
- **Footer**: Chapter/page indicator + progress
- **TOC overlay**: Slides in from side
- **Settings panel**: Font size, theme, etc.

### CSS for "hide nav when book"

```css
/* In main template */
body:has(#book-container) nav {
  /* Minimal nav styling */
  background: transparent;
}

body:has(#book-container) nav #nav-links {
  display: none; /* Hide navigation links */
}

body:has(#book-container) nav #logo {
  opacity: 0.5; /* Subtle logo */
}

body:has(#book-container) nav #logo:hover {
  opacity: 1;
}
```

---

## 13. Final Recommendations

### Go With:

1. **Structure**: `/projects/{project}/books/{book-id}/` with `book.json`
2. **Integration**: Dedicated route (`/books/{book-id}`) with separate template
3. **Processing**: Server-side compile to JSON, client-side cache
4. **Storage**: LocalStorage for cache + progress (plenty of space)
5. **Pagination**: Start with CSS columns, add JS helpers
6. **Navigation**: Minimal nav (logo only) with `:has()` styling
7. **State**: Simple vanilla JS object, no framework
8. **Phase approach**: Implement in 4 phases as outlined

### Keep Declarative:

- book.json for metadata (JSON)
- Markdown for chapters (declarative)
- CSS columns for pagination (CSS)
- Simple event listeners (minimal JS)
- No build step, no bundling

### EPUB Export (bonus):

Once structure is in place, add `/books/{book-id}/export.epub` endpoint that:

1. Reads book.json + chapters
2. Generates EPUB3 structure
3. Returns zipped file

This aligns with your "minimal, declarative" philosophy while giving you a powerful book system.

---

## Questions to Consider

1. **Do you want chapters to be accessible via direct URLs?**

   - e.g., `/books/my-book-1/chapter/328`
   - Pros: Bookmarkable, shareable
   - Cons: More routing logic

2. **Should books be public or auth-protected?**

   - Could integrate with your existing auth system
   - Premium books behind login?

3. **Multi-language support for books?**

   - Same structure as manifests: `book-en.json`, `book-hu.json`

4. **Search within books?**

   - Client-side search since all content is loaded?

5. **Annotations/highlights?**
   - Store in localStorage with chapter:paragraph:offset format?

Let me know which direction resonates and we can start implementing!
