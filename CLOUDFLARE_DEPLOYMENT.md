# Cloudflare Pages Deployment Guide

## Prerequisites

✅ **Project is ready for deployment!**

The project has been tested and builds successfully. All necessary files are in place.

## Deployment Steps

### 1. Connect Repository to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Connect your Git provider (GitHub/GitLab/Bitbucket)
4. Select the `CrewControl` repository
5. Select the `main` branch

### 2. Build Configuration

**Build Settings:**
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave empty)
- **Deploy command**: ⚠️ **LEAVE THIS EMPTY** - Cloudflare Pages automatically deploys after build

**⚠️ IMPORTANT:** Do NOT add a deploy command. Cloudflare Pages will automatically deploy the `dist` folder after the build completes. If you see a "Deploy command" field, leave it blank or remove any value.

### 3. Environment Variables

Add these environment variables in Cloudflare Pages settings:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**How to add:**
1. In Cloudflare Pages project settings
2. Go to **Environment variables**
3. Add both variables for **Production**, **Preview**, and **Development** environments

### 4. Custom Domain (Optional)

1. Go to **Custom domains** in your Pages project
2. Add your domain (e.g., `crewcontrol.io`)
3. Follow DNS configuration instructions

### 5. Deployment

- Cloudflare Pages will automatically deploy on every push to `main`
- You can also trigger manual deployments from the dashboard

## Post-Deployment Checklist

### Database Setup
- [ ] Run all SQL migration files in Supabase SQL Editor:
  - `add_shift_type_and_color_migration.sql`
  - `add_template_color_and_shift_type_migration.sql`
  - `add_days_off_per_week_migration.sql`
  - `add_days_off_distribution_migration.sql`
  - `update_shift_type_constraint_migration.sql`
  - `fix_notification_rls_policy.sql`
  - `fix_overnight_shifts_constraint.sql` (if needed)

### Supabase Configuration
- [ ] Update Supabase redirect URLs to include your Cloudflare Pages domain
- [ ] Verify email templates are configured
- [ ] Test authentication flow (sign up, sign in, password reset)

### Testing
- [ ] Test all public pages load correctly
- [ ] Test authentication (sign up, sign in)
- [ ] Test dashboard functionality
- [ ] Test shift creation and management
- [ ] Test auto-fill functionality
- [ ] Verify mobile responsiveness

## Build Output

The build generates optimized chunks:
- Main bundle: ~198 KB (gzipped: ~61 KB)
- Dashboard chunk: ~151 KB (gzipped: ~35 KB)
- React vendor: ~47 KB (gzipped: ~17 KB)
- Supabase vendor: ~170 KB (gzipped: ~44 KB)
- CSS: ~187 KB (gzipped: ~21 KB)

Total gzipped size: ~200 KB (excellent for performance!)

## Important Notes

1. **SPA Routing**: The `_redirects` file is included for proper React Router support
2. **Environment Variables**: Must be set in Cloudflare Pages dashboard
3. **Database Migrations**: Run all SQL migrations before using the app
4. **Supabase Redirect URLs**: Must include your Cloudflare Pages domain

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs in Cloudflare dashboard

### Deploy Command Error (Wrangler)
**Error:** `Missing entry-point to Worker script or to assets directory`

**Solution:** 
- Go to your Cloudflare Pages project settings
- Find the **"Deploy command"** field
- **DELETE/REMOVE** any value in this field (leave it completely empty)
- Cloudflare Pages does NOT need a deploy command - it automatically deploys after build
- Save settings and redeploy

### Routes Not Working
- Verify `_redirects` file is in `public/` folder
- Check Cloudflare Pages redirect rules

### Environment Variables Not Working
- Ensure variables start with `VITE_` prefix
- Redeploy after adding environment variables
- Check variable names match exactly

## Support

For issues, check:
- Cloudflare Pages documentation
- Vite documentation
- Supabase documentation
