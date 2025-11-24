// backend/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Read DB connection info from environment (.env)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // set true to see SQL queries in console (useful for debugging)
    pool: {
      max: 5,    // max connections in pool
      min: 0,    // min connections
      acquire: 30000, // max ms to try to get connection before error
      idle: 10000 // ms before an idle connection is released
    }
  }
);

module.exports = sequelize;
