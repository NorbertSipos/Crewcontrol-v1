# Supabase Email Template Setup

## How to Use the Custom Email Template

1. **Go to Supabase Dashboard**
   - Navigate to your Supabase project
   - Go to **Authentication** → **Email Templates**

2. **Select "Confirm signup" Template**
   - Click on the "Confirm signup" template from the list

3. **Copy the HTML**
   - Open `supabase_email_templates/confirm_signup.html`
   - Copy the entire HTML content

4. **Paste into Supabase**
   - In the Supabase email template editor, paste the HTML
   - The template uses `{{ .ConfirmationURL }}` which Supabase will automatically replace with the actual confirmation link

5. **Save**
   - Click "Save" to apply the template

## Template Features

- ✅ **Modern Design**: Matches CrewControl's dark theme with purple accents
- ✅ **Responsive**: Works on desktop and mobile email clients
- ✅ **Professional**: Clean, branded design with logo and gradient effects
- ✅ **Clear CTA**: Prominent "Confirm Your Email" button
- ✅ **Security Note**: Includes helpful security information
- ✅ **Alternative Link**: Provides a fallback link if button doesn't work
- ✅ **Email Client Compatible**: Uses table-based layout for maximum compatibility

## Template Variables

The template uses Supabase's built-in variable:
- `{{ .ConfirmationURL }}` - Automatically replaced with the confirmation link

## Preview

The email includes:
- CrewControl logo and branding
- Welcome message
- Large, clickable confirmation button
- Alternative text link
- Security note
- Footer with contact information

## Customization

To customize colors or styling:
- Main background: `#0f172a` (slate-950)
- Card background: `#1e293b` (slate-800)
- Purple accent: `#a855f7` (purple-500)
- Text colors: Various shades of slate/gray
