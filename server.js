import 'dotenv/config'; 
import { google } from "googleapis";
import express from 'express'; 
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; 
// --- Define ES Module Equivalents for CommonJS __dirname previously ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ------------------------------------

const app = express();
const port = process.env.PORT || 3000;

console.log("Starting Express server...");

// parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
// serve project-specific static assets so /projects/* is reachable from the browser
app.use('/projects', express.static(path.join(__dirname, 'projects')));


// Define the ID of your Google Spreadsheet
const SPREADSHEET_ID = '1k6-C1cuZjHBKAhlt6llf8vsdXPxrZdoI1-sgCDir3xg'; 
// Get this from the sheet's URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit

// **B. GOOGLE SHEETS AUTHENTICATION SETUP**
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const PROJECT = process.env.PROJECT_NAME || 'photographer';
let manifestCached = loadProjectManifest(PROJECT);

// load HTML template for server-side rendering
const templatePath = path.join(__dirname, 'public', 'index.html');
let templateHtml = '';
try {
  templateHtml = fs.readFileSync(templatePath, 'utf8');
} catch (err) {
  console.error('Failed to read template:', templatePath, err);
  // fallback minimal template so server doesn't crash
  templateHtml = '<!doctype html><html><head><meta charset="utf-8"><title>Template missing</title></head><body><main id="content-container"></main></body></html>';
}

// contact POST endpoint
app.post('/form', async (req, res) => {
  
  console.log('POST /form body:', req.body);
  const { intent, ...formData } = req.body || {};
  const timestamp = new Date().toLocaleString();

  // save to Google Sheets
  let sheetName = '';
  let values = [];

  // 1. Determine which sheet to write to based on formType
  if (intent === 'pothattila.com: contact') {
      sheetName = 'pothattila.com: contact';
      // Order must match the sheet's column order: Timestamp, Name, Email, Message
      values = [timestamp, formData.name, formData.email, formData.message];
  } else if (intent === 'pothattila.com: workshop') {
      sheetName = 'pothattila.com: workshop';
      // Order must match the sheet's column order
      values = [timestamp, formData.name, formData.email];
  } else if (intent === 'neurodiv: segment') {
      sheetName = 'neurodiv: segment';
      // Order must match the sheet's column order
      values = [timestamp, formData.name || 'anonim', formData.email, formData.message || '', formData.role, JSON.stringify(formData.checkboxes)];
  } else if (intent === 'aipresszo.hu: contact') {
      sheetName = 'aipresszo.hu: contact';
      // Order must match the sheet's column order
      values = [timestamp, formData.name, formData.email, formData.message];
  } else if (intent === 'aipresszo.hu: AI') {
      sheetName = 'aipresszo.hu: AI';
      // Order must match the sheet's column order
      values = [timestamp, formData.name || 'anonim', formData.email, formData.message || '', formData.role, JSON.stringify(formData.checkboxes)];
  } else {
      return res.status(400).send('Invalid form type provided.');
  }
    
  try {
    // 2. Call the Google Sheets API to append the data
    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: sheetName, // Writes to the whole tab
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [values], // Append one row of data
        },
    });

    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error writing to Google Sheet:', error);
    res.status(500).json({ error: 'Failed to submit form.' });
  }
});


