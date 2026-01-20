-- Migration: Add days_off_per_week column to organizations table
-- This setting controls how many rest days each employee will have per week when using Auto-Fill

-- Add the column with default value of 2 (2 days off per week)
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS days_off_per_week INTEGER DEFAULT 2 CHECK (days_off_per_week IN (1, 2));

-- Update existing organizations to have default value of 2
UPDATE organizations
SET days_off_per_week = 2
WHERE days_off_per_week IS NULL;
