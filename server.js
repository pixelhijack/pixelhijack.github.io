import 'dotenv/config'; 
import { google } from "googleapis";
import { Resend } from 'resend';
import express from 'express'; 
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; 
// --- Define ES Module Equivalents for CommonJS __dirname previously ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ------------------------------------

import renderTreeServer from './utils/renderTreeServer.js';
import loadProjectManifest from './utils/loadProjectManifest.js';
import renderTemplate, { escapeHtml } from './utils/renderTemplate.js';
import { getImageSrcServer } from './utils/renderTreeServer.js';

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
// Use the service account credentials that has both Sheets and Gmail API enabled
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Initialize Resend for email notifications
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to detect language from Accept-Language header
function detectLanguage(req) {
  const acceptLang = req.headers['accept-language'] || '';
  // Check if Hungarian is preferred
  if (acceptLang.toLowerCase().includes('hu')) {
    return 'hu';
  }
  return 'en'; // default to English
}

const PROJECT = process.env.PROJECT_NAME || 'photographer';
// Cache manifests per language
const manifestCache = {
  en: loadProjectManifest(PROJECT, __dirname, 'en'),
  hu: loadProjectManifest(PROJECT, __dirname, 'hu')
};

// Optional: watch for changes in dev
if (process.env.NODE_ENV === 'development') {
  const PROJECT = process.env.PROJECT_NAME || 'photographer';
  const projectDir = path.join(__dirname, 'projects', PROJECT);
  
  // Watch both language manifests
  ['en', 'hu'].forEach(lang => {
    const manifestFile = path.join(projectDir, `manifest-${lang}.json`);
    if (fs.existsSync(manifestFile)) {
      let watchTimeout;
      fs.watch(manifestFile, () => {
        clearTimeout(watchTimeout);
        watchTimeout = setTimeout(async () => {
          manifestCache[lang] = await loadProjectManifest(PROJECT, __dirname, lang);
          console.log(`[manifest] reloaded manifest-${lang}.json`);
        }, 100);
      });
    }
  });
  
  // Also watch default manifest.json as fallback
  const defaultManifest = path.join(projectDir, 'manifest.json');
  if (fs.existsSync(defaultManifest)) {
    let watchTimeout;
    fs.watch(defaultManifest, () => {
      clearTimeout(watchTimeout);
      watchTimeout = setTimeout(async () => {
        ['en', 'hu'].forEach(lang => {
          manifestCache[lang] = loadProjectManifest(PROJECT, __dirname, lang);
        });
        console.log('[manifest] reloaded manifest.json');
      }, 100);
    });
  }
}

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

  const emailHtml = `
    <h1>New Form Submission from ${formData.name || 'Anonymous'}!</h1>
    <h2><strong>Intent:</strong> ${intent || 'No intent provided'}</h2>
    <p><strong>Email:</strong> ${formData.email || 'No email provided'}</p>
    <p><strong>Contact:</strong> ${formData.contact || 'No contact provided'}</p>
    <p><strong>Message:</strong> ${formData.message || 'No message provided'}</p>
    <p><strong>Role:</strong> ${formData.role || 'No role provided'}</p>
    <p><strong>Checkboxes:</strong> ${JSON.stringify(formData.checkboxes, null, 2) || 'No checkboxes provided'}</p>
  `;

  // save to Google Sheets
  let sheetName = '';
  let values = [];

  // 1. Determine which sheet to write to based on formType
  // later I can extend this with more form sheets if one is not enough, like this: 
  // if (intent === 'pothattila.com: contact') {}
  // else if (intent === 'pothattila.com: contact') {}

  if (intent) {
      sheetName = 'all forms'; // tab name in the sheet
      // Order must match the sheet's column order: Timestamp, Name, Email, Contact, Message etc
      values = [
        timestamp, 
        intent || 'unknown form',
        formData.name || 'anonim', 
        formData.email, 
        formData.contact || '',
        formData.message || '', 
        formData.role || '', 
        JSON.stringify(formData.checkboxes) || '' // "Goal"
      ];
  } else {
      return res.status(400).send('Invalid form type provided.');
  }
  
  try {
    // 2. Call the Google Sheets API to append the data
    sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName, // Writes to the whole tab
      valueInputOption: 'USER_ENTERED',
      resource: {
          values: [values], // Append one row of data
      },
    });

    // 3. Send notification email via Resend
    try {
      await resend.emails.send({
        from: intent + ' <noreply@pothattila.com>',
        to: 'pothattila@gmail.com',
        replyTo: 'pothattila@gmail.com',
        subject: intent || 'New Form Submission',
        html: emailHtml,
      });
      console.log('Email notification sent successfully via Resend');
    } catch (emailError) {
      console.error('Failed to send email via Resend:', emailError);
    }

    res.status(200).json({ 
      message: 'Form submitted successfully!' 
    });
  } catch (error) {
    console.error('Error form submission:', error);
    res.status(500).json({ error: 'Failed to submit form.' });
  }
});

app.get(/^(.*)$/, (req, res) => {
  try {
    // Detect language from browser headers
    const language = detectLanguage(req);
    const manifestCached = manifestCache[language];
    
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

    const contentHtml = renderTreeServer(currentPage.tree || {}, manifestCached, __dirname);
    const title = manifestCached.meta?.title || 'Site';
    const logo = manifestCached.meta?.logo || '';
    const logoStyle = manifestCached.meta?.logoStyle || '';
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
    // console.log('[ga] meta.ga:', manifestCached.meta?.ga, 'NODE_ENV:', process.env.NODE_ENV);
    
    const footerHtml = manifestCached.footer || '';

    const backgroundStyle = currentPage.background
      ? `background-image: url('${getImageSrcServer(currentPage.background)}'); background-size: cover; background-position: center; background-attachment: fixed;`
      : '';

    const html = renderTemplate({
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
      contentContainerStyle: backgroundStyle
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
