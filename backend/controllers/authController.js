const { sendOTP } = require('../utils/otpMailer');
const { setOtp, verifyOtp } = require('../utils/otpStore');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const sendOtpController = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  setOtp(email, otp);
  await sendOTP(email, otp);
  res.status(200).json({ message: 'OTP sent to your email' });
};

const verifyOtpController = async (req, res) => {
  const { email, otp } = req.body;
  if (!verifyOtp(email, otp)) {
    return res.status(401).json({ message: 'Invalid or expired OTP' });
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '2d',
  });

  res.status(200).json({
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      profilePic: user.profilePic
    }
  });
};

module.exports = { sendOtpController, verifyOtpController };
