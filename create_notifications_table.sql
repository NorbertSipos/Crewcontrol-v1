-- ============================================
-- Notifications Table
-- ============================================
-- This table stores all in-app notifications
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'invitation', 'shift_assigned', 'shift_updated', 'shift_cancelled', 'leave_request', 'leave_approved', 'leave_rejected', 'system', 'team_update', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT, -- URL to navigate when notification is clicked
  metadata JSONB, -- Additional data (e.g., shift_id, invitation_id, etc.)
  is_read BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false, -- Track if email notification was sent
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP,
  
  -- Index common queries
  CONSTRAINT notifications_type_check CHECK (type IN (
    'invitation', 
    'shift_assigned', 
    'shift_updated', 
    'shift_cancelled', 
    'leave_request', 
    'leave_approved', 
    'leave_rejected', 
    'system', 
    'team_update',
    'schedule_change',
    'new_team_member',
    'reminder'
  ))
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_org ON notifications(organization_id, created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- System can create notifications (via service role or Edge Functions)
-- For now, we'll allow users in the same organization to create notifications
-- In production, this should be restricted to Edge Functions with service role
CREATE POLICY "Users can create notifications in their organization"
  ON notifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.organization_id = notifications.organization_id
    )
  );

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- Notification Preferences Table
-- ============================================
-- Stores user preferences for notification types
-- ============================================

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Email preferences (true = send email, false = in-app only)
  email_invitation BOOLEAN DEFAULT true,
  email_shift_assigned BOOLEAN DEFAULT true,
  email_shift_updated BOOLEAN DEFAULT true,
  email_shift_cancelled BOOLEAN DEFAULT true,
  email_leave_request BOOLEAN DEFAULT true,
  email_leave_approved BOOLEAN DEFAULT true,
  email_leave_rejected BOOLEAN DEFAULT true,
  email_system BOOLEAN DEFAULT true,
  email_team_update BOOLEAN DEFAULT true,
  email_schedule_change BOOLEAN DEFAULT true,
  email_new_team_member BOOLEAN DEFAULT true,
  email_reminder BOOLEAN DEFAULT false,
  
  -- In-app preferences (true = show notification, false = hide)
  in_app_invitation BOOLEAN DEFAULT true,
  in_app_shift_assigned BOOLEAN DEFAULT true,
  in_app_shift_updated BOOLEAN DEFAULT true,
  in_app_shift_cancelled BOOLEAN DEFAULT true,
  in_app_leave_request BOOLEAN DEFAULT true,
  in_app_leave_approved BOOLEAN DEFAULT true,
  in_app_leave_rejected BOOLEAN DEFAULT true,
  in_app_system BOOLEAN DEFAULT true,
  in_app_team_update BOOLEAN DEFAULT true,
  in_app_schedule_change BOOLEAN DEFAULT true,
  in_app_new_team_member BOOLEAN DEFAULT true,
  in_app_reminder BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notification_preferences_user ON notification_preferences(user_id);
CREATE INDEX idx_notification_preferences_org ON notification_preferences(organization_id);

-- RLS Policies
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view their own preferences
CREATE POLICY "Users can view their own notification preferences"
  ON notification_preferences FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own preferences
CREATE POLICY "Users can create their own notification preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own preferences
CREATE POLICY "Users can update their own notification preferences"
  ON notification_preferences FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Function to create default notification preferences for new users
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id, organization_id)
  VALUES (NEW.id, NEW.organization_id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create preferences when user is created
CREATE TRIGGER trigger_create_notification_preferences
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_preferences();
