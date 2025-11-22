// backend/index.js

// Load environment variables from .env into process.env
require('dotenv').config();

const express = require('express'); // Web framework
const cors = require('cors');       // Enables cross-origin requests

const app = express(); // create app instance

// Middleware: parse JSON request bodies (so req.body works)
app.use(express.json());

// Middleware: enable CORS for all origins (during dev)
app.use(cors());

// Health route - easy to test server availability
app.get('/', (req, res) => {
  res.send('Smart Event Backend Running');
});

// Simple JSON test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Smart Event Backend' });
});

// Ping route (shows server time) - good for API check
app.get('/api/ping', (req, res) => {
  res.json({ pong: true, timestamp: new Date().toISOString() });
});

// Start server on port from env or 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
