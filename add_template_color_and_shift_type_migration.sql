-- Migration: Add shift_type and color columns to the schedule_templates table

ALTER TABLE schedule_templates
ADD COLUMN IF NOT EXISTS shift_type VARCHAR(20) DEFAULT 'on_shift';

ALTER TABLE schedule_templates
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#8b5cf6';

-- Add a CHECK constraint for valid shift_type values
ALTER TABLE schedule_templates
ADD CONSTRAINT chk_template_shift_type CHECK (shift_type IN ('on_shift', 'paid_leave', 'emergency'));

-- Update existing templates to have default values if columns were just added
UPDATE schedule_templates
SET shift_type = 'on_shift'
WHERE shift_type IS NULL;

UPDATE schedule_templates
SET color = '#8b5cf6'
WHERE color IS NULL;

-- Create index for shift_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_schedule_templates_shift_type ON schedule_templates(shift_type, organization_id);
