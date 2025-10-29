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


// helper: load manifest for project
function loadProjectManifest(projectName) {
  const manifestPath = path.join(__dirname, 'projects', projectName, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  }
  // fallback to root/public manifest.json
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'manifest.json'), 'utf8'));
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