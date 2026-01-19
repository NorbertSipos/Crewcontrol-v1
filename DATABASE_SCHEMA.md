# CrewControl Database Schema

## Overview
CrewControl is a B2B SaaS platform with three user roles: **Manager**, **Employee**, and **HR**. The system supports both remote and on-site work configurations.

---

## User Roles & Permissions

### 1. Manager (Owner/Admin)
- **First user** to create an organization
- Full control: schedules, employees, settings
- Can invite employees and HR users
- Creates and manages shifts
- Approves/rejects time-off requests and schedule swaps

### 2. Employee
- **Invited by Manager** via email
- Views team schedule (to see who they're working with)
- Views all employees in their organization
- Requests time off
- Requests schedule swaps with colleagues
- Clocks in/out (if enabled)

### 3. HR (Human Resources)
- **Invited by Manager** via email
- Views attendance and hours data
- Can view all employees' worked hours
- Reports: daily, weekly, monthly
- No scheduling permissions (read-only for attendance)

---

## Database Tables

### 1. `organizations`
Primary company/tenant table.

```sql
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
```

**Key Fields:**
- `work_type`: Determines if locations/sites are needed
- `plan`: Billing tier (affects features)

---

### 2. `locations`
**Only for on-site/hybrid organizations.**

```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL, -- "Site A", "Construction Site Downtown", etc.
  address TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_locations_org ON locations(organization_id);
```

**Usage:**
- Construction: "Site A", "Site B"
- Restaurants: "Downtown Location", "Airport Branch"
- Remote orgs: This table is empty/not used

---

### 3. `users`
All people in the system (managers, employees, HR).

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY, -- Matches Supabase Auth UUID
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(20) NOT NULL CHECK (role IN ('manager', 'employee', 'hr')),
  job_title VARCHAR(100), -- "UI Designer", "Software Developer", "Project Lead", etc. (NULL for manager/hr)
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL, -- Primary team assignment
  team_name VARCHAR(255), -- Legacy field for backward compatibility
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
CREATE INDEX idx_users_job_title ON users(job_title, organization_id); -- For filtering
CREATE INDEX idx_users_team_id ON users(team_id, organization_id);
```

**Role Logic:**
- First user in organization = `manager` (no `job_title` needed)
- Invited users default to `employee` (unless manager specifies `hr`)
- `job_title` is required for employees (used for dashboard filtering)
- HR users may or may not have `job_title`

**Job Title Examples:**
- "UI Designer"
- "Software Developer"
- "Senior Developer"
- "Project Lead"
- "Restaurant Manager"
- "Barista"
- "Construction Worker"
- "Warehouse Associate"
- etc.

---

### 4. `teams`
Team definitions within organizations.

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, name)
);

CREATE INDEX idx_teams_org ON teams(organization_id);
CREATE INDEX idx_teams_active ON teams(organization_id, is_active);
```

**Usage:**
- Managers create teams to organize employees
- Teams can be assigned to employees during invitation
- Used for filtering and organizing schedules
- Teams can be deactivated without deleting

---

### 5. `invitations`
Pending email invitations.

```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('employee', 'hr')),
  job_title VARCHAR(100), -- For employees
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  team_name VARCHAR(255), -- Legacy field for backward compatibility
  invited_by UUID NOT NULL REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_org ON invitations(organization_id);
CREATE INDEX idx_invitations_team_id ON invitations(team_id);
```

**Flow:**
1. Manager creates invitation → row created (with optional `team_id` and `job_title`)
2. Email sent with token link
3. Employee clicks link → checks token
4. If valid → creates user account → `accepted_at` set

---

### 6. `schedule_templates`
Reusable shift templates for quick scheduling.

```sql
CREATE TABLE schedule_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  start_time TIME NOT NULL, -- e.g., '08:00:00' for 8 AM
  end_time TIME NOT NULL, -- e.g., '16:00:00' for 4 PM
  timezone VARCHAR(50) DEFAULT 'UTC',
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
```

**Usage:**
- Managers create reusable templates (e.g., "Morning Shift: 8 AM - 4 PM")
- Templates can be used to quickly create shifts
- Templates are organization-specific
- Supports timezone and break duration

---

### 7. `shifts`
Scheduled work periods.

```sql
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL, -- NULL for remote
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  break_duration_minutes INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES users(id), -- Manager who created it
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CHECK (end_time > start_time)
);

CREATE INDEX idx_shifts_employee ON shifts(employee_id, start_time);
CREATE INDEX idx_shifts_org ON shifts(organization_id, start_time);
CREATE INDEX idx_shifts_location ON shifts(location_id);
```

**Location Logic:**
- If organization `work_type = 'remote'`: `location_id = NULL`
- If `work_type = 'on-site'` or `'hybrid'`: `location_id` must be set

---

### 8. `time_off_requests`
Employee time-off requests.

```sql
CREATE TABLE time_off_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  type VARCHAR(50) DEFAULT 'vacation' CHECK (type IN ('vacation', 'sick', 'personal', 'other')),
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES users(id), -- Manager
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  CHECK (end_date >= start_date)
);

CREATE INDEX idx_timeoff_employee ON time_off_requests(employee_id);
CREATE INDEX idx_timeoff_status ON time_off_requests(status, organization_id);
```

---

### 9. `schedule_swaps`
Employee-initiated shift swaps.

```sql
CREATE TABLE schedule_swaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Employee requesting swap
  responder_id UUID REFERENCES users(id), -- Employee accepting (can be NULL initially)
  requester_shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  responder_shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL, -- Optional: swap specific shift
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'approved', 'rejected', 'cancelled')),
  message TEXT,
  approved_by UUID REFERENCES users(id), -- Manager (required for final approval)
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_swaps_requester ON schedule_swaps(requester_id);
CREATE INDEX idx_swaps_status ON schedule_swaps(status);
```

**Swap Flow:**
1. Employee A requests swap (offers their shift)
2. Employee B accepts (if specified) OR manager assigns
3. Manager approves → shifts are swapped

---

### 10. `attendance`
Clock-in/out records (for HR reports).

```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
  clock_in TIMESTAMP NOT NULL,
  clock_out TIMESTAMP,
  location_id UUID REFERENCES locations(id), -- For on-site: where they clocked in
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
```

**HR Dashboard Data:**
- Query by employee, date range, location
- Calculate total hours, overtime, etc.

---

### 11. `user_locations` (Many-to-Many)
Which employees work at which locations (for on-site orgs).

```sql
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
```

**Usage:**
- Employee can work at multiple sites
- One site marked as primary
- Used for filtering shifts and assignments

---

### 12. `user_teams` (Many-to-Many)
Which employees belong to which teams.

```sql
CREATE TABLE user_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, team_id)
);

CREATE INDEX idx_user_teams_user ON user_teams(user_id);
CREATE INDEX idx_user_teams_team ON user_teams(team_id);
```

**Usage:**
- Employees can belong to multiple teams
- One team marked as primary
- Used for team-based filtering and organization
- Note: `users.team_id` also exists for single-team assignment (legacy support)

---

### 13. `notifications`
In-app notifications for users.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT, -- URL to navigate when notification is clicked
  metadata JSONB, -- Additional data (e.g., shift_id, invitation_id, etc.)
  is_read BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false, -- Track if email notification was sent
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP,
  
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
```

**Notification Types:**
- `invitation` - User invitation sent/received
- `shift_assigned` - New shift assigned to employee
- `shift_updated` - Existing shift was modified
- `shift_cancelled` - Shift was cancelled
- `leave_request` - Time-off request submitted
- `leave_approved` - Time-off request approved
- `leave_rejected` - Time-off request rejected
- `system` - System-wide announcements
- `team_update` - Team membership changes
- `schedule_change` - Schedule modifications
- `new_team_member` - New member joined team
- `reminder` - Reminder notifications

**Key Fields:**
- `action_url`: Optional URL to navigate when notification is clicked
- `metadata`: JSONB field storing additional context (e.g., `{shift_id: "...", employee_id: "..."}`)
- `email_sent`: Tracks if email notification was sent (prevents duplicate emails)

---

### 14. `notification_preferences`
User preferences for notification delivery (email vs in-app).

```sql
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
```

**Auto-Creation:**
- A trigger automatically creates default preferences when a new user is created
- All preferences default to `true` (enabled) except `email_reminder` (defaults to `false`)

**Preference Logic:**
- Each notification type has two settings: `email_*` and `in_app_*`
- Users can control whether they receive emails and/or in-app notifications for each type
- Preferences are managed in the Settings page

---

### 15. `phone_verifications`
Phone number verification records (for future SMS/phone features).

```sql
CREATE TABLE phone_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  phone VARCHAR(50) NOT NULL,
  verification_code VARCHAR(10),
  verified BOOLEAN DEFAULT false,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_phone_verifications_user ON phone_verifications(user_id);
CREATE INDEX idx_phone_verifications_phone ON phone_verifications(phone);
```

**Status:** This table exists but is not currently used in the application. Reserved for future phone/SMS verification features.

---

## Signup Flow

### Phase 1: Manager Creates Account

1. **Manager visits `/signup`**
   - Enters: Email, Password, Full Name
   - Clicks "Create Account"

2. **Organization Setup** (multi-step form):
   - **Step 1: Company Details**
     - Company Name
     - Industry (dropdown)
     - Number of employees (estimate)
   
   - **Step 2: Work Type Selection** ⭐
     - Radio: `Remote` | `On-Site` | `Hybrid`
     - **If On-Site/Hybrid:**
       - Show "Add Locations" section
       - Can add multiple locations (Site A, Site B, etc.)
       - Each location: Name, Address (optional), Timezone
   
   - **Step 3: Plan Selection**
     - Choose Starter (Free) or Professional (Trial)

3. **Database Creates:**
   - `organizations` row
   - `users` row (manager, role='manager', organization_id)
   - If on-site: `locations` rows
   - Supabase Auth user

4. **Redirect to Dashboard**

---

### Phase 2: Manager Invites Employees/HR

1. Manager goes to "Team" page
2. Clicks "Invite Employee" or "Invite HR"
3. Enters:
   - Email
   - Role (employee/hr)
   - **Job Title** (if employee) - e.g., "UI Designer", "Software Developer"
4. **Database:**
   - Creates `invitations` row (with job_title)
   - Generates unique token
   - Sends email with link: `/accept-invite?token=xxx`

**When Employee Accepts:**
- `job_title` is copied from invitation to user record

---

### Phase 3: Employee Accepts Invitation

1. Employee clicks email link → `/accept-invite?token=xxx`
2. System validates token (checks `invitations` table)
3. **If valid:**
   - Show signup form (Name, Password)
   - On submit:
     - Create Supabase Auth user
     - Create `users` row (role='employee', organization_id from invitation, job_title from invitation)
     - Update `invitations.accepted_at`
     - Set `users.joined_at`
4. Redirect to Employee Dashboard

---

## Dashboard Views (Modular)

### Manager Dashboard:
- Create/Edit shifts
- View all employees' schedules
- **Filter by Job Title** ⭐ (e.g., show only "Software Developers" or "Baristas")
- Filter by location (if on-site)
- Filter by date range
- Manage locations (if on-site)
- Manage employee job titles
- Approve/reject time-off & swaps
- Invite employees/HR (with job title assignment)
- Organization settings

**Filtering Logic:**
- Manager selects job titles to display (multi-select)
- Dashboard shows only employees matching selected job titles
- Example: Filter → "UI Designer" + "Software Developer" → Shows only those roles
- Filter persists per session (localStorage) or saved preference

### Employee Dashboard:
- **Team Schedule** (calendar view - shows all team members to see who they're working with)
- **View Team Members** (see all employees in organization)
- **Filter by Job Title** (optional - to see specific roles/teams)
- **Request Time Off** button
- **Request Swap** (view colleagues' shifts)
- Clock in/out (if enabled)
- **Mobile-friendly** design

### HR Dashboard:
- **Hours Report** (filterable):
  - By employee
  - By date range (day/week/month)
  - By location (if on-site)
- **Attendance Overview**
- Export data (CSV/Excel)
- No scheduling access (read-only)

---

## Key Business Rules

1. **Work Type Logic:**
   - Remote: `locations` table not used; `shifts.location_id = NULL`
   - On-Site: `shifts.location_id` required
   - Hybrid: Mix of both

2. **Role Permissions:**
   - Manager: Full access
   - Employee: View team schedule (read-only), view all employees, request time-off/swaps
   - HR: Read attendance/hours (no schedule edit)

3. **Job Title System:**
   - Each employee has a `job_title` (e.g., "UI Designer", "Software Developer")
   - Manager assigns job title when inviting employee
   - Manager can update job titles later in "Team" settings
   - **Dashboard Filtering:**
     - Manager selects job titles to display (multi-select checkbox/button)
     - Example: Filter → Select "UI Designer" + "Software Developer" → Dashboard shows only those employees
     - Filter can be combined with location filter (if on-site)
     - Filter persists during session or saved as user preference

4. **Invitation System:**
   - Token expires after 7 days
   - One invitation per email per organization
   - Manager can resend if expired
   - Manager must specify `job_title` when inviting employees

5. **Modular Dashboard:**
   - Same `/dashboard` route
   - Different components based on `user.role`
   - Different navigation menu items
   - Manager can filter by `job_title` to see specific roles (e.g., "Show only Software Developers")

---

## In-App Notification System

CrewControl includes a comprehensive notification system that provides both in-app and email notifications with user-configurable preferences.

### Architecture Overview

The notification system consists of:
1. **`notifications` table** - Stores all in-app notifications
2. **`notification_preferences` table** - User preferences for each notification type
3. **Notification Service** (`src/lib/notificationService.js`) - Handles notification creation and delivery
4. **Notification Context** (`src/contexts/NotificationContext.jsx`) - React context for managing notifications
5. **Notification Center** (`src/components/NotificationCenter.jsx`) - UI component for displaying notifications

### How Notifications Work

#### 1. Creating Notifications

When an event occurs (e.g., shift assigned, invitation sent), the system:

```javascript
import { createNotification } from '../lib/notificationService';

await createNotification({
  userId: employeeId,
  organizationId: orgId,
  type: 'shift_assigned',
  title: 'New Shift Assigned',
  message: 'You have been assigned a shift on Monday, Jan 15 from 8:00 AM to 4:00 PM',
  actionUrl: '/schedule',
  metadata: { shift_id: shiftId, employee_id: employeeId }
});
```

#### 2. Preference Checking

Before creating a notification, the system checks user preferences:

- **In-App Notification**: If `in_app_<type>` is `true` (default), creates notification in database
- **Email Notification**: If `email_<type>` is `true` (default), sends email via Edge Function

If both are disabled, no notification is created.

#### 3. Notification Delivery

**In-App Notifications:**
- Stored in `notifications` table
- Fetched by `NotificationContext` every 30 seconds (polling)
- Displayed in `NotificationCenter` component (slides in from right)
- Unread count badge shown on bell icon in navigation

**Email Notifications:**
- Sent via Supabase Edge Function (`send-notification-email`)
- HTML email templates with action buttons
- `email_sent` flag updated in notification record

### Notification Center UI

The Notification Center (`NotificationCenter.jsx`) provides:

- **Slide-in Panel**: Slides in from the right side of the screen
- **Filter Options**: "All" or "Unread" notifications
- **Unread Badge**: Shows count of unread notifications on bell icon
- **Mark as Read**: Individual or "Mark all as read" functionality
- **Delete**: Users can delete notifications
- **Click to Navigate**: Clicking a notification navigates to `action_url` if provided
- **Auto-refresh**: Polls for new notifications every 30 seconds
- **Beautiful UI**: Color-coded by type, icons, gradients, animations

### Notification Types & Usage

| Type | When Triggered | Example |
|------|---------------|---------|
| `invitation` | Manager sends invitation | "You've been invited to join [Organization]" |
| `shift_assigned` | Manager assigns shift | "New shift assigned: Monday 8 AM - 4 PM" |
| `shift_updated` | Manager modifies existing shift | "Your shift on Monday has been updated" |
| `shift_cancelled` | Manager cancels shift | "Your shift on Monday has been cancelled" |
| `leave_request` | Employee submits time-off request | "Time-off request submitted for Jan 15-20" |
| `leave_approved` | Manager approves time-off | "Your time-off request has been approved" |
| `leave_rejected` | Manager rejects time-off | "Your time-off request has been rejected" |
| `team_update` | Team membership changes | "You've been added to the Engineering team" |
| `schedule_change` | Schedule modifications | "Schedule updated for next week" |
| `new_team_member` | New member joins team | "John Doe joined your team" |
| `system` | System announcements | "System maintenance scheduled for tonight" |
| `reminder` | Reminder notifications | "Reminder: Shift starts in 1 hour" |

### Integration Points

Notifications are automatically created in these scenarios:

1. **Shift Management** (`src/components/Schedule.jsx`):
   - When manager creates/updates/cancels shifts
   - When shifts are created via drag-and-drop

2. **Invitations** (`src/components/Team.jsx`):
   - When manager sends invitation
   - Notification sent to manager confirming invitation sent

3. **Time-Off Requests** (Future):
   - When employee submits request
   - When manager approves/rejects request

### User Preferences Management

Users can manage notification preferences in the Settings page:

- Toggle email notifications per type
- Toggle in-app notifications per type
- Preferences are saved to `notification_preferences` table
- Changes take effect immediately for new notifications

### API Functions

The notification service provides these functions:

- `createNotification()` - Create a new notification (checks preferences)
- `getUserNotifications()` - Fetch user's notifications
- `getUnreadNotificationCount()` - Get count of unread notifications
- `markNotificationAsRead()` - Mark single notification as read
- `markAllNotificationsAsRead()` - Mark all as read
- `deleteNotification()` - Delete a notification

### Real-Time Updates

Currently, notifications use **polling** (every 30 seconds) to check for new notifications. Future enhancements could include:

- Supabase Realtime subscriptions for instant updates
- WebSocket connections for real-time delivery
- Push notifications for mobile apps

### Best Practices

1. **Always check preferences** before creating notifications
2. **Provide action URLs** for notifications that require user action
3. **Include metadata** for context (shift_id, employee_id, etc.)
4. **Use appropriate types** for proper filtering and UI display
5. **Don't spam** - Group related notifications when possible

---

## Next Steps for Implementation

1. **Create Supabase tables** (using SQL above)
2. **Set up Row Level Security (RLS)** policies
3. **Implement signup flow** (Manager → Organization → Invite)
4. **Build invitation system** (email + token validation)
5. **Create modular dashboard** (role-based rendering)
6. **Implement location management** (conditional on work_type)

Would you like me to start implementing any of these?
