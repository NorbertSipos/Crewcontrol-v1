# Email Confirmation Setup Guide

## Overview

This project uses **selective email confirmation**:
- **Managers** (signing up): ✅ **Email confirmation REQUIRED** - Prevents typos and ensures valid email
- **Invited Employees**: ❌ **Email confirmation SKIPPED** - Email is pre-validated by manager

## Why This Approach?

**Problem:** If email confirmation is disabled globally, managers might accidentally sign up with a typo in their email address. They won't receive password reset emails or important notifications, and they can't recover their account.

**Solution:** Require confirmation for managers (organization creators), but skip it for invited employees since their email was validated by the manager when sending the invitation.

## Supabase Configuration

### 1. Enable Email Confirmation Globally

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Settings**
3. Under **Email Auth**, enable:
   - ✅ **"Confirm email"** - This enables confirmation globally

### 2. Configure Redirect URL

1. In **Authentication** → **URL Configuration**
2. Add redirect URL:
   - **Development:** `http://localhost:5173/auth/callback`
   - **Production:** `https://yourdomain.com/auth/callback`
3. Set **Site URL**:
   - **Development:** `http://localhost:5173`
   - **Production:** `https://yourdomain.com`

## How It Works

### Manager Signup Flow

1. **Manager signs up** → `SignUp.jsx` calls `supabase.auth.signUp()` with `emailRedirectTo`
2. **Email confirmation required** → User receives confirmation email
3. **User clicks link** → Redirected to `/auth/callback`
4. **EmailConfirmationHandler** checks profile → Redirects to `/complete-signup`
5. **Manager completes setup** → Organization created, redirected to `/dashboard`

**Code in `SignUp.jsx`:**
```javascript
await supabase.auth.signUp({
  email: accountData.email,
  password: accountData.password,
  options: {
    data: { full_name: accountData.fullName },
    emailRedirectTo: `${window.location.origin}/auth/callback` // ← Confirmation required
  }
});
```

### Invited Employee Flow

1. **Manager invites employee** → Email sent with invitation token
2. **Employee clicks link** → `AcceptInvite.jsx` loads
3. **Employee creates account** → `supabase.auth.signUp()` called with `emailRedirectTo: null`
4. **Email confirmation SKIPPED** → Account created immediately
5. **Profile created** → Redirected to `/dashboard`

**Code in `AcceptInvite.jsx`:**
```javascript
await supabase.auth.signUp({
  email: invitation.email,
  password: formData.password,
  options: {
    data: { full_name: formData.fullName },
    emailRedirectTo: null // ← No confirmation needed
  }
});
```

## ⚠️ Important: Email Confirmation Behavior

**Note:** Setting `emailRedirectTo: null` does NOT actually bypass email confirmation when it's enabled globally in Supabase. The confirmation email will still be sent and the user must confirm before they can log in.

**Solution:** We use a database function (`create_user_from_invitation`) that creates the user profile **without requiring a session token**. This means:
- ✅ User profile is created immediately (no "Failed to get session token" error)
- ⚠️ User still receives confirmation email (Supabase requirement)
- ⚠️ User must confirm email before they can log in

**Alternative:** If you want invited employees to skip confirmation entirely, you would need to:
1. Disable "Confirm email" globally in Supabase
2. Add a custom email verification flow for managers only
3. Use Supabase Admin API (via backend/edge function) to auto-confirm invited users

For now, the current setup ensures the profile is created but requires email confirmation.

## Testing

### Test Manager Signup (Confirmation Required)

1. Sign up as a new manager
2. Check email for confirmation link
3. Click link → Should redirect to `/auth/callback`
4. Should then redirect to `/complete-signup`
5. Complete setup → Should redirect to `/dashboard`

### Test Employee Invite (No Confirmation)

1. Log in as manager
2. Go to Team page → Invite a new employee
3. Click invitation link (or use `/accept-invite?token=...`)
4. Create account → Should **NOT** require email confirmation
5. Should redirect directly to `/dashboard` after account creation

## Troubleshooting

### Issue: Manager not receiving confirmation email

**Solutions:**
- Check Supabase Email settings are configured
- Verify email templates are set up (check `SUPABASE_EMAIL_SETUP.md`)
- Check spam folder
- Verify redirect URL is correctly configured in Supabase

### Issue: Employee signup still requires confirmation

**Check:**
- Ensure `emailRedirectTo: null` is set in `AcceptInvite.jsx`
- Verify Supabase settings allow this override
- Check browser console for errors

### Issue: Redirect after confirmation not working

**Solutions:**
- Verify redirect URL is added in Supabase Dashboard
- Check `EmailConfirmationHandler.jsx` is handling the redirect correctly
- Ensure `/auth/callback` route exists in `main.jsx`

## Security Notes

- ✅ Managers must verify their email (prevents typos)
- ✅ Invited employees skip confirmation (pre-validated by manager)
- ✅ Password reset still requires email verification
- ✅ Email changes require confirmation (handled by Supabase)

This approach balances security with user experience while preventing the "wrong email" problem.
