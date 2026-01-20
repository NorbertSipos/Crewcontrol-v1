-- Fix RLS Policy for Notifications
-- This allows managers and HR to create notifications for employees in their organization

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can create notifications in their organization" ON notifications;

-- Create a better policy that allows:
-- 1. Users to create notifications for themselves
-- 2. Managers/HR to create notifications for users in their organization
-- 3. Verifies both the creator and target user are in the same organization
CREATE POLICY "Users can create notifications in their organization"
  ON notifications FOR INSERT
  WITH CHECK (
    -- Allow if creating notification for yourself
    (user_id = auth.uid() AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.organization_id = notifications.organization_id
    ))
    OR
    -- Allow if you're a manager/HR and the target user is in your organization
    (
      EXISTS (
        SELECT 1 FROM users AS creator
        WHERE creator.id = auth.uid()
        AND creator.organization_id = notifications.organization_id
        AND creator.role IN ('manager', 'hr', 'admin')
      )
      AND
      EXISTS (
        SELECT 1 FROM users AS target
        WHERE target.id = notifications.user_id
        AND target.organization_id = notifications.organization_id
      )
    )
  );
