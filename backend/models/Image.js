// === FILE: models/Image.js ===
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'general'
  },
  tags: {
    type: [String],
    default: []
  },
  imageUrl: {
    type: String,
    required: true // Cloudinary URL
  },
  publicId: {
    type: String,
    required: true // Cloudinary public ID (for deletion)
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  likesBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  comments: [
    {
      text: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  downloads: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
