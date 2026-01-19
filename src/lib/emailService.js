// Email service for sending invitation emails
// Supports multiple methods: Supabase Edge Function, Resend API, or fallback

/**
 * Send invitation email using Supabase's built-in invite system
 * @param {Object} params - Email parameters
 * @param {string} params.email - Recipient email
 * @param {string} params.invitationUrl - Invitation acceptance URL
 * @param {string} params.organizationId - Organization ID (UUID)
 * @param {string} params.organizationName - Organization name
 * @param {string} params.role - User role (employee/hr)
 * @param {string} params.jobTitle - Job title (optional)
 * @param {string} params.teamName - Team name (optional)
 * @param {string} params.invitedBy - User ID who sent the invitation
 * @param {string} params.token - Invitation token
 * @param {string} params.expiresAt - Expiration date (ISO string)
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function sendInvitationEmail({ 
  email, 
  invitationUrl, 
  organizationId,
  organizationName, 
  role, 
  jobTitle, 
  teamName,
  invitedBy,
  token,
  expiresAt
}) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;

  // Build email HTML
  const roleDisplay = role === 'employee' ? 'Employee' : 'HR';
  const jobTitleText = jobTitle ? ` • ${jobTitle}` : '';
  const teamText = teamName ? ` • Team: ${teamName}` : '';

  const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a">
<tr><td align="center" style="padding:40px 20px">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#1e293b;border-radius:24px;overflow:hidden">
<tr><td style="background:linear-gradient(135deg,rgba(168,85,247,0.1),rgba(99,102,241,0.1));padding:40px">
<div style="text-align:center;margin-bottom:32px">
<div style="width:64px;height:64px;background:linear-gradient(135deg,#a855f7,#6366f1);border-radius:16px;display:inline-block;line-height:64px;color:#fff;font-size:32px;font-weight:bold">C</div>
<h1 style="margin:24px 0 0;color:#fff;font-size:32px;font-weight:900">CrewControl</h1>
</div>
<h2 style="margin:0 0 16px;color:#fff;font-size:28px;font-weight:800;text-align:center">You've Been Invited!</h2>
<p style="margin:0 0 24px;color:#cbd5e1;font-size:16px;line-height:1.6;text-align:center">
You've been invited to join <strong style="color:#fff">${organizationName}</strong> on CrewControl as <strong style="color:#fff">${roleDisplay}${jobTitleText}${teamText}</strong>.
</p>
<div style="background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.3);border-radius:12px;padding:20px;margin-bottom:32px">
<p style="margin:0 0 8px;color:#cbd5e1;font-size:14px"><strong style="color:#a855f7">📧 Email:</strong> <span style="color:#fff">${email}</span></p>
<p style="margin:0 0 8px;color:#cbd5e1;font-size:14px"><strong style="color:#a855f7">🏢 Organization:</strong> <span style="color:#fff">${organizationName}</span></p>
<p style="margin:0;color:#cbd5e1;font-size:14px"><strong style="color:#a855f7">👤 Role:</strong> <span style="color:#fff">${roleDisplay}${jobTitleText}${teamText}</span></p>
</div>
<div style="text-align:center;margin-bottom:32px">
<a href="${invitationUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#a855f7,#6366f1);color:#fff;text-decoration:none;border-radius:12px;font-weight:700;font-size:16px;box-shadow:0 8px 24px rgba(168,85,247,0.4)">Accept Invitation</a>
</div>
<p style="margin:0 0 32px;color:#94a3b8;font-size:14px;text-align:center">
Or copy and paste this link:<br>
<a href="${invitationUrl}" style="color:#a855f7;text-decoration:underline;word-break:break-all">${invitationUrl}</a>
</p>
<div style="background:rgba(168,85,247,0.1);border-left:3px solid #a855f7;padding:16px;border-radius:8px">
<p style="margin:0;color:#cbd5e1;font-size:13px"><strong style="color:#a855f7">🔒 Security Note:</strong> This invitation link will expire in 7 days.</p>
</div>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
  `;

  // Method 1: Try Supabase Edge Function (uses Supabase's built-in invite system)
  if (supabaseUrl) {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/send-invitation-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email,
          invitationUrl,
          organizationId,
          organizationName,
          role,
          jobTitle: jobTitle || null,
          teamName: teamName || null,
          invitedBy,
          token,
          expiresAt
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return { success: true, message: data.message || 'Invitation email sent successfully!' };
        } else {
          // Edge Function succeeded but email sending failed
          return { 
            success: false, 
            error: data.error || 'Failed to send email',
            fallbackUrl: data.fallbackUrl || invitationUrl
          };
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Edge Function returned an error');
      }
    } catch (error) {
      console.log('Edge Function not available or failed, trying alternative method...', error);
      // Fall through to Resend or fallback
    }
  }

  // Method 2: Try Resend API directly (if API key is configured)
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'CrewControl <invitations@crewcontrol.com>',
          to: email,
          subject: `You've been invited to join ${organizationName} on CrewControl`,
          html: emailHtml,
        }),
      });

      if (response.ok) {
        return { success: true, message: 'Invitation email sent successfully!' };
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send email via Resend');
      }
    } catch (error) {
      console.error('Resend API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email. Please check your Resend API key configuration.',
      };
    }
  }

  // Method 3: Fallback - email service not configured
  return {
    success: false,
    error: 'Email service not configured. Please deploy the Supabase Edge Function. See EMAIL_SERVICE_SETUP.md for instructions.',
    fallbackUrl: invitationUrl
  };
}
