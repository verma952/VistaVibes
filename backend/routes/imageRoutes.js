// === FILE: routes/imageRoutes.js ===
const express = require('express');
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
const upload = require('../middlewares/cloudinaryStorage'); // 🔄 Updated multer middleware

const router = express.Router();

// ✅ Route to get all images
router.get('/all', getAllImages);

// ✅ Route to upload an image to Cloudinary
router.post('/upload', verifyToken, upload.single('image'), uploadImage);

// ✅ Route to get single image by ID
router.get('/:id', getImageById);

// ✅ Route to delete an image
router.delete('/:id', verifyToken, deleteImage);

// ✅ Routes for likes, comments, downloads
router.post('/:id/like', verifyToken, likeImage);
router.post('/:id/comment', verifyToken, commentImage);
router.post('/:id/download', downloadImage);

module.exports = router;