// helper: load manifest for project and merge folder.json routes
function loadProjectManifest(projectName) {
  const manifestPath = path.join(__dirname, 'projects', projectName, 'manifest.json');
  let manifest;
  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } else {
    manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'manifest.json'), 'utf8'));
  }

  // ensure pages array exists
  manifest.pages = Array.isArray(manifest.pages) ? manifest.pages : [];

  // load folder.json (project-independent)
  const folderPath = path.join(__dirname, 'public', 'folder.json');
  let folderData = { flat: {} };
  if (fs.existsSync(folderPath)) {
    try {
      folderData = JSON.parse(fs.readFileSync(folderPath, 'utf8'));
    } catch (err) {
      console.warn('Could not parse folder.json, continuing with empty folder:', err.message);
    }
  }

  // merge folder routes into manifest.pages (avoid duplicates)
  Object.keys(folderData.flat || {}).forEach((route) => {
    if (!manifest.pages.find((p) => p && p.slug === route)) {
      manifest.pages.push({
        slug: route,
        tree: { source: route }
      });
    }
  });

  // optional: ensure a sitemap page exists (similar to client behavior)
  if (!manifest.pages.find(p => p && p.slug === 'sitemap')) {
    manifest.pages.push({
      slug: "sitemap",
      navColor: "white",
      background: "conceptual/botanic/DSC09953.jpg",
      tree: {
        type: "div",
        class: "pt-[100px] pl-[75px] min-h-screen flex flex-col items-left justify-center space-y-4 p-8",
        children: [
          {
            type: "h1",
            class: "text-4xl md:text-6xl font-ambroise mb-8",
            content: "Congrats hacker, you found all the pages"
          },
          // links generated from folder routes
          ...Object.keys(folderData.flat || {}).map(route => ({
            type: "a",
            href: `/${route}`,
            class: "text-1xl md:text-2xl font-bold text-white rounded-md",
            content: route
          }))
        ]
      }
    });
  }

  // attach raw folder data for client use if needed
  manifest._folder = folderData;

  return manifest;
}

// API: return manifest for current project or query param
app.get('/api/manifest', (req, res) => {
  const project = process.env.PROJECT_NAME || 'photographer';
  try {
    const manifest = loadProjectManifest(project);
    // include a few computed hints if you want
    res.json(manifest);
  } catch (err) {
    console.error('manifest load error', err);
    res.status(500).json({ error: 'failed to load manifest' });
  }
});


