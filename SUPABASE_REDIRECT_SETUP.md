# Supabase Redirect URL Configuration

## Important: Configure Email Confirmation Redirect

After a user confirms their email, Supabase needs to know where to redirect them. We've set up a handler at `/auth/callback` that will:
1. Check if the user has completed signup
2. Redirect to `/complete-signup` if they haven't
3. Redirect to `/dashboard` if they have

## Setup Steps

### 1. Configure Redirect URL in Supabase

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **URL Configuration**
3. Find **"Redirect URLs"** or **"Site URL"**
4. Add your redirect URL:
   - **For development:** `http://localhost:5173/auth/callback`
   - **For production:** `https://yourdomain.com/auth/callback`
5. Also set **"Site URL"** to your app's base URL:
   - **For development:** `http://localhost:5173`
   - **For production:** `https://yourdomain.com`

### 2. Update Email Template (Optional)

In your email confirmation template, the `{{ .ConfirmationURL }}` variable will automatically include the redirect URL. No changes needed to the email template.

### 3. Test the Flow

1. Sign up with a new email
2. Check your email and click the confirmation link
3. You should be redirected to `/auth/callback`
4. The handler will check if you need to complete signup
5. You'll be redirected to `/complete-signup` or `/dashboard` accordingly

## How It Works

1. **User signs up** → Email sent with confirmation link
2. **User clicks link** → Supabase verifies email and redirects to `/auth/callback`
3. **EmailConfirmationHandler** checks:
   - Is user authenticated? → Yes
   - Does user have a profile in `users` table? → No
   - Redirect to `/complete-signup`
4. **User completes signup** → Creates organization and user profile
5. **User redirected to `/dashboard`**

## Troubleshooting

### Issue: Redirect not working
- Check that the redirect URL is added in Supabase Dashboard
- Verify the URL matches exactly (including `/auth/callback`)
- Check browser console for errors

### Issue: User stuck on "Verifying email..."
- Check that `AuthContext` is loading properly
- Check browser console for errors
- Verify Supabase client is configured correctly

### Issue: User redirected to signin after confirmation
- This means the user wasn't authenticated after email confirmation
- Check Supabase auth settings
- Verify email confirmation is working in Supabase Dashboard
