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
app.use(express.static(path.join(__dirname, 'public')));
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
      values = [timestamp, formData.name, formData.email, formData.role, formData.message, JSON.stringify(formData.checkboxes)];
  } else if (intent === 'aipresszo.hu: contact') {
      sheetName = 'aipresszo.hu: contact';
      // Order must match the sheet's column order
      values = [timestamp, formData.name, formData.email, formData.message];
  } else if (intent === 'aipresszo.hu: AI') {
      sheetName = 'aipresszo.hu: AI';
      // Order must match the sheet's column order
      values = [timestamp, formData.name, formData.email, formData.role, formData.message, JSON.stringify(formData.checkboxes)];
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

// For any route not matched by a static file, serve index.html.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});