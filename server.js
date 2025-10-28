
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

console.log("Starting Express server...");

// parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// contact POST endpoint
app.post('/form', async (req, res) => {
  console.log('POST /form body:', req.body);
  try {
    const { name, email, message, intent } = req.body || {};
    // basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Form handler error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// For any route not matched by a static file, serve index.html.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});