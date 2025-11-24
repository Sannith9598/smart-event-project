// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const sequelize = require('./config/db'); // DB connection
// register models so Sequelize knows them
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// mount auth routes (we will update this file in Part 4.B)
app.use('/api/auth', require('./routes/auth'));

// protected route example using the auth middleware 
const authMiddleware = require('./middleware/auth'); 
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected OK', user: req.user });
});


// simple health & test routes
app.get('/', (req, res) => res.send('Smart Event Backend Running'));
app.get('/api/hello', (req, res) => res.json({ message: 'Hello from Smart Event Backend' }));

// Start server only after DB is OK and models synced
const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connection OK');
    // Create tables if they do not exist (safe for dev)
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})();
