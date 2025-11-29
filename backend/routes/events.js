const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// PUBLIC: list/search events (simple)
router.get('/', async (req, res) => {
  try {
    const { q, category, location, minPrice, maxPrice, limit = 20 } = req.query;
    const where = {};

    if (category) where.category = category;
    if (location) where.location = location;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (q) {
      where.title = { [Op.like]: `%${q}%` };
    }

    const events = await Event.findAll({
      where,
      limit: parseInt(limit, 10),
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, events });
  } catch (err) {
    console.error('List events error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PROTECTED: manager creates event (updated to accept gallery URLs)
router.post('/', auth, async (req, res) => {
  try {
    // only managers can create events
    if (req.user.role !== 'MANAGER') return res.status(403).json({ error: 'Only managers can create events' });

    const {
      title,
      description,
      category,
      location,
      price,
      packageDetails,
      gallery = [],          // expect array of image URLs
      dateAvailableFrom,
      dateAvailableTo
    } = req.body;

    // Basic validation
    if (!title) return res.status(400).json({ error: 'title is required' });

    // Validate gallery: must be array, max 10 items, each must be a string and look like a URL
    if (!Array.isArray(gallery)) return res.status(400).json({ error: 'gallery must be an array of image URLs' });
    const MAX_GALLERY = 10;
    if (gallery.length > MAX_GALLERY) return res.status(400).json({ error: `gallery can have at most ${MAX_GALLERY} images` });

    // simple URL-ish validation (not perfect, but prevents obvious non-urls)
    const urlLike = str => typeof str === 'string' && (str.startsWith('http://') || str.startsWith('https://'));
    for (const g of gallery) {
      if (!urlLike(g)) return res.status(400).json({ error: 'gallery must contain valid http/https URLs only' });
    }

    const ev = await Event.create({
      managerId: req.user.id,
      title,
      description,
      category,
      location,
      price,
      packageDetails,
      gallery,               // Sequelize will store JSON
      dateAvailableFrom,
      dateAvailableTo
    });

    res.json({ success: true, event: ev });
  } catch (err) {
    console.error('Create event error', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
