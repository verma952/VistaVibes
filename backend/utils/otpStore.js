const otpMap = new Map();

const setOtp = (email, otp) => {
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpMap.set(email, { otp, expiresAt });
};

const verifyOtp = (email, otp) => {
  const data = otpMap.get(email);
  if (!data) return false;
  if (Date.now() > data.expiresAt) {
    otpMap.delete(email);
    return false;
  }
  const isValid = data.otp === otp;
  if (isValid) otpMap.delete(email);
  return isValid;
};

module.exports = { setOtp, verifyOtp };
