# Free SMTP Setup Guide for HMS

Quick guide to configure free email services for password reset functionality.

---

## 🎯 Quick Start (Gmail - 5 Minutes)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click **2-Step Verification** → Turn it ON
3. Complete the setup process

### Step 2: Generate App Password
1. Still in Security, scroll to **App passwords**
2. Select **Mail** and your device type
3. Click **Generate**
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update .env File
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="youremail@gmail.com"
SMTP_PASSWORD="abcdefghijklmnop"  # Remove spaces from app password
SMTP_FROM="HMS Healthcare <youremail@gmail.com>"
```

### Step 4: Test
```bash
npm run dev
# Navigate to forgot password page and test
```

**Limits**: 500 emails/day (more than enough for development)

---

## 🚀 Free SMTP Providers Comparison

| Provider | Free Limit | Setup Time | Best For |
|----------|-----------|------------|----------|
| **Gmail** | 500/day | 5 min | Development |
| **Brevo** | 300/day | 10 min | Production |
| **Mailgun** | 5,000/month | 15 min | Production |
| **SendGrid** | 100/day | 15 min | Production |
| **Mailtrap** | Unlimited* | 5 min | Testing only |

*Mailtrap doesn't send real emails - testing sandbox only

---

## 📧 Option 1: Gmail (Easiest)

### ✅ Pros
- Instant setup (5 minutes)
- No registration needed
- Reliable delivery
- 500 emails/day free

### ❌ Cons
- May trigger spam filters
- Not ideal for production
- Must use your personal email

### Setup Instructions
See Quick Start above ⬆️

### Troubleshooting Gmail
**Error: "Invalid login"**
- Make sure you're using App Password, not regular password
- Remove spaces from App Password
- Enable 2FA first

**Emails not sending**
- Check if "Less secure app access" is OFF (use App Password instead)
- Wait a few minutes after creating App Password

---

## 📧 Option 2: Brevo (Recommended for Production)

### ✅ Pros
- 300 emails/day forever free
- Professional delivery
- Real production-ready service
- No credit card required
- Email templates included

### Setup (10 minutes)

1. **Sign up**: [brevo.com](https://www.brevo.com) (free account)
2. **Verify email**: Check inbox and confirm
3. **Get SMTP credentials**:
   - Go to Settings → SMTP & API
   - Find your SMTP credentials

4. **Update .env**:
```env
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-brevo-email@example.com"
SMTP_PASSWORD="your-smtp-key"  # From Brevo dashboard
SMTP_FROM="HMS Healthcare <noreply@yourdomain.com>"
```

5. **Verify sender**: Add your from email in Brevo dashboard

**Limits**: 300 emails/day, 9,000/month

---

## 📧 Option 3: Mailgun (Best Free Tier)

### ✅ Pros
- 5,000 emails/month free
- Professional service
- Great API documentation
- Industry standard

### ❌ Cons
- Requires credit card (won't charge)
- More complex setup
- Domain verification needed

### Setup (15 minutes)

1. **Sign up**: [mailgun.com](https://www.mailgun.com) → Free trial
2. **Verify email and phone**
3. **Add domain** OR use sandbox domain
4. **Get SMTP credentials**:
   - Go to Sending → Domain settings → SMTP credentials

5. **Update .env**:
```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="postmaster@sandboxXXXX.mailgun.org"  # From Mailgun
SMTP_PASSWORD="your-smtp-password"  # From Mailgun
SMTP_FROM="HMS Healthcare <noreply@sandboxXXXX.mailgun.org>"
```

**Limits**: 5,000 emails/month (166/day average)

---

## 📧 Option 4: SendGrid (Alternative)

### ✅ Pros
- 100 emails/day free
- Professional service
- Twilio-backed
- Good documentation

### Setup (15 minutes)

1. **Sign up**: [sendgrid.com](https://sendgrid.com) → Free plan
2. **Verify email**
3. **Create API Key**:
   - Settings → API Keys → Create API Key
   - Select "Restricted Access" → Mail Send (Full Access)

4. **Update .env**:
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="apikey"  # Literally "apikey"
SMTP_PASSWORD="SG.XXXXXXXXXXXXXX"  # Your actual API key
SMTP_FROM="HMS Healthcare <verified-email@yourdomain.com>"
```

5. **Verify sender**: Add sender email in SendGrid dashboard

**Limits**: 100 emails/day

---

## 🧪 Option 5: Mailtrap (Testing Only)

### ⚠️ Important: This is for TESTING ONLY - emails won't actually be sent!

### ✅ Pros
- Perfect for development
- See emails in web dashboard
- No spam folder issues
- Unlimited "emails"

### Setup (5 minutes)

