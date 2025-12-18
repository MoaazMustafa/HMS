import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"HMS Healthcare" <noreply@hms.com>',
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}

export function generateOTP(): string {
  // Generate 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getPasswordResetEmailTemplate(name: string, otp: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - HMS</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: #ffffff;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #800000;
          margin-bottom: 10px;
        }
        .otp-box {
          background: #f7f7f7;
          border: 2px dashed #800000;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 36px;
          font-weight: bold;
          color: #800000;
          letter-spacing: 8px;
          margin: 10px 0;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          font-size: 12px;
          color: #666;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #800000;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🏥 HMS Healthcare</div>
          <h2 style="color: #333; margin: 0;">Password Reset Request</h2>
        </div>
        
        <p>Hello ${name},</p>
        
        <p>We received a request to reset your password. Use the following One-Time Password (OTP) to complete the process:</p>
        
        <div class="otp-box">
          <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
          <div class="otp-code">${otp}</div>
          <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">Valid for 10 minutes</p>
        </div>
        
        <p>To reset your password:</p>
        <ol>
          <li>Return to the password reset page</li>
          <li>Enter this OTP code</li>
          <li>Create your new password</li>
        </ol>
        
        <div class="warning">
          <strong>⚠️ Security Notice:</strong>
          <ul style="margin: 10px 0 0 0; padding-left: 20px;">
            <li>This OTP expires in 10 minutes</li>
            <li>Never share this code with anyone</li>
            <li>HMS staff will never ask for your OTP</li>
          </ul>
        </div>
        
        <p>If you didn't request this password reset, please ignore this email or contact our support team immediately if you have concerns.</p>
        
        <div class="footer">
          <p><strong>HMS - Health Management System</strong></p>
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} HMS Healthcare. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getEmailVerificationTemplate(name: string, otp: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - HMS</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: #ffffff;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #800000;
          margin-bottom: 10px;
        }
        .otp-box {
          background: #f7f7f7;
          border: 2px dashed #800000;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 36px;
          font-weight: bold;
          color: #800000;
          letter-spacing: 8px;
          margin: 10px 0;
        }
        .warning {
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🏥 HMS Healthcare</div>
          <h2 style="color: #333; margin: 0;">Welcome to HMS!</h2>
        </div>
        
        <p>Hello ${name},</p>
        
        <p>Thank you for registering with HMS Healthcare. To complete your registration and verify your email address, please use the following One-Time Password (OTP):</p>
        
        <div class="otp-box">
          <p style="margin: 0; color: #666; font-size: 14px;">Your Verification Code</p>
          <div class="otp-code">${otp}</div>
          <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">Valid for 15 minutes</p>
        </div>
        
        <p>To verify your account:</p>
        <ol>
          <li>Return to the registration page</li>
          <li>Enter this verification code</li>
          <li>Complete your account setup</li>
        </ol>
        
        <div class="warning">
          <strong>📧 Email Verification:</strong>
          <ul style="margin: 10px 0 0 0; padding-left: 20px;">
            <li>This code expires in 15 minutes</li>
            <li>Never share this code with anyone</li>
            <li>If you didn't create an account, please ignore this email</li>
          </ul>
        </div>
        
        <p>Once verified, you'll have full access to:</p>
        <ul>
          <li>✅ Book appointments with doctors</li>
          <li>✅ Access your medical records</li>
          <li>✅ View prescriptions and lab results</li>
          <li>✅ Manage your health information</li>
        </ul>
        
        <div class="footer">
          <p><strong>HMS - Health Management System</strong></p>
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} HMS Healthcare. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getPasswordResetSuccessEmailTemplate(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Changed - HMS</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: #ffffff;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #800000;
          margin-bottom: 10px;
        }
        .success-icon {
          font-size: 64px;
          text-align: center;
          margin: 20px 0;
        }
        .info-box {
          background: #f0f9ff;
          border-left: 4px solid #0284c7;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🏥 HMS Healthcare</div>
          <h2 style="color: #333; margin: 0;">Password Successfully Changed</h2>
        </div>
        
        <div class="success-icon">✅</div>
        
        <p>Hello ${name},</p>
        
        <p>Your password has been successfully changed. You can now log in to your HMS account with your new password.</p>
        
        <div class="info-box">
          <strong>📋 What to do next:</strong>
          <ul style="margin: 10px 0 0 0; padding-left: 20px;">
            <li>Log in with your new password</li>
            <li>Update any saved passwords in your browser</li>
            <li>Consider enabling two-factor authentication for added security</li>
          </ul>
        </div>
        
        <p><strong>Didn&apos;t make this change?</strong></p>
        <p>If you didn&apos;t change your password, please contact our support team immediately at <a href="mailto:support@hms.com">support@hms.com</a> or call us at +1 (800) 123-4567.</p>
        
        <div class="footer">
          <p><strong>HMS - Health Management System</strong></p>
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} HMS Healthcare. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
