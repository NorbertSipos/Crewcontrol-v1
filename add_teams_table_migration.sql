-- Migration: Create teams table for managing teams in the organization
-- Teams are created during organization setup and can be managed separately

-- ============================================
-- TEAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, name) -- Prevent duplicate team names within same organization
);

CREATE INDEX IF NOT EXISTS idx_teams_org ON teams(organization_id);
CREATE INDEX IF NOT EXISTS idx_teams_active ON teams(organization_id, is_active);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams
-- Users can view teams in their organization
DROP POLICY IF EXISTS "Users can view teams in their organization" ON teams;
CREATE POLICY "Users can view teams in their organization"
  ON teams FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Only managers can insert/update/delete teams
DROP POLICY IF EXISTS "Managers can manage teams" ON teams;
CREATE POLICY "Managers can manage teams"
  ON teams FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.organization_id = teams.organization_id
      AND users.role = 'manager'
    )
  );

-- Update invitations table to reference team_id instead of just team_name
-- (keeping team_name for backward compatibility, but also add team_id)
ALTER TABLE invitations 
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

-- Update users table to reference team_id instead of just team_name
-- (keeping team_name for backward compatibility, but also add team_id)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

-- Create index for team_id lookups
CREATE INDEX IF NOT EXISTS idx_users_team_id ON users(team_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_invitations_team_id ON invitations(team_id);
