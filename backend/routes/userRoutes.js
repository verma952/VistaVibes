const express = require('express');
const multer = require('multer');
const path = require('path');
const { updateProfile, getProfile } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// === Multer config ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `profile-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// === Routes ===
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, upload.single('profilePic'), updateProfile);

module.exports = router;
