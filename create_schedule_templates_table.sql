-- ============================================
-- Schedule Templates Table
-- ============================================
-- This table stores reusable schedule templates
-- that managers can create and use when adding shifts
-- ============================================

CREATE TABLE schedule_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  start_time TIME NOT NULL, -- e.g., '08:00:00' for 8 AM
  end_time TIME NOT NULL, -- e.g., '16:00:00' for 4 PM
  timezone VARCHAR(50) DEFAULT 'UTC', -- e.g., 'CET', 'EST', 'PST'
  break_duration_minutes INTEGER DEFAULT 0,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CHECK (end_time > start_time)
);

CREATE INDEX idx_schedule_templates_org ON schedule_templates(organization_id, is_active);
CREATE INDEX idx_schedule_templates_created_by ON schedule_templates(created_by);

-- RLS Policies
ALTER TABLE schedule_templates ENABLE ROW LEVEL SECURITY;

-- Managers and HR can view all templates in their organization
CREATE POLICY "Managers and HR can view schedule templates"
  ON schedule_templates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.organization_id = schedule_templates.organization_id
      AND users.role IN ('manager', 'hr')
    )
  );

-- Only managers can create templates
CREATE POLICY "Managers can create schedule templates"
  ON schedule_templates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.organization_id = schedule_templates.organization_id
      AND users.role = 'manager'
    )
  );

-- Only managers can update templates
CREATE POLICY "Managers can update schedule templates"
  ON schedule_templates FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.organization_id = schedule_templates.organization_id
      AND users.role = 'manager'
    )
  );

-- Only managers can delete templates
CREATE POLICY "Managers can delete schedule templates"
  ON schedule_templates FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.organization_id = schedule_templates.organization_id
      AND users.role = 'manager'
    )
  );