1. **Sign up**: [mailtrap.io](https://mailtrap.io) (free account)
2. **Get credentials**: 
   - Go to Inboxes → Your inbox → Show Credentials

3. **Update .env**:
```env
SMTP_HOST="sandbox.smtp.mailtrap.io"
SMTP_PORT="2525"
SMTP_SECURE="false"
SMTP_USER="your-mailtrap-username"
SMTP_PASSWORD="your-mailtrap-password"
SMTP_FROM="HMS Healthcare <test@hms.com>"
```

4. **Check emails**: View all sent emails in Mailtrap dashboard

**Use Case**: Development and testing only - emails won't reach real inboxes

---

## 🎯 Which One to Choose?

### For Development (Testing on your machine)
**Choose: Gmail** or **Mailtrap**
- Gmail: Quick, easy, emails actually send
- Mailtrap: Pure testing, see emails in dashboard

### For Production (Real users)
**Choose: Brevo** or **Mailgun**
- Brevo: Easiest, 300/day free forever
- Mailgun: More emails (5,000/month), needs credit card

### For Small Production
**Choose: Brevo**
- Best free tier
- No credit card
- Professional service

---

## 🔧 Complete Setup Example (Brevo)

### 1. Sign Up (2 min)
```
1. Go to brevo.com
2. Click "Sign up free"
3. Enter email and create password
4. Verify email from inbox
```

### 2. Get Credentials (3 min)
```
1. Log in to Brevo
2. Click your name (top right) → SMTP & API
3. Copy "SMTP Server" and "Login"
4. Click "Create a new SMTP key" → Copy it
```

### 3. Configure HMS (2 min)
Edit `/Users/moaazmustafa/Documents/name/HMS/.env`:

```env
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@example.com"  # From Brevo
SMTP_PASSWORD="xsmtpsib-xxxxxxxxxxxx"  # SMTP key from Brevo
SMTP_FROM="HMS Healthcare <noreply@yourdomain.com>"
```

### 4. Verify Sender (3 min)
```
1. In Brevo: Senders → Add a new sender
2. Enter the email you'll use in SMTP_FROM
3. Verify it via email confirmation
```

### 5. Test (1 min)
```bash
npm run dev
# Go to http://localhost:3002/forgot-password
# Enter a test email
# Check inbox!
```

---

## 🐛 Common Issues & Fixes

### "Authentication failed"
- **Gmail**: Use App Password, not regular password
- **Brevo/Others**: Check you copied the full API key/password

### "Connection timeout"
- Check SMTP_PORT is correct (587 for most)
- Try SMTP_PORT="465" with SMTP_SECURE="true"
- Check firewall isn't blocking port 587

### "Sender not verified"
- Add and verify the SMTP_FROM email in provider dashboard
- Wait 5-10 minutes after verification

### Emails going to spam
- **Development**: Use personal Gmail for testing
- **Production**: 
  - Verify sender domain
  - Add SPF/DKIM records (provider provides instructions)
  - Use professional "from" address

### "535 Authentication failed"
- Remove spaces from App Password (Gmail)
- Generate new SMTP credentials
- Check username is correct (some use "apikey")

---

## 🔒 Security Best Practices

1. **Never commit .env file**
   - Already in `.gitignore`
   - Use environment variables in production

2. **Rotate SMTP passwords regularly**
   - Regenerate every 90 days
   - Immediately if exposed

3. **Use App Passwords (Gmail)**
   - Never use your actual Gmail password
   - Revoke unused App Passwords

4. **Monitor usage**
   - Check provider dashboard for unusual activity
   - Set up alerts for quota limits

---

## 📊 Cost Comparison (if you need more)

| Provider | Free | Paid Start | 10,000 emails/month |
|----------|------|------------|---------------------|
| Brevo | 300/day | $25/mo | $25/mo |
| Mailgun | 5,000/mo | $35/mo | $35/mo |
| SendGrid | 100/day | $20/mo | $20/mo |
| Gmail | 500/day | N/A | N/A |

---

## ✅ Verification Checklist

After setup, verify these work:

- [ ] User requests password reset
- [ ] Email arrives in inbox (not spam)
- [ ] OTP code is visible and correct
- [ ] Email is professionally formatted
- [ ] Links/buttons work (if any)
- [ ] Password reset completes successfully
- [ ] Confirmation email arrives

---

## 🆘 Still Having Issues?

1. **Check HMS logs**: Look for error messages in terminal
2. **Test SMTP credentials**: Use online SMTP tester
3. **Try different provider**: Switch from Gmail to Brevo
4. **Check firewall**: Ensure port 587 isn't blocked
5. **Contact support**: Provider support is usually very helpful

---

## 📝 Quick Reference

### Test Email Flow
```bash
# 1. Start dev server
npm run dev

# 2. Send request
curl -X POST http://localhost:3002/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 3. Check email
# Look for 6-digit OTP code

# 4. Verify OTP
curl -X POST http://localhost:3002/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

### .env Template
```env
# Copy this and fill in your values
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-smtp-password-here"
SMTP_FROM="HMS Healthcare <noreply@yourdomain.com>"
```

---

**Last Updated**: December 18, 2025  
**Recommended**: Brevo (free, reliable, 300 emails/day)  
**For Testing**: Mailtrap (unlimited, testing only)  
**For Development**: Gmail (quick, easy, 500/day)
