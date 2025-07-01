// === FILE: middlewares/cloudinaryStorage.js ===
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// 🔧 Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'VistaVibes', // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
  },
});

// 📦 Create multer instance using Cloudinary storage
const upload = multer({ storage });

module.exports = upload;
