# Email Service Setup Instructions

## Overview

The invitation system now uses **Supabase's built-in invite email system** - no Resend or third-party services needed! 🎉

The Edge Function uses `auth.admin.inviteUserByEmail()` which automatically sends emails using Supabase's email template that you can customize in the Dashboard.

---

## Setup Steps

### Step 1: Customize the Invite Email Template

1. **Go to Supabase Dashboard**
   - Navigate to **Authentication** → **Email Templates**
   - Select **"Invite"** template

2. **Paste Your Custom Template**
   - You can use the HTML template you already have
   - The template supports these variables:
     - `{{ .ConfirmationURL }}` - The invitation acceptance link (points to `/accept-invite?token=xxx`)
     - `{{ .Email }}` - The invited user's email
     - `{{ .OrganizationName }}` - Organization name (from user_metadata)
     - `{{ .Role }}` - User role (from user_metadata)

3. **Save the Template**
   - Click "Save" to apply your custom template

**Note:** The template you showed me earlier is perfect! Just make sure to use `{{ .ConfirmationURL }}` for the invitation link instead of a hardcoded URL.

---

### Step 2: Configure SMTP (If Not Already Done)

Supabase needs SMTP configured to send emails. You have two options:

#### Option A: Use Supabase's Default SMTP (Development Only)
- ⚠️ **Limited:** Only sends to pre-authorized email addresses
- ⚠️ **Low rate limits**
- ✅ **Free** - Good for testing

#### Option B: Use Custom SMTP (Recommended for Production)

**📖 For detailed step-by-step instructions, see [SMTP_SETUP_GUIDE.md](./SMTP_SETUP_GUIDE.md)**

Quick steps:
1. **Go to Supabase Dashboard**
   - Navigate to **Authentication** → **SMTP Settings**
   - Enable **Custom SMTP**

2. **Choose an SMTP Provider:**
   - **Gmail** (Free, easy) - See guide for App Password setup
   - **SendGrid** (Free tier: 100 emails/day)
   - **AWS SES** (Very cheap, production-ready)
   - **Mailgun** (Developer-friendly)

3. **Enter SMTP Details** (see SMTP_SETUP_GUIDE.md for provider-specific values)
   - SMTP Host
   - SMTP Port (usually 587 or 465)
   - SMTP User
   - SMTP Password
   - Sender Email
   - Sender Name

---

### Step 3: Deploy the Edge Function

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find your project ref in Supabase Dashboard → Settings → General)

4. **Deploy the Edge Function**:
   ```bash
   supabase functions deploy send-invitation-email
   ```

   **No API keys needed!** The function uses Supabase's built-in invite system.

---

### Step 4: Verify Setup

1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions**
3. You should see `send-invitation-email` function listed
4. Test by inviting a team member from the Team page
5. Check the recipient's email inbox

---

## How It Works

1. **Manager invites employee** → Creates invitation in `invitations` table
2. **Edge Function called** → Uses `auth.admin.inviteUserByEmail()`
3. **Supabase sends email** → Uses your custom invite template
4. **Employee clicks link** → Redirected to `/accept-invite?token=xxx`
5. **Employee signs up** → Creates account and profile

The invitation metadata (organization, role, job title, team) is stored in:
- `invitations` table (for our app logic)
- `user_metadata` (accessible via `user.user_metadata`)

---

## Testing

1. Invite a team member from the Team page
2. Check the recipient's email inbox
3. If email doesn't arrive:
   - Check spam folder
   - Verify SMTP is configured in Supabase Dashboard
   - Check Supabase Edge Function logs
   - Check browser console for errors
   - Verify email address is authorized (if using default SMTP)

---

## Troubleshooting

### Error: "Failed to send invitation email"

**Possible causes:**
- SMTP not configured in Supabase Dashboard
- Edge Function not deployed
- Network/CORS issues
- Email address not authorized (default SMTP only)

**Solutions:**
1. Verify SMTP settings in Supabase Dashboard → Authentication → SMTP Settings
2. Redeploy Edge Function: `supabase functions deploy send-invitation-email`
3. Check Edge Function logs in Supabase Dashboard → Edge Functions → Logs
4. For default SMTP: Add email to authorized list in Supabase Dashboard

### Email not arriving

**Check:**
- Spam/junk folder
- SMTP configuration is correct
- Email address is valid
- SMTP provider limits (if using custom SMTP)
- Supabase Dashboard → Authentication → Email Templates → Invite template is saved

### Email template variables not working

**Make sure:**
- You're using the correct variable syntax: `{{ .VariableName }}`
- Variables are available in user_metadata (set by Edge Function)
- Template is saved in Supabase Dashboard

---

## Fallback Behavior

If email sending fails, the system will:
1. Still create the invitation in the database
2. Show an alert with the invitation link
3. Allow you to manually share the link

This ensures invitations aren't lost even if email service is down.

---

## Production Considerations

For production:
1. **Use Custom SMTP** (not default Supabase SMTP)
2. **Verify your domain** with your SMTP provider
3. **Set up SPF/DKIM records** for better deliverability
4. **Monitor email delivery rates** in your SMTP provider dashboard
5. **Test email template** on multiple email clients
6. **Monitor Edge Function logs** for errors

---

## Cost

- **Supabase Edge Functions:** Included in Supabase plan
- **SMTP Provider:** 
  - Gmail: Free (with limits)
  - SendGrid: Free tier (100 emails/day)
  - AWS SES: Very cheap ($0.10 per 1,000 emails)
  - Other providers vary

**No Resend account needed!** 🎉

---

## Benefits of This Approach

✅ **No third-party services** - Uses Supabase's built-in system  
✅ **Simple setup** - Just configure SMTP and deploy Edge Function  
✅ **Customizable templates** - Edit in Supabase Dashboard  
✅ **Automatic email sending** - Handled by Supabase  
✅ **Metadata support** - Organization, role, job title stored in user_metadata  
✅ **Fallback support** - Shows link if email fails  

---

## Next Steps

1. ✅ Customize the invite email template in Supabase Dashboard
2. ✅ Configure SMTP settings (or use default for testing)
3. ✅ Deploy the Edge Function
4. ✅ Test by inviting a team member
5. ✅ Verify email arrives and link works

That's it! No Resend account needed. 🚀
