-- Function to create user profile from invitation token
-- This allows creating the user profile without needing a session token
-- The invitation token is used as verification instead
-- SECURITY DEFINER bypasses RLS, so we can insert the user profile even if email isn't confirmed yet

CREATE OR REPLACE FUNCTION create_user_from_invitation(
  p_invitation_token VARCHAR(255),
  p_user_id UUID,
  p_full_name VARCHAR(255)
)
RETURNS TABLE (
  user_created BOOLEAN,
  invitation_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitation invitations%ROWTYPE;
  v_invitation_id UUID;
BEGIN
  -- Find the invitation by token (must be unaccepted)
  SELECT * INTO v_invitation
  FROM invitations
  WHERE token = p_invitation_token
    AND accepted_at IS NULL
    AND expires_at > NOW();

  -- Check if invitation exists and is valid
  IF v_invitation IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired invitation token';
  END IF;

  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
    -- User already exists, just mark invitation as accepted
    UPDATE invitations
    SET accepted_at = NOW()
    WHERE id = v_invitation.id;

    RETURN QUERY SELECT false, v_invitation.id;
    RETURN;
  END IF;

  -- Create user profile
  INSERT INTO users (
    id,
    email,
    full_name,
    role,
    job_title,
    team_id,
    team_name,
    organization_id,
    invited_by,
    invited_at,
    joined_at,
    is_active
  ) VALUES (
    p_user_id,
    v_invitation.email,
    p_full_name,
    v_invitation.role,
    v_invitation.job_title,
    v_invitation.team_id,
    v_invitation.team_name,
    v_invitation.organization_id,
    v_invitation.invited_by,
    v_invitation.created_at,
    NOW(),
    true
  );

  -- Mark invitation as accepted
  UPDATE invitations
  SET accepted_at = NOW()
  WHERE id = v_invitation.id;

  RETURN QUERY SELECT true, v_invitation.id;
END;
$$;

-- Grant execute permission to authenticated users (but function uses SECURITY DEFINER, so it will run with elevated privileges)
GRANT EXECUTE ON FUNCTION create_user_from_invitation TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_from_invitation TO anon;
