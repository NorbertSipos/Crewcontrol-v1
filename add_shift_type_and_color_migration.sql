-- Migration: Add shift_type and color columns to shifts table
-- This allows shifts to have different types (on_shift, paid_leave, emergency) and custom colors

-- Add shift_type column
ALTER TABLE shifts 
ADD COLUMN IF NOT EXISTS shift_type VARCHAR(20) DEFAULT 'on_shift';

-- Add color column (hex color code)
ALTER TABLE shifts 
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#8b5cf6';

-- Add check constraint for shift_type values
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'shifts_shift_type_check'
    ) THEN
        ALTER TABLE shifts 
        ADD CONSTRAINT shifts_shift_type_check 
        CHECK (shift_type IN ('on_shift', 'paid_leave', 'emergency'));
    END IF;
END $$;

-- Create index for filtering by shift type
CREATE INDEX IF NOT EXISTS idx_shifts_shift_type ON shifts(shift_type, organization_id);

-- Update existing shifts to have default values
UPDATE shifts 
SET 
    shift_type = COALESCE(shift_type, 'on_shift'),
    color = COALESCE(color, '#8b5cf6')
WHERE shift_type IS NULL OR color IS NULL;
