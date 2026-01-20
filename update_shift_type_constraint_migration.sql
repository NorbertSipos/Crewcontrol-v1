-- Migration: Update shift_type constraint to include 'day_off'
-- This allows the Day Off template to be used in schedule_templates

-- Drop the existing constraint if it exists
ALTER TABLE schedule_templates
DROP CONSTRAINT IF EXISTS chk_template_shift_type;

-- Add the updated constraint with 'day_off' included
ALTER TABLE schedule_templates
ADD CONSTRAINT chk_template_shift_type CHECK (shift_type IN ('on_shift', 'paid_leave', 'emergency', 'day_off'));

-- Also update the shifts table constraint if it exists
-- First, check if the constraint exists and drop it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'shifts_shift_type_check' 
    AND conrelid = 'shifts'::regclass
  ) THEN
    ALTER TABLE shifts DROP CONSTRAINT shifts_shift_type_check;
  END IF;
END $$;

-- Add updated constraint to shifts table if shift_type column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shifts' 
    AND column_name = 'shift_type'
  ) THEN
    ALTER TABLE shifts
    ADD CONSTRAINT shifts_shift_type_check CHECK (shift_type IN ('on_shift', 'paid_leave', 'emergency', 'day_off'));
  END IF;
END $$;
