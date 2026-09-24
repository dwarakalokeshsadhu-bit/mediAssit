import nodemailer from 'nodemailer';

/**
 * Configure nodemailer transporter if SMTP credentials exist in environment
 */
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  // Support Gmail service shortcut if GMAIL_USER and GMAIL_PASS are provided
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  return null;
};

/**
 * Send 6-digit password reset verification code
 * @param {string} to - Recipient email
 * @param {string} code - 6-digit verification code
 * @param {string} [userName] - Recipient name
 * @returns {Promise<{ sent: boolean, code?: string }>}
 */
export const sendPasswordResetCode = async (to, code, userName = 'Valued User') => {
  const transporter = getTransporter();

  const fromAddress =
    process.env.EMAIL_FROM ||
    process.env.SMTP_USER ||
    process.env.GMAIL_USER ||
    '"MedAssist Healthcare" <security@medassist.clinic>';

  const subject = `MedAssist Security: Your Password Reset Verification Code is ${code}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>MedAssist Security Verification</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 24px; color: #09090b; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .logo { font-size: 18px; font-weight: 700; color: #09090b; letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
        .badge { font-size: 11px; font-family: monospace; background: #f4f4f5; padding: 2px 6px; border-radius: 4px; border: 1px solid #e4e4e7; color: #71717a; margin-left: 6px; }
        .title { font-size: 20px; font-weight: 600; color: #09090b; margin-top: 0; margin-bottom: 12px; }
        .text { font-size: 14px; line-height: 1.6; color: #52525b; margin-bottom: 20px; }
        .code-container { text-align: center; margin: 28px 0; }
        .code-box { display: inline-block; font-size: 32px; font-family: 'Courier New', Courier, monospace; font-weight: 700; letter-spacing: 8px; background: #f4f4f5; color: #09090b; padding: 14px 28px; border-radius: 8px; border: 1px solid #d4d4d8; text-indent: 8px; }
        .expiry { font-size: 12px; color: #71717a; margin-top: 10px; font-style: italic; }
        .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e4e4e7; font-size: 11px; color: #a1a1aa; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">
          MEDASSIST <span class="badge">SECURITY</span>
        </div>
        <h2 class="title">Password Reset Verification Code</h2>
        <p class="text">Hello ${userName},</p>
        <p class="text">We received a request to reset your password for your MedAssist clinical portal account. Please use the following 6-digit verification code to complete your password update:</p>
        
        <div class="code-container">
          <div class="code-box">${code}</div>
          <div class="expiry">This verification code expires in 15 minutes.</div>
        </div>

        <p class="text">If you did not request this password reset, you can safely ignore this email. Your existing password will remain active and secure.</p>
        
        <div class="footer">
          MedAssist Healthcare Systems Inc. • HL7 / HIPAA Certified Portal<br>
          Automated clinical security dispatch. Please do not reply directly to this email.
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `Hello ${userName},\n\nYour MedAssist password reset verification code is: ${code}\n\nThis code expires in 15 minutes.\n\nIf you did not request this change, please ignore this email.`;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        text: textContent,
        html: htmlContent,
      });
      console.log(`[EMAIL DISPATCH] Verification email sent to ${to}: messageId=${info.messageId}`);
      return { sent: true };
    } catch (err) {
      console.error(`[EMAIL ERROR] Failed to send verification email to ${to}:`, err.message);
      // Fall through to dev preview mode so user is never blocked
      return { sent: false, code };
    }
  }

  // Developer / Test fallback mode
  console.log(`------------------------------------------------------------`);
  console.log(`[EMAIL DEV MODE] Password Reset Code for: ${to}`);
  console.log(`[EMAIL DEV MODE] Verification Code: ${code} (Expires in 15 mins)`);
  console.log(`[EMAIL DEV MODE] To enable live emails, add SMTP_HOST, SMTP_USER, and SMTP_PASS to .env`);
  console.log(`------------------------------------------------------------`);

  return { sent: false, code };
};
