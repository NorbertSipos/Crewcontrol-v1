-- ============================================
-- CrewControl Database Setup
-- ============================================
-- This file contains all tables, indexes, and RLS policies
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. ORGANIZATIONS TABLE
-- ============================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  work_type VARCHAR(20) NOT NULL CHECK (work_type IN ('remote', 'on-site', 'hybrid')),
  plan VARCHAR(20) DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. LOCATIONS TABLE
-- ============================================
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_locations_org ON locations(organization_id);

-- ============================================
-- 3. USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY, -- Matches Supabase Auth UUID
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(20) NOT NULL CHECK (role IN ('manager', 'employee', 'hr')),
  job_title VARCHAR(100), -- NULL for manager/hr
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  phone VARCHAR(50),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMP,
  joined_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_role ON users(role, organization_id);
CREATE INDEX idx_users_job_title ON users(job_title, organization_id);

-- ============================================
-- 4. INVITATIONS TABLE
-- ============================================
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('employee', 'hr')),
  job_title VARCHAR(100), -- For employees
  invited_by UUID NOT NULL REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_org ON invitations(organization_id);

-- ============================================
-- 5. SHIFTS TABLE
-- ============================================
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  break_duration_minutes INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CHECK (end_time > start_time)
);

CREATE INDEX idx_shifts_employee ON shifts(employee_id, start_time);
CREATE INDEX idx_shifts_org ON shifts(organization_id, start_time);
CREATE INDEX idx_shifts_location ON shifts(location_id);

-- ============================================
-- 6. TIME OFF REQUESTS TABLE
-- ============================================
CREATE TABLE time_off_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  type VARCHAR(50) DEFAULT 'vacation' CHECK (type IN ('vacation', 'sick', 'personal', 'other')),
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  CHECK (end_date >= start_date)
);

CREATE INDEX idx_timeoff_employee ON time_off_requests(employee_id);
CREATE INDEX idx_timeoff_status ON time_off_requests(status, organization_id);

-- ============================================
-- 7. SCHEDULE SWAPS TABLE
-- ============================================
CREATE TABLE schedule_swaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  responder_id UUID REFERENCES users(id),
  requester_shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  responder_shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'approved', 'rejected', 'cancelled')),
  message TEXT,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_swaps_requester ON schedule_swaps(requester_id);
CREATE INDEX idx_swaps_status ON schedule_swaps(status);

-- ============================================
-- 8. ATTENDANCE TABLE
-- ============================================
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
  clock_in TIMESTAMP NOT NULL,
  clock_out TIMESTAMP,
  location_id UUID REFERENCES locations(id),
  hours_worked DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN clock_out IS NOT NULL 
      THEN EXTRACT(EPOCH FROM (clock_out - clock_in)) / 3600.0
      ELSE NULL
    END
  ) STORED,
  break_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attendance_employee ON attendance(employee_id, clock_in);
CREATE INDEX idx_attendance_date ON attendance(clock_in);
CREATE INDEX idx_attendance_org ON attendance(organization_id, clock_in);

-- ============================================
-- 9. USER LOCATIONS TABLE (Many-to-Many)
-- ============================================
CREATE TABLE user_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, location_id)
);

