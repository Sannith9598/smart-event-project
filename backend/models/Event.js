// backend/models/Event.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Event = sequelize.define('Event', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  managerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }, // will reference User.id
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  category: { type: DataTypes.STRING(80), allowNull: true }, // wedding, birthday, etc.
  location: { type: DataTypes.STRING(150), allowNull: true }, // city or address
  price: { type: DataTypes.DECIMAL(10,2), allowNull: true, defaultValue: 0.0 },
  packageDetails: { type: DataTypes.TEXT, allowNull: true },
  gallery: { type: DataTypes.JSON, allowNull: true }, // array of image URLs
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
  dateAvailableFrom: { type: DataTypes.DATE, allowNull: true },
  dateAvailableTo: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'events',
  timestamps: true
});

module.exports = Event;
