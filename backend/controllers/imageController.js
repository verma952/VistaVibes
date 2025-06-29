const Image = require('../models/Image');

const uploadImage = async (req, res) => {
  try {
    const { title, category, tags } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const image = await Image.create({
      title,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      imageUrl,
      uploadedBy: req.userId
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      image
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
};

const getAllImages = async (req, res) => {
  try {
    const images = await Image.find()
      .populate('uploadedBy', 'email name profilePic')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, images });
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch images' });
  }
};

const getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)
      .populate('uploadedBy', 'email name profilePic');

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    res.status(200).json({ success: true, image });
  } catch (error) {
    console.error('Fetch by ID Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching image' });
  }
};

const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    if (image.uploadedBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Image.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete image' });
  }
};

const likeImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    if (!image.likesBy) image.likesBy = [];

    const alreadyLiked = image.likesBy.includes(req.userId);

    if (alreadyLiked) {
      // 👎 Dislike: remove user from likesBy and decrease count
      image.likesBy = image.likesBy.filter(userId => userId.toString() !== req.userId);
      image.likes = Math.max(0, image.likes - 1);
      await image.save();
      return res.status(200).json({ message: 'Unliked', liked: false, likes: image.likes });
    } else {
      // 👍 Like: add user and increase count
      image.likesBy.push(req.userId);
      image.likes += 1;
      await image.save();
      return res.status(200).json({ message: 'Liked', liked: true, likes: image.likes });
    }

  } catch (err) {
    console.error('Like toggle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const commentImage = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ success: false, message: 'Comment text is required' });

  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });

    image.comments.push({ text, user: req.userId });
    await image.save();

    res.status(200).json({ success: true, comments: image.comments });
  } catch (err) {
    console.error('Comment Error:', err);
    res.status(500).json({ success: false, message: 'Error adding comment' });
  }
};

const downloadImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });

    image.downloads = (image.downloads || 0) + 1;
    await image.save();

    res.status(200).json({ success: true, downloads: image.downloads });
  } catch (err) {
    console.error('Download Error:', err);
    res.status(500).json({ success: false, message: 'Error tracking download' });
  }
};

module.exports = {
  uploadImage,
  getAllImages,
  getImageById,
  deleteImage,
  likeImage,
  commentImage,
  downloadImage
};
