# Email Configuration Guide for HMS

## Overview
The HMS system uses email for password reset functionality with OTP (One-Time Password) verification.

## SMTP Configuration

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account → Security
   - Enable 2-Step Verification if not enabled
   - Go to App Passwords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update .env file**:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-16-char-app-password"
SMTP_FROM="HMS Healthcare <noreply@hms.com>"
```

### Option 2: SendGrid

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
SMTP_FROM="HMS Healthcare <noreply@yourdomain.com>"
```

### Option 3: AWS SES

```env
SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-ses-smtp-username"
SMTP_PASSWORD="your-ses-smtp-password"
SMTP_FROM="HMS Healthcare <noreply@yourdomain.com>"
```

### Option 4: Mailgun

```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-mailgun-smtp-username"
SMTP_PASSWORD="your-mailgun-smtp-password"
SMTP_FROM="HMS Healthcare <noreply@yourdomain.com>"
```

## Password Reset Flow

### 1. Request Password Reset
**Endpoint**: `POST /api/auth/forgot-password`

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "If an account with that email exists, we sent a password reset code"
}
```

**What happens**:
- Generates 6-digit OTP (valid for 10 minutes)
- Stores OTP in database
- Sends beautifully formatted email with OTP

### 2. Verify OTP
**Endpoint**: `POST /api/auth/verify-otp`

**Request**:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "resetTokenId": "clx..."
}
```

### 3. Reset Password
**Endpoint**: `POST /api/auth/reset-password`

**Request**:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePassword123!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**What happens**:
- Validates OTP again
- Updates password in database
- Marks OTP as used
- Sends confirmation email

## Email Templates

### Password Reset Email
- **Subject**: "Password Reset - HMS Healthcare"
- **Contains**: 6-digit OTP in large, clear format
- **Validity**: 10 minutes
- **Design**: Professional healthcare-themed HTML template
- **Security warnings**: Don't share OTP, staff won't ask for it

### Password Changed Email
- **Subject**: "Password Changed Successfully - HMS Healthcare"
- **Contains**: Success confirmation
- **Action Items**: Login instructions, security tips
- **Alert**: Contact support if unauthorized

## Security Features

1. **OTP Expiration**: 10-minute validity
2. **One-Time Use**: OTP cannot be reused
3. **Auto-Cleanup**: Old tokens deleted when new one requested
4. **Email Enumeration Prevention**: Same response for valid/invalid emails
5. **Password Strength**: Minimum 8 characters enforced
6. **Transaction Safety**: Password update and token marking in single transaction

## Testing

### Test Locally with Gmail

1. Configure Gmail App Password
2. Update .env with credentials
3. Test the flow:

```bash
# 1. Request password reset
curl -X POST http://localhost:3002/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Check your email for OTP
# 3. Verify OTP
curl -X POST http://localhost:3002/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# 4. Reset password
curl -X POST http://localhost:3002/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456","newPassword":"NewPassword123!"}'
```

## Database Schema

### PasswordResetToken Model
```prisma
model PasswordResetToken {
  id              String   @id @default(cuid())
  userId          String
  otp             String
  expiresAt       DateTime
  isUsed          Boolean  @default(false)
  createdAt       DateTime @default(now())
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([otp])
  @@map("password_reset_tokens")
}
```

## Troubleshooting

### Email Not Sending

1. **Check SMTP credentials**: Ensure all env variables are set
2. **Gmail**: Make sure App Password is used, not regular password
3. **Firewall**: Check if port 587 is open
4. **Logs**: Check console for error messages

### OTP Invalid/Expired

1. **Check server time**: Ensure server clock is accurate
2. **Verify expiration**: OTP valid for exactly 10 minutes
3. **Check database**: Query `password_reset_tokens` table

### Multiple Requests

- Old unused tokens are automatically deleted when new request made
- Only one valid OTP per user at a time

## Production Recommendations

1. **Use dedicated email service**: SendGrid, AWS SES, or Mailgun
2. **Set up SPF/DKIM**: For better deliverability
3. **Monitor email queue**: Set up alerts for failures
4. **Rate limiting**: Add rate limits to prevent abuse
5. **Custom domain**: Use your own domain for professional appearance

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| SMTP_HOST | Yes | SMTP server hostname | smtp.gmail.com |
| SMTP_PORT | Yes | SMTP server port | 587 |
| SMTP_SECURE | No | Use TLS (465) or STARTTLS (587) | false |
| SMTP_USER | Yes | SMTP username/email | your-email@gmail.com |
| SMTP_PASSWORD | Yes | SMTP password/API key | app-password |
| SMTP_FROM | No | From address in emails | HMS <noreply@hms.com> |

## Support

For issues or questions:
- Check logs in console
- Verify SMTP credentials
- Test with a simple email client first
- Contact support@hms.com
