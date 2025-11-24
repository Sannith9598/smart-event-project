// backend/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define a User model that maps to the 'users' table
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING(200), allowNull: false },
  role: { type: DataTypes.ENUM('CUSTOMER', 'MANAGER', 'ADMIN'), defaultValue: 'CUSTOMER' },
  location: { type: DataTypes.STRING(150), allowNull: true },
  completedEvents: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
  ratingAvg: { type: DataTypes.FLOAT, defaultValue: 0.0 }
}, {
  tableName: 'users',
  timestamps: true // createdAt, updatedAt
});

module.exports = User;
