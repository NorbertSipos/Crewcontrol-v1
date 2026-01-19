# Database Setup Instructions

## Step-by-Step Guide to Set Up Your Supabase Database

### Prerequisites
- ✅ Supabase project created
- ✅ `.env.local` file configured with your Supabase credentials

---

## Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New query"** button

---

## Step 2: Copy and Paste SQL

1. Open the file `supabase_setup.sql` in this project
2. **Copy ALL the contents** (Ctrl+A, Ctrl+C)
3. **Paste it into the Supabase SQL Editor** (Ctrl+V)

---

## Step 3: Run the SQL

1. Click the **"Run"** button (or press Ctrl+Enter)
2. Wait for it to complete (should take a few seconds)
3. You should see: **"Success. No rows returned"**

---

## Step 4: Verify Tables Were Created

1. In Supabase Dashboard, go to **"Table Editor"** (left sidebar)
2. You should see these tables:
   - ✅ `organizations`
   - ✅ `locations`
   - ✅ `users`
   - ✅ `invitations`
   - ✅ `shifts`
   - ✅ `time_off_requests`
   - ✅ `schedule_swaps`
   - ✅ `attendance`
   - ✅ `user_locations`

---

## Step 5: Verify RLS is Enabled

1. Click on any table (e.g., `organizations`)
2. Go to the **"Policies"** tab
3. You should see RLS policies listed
4. RLS should be **"Enabled"** (green toggle)

---

## Step 6: Test Your Setup

### Test 1: Sign Up Flow
1. Go to your app: `http://localhost:5173/signup`
2. Fill out the signup form
3. Submit it
4. **Expected Result:** Should create:
   - Organization in `organizations` table
   - User in `users` table (with role='manager')
   - Locations (if on-site/hybrid)

### Test 2: Check Database
1. Go to Supabase Dashboard → Table Editor
2. Check `organizations` table - should see your new organization
3. Check `users` table - should see your user with role='manager'

---

## Troubleshooting

### Error: "relation already exists"
- **Solution:** Some tables might already exist. You can either:
  - Drop existing tables first (be careful!)
  - Or skip the CREATE TABLE statements for existing tables

### Error: "permission denied"
- **Solution:** Make sure you're using the correct Supabase project and have admin access

### RLS Policies Not Working
- **Solution:** 
  1. Go to Table Editor → Select table → Policies tab
  2. Make sure RLS is enabled (green toggle)
  3. Check that policies are listed

### SignUp Fails
- **Check:** 
  1. Are tables created? (Step 4)
  2. Is RLS enabled? (Step 5)
  3. Check browser console for errors
  4. Check Supabase logs: Dashboard → Logs

---

## What This Setup Includes

### ✅ Tables Created:
- `organizations` - Company/tenant data
- `locations` - Work locations (for on-site/hybrid)
- `users` - All users (managers, employees, HR)
- `invitations` - Email invitations
- `shifts` - Scheduled work periods
- `time_off_requests` - Time-off requests
- `schedule_swaps` - Shift swap requests
- `attendance` - Clock-in/out records
- `user_locations` - Employee-location assignments

### ✅ Security (RLS):
- Users can only see data from their organization
- Managers have full access to their org
- Employees can view team schedule (read-only)
- HR can view attendance/hours (read-only)

### ✅ Indexes:
- Optimized for fast queries
- Indexes on foreign keys
- Indexes on frequently queried fields

---

## Step 7: Create Invitation Function (Required for Accepting Invitations)

**Important:** If you want to use the invitation system, you must create the `create_user_from_invitation` function.

1. Open the file `create_user_from_invitation_function.sql` in this project
2. **Copy ALL the contents** (Ctrl+A, Ctrl+C)
3. **Paste it into the Supabase SQL Editor** (Ctrl+V)
4. Click the **"Run"** button (or press Ctrl+Enter)
5. You should see: **"Success. No rows returned"**

**Note:** If you see errors about missing `team_id` or `team_name` columns, run these migrations first:
- `add_team_name_migration.sql`
- `add_teams_table_migration.sql`

See `INVITATION_FUNCTION_SETUP.md` for detailed instructions.

## Next Steps After Setup

1. ✅ **Test SignUp** - Create a manager account
2. ✅ **Test SignIn** - Log in with your account
3. ✅ **Create Invitation Function** - Run `create_user_from_invitation_function.sql`
4. ✅ **Test Invitations** - Invite an employee and test the accept flow
5. ✅ **Build Dashboard** - Create role-based dashboards
6. ✅ **Add Features** - Shifts, time-off, swaps, etc.

---

## Need Help?

If you encounter any issues:
1. Check the Supabase logs: Dashboard → Logs
2. Check browser console for errors
3. Verify your `.env.local` has correct credentials
4. Make sure all tables were created successfully

---

**You're all set! 🎉**
