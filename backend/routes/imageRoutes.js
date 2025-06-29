const express = require('express');
const { getAllImages, getImageById, uploadImage, deleteImage, likeImage, commentImage, downloadImage } = require('../controllers/imageController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// ✅ Add this missing route
router.get('/all', getAllImages);

// Upload image (authenticated)
router.post('/upload', verifyToken, uploadImage);

// Get single image
router.get('/:id', getImageById);

// Delete image
router.delete('/:id', verifyToken, deleteImage);

// Likes, comments, downloads
router.post('/:id/like', verifyToken, likeImage);
router.post('/:id/comment', verifyToken, commentImage);
router.post('/:id/download', downloadImage);

module.exports = router;
