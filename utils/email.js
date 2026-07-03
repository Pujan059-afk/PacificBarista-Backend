const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';

const sendOtpEmail = async (to, otp) => {
  await resend.emails.send({
    from: `Pacific Barista <${from}>`,
    to,
    subject: 'Your OTP for Admin Login',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">Pacific Barista Admin Login</h2>
        <p style="color: #555;">Use the OTP below to log in. It expires in 10 minutes.</p>
        <div style="background: #f5f0e8; padding: 24px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #1a1a2e;">${otp}</span>
        </div>
        <p style="color: #999; font-size: 12px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendOtpEmail };
