// Supabase Edge Function to send invitation emails using Supabase's built-in invite system
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Receive invitation data from frontend
    const { 
      email, 
      invitationUrl, // Our custom token URL: /accept-invite?token=xxx
      organizationId,
      organizationName, 
      role, 
      jobTitle, 
      teamName,
      invitedBy,
      token, // Our custom token for the invitations table
      expiresAt
    } = await req.json()

    // Validate required fields
    if (!email || !organizationId || !role || !token || !invitationUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, organizationId, role, token, invitationUrl' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase configuration missing' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // First, create invitation in our invitations table
    // This ensures we have a record even if Supabase invite fails
    const { data: invitationData, error: invitationError } = await supabase
      .from('invitations')
      .insert({
        email,
        organization_id: organizationId,
        role,
        job_title: jobTitle || null,
        team_id: null, // TODO: Pass team_id if available
        team_name: teamName || null,
        invited_by: invitedBy,
        token,
        expires_at: expiresAt
      })
      .select()
      .single()

    if (invitationError) {
      console.error('Error creating invitation:', invitationError)
      return new Response(
        JSON.stringify({ error: 'Failed to create invitation: ' + invitationError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Use Supabase's built-in inviteUserByEmail
    // This will send the email using Supabase's invite template
    // The redirectTo will point to our accept-invite page with our custom token
    const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: invitationUrl, // Our custom URL with token: /accept-invite?token=xxx
        data: {
          organization_id: organizationId,
          organization_name: organizationName || 'your organization',
          role: role,
          job_title: jobTitle || null,
          team_name: teamName || null,
          invitation_token: token // Store our token in metadata for reference
        }
      }
    )

    if (inviteError) {
      console.error('Error sending Supabase invite:', inviteError)
      // If Supabase invite fails, we still have the invitation in our table
      // The frontend can show the link as fallback
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to send invitation email: ' + inviteError.message,
          invitationCreated: true,
          fallbackUrl: invitationUrl
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation email sent using Supabase invite system',
        invitationId: invitationData.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-invitation-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send invitation email' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
