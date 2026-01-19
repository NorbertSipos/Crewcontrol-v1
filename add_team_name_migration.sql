-- Migration: Add team_name to invitations and users tables
-- This allows employees to be assigned to teams when invited

-- Add team_name to invitations table
ALTER TABLE invitations 
ADD COLUMN IF NOT EXISTS team_name VARCHAR(255);

-- Add team_name to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS team_name VARCHAR(255);

-- Create index for filtering by team
CREATE INDEX IF NOT EXISTS idx_users_team ON users(team_name, organization_id);
