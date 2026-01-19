/**
 * Plan Features Configuration
 * Defines which features are available for each plan
 */

export const PLAN_LIMITS = {
  starter: {
    maxEmployees: 10,
    features: {
      dragAndDropScheduling: true,
      mobileApp: true,
      shiftSwapRequests: true,
      aiConflictDetection: true,
      realTimeDashboard: true,
      oneClickPublishing: true,
      availabilityCalendar: true,
      timeOffRequests: true,
      multipleLocations: true,
      emailSupport: true,
      // Not available in Starter
      automatedShiftFilling: false,
      inAppMessaging: false,
      payrollExports: false,
      hrRoleAccess: false,
      documentVault: false,
      complianceAuditTrail: false,
      apiAccess: false,
    }
  },
  professional: {
    maxEmployees: 50,
    features: {
      dragAndDropScheduling: true,
      mobileApp: true,
      shiftSwapRequests: true,
      aiConflictDetection: true,
      realTimeDashboard: true,
      oneClickPublishing: true,
      availabilityCalendar: true,
      timeOffRequests: true,
      multipleLocations: true,
      emailSupport: true,
      automatedShiftFilling: true,
      inAppMessaging: true,
      payrollExports: true,
      hrRoleAccess: true,
      // Not available in Professional
      documentVault: false,
      complianceAuditTrail: false,
      apiAccess: false,
    }
  },
  enterprise: {
    maxEmployees: Infinity, // Unlimited
    features: {
      // Everything enabled
      dragAndDropScheduling: true,
      mobileApp: true,
      shiftSwapRequests: true,
      aiConflictDetection: true,
      realTimeDashboard: true,
      oneClickPublishing: true,
      availabilityCalendar: true,
      timeOffRequests: true,
      multipleLocations: true,
      emailSupport: true,
      automatedShiftFilling: true,
      inAppMessaging: true,
      payrollExports: true,
      hrRoleAccess: true,
      documentVault: true,
      complianceAuditTrail: true,
      apiAccess: true,
    }
  }
};

/**
 * Check if a feature is available for a given plan
 * @param {string} plan - 'starter' | 'professional' | 'enterprise'
 * @param {string} featureName - Name of the feature (e.g., 'payrollExports')
 * @returns {boolean}
 */
export const hasFeature = (plan, featureName) => {
  if (!plan || !PLAN_LIMITS[plan]) return false;
  return PLAN_LIMITS[plan].features[featureName] === true;
};

/**
 * Get the maximum number of employees allowed for a plan
 * @param {string} plan - 'starter' | 'professional' | 'enterprise'
 * @returns {number}
 */
export const getMaxEmployees = (plan) => {
  if (!plan || !PLAN_LIMITS[plan]) return 0;
  return PLAN_LIMITS[plan].maxEmployees;
};

/**
 * Check if organization can add more employees
 * @param {string} plan - Current plan
 * @param {number} currentEmployeeCount - Current number of employees
 * @returns {boolean}
 */
export const canAddEmployee = (plan, currentEmployeeCount) => {
  const max = getMaxEmployees(plan);
  if (max === Infinity) return true; // Enterprise = unlimited
  return currentEmployeeCount < max;
};

/**
 * Get the number of employees remaining before limit
 * @param {string} plan - Current plan
 * @param {number} currentEmployeeCount - Current number of employees
 * @returns {number | string} - Number remaining or 'Unlimited' for Enterprise
 */
export const getRemainingEmployeeSlots = (plan, currentEmployeeCount) => {
  const max = getMaxEmployees(plan);
  if (max === Infinity) return 'Unlimited';
  return Math.max(0, max - currentEmployeeCount);
};
