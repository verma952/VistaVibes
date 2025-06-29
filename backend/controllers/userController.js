const path = require('path');
const fs = require('fs');
const User = require('../models/User');

// @desc Get logged-in user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      _id: user._id, // ✅ needed for matching images by uploadedBy
      email: user.email,
      name: user.name || '',
      profilePic: user.profilePic || ''
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Update profile (name + optional profilePic)
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.name) {
      user.name = req.body.name;
    }

    // ✅ Handle profile picture upload
    if (req.file) {
      const oldPath = path.join(__dirname, '..', user.profilePic || '');
      if (user.profilePic && fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      user.profilePic = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated',
      name: user.name,
      profilePic: user.profilePic
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
