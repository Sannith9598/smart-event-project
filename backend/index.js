// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const sequelize = require('./config/db'); // DB connection

// register models so Sequelize knows them BEFORE sync
const User = require('./models/User');
const Event = require('./models/Event'); 

const app = express();
app.use(express.json());
app.use(cors());

// mount auth routes
app.use('/api/auth', require('./routes/auth'));

// mount uploads routes 
app.use('/api/uploads', require('./routes/uploads'));


// protected route example using the auth middleware 
const authMiddleware = require('./middleware/auth'); 
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected OK', user: req.user });
});

// mount events routes
app.use('/api/events', require('./routes/events'));

// simple health & test routes
app.get('/', (req, res) => res.send('Smart Event Backend Running'));
app.get('/api/hello', (req, res) => res.json({ message: 'Hello from Smart Event Backend' }));

// Start server only after DB is OK and models synced
const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connection OK');

    // Sync models (creates tables if not existing). alter:true updates schema non-destructively.
    await sequelize.sync({ alter: true });
    console.log('Database synced');

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})();
