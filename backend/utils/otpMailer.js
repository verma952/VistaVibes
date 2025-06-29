const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"VistaVibes" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for VistaVibes Login',
    html: `
      <h2>Hello from VistaVibes</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 5 minutes.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };
