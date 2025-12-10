import 'dotenv/config'; 
import { google } from "googleapis";
import { Resend } from 'resend';
import express from 'express'; 
import cookieParser from 'cookie-parser';
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
import { initializeFirebaseAdmin } from './utils/firebaseAdmin.js';
import { verifyAuth, checkAccess, trackEngagement } from './utils/authMiddleware.js';
import { generateMagicLinkEmail } from './utils/emailTemplates.js';

const app = express();
const port = process.env.PORT || 3000;

console.log("Starting Express server...");

// parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

// Initialize Firebase Admin
initializeFirebaseAdmin();

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

function projectNamePublic(projectName){
  // Convert internal project names to public-facing names:
  if(projectName === 'photographer'){ return 'Póth Attila Photographer';}
  if(projectName === 'wedding'){ return 'Póth Attila Photographer';}
  if(projectName === 'neurodiv'){ return "Overthinkers' Club";}
  if(projectName === 'aipresszo'){ return 'AI.Presszó';}
  return 'Póth Attila Labs';
}

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
      message: 'Sikeres küldés!', 
    });
  } catch (error) {
    console.error('Error form submission:', error);
    res.status(500).json({ error: 'Upsz. Valami hiba történt.' });
  }
});

// Quiz submission with user creation and magic link
app.post('/quiz/submit', async (req, res) => {
  const { email, projectName, quizData, redirectTo } = req.body;
  
  if (!email || !projectName) {
    return res.status(400).json({ error: 'Email and project name are required' });
  }

  try {
    const { getAuth, getFirestore } = await import('./utils/firebaseAdmin.js');
    const db = getFirestore();
    
    // Check if user is already authenticated
    const authResult = await verifyAuth(req);
    const isAlreadyAuthenticated = authResult.authenticated;
    
    // 1. Create or get user
    let user;
    try {
      user = await getAuth().getUserByEmail(email);
      console.log('Found existing user:', user.uid);
    } catch (error) {
      // User doesn't exist, create them
      console.log('Creating new user for:', email);
      user = await getAuth().createUser({ email });
      console.log('Created new user:', user.uid);
      
      // Create user document in shared users collection
      await db.collection('users').doc(user.uid).set({
        email: email,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        projects: [projectName]
      });
    }

    // 2. Create or update project-specific user document
    const projectUserRef = db.collection(`users_${projectName}`).doc(user.uid);
    const projectUserDoc = await projectUserRef.get();
    
    if (!projectUserDoc.exists) {
      // New user in this project
      await projectUserRef.set({
        email: email,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        isPremium: false,
        interests: quizData.checkboxes?.map(cb => cb.label) || [],
        totalEngagements: 1,
        quizResponses: {
          [quizData.quizId || 'initial']: {
            timestamp: new Date().toISOString(),
            ...quizData
          }
        }
      });
    } else {
      // Existing user - update
      const existingData = projectUserDoc.data();
      await projectUserRef.update({
        lastActive: new Date().toISOString(),
        interests: Array.from(new Set([
          ...(existingData.interests || []),
          ...(quizData.checkboxes?.map(cb => cb.label) || [])
        ])),
        totalEngagements: (existingData.totalEngagements || 0) + 1,
        [`quizResponses.${quizData.quizId || 'initial'}`]: {
          timestamp: new Date().toISOString(),
          ...quizData
        }
      });
    }

    // 3. Save to engagements subcollection
    await projectUserRef.collection('engagements').add({
      timestamp: new Date().toISOString(),
      action: 'quiz_submission',
      quizId: quizData.quizId || 'initial',
      data: quizData
    });

    // 4. Also save to Google Sheets for backup/analytics
    const sheetName = 'all forms';
    const values = [
      new Date().toLocaleString(),
      `${projectName}: quiz`,
      email,
      '',
      '',
      '',
      quizData.role || '',
      JSON.stringify(quizData.checkboxes || [])
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] }
    });

    // 5. Send magic link only if user is not already authenticated
    if (!isAlreadyAuthenticated) {
      const customToken = await getAuth().createCustomToken(user.uid);
      const magicLink = `${req.protocol}://${req.get('host')}/auth/verify?token=${customToken}&redirect=${encodeURIComponent(redirectTo || '/')}`;

      await resend.emails.send(generateMagicLinkEmail({
        projectName: projectNamePublic(projectName),
        email,
        magicLink
      }));

      console.log('✅ Quiz submitted, user created/updated, magic link sent:', email);

      res.status(200).json({ 
        message: 'Siker! Ellenőrizd az emailjeid!',
        userId: user.uid,
        sentMagicLink: true
      });
    } else {
      console.log('✅ Quiz submitted, user already authenticated, skipped magic link:', email);

      res.status(200).json({ 
        message: 'Siker! Válaszaid mentve.',
        userId: user.uid,
        sentMagicLink: false,
        redirectTo: redirectTo || '/'
      });
    }

  } catch (error) {
    console.error('Error in quiz submission:', error);
    res.status(500).json({ 
      error: 'Upsz. Valami hiba történt.',
      details: error.message 
    });
  }
});

// Magic link authentication endpoint
app.post('/auth/send-link', async (req, res) => {
  const { email, redirectTo } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const actionCodeSettings = {
      url: `${req.protocol}://${req.get('host')}/auth/verify?redirect=${encodeURIComponent(redirectTo || '/')}`,
      handleCodeInApp: true,
    };

    // Send magic link email via Firebase (this requires Firebase client-side setup)
    // For now, we'll generate a custom token and send it via Resend
    const { getAuth } = await import('./utils/firebaseAdmin.js');
    
    // Create or get user
    let user;
    try {
      user = await getAuth().getUserByEmail(email);
      console.log('Found existing user:', user.uid);
    } catch (error) {
      // User doesn't exist, create them
      console.log('Creating new user for:', email);
      user = await getAuth().createUser({ email });
      console.log('Created new user:', user.uid);
    }

    // Generate custom token
    const customToken = await getAuth().createCustomToken(user.uid);
    console.log('Generated custom token for user:', user.uid);
    
    // Create magic link
    const magicLink = `${req.protocol}://${req.get('host')}/auth/verify?token=${customToken}&redirect=${encodeURIComponent(redirectTo || '/')}`;

    // Send email via Resend
    const host = req.get('host') || 'localhost';
    let fromEmail = 'noreply@pothattila.com';

    console.log('Sending magic link to:', email);
    console.log('Magic link URL:', magicLink);
    

    const emailResult = await resend.emails.send(generateMagicLinkEmail({
      projectName: projectNamePublic(projectName),
      email,
      magicLink
    }));

    console.log('Email sent successfully:', emailResult);
    res.status(200).json({ message: 'Egyszeri belépési linket küldtünk az emailedre!' });
  } catch (error) {
    console.error('Error sending magic link - Full error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Send more specific error to client
    res.status(500).json({ 
      error: 'Failed to send magic link',
      details: error.message 
    });
  }
});

// Verify magic link and set auth cookie
app.get('/auth/verify', async (req, res) => {
  const { token, redirect } = req.query;

  if (!token) {
    return res.status(400).send('Invalid magic link');
  }

  try {
    // Custom tokens need to be exchanged for ID tokens client-side using Firebase SDK
    // We'll render a page that does this exchange, then sets the cookie
    const exchangeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verifying...</title>
        <script type="module">
          import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
          import { getAuth, signInWithCustomToken } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
          
          const firebaseConfig = {
            apiKey: "${process.env.FIREBASE_API_KEY}",
            authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
            projectId: "${process.env.FIREBASE_PROJECT_ID}",
          };
          
          const app = initializeApp(firebaseConfig);
          const auth = getAuth(app);
          
          async function verify() {
            try {
              const userCredential = await signInWithCustomToken(auth, "${token}");
              const idToken = await userCredential.user.getIdToken();
              
              // Send ID token to server to create session cookie
              const response = await fetch('/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
              });
              
              if (response.ok) {
                window.location.href = decodeURIComponent("${redirect || '/'}");
              } else {
                document.body.innerHTML = '<h1>Authentication failed</h1>';
              }
            } catch (error) {
              console.error('Auth error:', error);
              document.body.innerHTML = '<h1>Invalid or expired magic link</h1>';
            }
          }
          
          verify();
        </script>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
          }
          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="loader"></div>
      </body>
      </html>
    `;
    
    res.send(exchangeHtml);
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).send('Invalid or expired magic link');
  }
});

// Create session cookie from ID token
app.post('/auth/session', async (req, res) => {
  const { idToken } = req.body;
  
  if (!idToken) {
    return res.status(400).json({ error: 'ID token required' });
  }

  try {
    const { getAuth } = await import('./utils/firebaseAdmin.js');
    
    // Create session cookie (expires in 5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });
    
    // Set cookie
    res.cookie('authToken', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn,
      sameSite: 'lax',
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout endpoint
app.post('/auth/logout', (req, res) => {
  res.clearCookie('authToken');
  res.status(200).json({ message: 'Logged out successfully' });
});

app.get(/^(.*)$/, async (req, res) => {
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

    // Check authentication and access
    const authResult = await verifyAuth(req);
    const hasAccess = await checkAccess(authResult.user, currentPage, PROJECT);

    // Track engagement for authenticated users on protected routes
    if (authResult.authenticated && currentPage.access) {
      await trackEngagement(authResult.user.uid, PROJECT, {
        email: authResult.user.email,
        page: pathName || 'home',
        action: 'view_protected_content',
        pageTitle: currentPage.title || pathName,
        accessLevel: currentPage.access,
      });
      console.log(`📊 Tracked engagement: ${authResult.user.email} viewed /${pathName}`);
    }

    // If page requires access but user doesn't have it, redirect to login page
    if (!hasAccess && currentPage.access) {
      const redirectUrl = `/login?redirect=${encodeURIComponent('/' + pathName)}`;
      return res.redirect(redirectUrl);
    }

    const contentHtml = renderTreeServer(currentPage.tree || {}, manifestCached, __dirname);
    const title = manifestCached.meta?.title || 'Site';
    const logo = manifestCached.meta?.logo || '';
    const logoStyle = manifestCached.meta?.logoStyle || '';
    const navColor = currentPage.navColor || 'white';

    // Pass authentication state to template
    const userEmail = authResult.authenticated ? authResult.user.email : null;
    const isAuthenticated = authResult.authenticated;

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
      contentContainerStyle: backgroundStyle,
      isAuthenticated,
      userEmail
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
