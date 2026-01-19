# Notification System Setup Guide

## Overview

The notification system provides both in-app and email notifications for important events in your HR dashboard. It's fully integrated with your existing SMTP configuration.

---

## Database Setup

### Step 1: Create Notifications Tables

Run the SQL migration file in your Supabase SQL Editor:

```sql
-- Run: create_notifications_table.sql
```

This creates:
- `notifications` table - Stores all in-app notifications
- `notification_preferences` table - Stores user notification preferences
- RLS policies for security
- Auto-creation trigger for default preferences

### Step 2: Verify Tables Created

1. Go to Supabase Dashboard → Table Editor
2. Verify you see:
   - `notifications` table
   - `notification_preferences` table

---

## Edge Function Setup

### Step 1: Deploy Email Notification Function

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Deploy the Edge Function**:
   ```bash
   supabase functions deploy send-notification-email
   ```

---

## How It Works

### Notification Flow

1. **Event Occurs** (e.g., shift assigned, invitation sent)
2. **Create Notification** → `createNotification()` is called
3. **Check Preferences** → System checks user's notification preferences
4. **Create In-App Notification** → If enabled, creates notification in database
5. **Send Email** → If email enabled, calls Edge Function to send email
6. **User Sees Notification** → Bell icon shows unread count, user can view in Notification Center

### Notification Types

- `invitation` - User invitations
- `shift_assigned` - New shift assignments
- `shift_updated` - Shift time/location changes
- `shift_cancelled` - Shift cancellations
- `leave_request` - Leave/time-off requests
- `leave_approved` - Leave request approvals
- `leave_rejected` - Leave request rejections
- `system` - System notifications
- `team_update` - Team changes
- `schedule_change` - Schedule modifications
- `new_team_member` - New team member joined
- `reminder` - Reminders and alerts

---

## Features

### ✅ In-App Notifications
- Real-time notification center (slides in from right)
- Unread count badge on bell icon
- Filter by "All" or "Unread"
- Mark as read / Mark all as read
- Delete notifications
- Click to navigate to related page
- Auto-refresh every 30 seconds

### ✅ Email Notifications
- Respects user preferences
- Beautiful HTML email templates
- Action buttons with links
- Uses your configured SMTP

### ✅ Notification Preferences
- Granular control per notification type
- Separate settings for email vs in-app
- Accessible from Settings page
- Defaults to "enabled" for all types

---

## Integration Points

### Invitation Notifications
- **Location**: `src/components/Team.jsx`
- **Trigger**: When manager sends invitation
- **Notification**: Confirmation to manager

### Shift Notifications
- **Location**: `src/components/Dashboard.jsx`
- **Triggers**:
  - When shift is created (`handleShiftSubmit`)
  - When shift is copied via drag-and-drop (`handleDrop`)
- **Notification**: Sent to assigned employee

### Future Integration Points
- Leave requests (when implemented)
- Schedule changes
- Team updates
- System alerts

---

## User Experience

### Notification Bell
- Located in DashboardLayout header
- Shows unread count badge
- Click to open Notification Center

### Notification Center
- Slides in from right side
- Shows all notifications with icons
- Color-coded by type
- Time-relative display ("2h ago", "Just now")
- Click notification to navigate
- Mark as read / Delete options

### Settings
- Notification Preferences section
- Toggle email/in-app per notification type
- Changes save automatically

---

## Testing

### Test In-App Notifications

1. **As Manager**: Invite a team member
   - Check notification appears in your Notification Center
   - Verify unread count increases

2. **As Manager**: Assign a shift to an employee
   - Check employee receives notification
   - Verify notification appears in their Notification Center

3. **As Employee**: Check Notification Center
   - Click bell icon
   - View notifications
   - Mark as read
   - Delete notification

### Test Email Notifications

1. **Check Preferences**: Go to Settings → Notification Preferences
2. **Enable Email**: Ensure email notifications are enabled
3. **Trigger Event**: Create a shift or send invitation
4. **Check Email**: Verify email arrives (check spam folder)

---

## Troubleshooting

### Notifications Not Appearing

**Check:**
1. Database tables created? (Run SQL migration)
2. Notification preferences exist? (Auto-created on first load)
3. User has correct `organization_id`?
4. Browser console for errors?

### Email Notifications Not Sending

**Check:**
1. SMTP configured in Supabase Dashboard?
2. Edge Function deployed?
3. User's email preference enabled?
4. Edge Function logs in Supabase Dashboard

### Notification Center Not Opening

**Check:**
1. NotificationContext provider in `main.jsx`?
2. Bell icon click handler in DashboardLayout?
3. Browser console for errors?

---

## Customization

### Add New Notification Types

1. **Update Database**:
   - Add new type to `notifications` table CHECK constraint
   - Add preference columns to `notification_preferences` table

2. **Update Code**:
   - Add type to `notificationService.js`
   - Add icon mapping in `NotificationCenter.jsx`
   - Add preference UI in `Settings.jsx`

### Customize Email Templates

Edit `supabase/functions/send-notification-email/index.ts` to customize email HTML.

---

## Next Steps

1. ✅ Run database migration (`create_notifications_table.sql`)
2. ✅ Deploy Edge Function (`supabase functions deploy send-notification-email`)
3. ✅ Test invitation notifications
4. ✅ Test shift assignment notifications
5. ✅ Configure notification preferences
6. ✅ Test email notifications

---

## Production Considerations

- **Rate Limiting**: Consider rate limiting for email notifications
- **Email Queue**: For high volume, consider implementing a queue system
- **Real-time Updates**: Consider WebSockets for instant notifications (currently polling every 30s)
- **Notification Retention**: Consider auto-deleting old notifications (e.g., after 30 days)

---

**Note**: The notification system uses your existing SMTP configuration. No additional email service setup needed! 🎉
