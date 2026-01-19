// Supabase Edge Function to send notification emails
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
    // Receive notification email data
    const { 
      email,
      userName,
      type,
      title,
      message,
      actionUrl,
      metadata
    } = await req.json()

    // Validate required fields
    if (!email || !title || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, title, message' }),
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

    // Build email HTML based on notification type
    const baseUrl = actionUrl ? `${supabaseUrl.replace('/rest/v1', '')}${actionUrl}` : null;
    const actionButton = baseUrl ? `
      <div style="text-align:center;margin-bottom:32px">
        <a href="${baseUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#a855f7,#6366f1);color:#fff;text-decoration:none;border-radius:12px;font-weight:700;font-size:16px;box-shadow:0 8px 24px rgba(168,85,247,0.4)">View Details</a>
      </div>
    ` : '';

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
<h2 style="margin:0 0 16px;color:#fff;font-size:28px;font-weight:800;text-align:center">${title}</h2>
<p style="margin:0 0 24px;color:#cbd5e1;font-size:16px;line-height:1.6;text-align:center">
Hi ${userName || 'there'},
</p>
<div style="background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.3);border-radius:12px;padding:20px;margin-bottom:32px">
<p style="margin:0;color:#cbd5e1;font-size:16px;line-height:1.6">${message}</p>
</div>
${actionButton}
${baseUrl ? `<p style="margin:0 0 32px;color:#94a3b8;font-size:14px;text-align:center">
Or copy and paste this link:<br>
<a href="${baseUrl}" style="color:#a855f7;text-decoration:underline;word-break:break-all">${baseUrl}</a>
</p>` : ''}
<div style="background:rgba(168,85,247,0.1);border-left:3px solid #a855f7;padding:16px;border-radius:8px">
<p style="margin:0;color:#cbd5e1;font-size:13px"><strong style="color:#a855f7">ℹ️ Notification:</strong> This is an automated notification from CrewControl.</p>
</div>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
    `;

    // Send email using SMTP (requires SMTP to be configured in Supabase Dashboard)
    // For production, consider using Resend, SendGrid, or AWS SES APIs
    // For now, we'll use a simple approach that works with Supabase's SMTP
    
    // Note: Supabase Edge Functions can use SMTP on port 465 with TLS
    // You can use denomailer library: https://deno.land/x/denomailer
    
    // For simplicity, we'll log the email and return success
    // In production, implement actual SMTP sending here
    console.log('Notification email prepared:', {
      to: email,
      subject: title,
      type
    });
    
    // TODO: Implement actual email sending using:
    // - denomailer for SMTP (port 465)
    // - Resend API
    // - SendGrid API
    // - AWS SES API
    // Or use Supabase's built-in email system if available
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification email prepared (implement SMTP sending for production)'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-notification-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send notification email' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
