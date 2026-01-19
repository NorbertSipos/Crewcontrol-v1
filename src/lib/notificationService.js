// Notification Service
// Handles creating and sending notifications (in-app and email)

import { supabase } from './supabase';

/**
 * Create a notification in the database
 * @param {Object} params - Notification parameters
 * @param {string} params.userId - User ID to notify
 * @param {string} params.organizationId - Organization ID
 * @param {string} params.type - Notification type
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message
 * @param {string} params.actionUrl - Optional URL to navigate to
 * @param {Object} params.metadata - Optional metadata object
 * @returns {Promise<{success: boolean, notificationId?: string, error?: string}>}
 */
export async function createNotification({
  userId,
  organizationId,
  type,
  title,
  message,
  actionUrl = null,
  metadata = null
}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      return { success: false, error: 'No access token' };
    }

    // Check user's notification preferences
    const preferences = await getUserNotificationPreferences(userId);
    
    // Check if in-app notification is enabled
    const inAppKey = `in_app_${type}`;
    const emailKey = `email_${type}`;
    
    const shouldCreateInApp = preferences?.[inAppKey] !== false; // Default to true if preferences don't exist
    const shouldSendEmail = preferences?.[emailKey] !== false; // Default to true if preferences don't exist

    // Create in-app notification if enabled
    if (shouldCreateInApp) {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/notifications`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            user_id: userId,
            organization_id: organizationId,
            type,
            title,
            message,
            action_url: actionUrl,
            metadata: metadata ? JSON.stringify(metadata) : null,
            is_read: false,
            email_sent: false
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error creating notification:', errorText);
        return { success: false, error: 'Failed to create notification' };
      }

      const notificationData = await response.json();
      const notificationId = notificationData[0]?.id;

      // Send email notification if enabled
      if (shouldSendEmail) {
        await sendEmailNotification({
          userId,
          type,
          title,
          message,
          actionUrl,
          metadata
        }).catch(err => {
          console.error('Error sending email notification:', err);
          // Don't fail the whole operation if email fails
        });
      }

      return { success: true, notificationId };
    }

    // If only email is enabled, send email without creating in-app notification
    if (shouldSendEmail) {
      await sendEmailNotification({
        userId,
        type,
        title,
        message,
        actionUrl,
        metadata
      }).catch(err => {
        console.error('Error sending email notification:', err);
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message || 'Failed to create notification' };
  }
}

/**
 * Get user's notification preferences
 */
async function getUserNotificationPreferences(userId) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) return null;

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/notification_preferences?user_id=eq.${userId}&select=*`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data[0] || null;
    }

    return null;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return null;
  }
}

/**
 * Send email notification via Edge Function
 */
async function sendEmailNotification({ userId, type, title, message, actionUrl, metadata }) {
  try {
    // Get user email
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) return;

    const userResponse = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=email,full_name`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!userResponse.ok) return;

    const userData = await userResponse.json();
    if (!userData || userData.length === 0) return;

    const userEmail = userData[0].email;
    const userName = userData[0].full_name || 'there';

    // Call Edge Function to send email
    const emailResponse = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          email: userEmail,
          userName,
          type,
          title,
          message,
          actionUrl,
          metadata
        })
      }
    );

    if (emailResponse.ok) {
      // Mark notification as email_sent
      // This would be done in the Edge Function or here
      return { success: true };
    }

    return { success: false };
  } catch (error) {
    console.error('Error sending email notification:', error);
    return { success: false };
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      return { success: false, error: 'No access token' };
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/notifications?id=eq.${notificationId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          is_read: true,
          read_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      return { success: false, error: 'No access token' };
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/notifications?user_id=eq.${userId}&is_read=eq.false`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          is_read: true,
          read_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      return { success: false, error: 'No access token' };
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/notifications?id=eq.${notificationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get notifications for a user
 */
export async function getUserNotifications(userId, limit = 50, offset = 0) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      return { success: false, error: 'No access token', notifications: [] };
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/notifications?user_id=eq.${userId}&select=*&order=created_at.desc&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText, notifications: [] };
    }

    const notifications = await response.json();
    
    // Parse metadata JSON strings
    const parsedNotifications = notifications.map(notif => ({
      ...notif,
      metadata: notif.metadata ? (typeof notif.metadata === 'string' ? JSON.parse(notif.metadata) : notif.metadata) : null
    }));

    return { success: true, notifications: parsedNotifications };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false, error: error.message, notifications: [] };
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(userId) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      return { success: false, count: 0 };
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/notifications?user_id=eq.${userId}&is_read=eq.false&select=id`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Prefer': 'count=exact'
        }
      }
    );

    if (!response.ok) {
      return { success: false, count: 0 };
    }

    const count = response.headers.get('content-range')?.split('/')[1] || '0';
    return { success: true, count: parseInt(count) || 0 };
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return { success: false, count: 0 };
  }
}
