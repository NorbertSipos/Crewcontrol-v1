# SMTP Setup Guide for Supabase

## Overview

This guide will help you configure SMTP settings in Supabase Dashboard so that invitation emails can be sent. You have several options depending on your needs.

---

## Step-by-Step: Configure SMTP in Supabase Dashboard

### Step 1: Navigate to SMTP Settings

1. Go to your **Supabase Dashboard**: https://app.supabase.com
2. Select your project
3. Navigate to **Authentication** (left sidebar)
4. Click on **SMTP Settings** (under Authentication section)

### Step 2: Enable Custom SMTP

1. Find the **"Custom SMTP"** toggle
2. **Enable** the toggle (switch it ON)
3. You'll see a form with SMTP configuration fields

---

## Option 1: Gmail SMTP (Free, Easy Setup)

### Prerequisites
- A Gmail account
- 2-Step Verification enabled on your Gmail account
- An App Password generated

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com
2. Click **Security** (left sidebar)
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the prompts to enable it

### Step 2: Generate App Password

1. Go back to **Security** → **2-Step Verification**
2. Scroll down and click **App passwords**
3. Select **Mail** and **Other (Custom name)**
4. Enter "Supabase" as the name
5. Click **Generate**
6. **Copy the 16-character password** (you'll need this!)

### Step 3: Configure in Supabase

Fill in the SMTP settings in Supabase Dashboard:

- **SMTP Host:** `smtp.gmail.com`
- **SMTP Port:** `587` (or `465` for SSL)
- **SMTP User:** Your Gmail address (e.g., `yourname@gmail.com`)
- **SMTP Password:** The 16-character App Password you just generated
- **Sender Email:** Your Gmail address (e.g., `yourname@gmail.com`)
- **Sender Name:** Your app name (e.g., `CrewControl`)

### Step 4: Test

1. Click **"Send test email"** (if available)
2. Or invite a team member to test

**Note:** Gmail has daily sending limits (500 emails/day for free accounts).

---

## Option 2: SendGrid SMTP (Free Tier Available)

### Prerequisites
- SendGrid account (sign up at https://sendgrid.com)
- API Key or SMTP credentials

### Step 1: Create SendGrid Account

1. Go to https://sendgrid.com
2. Sign up for a free account
3. Verify your email address

### Step 2: Get SMTP Credentials

1. In SendGrid Dashboard, go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name it "Supabase SMTP"
4. Select **"Full Access"** or **"Mail Send"** permissions
5. **Copy the API key** (you'll need this!)

**OR** use SMTP credentials:

1. Go to **Settings** → **Sender Authentication**
2. Complete domain authentication (or use single sender verification)
3. Go to **Settings** → **SMTP Relay**
4. Note your SMTP credentials

### Step 3: Configure in Supabase

Fill in the SMTP settings:

- **SMTP Host:** `smtp.sendgrid.net`
- **SMTP Port:** `587` (or `465` for SSL)
- **SMTP User:** `apikey` (literally the word "apikey")
- **SMTP Password:** Your SendGrid API key
- **Sender Email:** Your verified sender email in SendGrid
- **Sender Name:** Your app name (e.g., `CrewControl`)

**Note:** SendGrid free tier allows 100 emails/day.

---

## Option 3: AWS SES SMTP (Very Cheap, Production-Ready)

### Prerequisites
- AWS account
- AWS SES service set up
- Verified email or domain

### Step 1: Set Up AWS SES

1. Go to AWS Console → **Simple Email Service (SES)**
2. Verify your email address or domain
3. Request production access (if needed)
4. Go to **SMTP Settings**

### Step 2: Create SMTP Credentials

1. In SES → **SMTP Settings**
2. Click **"Create SMTP Credentials"**
3. Enter a username (e.g., "supabase-smtp")
4. Click **"Create"**
5. **Download the credentials** (you'll get username and password)

### Step 3: Configure in Supabase

Fill in the SMTP settings:

- **SMTP Host:** Your SES SMTP endpoint (e.g., `email-smtp.us-east-1.amazonaws.com`)
  - Find your endpoint in SES → SMTP Settings
- **SMTP Port:** `587` (TLS) or `465` (SSL)
- **SMTP User:** The username from step 2
- **SMTP Password:** The password from step 2
- **Sender Email:** Your verified SES email
- **Sender Name:** Your app name

**Note:** AWS SES is very cheap ($0.10 per 1,000 emails) but requires initial setup.

---

## Option 4: Mailgun SMTP (Developer-Friendly)

### Prerequisites
- Mailgun account (sign up at https://www.mailgun.com)
- Verified domain or sandbox domain

### Step 1: Create Mailgun Account

1. Go to https://www.mailgun.com
2. Sign up for free account
3. Verify your email

### Step 2: Get SMTP Credentials

1. In Mailgun Dashboard, go to **Sending** → **Domain Settings**
2. Select your domain (or use sandbox domain for testing)
3. Go to **SMTP credentials** tab
4. Note your SMTP username and password

### Step 3: Configure in Supabase

Fill in the SMTP settings:

- **SMTP Host:** `smtp.mailgun.org`
- **SMTP Port:** `587` (or `465` for SSL)
- **SMTP User:** Your Mailgun SMTP username
- **SMTP Password:** Your Mailgun SMTP password
- **Sender Email:** Your verified sender email
- **Sender Name:** Your app name

**Note:** Mailgun free tier allows 5,000 emails/month for first 3 months.

---

## Option 5: Use Supabase Default SMTP (Testing Only)

If you just want to test and don't want to set up custom SMTP:

### Limitations:
- ⚠️ Only sends to **pre-authorized email addresses**
- ⚠️ Very low rate limits
- ⚠️ Not suitable for production

### How to Use:

1. Go to **Authentication** → **SMTP Settings**
2. **Don't enable Custom SMTP** (leave it OFF)
3. Go to **Authentication** → **Users**
4. Add test email addresses to authorized list (if needed)

### Authorize Test Emails:

1. In Supabase Dashboard → **Authentication** → **Users**
2. The default SMTP will only send to emails you've manually authorized
3. For testing, you can manually create test users first

---

## Testing Your SMTP Configuration

### Method 1: Send Test Email (If Available)

1. After configuring SMTP, look for **"Send test email"** button
2. Enter a test email address
3. Click send
4. Check the inbox (and spam folder)

### Method 2: Test via Invitation

1. Go to your app's Team page
2. Click "Invite Team Member"
3. Enter a test email address
4. Submit the invitation
5. Check the email inbox

### Method 3: Check Edge Function Logs

1. Go to Supabase Dashboard → **Edge Functions**
2. Click on `send-invitation-email`
3. Go to **Logs** tab
4. Look for any SMTP errors

---

## Common Issues and Solutions

### Issue: "SMTP authentication failed"

**Solution:**
- Double-check your SMTP username and password
- For Gmail: Make sure you're using an App Password, not your regular password
- For SendGrid: Make sure you're using the API key, not your account password

---

### Issue: "Connection timeout" or "Cannot connect to SMTP server"

**Solution:**
- Verify the SMTP host is correct
- Check the port number (587 for TLS, 465 for SSL)
- Make sure your firewall isn't blocking the connection
- Try a different port (587 vs 465)

---

### Issue: "Email not arriving"

**Check:**
1. **Spam folder** - Check there first!
2. **SMTP provider limits** - Check if you've exceeded daily/monthly limits
3. **Email address** - Make sure it's valid
4. **Sender verification** - For some providers (SendGrid, Mailgun), you need to verify the sender email
5. **Edge Function logs** - Check for errors in Supabase Dashboard

---

### Issue: "Sender email not verified"

**Solution:**
- For SendGrid: Verify your sender email in Settings → Sender Authentication
- For Mailgun: Verify your domain or use sandbox domain
- For AWS SES: Verify your email address in SES console
- For Gmail: Use your actual Gmail address

---

## Recommended Setup by Use Case

### For Development/Testing:
- **Gmail SMTP** - Easy setup, free, good for testing
- **Supabase Default SMTP** - If you only need to test with a few emails

### For Production (Small Scale):
- **SendGrid** - Free tier (100 emails/day), easy setup
- **Mailgun** - Free tier (5,000/month for 3 months)

### For Production (Large Scale):
- **AWS SES** - Very cheap ($0.10 per 1,000 emails), reliable
- **SendGrid Pro** - $20/month for 50,000 emails

---

## Security Best Practices

1. **Never commit SMTP credentials** to git
2. **Use App Passwords** (Gmail) or API keys instead of account passwords
3. **Rotate credentials** periodically
4. **Use environment variables** for sensitive data (handled by Supabase)
5. **Enable 2FA** on your email/SMTP provider accounts

---

## Quick Reference: SMTP Settings by Provider

| Provider | Host | Port | User | Password |
|----------|------|------|------|---------|
| Gmail | `smtp.gmail.com` | 587 | Your Gmail | App Password |
| SendGrid | `smtp.sendgrid.net` | 587 | `apikey` | API Key |
| AWS SES | `email-smtp.region.amazonaws.com` | 587 | SMTP Username | SMTP Password |
| Mailgun | `smtp.mailgun.org` | 587 | SMTP Username | SMTP Password |

---

## Next Steps

After configuring SMTP:

1. ✅ **Test the configuration** by sending a test email
2. ✅ **Deploy the Edge Function** (if not already done):
   ```bash
   supabase functions deploy send-invitation-email
   ```
3. ✅ **Test invitation flow** by inviting a team member
4. ✅ **Monitor Edge Function logs** for any issues

---

## Need More Help?

- Check Supabase documentation: https://supabase.com/docs/guides/auth/auth-smtp
- Check Edge Function logs in Supabase Dashboard
- Verify your SMTP provider's documentation for specific settings
