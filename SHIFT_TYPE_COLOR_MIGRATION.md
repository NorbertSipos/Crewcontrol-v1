# Shift Type and Color Migration Guide

## Problem

When trying to save a shift with a new color or shift type, you may see this error:
```
Error saving shift: Failed to fetch
```

This happens because the `shift_type` and `color` columns don't exist in the `shifts` table yet.

## Solution: Run the Migration

### Step 1: Open Supabase SQL Editor

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New query"** button

### Step 2: Run the Migration

1. Open the file `add_shift_type_and_color_migration.sql` in this project
2. **Copy ALL the contents** (Ctrl+A, Ctrl+C)
3. **Paste it into the Supabase SQL Editor** (Ctrl+V)
4. Click the **"Run"** button (or press Ctrl+Enter)
5. You should see: **"Success. No rows returned"**

### Step 3: Verify the Columns Were Added

Run this query to verify:
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'shifts' 
AND column_name IN ('shift_type', 'color');
```

You should see both `shift_type` and `color` columns in the results.

### Step 4: Test the Feature

1. Go to your app and log in as a manager
2. Navigate to the Dashboard
3. Try creating or editing a shift
4. Select a shift type and change the color
5. Save the shift - it should work now!

## What This Migration Adds

- **`shift_type`** column: VARCHAR(20) with default value 'on_shift'
  - Allowed values: 'on_shift', 'paid_leave', 'emergency'
  - Default: 'on_shift'
  
- **`color`** column: VARCHAR(7) for hex color codes (e.g., '#8b5cf6')
  - Default: '#8b5cf6' (purple)

- **Index**: Created on `shift_type` for faster filtering

- **Existing Data**: All existing shifts are updated with default values

## Features Enabled After Migration

✅ **Shift Types**: 
- On Shift (default purple)
- Paid Leave (green)
- Emergency (red)

✅ **Color Picker**: Custom colors for each shift

✅ **Auto-Fill**: Automatically creates shifts with different types and colors

✅ **Visual Distinction**: Shifts display with their assigned colors in the calendar

## Troubleshooting

### Error: "column already exists"
- The columns are already added. You can skip this migration.

### Error: "permission denied"
- Make sure you're using the correct Supabase project and have admin access

### Shifts still not saving
- Clear your browser cache
- Check browser console for detailed error messages
- Verify the columns exist using the verification query above

---

**After running this migration, you'll be able to use all shift type and color features! 🎨**
