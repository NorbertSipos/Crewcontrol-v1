/**
 * User Roles and Permissions
 * Defines what each role can and cannot do
 */

export const USER_ROLES = {
  manager: 'manager',
  employee: 'employee',
  hr: 'hr'
};

export const ROLE_PERMISSIONS = {
  manager: {
    canCreateShifts: true,
    canEditShifts: true,
    canDeleteShifts: true,
    canViewAllShifts: true,
    canInviteUsers: true,
    canManageLocations: true,
    canApproveTimeOff: true,
    canApproveSwaps: true,
    canViewReports: true,
    canManageSettings: true,
    canViewAllEmployees: true,
    canFilterByJobTitle: true,
    canClockInOut: false, // Managers typically don't clock in/out
    canRequestTimeOff: false, // Managers don't request, they approve
    canRequestSwap: false,
  },
  employee: {
    canCreateShifts: false,
    canEditShifts: false,
    canDeleteShifts: false,
    canViewAllShifts: true, // Can see team schedule to know who they're working with
    canInviteUsers: false,
    canManageLocations: false,
    canApproveTimeOff: false,
    canApproveSwaps: false,
    canViewReports: false,
    canManageSettings: false,
    canViewAllEmployees: true, // Can see team members to know who they're working with
    canFilterByJobTitle: true, // Can filter to see specific roles/teams
    canClockInOut: true,
    canRequestTimeOff: true,
    canRequestSwap: true,
  },
  hr: {
    canCreateShifts: false,
    canEditShifts: false,
    canDeleteShifts: false,
    canViewAllShifts: true, // Read-only for attendance
    canInviteUsers: false,
    canManageLocations: false,
    canApproveTimeOff: false,
    canApproveSwaps: false,
    canViewReports: true, // HR can view reports
    canManageSettings: false,
    canViewAllEmployees: true, // For attendance/hours data
    canFilterByJobTitle: true,
    canClockInOut: false,
    canRequestTimeOff: true, // HR can request time off
    canRequestSwap: false,
  }
};

/**
 * Check if a role has a specific permission
 * @param {string} role - 'manager' | 'employee' | 'hr'
 * @param {string} permission - Permission name (e.g., 'canCreateShifts')
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  if (!role || !ROLE_PERMISSIONS[role]) return false;
  return ROLE_PERMISSIONS[role][permission] === true;
};

/**
 * Check if user is a manager
 * @param {string} role - User role
 * @returns {boolean}
 */
export const isManager = (role) => role === USER_ROLES.manager;

/**
 * Check if user is an employee
 * @param {string} role - User role
 * @returns {boolean}
 */
export const isEmployee = (role) => role === USER_ROLES.employee;

/**
 * Check if user is HR
 * @param {string} role - User role
 * @returns {boolean}
 */
export const isHR = (role) => role === USER_ROLES.hr;

/**
 * Get dashboard type based on role
 * @param {string} role - User role
 * @returns {string} - 'manager' | 'employee' | 'hr'
 */
export const getDashboardType = (role) => {
  return role || 'employee'; // Default to employee if role not set
};