app.get(/^(.*)$/, (req, res) => {
  try {
    const pathName = req.path === '/' ? '' : req.path.replace(/^\//, '').replace(/\/$/, '');
    let currentPage = manifestCached.pages.find(p => p.slug === pathName);
    
    if (!currentPage) {
      if (pathName.includes('/')) {
        const segs = pathName.split('/');
        while (segs.length > 0 && !currentPage) {
          const toCheck = segs.join('/');
          currentPage = manifestCached.pages.find(p => p.slug === toCheck);
          segs.pop();
        }
      }
    }
    
    if (!currentPage) {
      currentPage = manifestCached.pages.find(p => p.slug === '') || manifestCached.pages[0];
    }

    const contentHtml = renderTreeServer(currentPage.tree || {});
    const title = manifestCached.meta?.title || 'Site';
    const logo = manifestCached.meta?.logo || '';
    const navColor = currentPage.navColor || 'white';

    // Merge global and page-specific OG tags
    const globalOg = manifestCached.meta?.og || {};
    const pageOg = currentPage.og || {};
    const ogTags = {
      title: pageOg.title || globalOg.title || title,
      description: pageOg.description || globalOg.description || '',
      image: pageOg.image || globalOg.image || '',
      url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      type: pageOg.type || globalOg.type || 'website',
      twitter: {
        card: pageOg.twitter?.card || globalOg.twitter?.card || 'summary_large_image',
        site: pageOg.twitter?.site || globalOg.twitter?.site || '',
        title: pageOg.twitter?.title || pageOg.title || globalOg.twitter?.title || globalOg.title || title,
        description: pageOg.twitter?.description || pageOg.description || globalOg.twitter?.description || globalOg.description || '',
        image: pageOg.twitter?.image || pageOg.image || globalOg.twitter?.image || globalOg.image || ''
      }
    };
    
    const navArray = manifestCached.nav || [];
    const navHtml = navArray.map(i => 
      `<a href="${i.href}" class="px-2">${escapeHtml(i.label || i.href)}</a>`
    ).join('');
    
    const fontLinks = (manifestCached.fonts || [])
      .map(url => `<link rel="stylesheet" href="${url}">`)
      .join('\n');
    
    const cssLinks = (manifestCached.css || [])
      .map(url => `<link rel="stylesheet" href="${url}">`)
      .join('\n');
    
    const gaScript = manifestCached.meta?.ga 
      ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${manifestCached.meta.ga}"></script>
         <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${manifestCached.meta.ga}');</script>`
      : '';
    
    const footerHtml = manifestCached.footer || '';

    const html = renderTemplate({
      title,
      logo,
      navColor,
      navHtml,
      contentHtml,
      footerHtml,
      fontLinks,
      cssLinks,
      gaScript,
      ogTags
    });

    res.status(200).send(html);
  } catch (err) {
    console.error('Server render error', err);
    res.status(500).send('Server render error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function getImageSrcServer(filename) {
  if (!filename) return '';
  if (process.env.NODE_ENV === 'development') return `/img/${filename}`;
  return `https://res.cloudinary.com/dg7vg50i9/image/upload/f_auto,q_auto/${filename}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderTreeServer(node) {
  if (!node) return '';

  // map style guide shorthand
  if (node.class && manifestCached?.styleGuide && manifestCached.styleGuide[node.class]) {
    node.class = manifestCached.styleGuide[node.class];
  }

  // handle source -> children population (folder.json)
  if (node.source) {
    const arr = manifestCached?._folder?.flat?.[node.source] || [];
    node.children = arr.map(img => ({
      type: "img",
      src: `${node.source}/${img}`,
      alt: img,
    }))
    // shuffle if you want same behavior as client (optional)
    .map(value => ({ value, sort: Math.random() }))
    .sort((a,b) => a.sort - b.sort)
    .map(({value}) => value);
  }

  if (node.type === undefined) node.type = "div";
  if (node.type === "text") return node.content || "";

  if (node.meta) {
    node.children = node.children || [];
    node.children.splice(1, 0, {
      type: "div",
      class: "m-[20px] text-2xl font-eb-garamond text-black mx-auto text-left max-w-[70%]",
      content: node.meta
    });
  }

  if (node.type === "background") {
    const bgImage = getImageSrcServer(node.src);
    let extraStyle = `background-image: url(${bgImage}); background-size: cover; background-position: center;`;
    extraStyle += "width: 100%; height: 100vh;";
    const classProp = node.class ? ` class="${node.class}"` : "";
    const styleProp = ` style="${extraStyle}"`;
    let childrenStr = "";
    if (Array.isArray(node.children)) childrenStr = node.children.map(renderTreeServer).join("");
    return `<div${classProp}${styleProp}>${node.content || ""}${childrenStr}</div>`;
  }

  // inputs
  if (node.type === "input") {
    const type = node.typeAttr || "text";
    const attrs = [];
    attrs.push(`type="${type}"`);
    if (node.name) attrs.push(`name="${node.name}"`);
    if (node.value !== undefined) attrs.push(`value="${node.value}"`);
    if (node.placeholder) attrs.push(`placeholder="${node.placeholder}"`);
    if (node.class) attrs.push(`class="${node.class}"`);
    if (node.id) attrs.push(`id="${node.id}"`);
    if (node.required) attrs.push(`required`);
    if (node.checked) attrs.push(`checked`);
    const reserved = ["type","children","content","class","style","src","alt","meta","caption","captionStyle","linkTo","source","typeAttr"];
    Object.keys(node).forEach(k => {
      if (!reserved.includes(k) && typeof node[k] === "string") attrs.push(`${k}="${node[k]}"`);
    });
    return `<input ${attrs.join(" ")}/>`;
  }

  if (node.type === "select") {
    const attrs = [];
    if (node.name) attrs.push(`name="${node.name}"`);
    if (node.class) attrs.push(`class="${node.class}"`);
    if (node.multiple) attrs.push(`multiple`);
    if (node.id) attrs.push(`id="${node.id}"`);
    let optionsHtml = "";
    (node.children || []).forEach(opt => {
      if (opt.type === "option") {
        const val = opt.value !== undefined ? opt.value : (opt.content || "");
        const selected = node.value !== undefined && String(node.value) === String(val) ? ' selected' : (opt.selected ? ' selected' : '');
        const optClass = opt.class ? ` class="${opt.class}"` : '';
        optionsHtml += `<option value="${val}"${selected}${optClass}>${opt.content || val}</option>`;
      }
    });
    return `<select ${attrs.join(" ")}>${optionsHtml}</select>`;
  }

  if (node.type === "img") {
    const imgProps = [];
    if (node.src) {
      if (typeof node.src === "string") imgProps.push(`src="${getImageSrcServer(node.src)}"`);
      else if (Array.isArray(node.src)) {
        const randomSrc = node.src[Math.floor(Math.random()*node.src.length)];
        imgProps.push(`src="${getImageSrcServer(randomSrc)}"`);
      }
    } else {
      console.warn("Image node missing 'src' property:", node);
    }
    if (node.alt) imgProps.push(`alt="${node.alt}"`);
    if (node.class) imgProps.push(`class="${node.class}"`);
    imgProps.push('loading="lazy"');
    const reservedImg = ["type","children","content","class","style","src","alt","caption","captionStyle"];
    Object.keys(node).forEach(key => {
      if (!reservedImg.includes(key) && typeof node[key] === "string") {
        imgProps.push(`${key}="${node[key]}"`);
      }
    });
    let imageHTML = "";
    if (node.caption) {
      const figCaptionProps = node.captionStyle ? ` class="${node.captionStyle}"` : "";
      imageHTML = `<figure><img ${imgProps.join(" ")}/><figcaption${figCaptionProps}>${node.caption}</figcaption></figure>`;
    } else {
      imageHTML = `<img ${imgProps.join(" ")}/>`;
    }
    if (node.linkTo) imageHTML = `<a href="/${node.linkTo}">${imageHTML}</a>`;
    return imageHTML;
  }

  // generic element
  const propsArr = [];
  if (node.class) propsArr.push(`class="${node.class}"`);

  let styleObj = {};
  if (node.style) styleObj = node.style;
  if (node.textColor) styleObj = { ...styleObj, color: node.textColor };
  const styleStr = Object.entries(styleObj).map(([k,v]) => `${k}:${v}`).join(";");
  if (styleStr) propsArr.push(`style="${styleStr}"`);

  const reserved = ["type","children","content","class","style","src","alt","caption","captionStyle","typeAttr"];
  Object.keys(node).forEach(key => {
    if (!reserved.includes(key) && typeof node[key] === "string") {
      propsArr.push(`${key}="${node[key]}"`);
    }
  });

  const propsStr = propsArr.length ? " " + propsArr.join(" ") : "";
  let childrenStr = "";
  if (Array.isArray(node.children)) childrenStr = node.children.map(renderTreeServer).join("");
  const selfClosing = ["img","br","hr","input","meta","link"];
  if (selfClosing.includes(node.type)) return `<${node.type}${propsStr}/>`;
  return `<${node.type}${propsStr}>${node.content || ""}${childrenStr}</${node.type}>`;
}

function renderTemplate({ title, logo, navColor, navHtml, contentHtml, footerHtml, fontLinks, cssLinks, gaScript, ogTags }) {
  
  // Generate OG meta tags
  const ogMetaTags = `
    <meta property="og:title" content="${escapeHtml(ogTags.title)}" />
    <meta property="og:description" content="${escapeHtml(ogTags.description)}" />
    <meta property="og:image" content="${ogTags.image}" />
    <meta property="og:url" content="${ogTags.url}" />
    <meta property="og:type" content="${ogTags.type}" />
    
    <meta name="twitter:card" content="${ogTags.twitter.card}" />
    <meta name="twitter:title" content="${escapeHtml(ogTags.twitter.title)}" />
    <meta name="twitter:description" content="${escapeHtml(ogTags.twitter.description)}" />
    <meta name="twitter:image" content="${ogTags.twitter.image}" />
    ${ogTags.twitter.site ? `<meta name="twitter:site" content="${ogTags.twitter.site}" />` : ''}
  `.trim();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  
  ${ogMetaTags}

  <link href="/output.css" rel="stylesheet">
  <link rel="stylesheet" href="https://use.typekit.net/bne3zga.css">
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  ${fontLinks}
  ${cssLinks}
  ${process.env.NODE_ENV === 'development' ? '' : gaScript}
  <style>
    /* common styles are in input.css */
  </style>
</head>
<body class="relative min-h-screen">
  <nav class="absolute top-0 left-0 w-full z-10 p-4 bg-transparent">
    <div id="logo" class="container mx-auto flex justify-between items-center px-4 md:px-0">
      <a href="/" class="font-title text-3xl md:text-4xl font-bold rounded-md p-2" style="color: ${navColor}">${logo}</a>
      <div class="space-x-4 hidden md:block" id="nav-links" style="color: ${navColor}">${navHtml}</div>
      <button id="hamburger-btn" class="${navHtml ? 'md:hidden' : 'hidden md:hidden'} text-5xl focus:outline-none self-center mr-4 leading-none" style="color: ${navColor}" aria-label="Open menu">&equiv;</button>
    </div>
    <div id="mobile-nav-overlay" class="hidden fixed inset-0 bg-black bg-opacity-90 z-50">
      <button id="close-mobile-nav" class="absolute top-6 right-8 text-white text-4xl" aria-label="Close menu">&#10005;</button>
      <nav id="mobile-nav-list" class="flex flex-col items-center justify-center h-full space-y-8 text-center text-3xl font-bold" style="color: white">${navHtml}</nav>
    </div>
  </nav>
  <main id="content-container" class="relative w-full min-h-screen">
    ${contentHtml}
  </main>
  <script>
    function submitForm(formElem, intent) {
      try {
        const payload = { intent, checkboxes: {} };
        const fd = new FormData(formElem);
        
        // Collect form entries
        for (const [key, value] of fd.entries()) {
            // For checked checkboxes, key will be the unique name (e.g., 'option_1'), 
            // and value will be its 'value' attribute (e.g., 'on' or a specific ID).
            if (payload[key] === undefined) payload[key] = value;
            // The array logic is still useful for multi-selects or other same-named fields, 
            // but less likely to be hit by uniquely named checkboxes.
            else if (Array.isArray(payload[key])) payload[key].push(value); 
            else payload[key] = [payload[key], value];
        }
        // 2. Manually process checkboxes to capture the true/false state
        formElem.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            // Use the UNIQUE NAME as the key in the payload
            if (cb.name) {
                payload['checkboxes'][cb.name] = cb.checked;
            }
        });

        fetch('/form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(res => {
            if (res.ok) {
              formElem.reset();
            } else {
              console.warn('Sorry, something went wrong at /', intent);
            }
          })
          .catch(() => console.error('Network error — please try again.'));
      } catch (err) {
        console.error('submitForm error', err);
      }
    }
    /* prevent layout loading from anchoring scroll (avoid jumps when images load) */
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    scrollToTopNow();
    document.addEventListener('click', function (e) {
      const hb = document.getElementById('hamburger-btn');
      const overlay = document.getElementById('mobile-nav-overlay');
      const closeBtn = document.getElementById('close-mobile-nav');
      if (hb && overlay && e.target.closest('#hamburger-btn')) {
        overlay.classList.remove('hidden');
      }
      if (closeBtn && overlay && e.target.closest('#close-mobile-nav')) {
        overlay.classList.add('hidden');
      }
      if (overlay && e.target.closest('#mobile-nav-list a')) {
        overlay.classList.add('hidden');
      }
    });
    function scrollToTopNow() {
      // reset scrolling on document and the main container
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const container = document.getElementById('content-container');
      if (container) container.scrollTop = 0;
      // double rAF to ensure after paint/layout
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, 0)));
    }
  </script>
  <footer class="text-center p-4 bg-black text-sm text-neutral-500">
    ${footerHtml}
  </footer>
</body>
</html>`;
}