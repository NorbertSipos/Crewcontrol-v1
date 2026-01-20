-- Migration: Add days_off_distribution column to organizations table
-- This setting controls whether days off are distributed randomly or always on weekends

-- Add the column with default value of 'random'
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS days_off_distribution VARCHAR(20) DEFAULT 'random' CHECK (days_off_distribution IN ('random', 'weekends'));

-- Update existing organizations to have default value of 'random'
UPDATE organizations
SET days_off_distribution = 'random'
WHERE days_off_distribution IS NULL;
