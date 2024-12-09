const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Default to 3000 if no PORT is specified

// Serve static files from the 'build' folder
app.use(express.static(path.join(__dirname, 'build')));

// Serve index.html for all other routes (for React Router, etc.)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`backend url ${process.env.REACT_APP_API_URL}`);
});
