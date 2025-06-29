// === FILE: middlewares/uploadMiddleware.js ===
const multer = require('multer');
const path = require('path');

// Utility to generate unique filenames
const generateFilename = (prefix, file) =>
  `${prefix}-${Date.now()}${path.extname(file.originalname)}`;

// === Storage for profile pictures ===
const profileStorage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, generateFilename('profile', file));
  }
});

// === Storage for wallpapers/images ===
const wallpaperStorage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, generateFilename('wallpaper', file));
  }
});

// Exported multer instances
const uploadProfile = multer({ storage: profileStorage });
const uploadWallpaper = multer({ storage: wallpaperStorage });

module.exports = {
  uploadProfile,
  uploadWallpaper
};
