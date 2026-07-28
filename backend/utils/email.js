const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';

const sendOtpEmail = async (to, otp) => {
  await resend.emails.send({
    from: `Pacific Barista <${from}>`,
    to,
    subject: 'Your Pacific Barista Admin Login OTP',
    text: `Your OTP code is: ${otp}. It expires in 10 minutes. If you did not request this, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3B2A23;">Pacific Barista Admin Login</h2>
        <p style="color: #555;">Your one-time password (OTP) for admin login is:</p>
        <div style="background: #FAF7F3; padding: 24px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #3B2A23;">${otp}</span>
        </div>
        <p style="color: #555;">This code will expire in <strong>10 minutes</strong>.</p>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">If you did not request this login, please ignore this email. Do not share this code with anyone.</p>
      </div>
    `,
  });
};

module.exports = { sendOtpEmail };
