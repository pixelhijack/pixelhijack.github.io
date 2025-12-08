
export function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}



export default function renderTemplate({ 
    title, 
    logo, 
    logoStyle,
    navColor, 
    navHtml, 
    contentHtml, 
    footerHtml, 
    fontLinks, 
    cssLinks, 
    gaScript, 
    ogTags,
    contentContainerStyle,
    isAuthenticated = false,
    userEmail = null
}) {
  
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
  ${process.env.NODE_ENV === 'development' ? '<!-- GA skipped in dev or missing meta.ga -->' : gaScript}
  <style>
    /* common styles are in input.css */
  </style>
</head>
<body class="relative min-h-screen${isAuthenticated ? ' authenticated' : ''}">
  <nav class="absolute top-0 left-0 w-full z-10 p-4 bg-transparent">
    <div id="logo" class="container mx-auto flex justify-between items-center px-4 md:px-0">
      <a href="/" class="${logoStyle || 'font-title text-2xl md:text-4xl font-bold rounded-md p-2'}" style="color: ${navColor}">${logo}</a>
      <div class="space-x-4 hidden md:block" id="nav-links" style="color: ${navColor}">${navHtml}</div>
      <button id="hamburger-btn" class="${navHtml ? 'md:hidden' : 'hidden md:hidden'} text-5xl leading-none focus:outline-none self-center mr-4" style="color: ${navColor}" aria-label="Open menu" aria-expanded="false">&equiv;</button>
    </div>
    <div id="mobile-nav-overlay" class="hidden fixed inset-0 bg-black bg-opacity-90 z-50">
      <button id="close-mobile-nav" class="absolute top-6 right-8 text-white text-4xl" aria-label="Close menu">&#10005;</button>
      <nav id="mobile-nav-list" class="flex flex-col items-center justify-center h-full space-y-8 text-center text-3xl font-bold" style="color: white">${navHtml}</nav>
    </div>
  </nav>
  <main 
    id="content-container" 
    class="relative w-full min-h-screen${isAuthenticated ? ' authenticated' : ''}"
    ${contentContainerStyle ? `style="${contentContainerStyle}"` : ''}
    ${isAuthenticated && userEmail ? `data-user-email="${escapeHtml(userEmail)}"` : ''}>
        ${contentHtml}
  </main>
  <script src="/client.js"></script>
  <footer class="text-center p-4 bg-black text-sm text-neutral-500">
    ${footerHtml}
  </footer>
</body>
</html>`;
}