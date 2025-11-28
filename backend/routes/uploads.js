// backend/routes/uploads.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const auth = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer memory storage (no files written to disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // max 5 MB per file
});

// Protected endpoint: managers upload images
router.post('/image', auth, upload.single('file'), async (req, res) => {
  try {
    if (req.user.role !== 'MANAGER') return res.status(403).json({ error: 'Only managers can upload' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'smart_event', resource_type: 'image' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    // return URL(s) to client
    res.json({ success: true, url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error('Upload error', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
