# Invitation Function Setup Guide

## Problem

When accepting an invitation, you may see this error:
```
Could not find the function public.create_user_from_invitation(p_full_name, p_invitation_token, p_user_id) in the schema cache
```

This means the `create_user_from_invitation` database function hasn't been created yet.

## Solution: Run the Function SQL

### Step 1: Open Supabase SQL Editor

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New query"** button

### Step 2: Run Required Migrations (if not already done)

**First, check if you have `team_name` and `team_id` columns:**

Run this query to check:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'invitations' 
AND column_name IN ('team_name', 'team_id');
```

**If the columns don't exist, run these migrations in order:**

1. **Run `add_team_name_migration.sql`** (adds `team_name` column)
2. **Run `add_teams_table_migration.sql`** (adds `teams` table and `team_id` columns)

### Step 3: Create the Function

1. Open the file `create_user_from_invitation_function.sql` in this project
2. **Copy ALL the contents** (Ctrl+A, Ctrl+C)
3. **Paste it into the Supabase SQL Editor** (Ctrl+V)
4. Click the **"Run"** button (or press Ctrl+Enter)
5. You should see: **"Success. No rows returned"**

### Step 4: Verify the Function Was Created

Run this query to verify:
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'create_user_from_invitation';
```

You should see `create_user_from_invitation` in the results.

### Step 5: Test the Invitation Flow

1. Go to your app and log in as a manager
2. Navigate to the Team page
3. Invite a new employee
4. Click the invitation link (or use `/accept-invite?token=...`)
5. Fill out the form and click "Accept Invitation & Create Account"
6. **Expected Result:** Account should be created successfully without errors

## Troubleshooting

### Error: "column team_id does not exist"

**Solution:** Run the migration files first:
1. Run `add_team_name_migration.sql`
2. Run `add_teams_table_migration.sql`
3. Then run `create_user_from_invitation_function.sql`

### Error: "permission denied"

**Solution:** Make sure you're logged into Supabase Dashboard with admin access to your project.

### Function still not found after creating it

**Solution:** 
1. Wait a few seconds for Supabase to update the schema cache
2. Try refreshing your browser
3. Check that the function was created in the correct schema (should be `public`)

## What This Function Does

The `create_user_from_invitation` function:
- ✅ Validates the invitation token
- ✅ Creates the user profile in the `users` table
- ✅ Copies role, job_title, team info from the invitation
- ✅ Links the user to the correct organization
- ✅ Marks the invitation as accepted
- ✅ Works even if email confirmation is pending (uses SECURITY DEFINER to bypass RLS)

This allows invited employees to create their account even before confirming their email address.
