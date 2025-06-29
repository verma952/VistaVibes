// === FILE: routes/imageRoutes.js ===
const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getAllImages,
  getImageById,
  uploadImage,
  deleteImage,
  likeImage,
  commentImage,
  downloadImage
} = require('../controllers/imageController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// 🔧 Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `image-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ Route to get all images
router.get('/all', getAllImages);

// ✅ Route to upload an image (with file middleware)
router.post('/upload', verifyToken, upload.single('image'), uploadImage);

// ✅ Route to get single image by ID
router.get('/:id', getImageById);

// ✅ Route to delete an image
router.delete('/:id', verifyToken, deleteImage);

// ✅ Routes for likes, comments, downloads
router.post('/:id/like', verifyToken, likeImage);
router.post('/:id/comment', verifyToken, commentImage);
router.post('/:id/download', downloadImage); // optional: no token

module.exports = router;
