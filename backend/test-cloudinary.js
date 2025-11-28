require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Change this path if you prefer an absolute path to your image file.
const filePath = path.resolve(__dirname, 'C:/Users/sanni/Downloads/shiva.jpg');

(async () => {
  try {
    const res = await cloudinary.uploader.upload(filePath, { folder: 'smart_event_test' });
    console.log('UPLOAD OK', res.secure_url);
  } catch (err) {
    console.error('UPLOAD ERR', err);
  }
})();
