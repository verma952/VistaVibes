const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: { type: Number, default: 0 },
  comments: [
    {
      text: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  downloads: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
