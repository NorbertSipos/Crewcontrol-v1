# Quick Setup Guide: Using Supabase's Built-in Invite System

## What Changed?

We've updated the invitation system to use **Supabase's built-in `auth.admin.inviteUserByEmail()`** instead of requiring Resend. This means:

- ✅ **No Resend account needed**
- ✅ **Uses Supabase's email template** (customizable in Dashboard)
- ✅ **Simpler setup** - just configure SMTP and deploy Edge Function

---

## Quick Start (3 Steps)

### 1. Update Email Template in Supabase Dashboard

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Select **"Invite"** template
3. Paste your custom HTML template (the one you showed me)
4. Make sure to use `{{ .ConfirmationURL }}` for the invitation link
5. Click **Save**

### 2. Configure SMTP (Choose One)

**Option A: Default SMTP (Testing Only)**
- Already configured
- Only sends to pre-authorized emails
- Limited rate limits

**Option B: Custom SMTP (Production)**
- Go to **Authentication** → **SMTP Settings**
- Enable **Custom SMTP**
- Enter your SMTP provider details (Gmail, SendGrid, AWS SES, etc.)

### 3. Deploy Edge Function

```bash
# Install Supabase CLI (if needed)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy
supabase functions deploy send-invitation-email
```

**That's it!** No API keys, no Resend account - just deploy and test.

---

## How It Works

1. Manager clicks "Invite Team Member" in Team page
2. System creates invitation in `invitations` table
3. Edge Function calls `auth.admin.inviteUserByEmail()`
4. Supabase sends email using your custom template
5. Employee clicks link → redirected to `/accept-invite?token=xxx`
6. Employee signs up → account created

---

## Email Template Variables

In your Supabase invite template, you can use:

- `{{ .ConfirmationURL }}` - The invitation link
- `{{ .Email }}` - Recipient email
- `{{ .OrganizationName }}` - From user_metadata (set by Edge Function)
- `{{ .Role }}` - From user_metadata

**Note:** The template you provided earlier is perfect! Just make sure `{{ .ConfirmationURL }}` is used for the link.

---

## Testing

1. Invite a team member from the Team page
2. Check email inbox (and spam folder)
3. Click the invitation link
4. Complete signup

If email doesn't arrive:
- Check Supabase Dashboard → Edge Functions → Logs
- Verify SMTP is configured
- Check spam folder

---

## Files Changed

- ✅ `supabase/functions/send-invitation-email/index.ts` - Now uses `auth.admin.inviteUserByEmail()`
- ✅ `src/lib/emailService.js` - Updated to pass required fields
- ✅ `src/components/Team.jsx` - Updated to pass invitation metadata
- ✅ `EMAIL_SERVICE_SETUP.md` - Complete documentation

---

## Benefits

- 🎉 **No Resend account needed**
- 🎉 **Uses Supabase's built-in system**
- 🎉 **Customizable email templates**
- 🎉 **Automatic email sending**
- 🎉 **Metadata support** (organization, role, job title)

---

## Need Help?

See `EMAIL_SERVICE_SETUP.md` for detailed troubleshooting and setup instructions.
