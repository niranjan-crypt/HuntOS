// ============================================
// HuntOS Email Service
// Engineered by Niranjan Krishnakumar
// ============================================

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const baseStyle = `
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0B0F19; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #111827; border-radius: 16px; border: 1px solid #1F2937; overflow: hidden; }
    .header { background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%); padding: 36px 40px; text-align: center; }
    .header h1 { color: #FFFFFF; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { color: #E0E7FF; margin: 8px 0 0; font-size: 14px; }
    .body { padding: 36px 40px; color: #E5E7EB; }
    .body h2 { color: #FFFFFF; font-size: 20px; font-weight: 700; margin: 0 0 14px; }
    .body p { color: #9CA3AF; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
    .detail-card { background: #1F2937; border: 1px solid #374151; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #374151; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #9CA3AF; font-size: 13px; font-weight: 500; }
    .detail-value { color: #F3F4F6; font-size: 13px; font-weight: 600; }
    .btn { display: inline-block; background: #4F46E5; color: #FFFFFF !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 14px; margin: 16px 0; }
    .footer { padding: 24px 40px; background: #0B0F19; border-top: 1px solid #1F2937; text-align: center; }
    .footer p { color: #6B7280; font-size: 12px; margin: 0; }
    .features { list-style: none; padding: 0; margin: 16px 0; }
    .features li { padding: 8px 0; color: #D1D5DB; font-size: 14px; display: flex; align-items: center; gap: 8px; }
    .features li::before { content: "⚡"; color: #06B6D4; font-weight: 700; }
  </style>
`;

/**
 * Send welcome email to new user
 */
const sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: `"HuntOS Intelligence" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Welcome to HuntOS ⚡ Your Career Operating System',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚡ HuntOS</h1>
            <p>The Autonomous Career & Placement Command Center</p>
          </div>
          <div class="body">
            <h2>Welcome to HuntOS, ${name}! 👋</h2>
            <p>You've unlocked the next-generation platform to streamline, automate, and dominate your job hunt.</p>
            <ul class="features">
              <li>Interactive Kanban Pipeline & Table Tracker</li>
              <li>Gemini-powered AI Interview Prep Copilot</li>
              <li>Automated ATS Resume Matcher & Keyword Gap Analysis</li>
              <li>Offer & Salary Comparison Engine</li>
              <li>Automated OA, Interview & Deadline Reminders</li>
            </ul>
            <p>Ready to get started? Log in to your dashboard now.</p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" class="btn">Launch HuntOS Dashboard →</a>
          </div>
          <div class="footer">
            <p>HuntOS · Engineered by Niranjan Krishnakumar · Built for elite developers</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[INFO] [${new Date().toISOString()}] Welcome email sent to ${to}`);
  } catch (err) {
    console.error(`[ERROR] [${new Date().toISOString()}] Failed to send welcome email to ${to}:`, err.message);
  }
};

/**
 * Send reminder email
 */
const sendReminderEmail = async (to, name, reminder) => {
  const reminderDate = new Date(reminder.remind_at).toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const mailOptions = {
    from: `"HuntOS Alerts" <${process.env.EMAIL_USER}>`,
    to,
    subject: `⚡ HuntOS Alert: ${reminder.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚡ HuntOS Alert</h1>
            <p>Critical Upcoming Action Item</p>
          </div>
          <div class="body">
            <h2>Hey ${name}, action required! ⏰</h2>
            <p>Your HuntOS scheduler is alerting you for:</p>
            <div class="detail-card">
              <div class="detail-row">
                <span class="detail-label">Title</span>
                <span class="detail-value">${reminder.title}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Type</span>
                <span class="detail-value" style="color:#06B6D4">${reminder.reminder_type}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Scheduled For</span>
                <span class="detail-value">${reminderDate}</span>
              </div>
              ${reminder.company_name ? `
              <div class="detail-row">
                <span class="detail-label">Company</span>
                <span class="detail-value">${reminder.company_name}</span>
              </div>
              ` : ''}
            </div>
            <p>Lock in your preparation and ace this milestone.</p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/reminders" class="btn">View Reminders →</a>
          </div>
          <div class="footer">
            <p>HuntOS · Engineered by Niranjan Krishnakumar</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[INFO] [${new Date().toISOString()}] Reminder email sent to ${to}`);
  } catch (err) {
    console.error(`[ERROR] [${new Date().toISOString()}] Failed to send reminder email to ${to}:`, err.message);
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (to, token) => {
  const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"HuntOS Security" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'HuntOS Security 🔒 Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 HuntOS Security</h1>
            <p>Authentication Reset Request</p>
          </div>
          <div class="body">
            <h2>Reset Your Password</h2>
            <p>We received a secure request to reset your HuntOS password. Click the button below to specify a new password. This token expires in 1 hour.</p>
            <a href="${resetLink}" class="btn">Reset Password →</a>
            <p style="margin-top:24px; font-size:13px; color:#6B7280;">If you did not request this, please disregard this email. Your account credentials remain secure.</p>
          </div>
          <div class="footer">
            <p>HuntOS · Engineered by Niranjan Krishnakumar</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[INFO] [${new Date().toISOString()}] Password reset email sent to ${to}`);
  } catch (err) {
    console.error(`[ERROR] [${new Date().toISOString()}] Failed to send password reset email to ${to}:`, err.message);
  }
};

module.exports = { sendWelcomeEmail, sendReminderEmail, sendPasswordResetEmail };
