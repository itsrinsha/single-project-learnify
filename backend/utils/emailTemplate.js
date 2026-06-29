export const otpTemplate = (otp) => {
  return `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Verify Your Account</h2>
      <p>Your OTP code is:</p>
      <h1>${otp}</h1>
      <p>This expires in 5 minutes.</p>
    </div>
  `;
};