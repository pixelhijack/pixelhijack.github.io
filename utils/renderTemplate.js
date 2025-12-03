
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
    contentContainerStyle
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
<body class="relative min-h-screen">
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
    class="relative w-full min-h-screen"
    ${contentContainerStyle ? `style="${contentContainerStyle}"` : ''}>
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

    function sendMagicLink(formElem, redirectTo) {
      const emailInput = formElem.querySelector('input[type="email"]');
      const submitBtn = formElem.querySelector('button[type="submit"]');
      const messageDiv = formElem.querySelector('.message') || formElem.parentElement.querySelector('.message');
      
      if (!emailInput || !emailInput.value) {
        console.error('Email input not found or empty');
        return;
      }

      const email = emailInput.value;
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Magic Link';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }
      
      if (messageDiv) {
        messageDiv.className = 'message';
        messageDiv.textContent = '';
      }

      fetch('/auth/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirectTo })
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            if (messageDiv) {
              messageDiv.className = 'message success';
              messageDiv.textContent = data.message;
            }
            formElem.reset();
          } else if (data.error) {
            throw new Error(data.error);
          }
        })
        .catch(error => {
          if (messageDiv) {
            messageDiv.className = 'message error';
            messageDiv.textContent = error.message;
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        });
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
        hb.classList.add('hidden');           // hide hb when overlay is open
        hb.setAttribute('aria-expanded', 'true');
      }
      if (closeBtn && overlay && e.target.closest('#close-mobile-nav')) {
        overlay.classList.add('hidden');
        hb && hb.classList.remove('hidden');  // restore hb when overlay closes
        hb && hb.setAttribute('aria-expanded', 'false');
      }
      if (overlay && e.target.closest('#mobile-nav-list a')) {
        overlay.classList.add('hidden');
        hb && hb.classList.remove('hidden');
        hb && hb.setAttribute('aria-expanded', 'false');
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