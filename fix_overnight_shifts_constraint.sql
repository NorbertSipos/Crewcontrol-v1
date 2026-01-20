-- Fix schedule_templates constraint to allow overnight shifts
-- The current constraint CHECK (end_time > start_time) doesn't allow overnight shifts
-- We'll remove it since we handle validation in the application

-- Drop the existing constraint (it may have different names in different setups)
DO $$ 
BEGIN
    -- Try common constraint names
    ALTER TABLE schedule_templates DROP CONSTRAINT IF EXISTS schedule_templates_end_time_check;
    ALTER TABLE schedule_templates DROP CONSTRAINT IF EXISTS schedule_templates_check;
    ALTER TABLE schedule_templates DROP CONSTRAINT IF EXISTS schedule_templates_start_time_end_time_check;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Note: Overnight shifts are now handled in the application
-- The application stores end_time as 23:59:59 for overnight shifts to satisfy any remaining constraints
-- and handles the actual end time (next day) when creating shifts from templates