CREATE INDEX idx_user_locations_user ON user_locations(user_id);
CREATE INDEX idx_user_locations_location ON user_locations(location_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_off_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_swaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTION: Get user's organization_id
-- ============================================
CREATE OR REPLACE FUNCTION get_user_organization_id(user_uuid UUID)
RETURNS UUID 
LANGUAGE sql 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM users WHERE id = user_uuid;
$$;

-- ============================================
-- HELPER FUNCTION: Get user's role
-- ============================================
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS VARCHAR(20)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM users WHERE id = user_uuid;
$$;

-- ============================================
-- ORGANIZATIONS POLICIES
-- ============================================
-- Users can view their own organization
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Only managers can update their organization
CREATE POLICY "Managers can update their organization"
  ON organizations FOR UPDATE
  USING (
    id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- ============================================
-- LOCATIONS POLICIES
-- ============================================
-- Users can view locations in their organization
CREATE POLICY "Users can view locations in their organization"
  ON locations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Only managers can manage locations
CREATE POLICY "Managers can manage locations"
  ON locations FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- ============================================
-- USERS POLICIES
-- ============================================
-- Users can view all users in their organization
-- AND users can always view their own profile (even if they don't have organization_id yet)
-- Use SECURITY DEFINER function to avoid infinite recursion in RLS policy
CREATE POLICY "Users can view team members"
  ON users FOR SELECT
  USING (
    -- Allow users to view their own record (needed for initial profile fetch)
    id = auth.uid()
    OR
    -- Allow users to view other users in their organization
    -- Use helper function (SECURITY DEFINER) to avoid circular RLS check
    organization_id = get_user_organization_id(auth.uid())
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- Managers can insert new users (for invitations)
CREATE POLICY "Managers can create users"
  ON users FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- ============================================
-- INVITATIONS POLICIES
-- ============================================
-- Managers can view invitations for their organization
CREATE POLICY "Managers can view invitations"
  ON invitations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Managers can create invitations
CREATE POLICY "Managers can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Anyone can view invitation by token (for accept-invite page)
CREATE POLICY "Anyone can view invitation by token"
  ON invitations FOR SELECT
  USING (true); -- Token validation happens in application code

-- Managers can update invitations
CREATE POLICY "Managers can update invitations"
  ON invitations FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- ============================================
-- SHIFTS POLICIES
-- ============================================
-- All users can view shifts in their organization
CREATE POLICY "Users can view shifts in their organization"
  ON shifts FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Only managers can create/edit/delete shifts
CREATE POLICY "Managers can manage shifts"
  ON shifts FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- ============================================
-- TIME OFF REQUESTS POLICIES
-- ============================================
-- Employees can view their own requests
CREATE POLICY "Employees can view own requests"
  ON time_off_requests FOR SELECT
  USING (
    employee_id = auth.uid() OR
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid() AND role IN ('manager', 'hr')
    )
  );

-- Employees can create their own requests
CREATE POLICY "Employees can create requests"
  ON time_off_requests FOR INSERT
  WITH CHECK (employee_id = auth.uid());

-- Managers can update requests (approve/reject)
CREATE POLICY "Managers can update requests"
  ON time_off_requests FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- ============================================
-- SCHEDULE SWAPS POLICIES
-- ============================================
-- Users can view swaps in their organization
CREATE POLICY "Users can view swaps in organization"
  ON schedule_swaps FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Employees can create swap requests
CREATE POLICY "Employees can create swaps"
  ON schedule_swaps FOR INSERT
  WITH CHECK (requester_id = auth.uid());

-- Employees can update their own swaps (accept/cancel)
CREATE POLICY "Employees can update own swaps"
  ON schedule_swaps FOR UPDATE
  USING (
    requester_id = auth.uid() OR responder_id = auth.uid()
  );

-- Managers can approve swaps
CREATE POLICY "Managers can approve swaps"
  ON schedule_swaps FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- ============================================
-- ATTENDANCE POLICIES
-- ============================================
-- Employees can view their own attendance
CREATE POLICY "Employees can view own attendance"
  ON attendance FOR SELECT
  USING (
    employee_id = auth.uid() OR
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid() AND role IN ('manager', 'hr')
    )
  );

-- Employees can create their own clock-in records
CREATE POLICY "Employees can clock in"
  ON attendance FOR INSERT
  WITH CHECK (employee_id = auth.uid());

-- Employees can update their own clock-out
CREATE POLICY "Employees can clock out"
  ON attendance FOR UPDATE
  USING (employee_id = auth.uid());

-- ============================================
-- USER LOCATIONS POLICIES
-- ============================================
-- Users can view user_locations in their organization
CREATE POLICY "Users can view user locations"
  ON user_locations FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users 
      WHERE organization_id IN (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Managers can manage user locations
CREATE POLICY "Managers can manage user locations"
  ON user_locations FOR ALL
  USING (
    user_id IN (
      SELECT id FROM users 
      WHERE organization_id IN (
        SELECT organization_id FROM users 
        WHERE id = auth.uid() AND role = 'manager'
      )
    )
  );

-- ============================================
-- COMPLETE SIGNUP FUNCTION
-- ============================================
-- This function creates both organization and user in a single transaction
-- It bypasses RLS, so it works even with React StrictMode causing AbortErrors
-- ============================================

-- Drop function if exists
DROP FUNCTION IF EXISTS create_organization_and_user(
  p_user_id UUID,
  p_user_email VARCHAR(255),
  p_user_full_name VARCHAR(255),
  p_org_name VARCHAR(255),
  p_org_industry VARCHAR(100),
  p_org_work_type VARCHAR(20),
  p_org_plan VARCHAR(20)
);

-- Create function that creates both organization and user
CREATE OR REPLACE FUNCTION create_organization_and_user(
  p_user_id UUID,
  p_user_email VARCHAR(255),
  p_user_full_name VARCHAR(255),
  p_org_name VARCHAR(255),
  p_org_industry VARCHAR(100),
  p_org_work_type VARCHAR(20),
  p_org_plan VARCHAR(20)
)
RETURNS TABLE(organization_id UUID, user_created BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
  user_exists BOOLEAN;
  existing_org_id UUID;
BEGIN
  -- Check if user already exists and has an organization_id
  SELECT organization_id INTO existing_org_id
  FROM users 
  WHERE id = p_user_id;
  
  -- If user already has an organization, return it (don't create a new one)
  IF existing_org_id IS NOT NULL THEN
    RETURN QUERY SELECT existing_org_id, false;
    RETURN;
  END IF;
  
  -- User doesn't have an organization yet, create one
  -- Generate organization ID
  new_org_id := gen_random_uuid();
  
  -- Create organization (bypasses RLS because of SECURITY DEFINER)
  INSERT INTO organizations (id, name, industry, work_type, plan)
  VALUES (new_org_id, p_org_name, p_org_industry, p_org_work_type, p_org_plan);
  
  -- Check if user already exists
  SELECT EXISTS(SELECT 1 FROM users WHERE id = p_user_id) INTO user_exists;
  
  -- Create or update user record (bypasses RLS because of SECURITY DEFINER)
  IF user_exists THEN
    UPDATE users 
    SET 
      email = p_user_email,
      full_name = p_user_full_name,
      role = 'manager',
      organization_id = new_org_id,
      updated_at = NOW()
    WHERE id = p_user_id;
  ELSE
    INSERT INTO users (id, email, full_name, role, organization_id)
    VALUES (p_user_id, p_user_email, p_user_full_name, 'manager', new_org_id);
  END IF;
  
  -- Return the organization ID and whether user was created (not updated)
  RETURN QUERY SELECT new_org_id, NOT user_exists;
END;
$$;

-- Grant execute permission to authenticated role
GRANT EXECUTE ON FUNCTION create_organization_and_user TO authenticated;

-- Add comment
COMMENT ON FUNCTION create_organization_and_user IS 'Creates organization and user in a single transaction, bypassing RLS. Used for complete signup flow.';

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your database is now ready!
-- Next steps:
-- 1. Test signup flow
-- 2. Test authentication
-- 3. Build dashboard components
-- ============================================
