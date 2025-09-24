const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

console.log("Starting Express server...");

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// For any route not matched by a static file, serve index.html.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});