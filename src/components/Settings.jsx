import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Lock, Bell, Save, Loader, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { getMaxEmployees } from '../lib/planFeatures';
import DashboardLayout from './DashboardLayout';

const Settings = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // User profile settings
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
  });
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  
  // Organization settings (only for managers)
  const [orgData, setOrgData] = useState({
    name: '',
    industry: '',
    workType: 'remote',
    plan: 'starter',
    daysOffPerWeek: 2,
    daysOffDistribution: 'random', // 'random' or 'weekends'
  });
  const [organization, setOrganization] = useState(null);
  
  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState(null);
  const [prefsSaving, setPrefsSaving] = useState(false);
  

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
      return;
    }

    if (!authLoading && user && userProfile) {
      if (!userProfile.organization_id) {
        navigate('/complete-signup');
        return;
      }
    }
  }, [user, userProfile, authLoading, navigate]);

  // Load user and organization data
  useEffect(() => {
    if (!userProfile?.organization_id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) {
          setLoading(false);
          return;
        }

        // Load user profile
        setProfileData({
          fullName: userProfile.full_name || '',
          email: user?.email || '',
        });

        // Load organization data (if manager)
        if (userProfile.role === 'manager') {
          const orgResponse = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/organizations?id=eq.${userProfile.organization_id}&select=*`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          );

          if (orgResponse.ok) {
            const orgData = await orgResponse.json();
            if (orgData && orgData.length > 0) {
              const org = orgData[0];
              setOrganization(org);
              setOrgData({
                name: org.name || '',
                industry: org.industry || '',
                workType: org.work_type || 'remote',
                plan: org.plan || 'starter',
                daysOffPerWeek: org.days_off_per_week || 2,
                daysOffDistribution: org.days_off_distribution || 'random',
              });
            }
          }
        }

        // Load notification preferences (for all users)
        const prefsResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/notification_preferences?user_id=eq.${user.id}&select=*`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (prefsResponse.ok) {
          const prefsData = await prefsResponse.json();
          if (prefsData && prefsData.length > 0) {
            setNotificationPrefs(prefsData[0]);
          } else {
            // Create default preferences if they don't exist
            const createPrefsResponse = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/notification_preferences`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${accessToken}`,
                  'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                  user_id: user.id,
                  organization_id: userProfile.organization_id
                })
              }
            );
            if (createPrefsResponse.ok) {
              const newPrefs = await createPrefsResponse.json();
              setNotificationPrefs(newPrefs[0]);
            }
          }
        }
      } catch (err) {
          console.error('Error loading settings:', err);
          setError('Failed to load settings data');
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, [userProfile, user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleOrgChange = (e) => {
    const { name, value } = e.target;
    setOrgData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  // Handle notification preference update
  const handleNotificationPrefUpdate = async (notifType, prefType, enabled) => {
    if (!notificationPrefs || !user?.id) return;

    setPrefsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error('No access token');
      }

      const prefKey = `${prefType}_${notifType}`;
      const updatedPrefs = { ...notificationPrefs, [prefKey]: enabled };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/notification_preferences?user_id=eq.${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`,
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            [prefKey]: enabled,
            updated_at: new Date().toISOString()
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update preference');
      }

      const updated = await response.json();
      setNotificationPrefs(updated[0] || updatedPrefs);
      setSuccess('Notification preference updated!');
    } catch (err) {
      console.error('Error updating notification preference:', err);
      setError(err.message || 'Failed to update preference');
    } finally {
      setPrefsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Please fill in all password fields');
      setPasswordSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      setPasswordSaving(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setPasswordSaving(false);
      return;
    }

    try {
      // Update password using Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error('No access token');
      }

      // Update user profile
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?id=eq.${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`,
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            full_name: profileData.fullName,
            updated_at: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      
      // Refresh user profile in AuthContext
      window.location.reload(); // Simple refresh - could be improved with context update
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOrganization = async (e) => {
    e.preventDefault();
    if (userProfile?.role !== 'manager') return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error('No access token');
      }

      // Update organization
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/organizations?id=eq.${userProfile.organization_id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`,
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            name: orgData.name,
            industry: orgData.industry,
            work_type: orgData.workType,
            plan: orgData.plan,
            days_off_per_week: parseInt(orgData.daysOffPerWeek) || 2,
            days_off_distribution: orgData.daysOffDistribution || 'random',
            updated_at: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update organization');
      }

      setSuccess('Organization settings updated successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Error updating organization:', err);
      setError(err.message || 'Failed to update organization settings');
    } finally {
      setSaving(false);
    }
  };


  if (authLoading || loading || !userProfile?.organization_id) {
    return (
      <DashboardLayout>
        <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
          <Loader className={`animate-spin ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} size={32} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Settings
        </h1>
        <p className={`text-sm sm:text-base mb-6 sm:mb-8 ${
          theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
        }`}>
          Manage your account and organization settings
        </p>

        {error && (
          <div className={`
            mb-6 p-4 rounded-xl border
            ${theme === 'dark'
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : 'bg-red-50 border-red-200 text-red-700'
            }
          `}>
            {error}
          </div>
        )}

        {success && (
          <div className={`
            mb-6 p-4 rounded-xl border
            ${theme === 'dark'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }
          `}>
            {success}
          </div>
        )}

        <div className="space-y-6 sm:space-y-8">
          {/* Profile Settings */}
          <div className={`
            rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8
            ${theme === 'dark'
              ? 'bg-slate-800/50 border border-slate-700/50'
              : 'bg-white border border-slate-200 shadow-sm'
            }
          `}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`
                p-2 rounded-lg
                ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}
              `}>
                <User className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} size={20} />
              </div>
              <h2 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Profile Settings
              </h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleProfileChange}
                  required
                  className={`
                    w-full px-4 py-3 rounded-xl border outline-none transition-colors
                    ${theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
                    }
                  `}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className={`
                    w-full px-4 py-3 rounded-xl border
                    ${theme === 'dark'
                      ? 'bg-slate-700/50 border-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                    }
                  `}
                />
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
                }`}>
                  Email cannot be changed here. Use password reset to change email.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`
                  px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all
                  ${saving
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-105'
                  }
                  bg-purple-600 hover:bg-purple-700 text-white
                `}
              >
                {saving ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Profile
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Password Change */}
          <div className={`
            rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8
            ${theme === 'dark'
              ? 'bg-slate-800/50 border border-slate-700/50'
              : 'bg-white border border-slate-200 shadow-sm'
            }
          `}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`
                p-2 rounded-lg
                ${theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'}
              `}>
                <Lock className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} size={20} />
              </div>
              <h2 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Change Password
              </h2>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className={`
                      w-full px-4 py-3 pr-12 rounded-xl border outline-none transition-colors
                      ${theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
                      }
                    `}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    className={`
                      w-full px-4 py-3 pr-12 rounded-xl border outline-none transition-colors
                      ${theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
                      }
                    `}
                    placeholder="Enter new password (min. 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    className={`
                      w-full px-4 py-3 pr-12 rounded-xl border outline-none transition-colors
                      ${theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
                      }
                    `}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordSaving}
                className={`
                  px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all
                  ${passwordSaving
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-105'
                  }
                  bg-purple-600 hover:bg-purple-700 text-white
                `}
              >
                {passwordSaving ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Change Password
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Organization Settings (Managers only) */}
          {userProfile?.role === 'manager' && organization && (
            <div className={`
              rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8
              ${theme === 'dark'
                ? 'bg-slate-800/50 border border-slate-700/50'
                : 'bg-white border border-slate-200 shadow-sm'
              }
            `}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`
                  p-2 rounded-lg
                  ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}
                `}>
                  <Building2 className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} size={20} />
                </div>
                <h2 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  Organization Settings
                </h2>
              </div>

              <form onSubmit={handleSaveOrganization} className="space-y-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Organization Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={orgData.name}
                    onChange={handleOrgChange}
                    required
                    className={`
                      w-full px-4 py-3 rounded-xl border outline-none transition-colors
                      ${theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
                      }
                    `}
                    placeholder="Organization name"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={orgData.industry}
                    onChange={handleOrgChange}
                    className={`
                      w-full px-4 py-3 rounded-xl border outline-none transition-colors
                      ${theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
                      }
                    `}
                    placeholder="Industry (optional)"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Work Type
                  </label>
                  <select
                    name="workType"
                    value={orgData.workType}
                    onChange={handleOrgChange}
                    className={`
                      w-full px-4 py-3 rounded-xl border outline-none transition-colors cursor-pointer
                      ${theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                      }
                    `}
                  >
                    <option value="remote">Remote</option>
                    <option value="on-site">On-Site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Plan
                  </label>
                  <select
                    name="plan"
                    value={orgData.plan}
                    onChange={handleOrgChange}
                    className={`
                      w-full px-4 py-3 rounded-xl border outline-none transition-colors cursor-pointer
                      ${theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                      }
                    `}
                  >
                    <option value="starter">Starter - Up to {getMaxEmployees('starter')} employees</option>
                    <option value="professional">Professional - Up to {getMaxEmployees('professional')} employees</option>
                    <option value="enterprise">Enterprise - Unlimited employees</option>
                  </select>
                  <p className={`mt-2 text-xs ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {orgData.plan === 'enterprise' 
                      ? 'Unlimited employees and all features included'
                      : `Current plan allows up to ${getMaxEmployees(orgData.plan)} employees`
                    }
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Days Off Per Week
                  </label>
                  <select
                    name="daysOffPerWeek"
                    value={orgData.daysOffPerWeek}
                    onChange={handleOrgChange}
                    className={`
                      w-full px-4 py-3 rounded-xl border outline-none transition-colors cursor-pointer
                      ${theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                      }
                    `}
                  >
                    <option value={1}>1 Day Off Per Week</option>
                    <option value={2}>2 Days Off Per Week (Default)</option>
                  </select>
                  <p className={`mt-2 text-xs ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    This setting controls how many rest days each employee will have when using Auto-Fill
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Days Off Distribution
                  </label>
                  <select
                    name="daysOffDistribution"
                    value={orgData.daysOffDistribution}
                    onChange={handleOrgChange}
                    className={`
                      w-full px-4 py-3 rounded-xl border outline-none transition-colors cursor-pointer
                      ${theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                      }
                    `}
                  >
                    <option value="random">Random Distribution</option>
                    <option value="weekends">Always on Weekends (Saturday & Sunday)</option>
                  </select>
                  <p className={`mt-2 text-xs ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {orgData.daysOffDistribution === 'weekends' 
                      ? 'Employees will always have weekends off (Saturday & Sunday)'
                      : 'Days off will be distributed randomly throughout the week'
                    }
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className={`
                    px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all
                    ${saving
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-105'
                    }
                    bg-purple-600 hover:bg-purple-700 text-white
                  `}
                >
                  {saving ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Organization
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Notification Preferences */}
          <div className={`
            rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8
            ${theme === 'dark'
              ? 'bg-slate-800/50 border border-slate-700/50'
              : 'bg-white border border-slate-200 shadow-sm'
            }
          `}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`
                p-2 rounded-lg
                ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}
              `}>
                <Bell className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} size={20} />
              </div>
              <h2 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Notification Preferences
              </h2>
            </div>

            <p className={`text-sm mb-6 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Configure how you receive notifications for different events.
            </p>

            <div className="space-y-4">
            <NotificationPreferenceSection
              theme={theme}
              title="Email Notifications"
              description="Receive email notifications for these events"
              preferences={notificationPrefs || {}}
              type="email"
              onUpdate={handleNotificationPrefUpdate}
              saving={prefsSaving}
            />
            <NotificationPreferenceSection
              theme={theme}
              title="In-App Notifications"
              description="Show in-app notifications for these events"
              preferences={notificationPrefs || {}}
              type="in_app"
              onUpdate={handleNotificationPrefUpdate}
              saving={prefsSaving}
            />
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

// Notification Preference Section Component
const NotificationPreferenceSection = ({ theme, title, description, preferences, type, onUpdate, saving }) => {
  const notificationTypes = [
    { key: 'invitation', label: 'Invitations' },
    { key: 'shift_assigned', label: 'Shift Assignments' },
    { key: 'shift_updated', label: 'Shift Updates' },
    { key: 'shift_cancelled', label: 'Shift Cancellations' },
    { key: 'leave_request', label: 'Leave Requests' },
    { key: 'leave_approved', label: 'Leave Approvals' },
    { key: 'leave_rejected', label: 'Leave Rejections' },
    { key: 'system', label: 'System Notifications' },
    { key: 'team_update', label: 'Team Updates' },
    { key: 'schedule_change', label: 'Schedule Changes' },
    { key: 'new_team_member', label: 'New Team Members' },
    { key: 'reminder', label: 'Reminders' }
  ];

  return (
    <div className={`
      rounded-xl p-4 border
      ${theme === 'dark'
        ? 'bg-slate-700/30 border-slate-600'
        : 'bg-slate-50 border-slate-200'
      }
    `}>
      <h3 className={`text-sm font-bold mb-1 ${
        theme === 'dark' ? 'text-white' : 'text-slate-900'
      }`}>
        {title}
      </h3>
      <p className={`text-xs mb-4 ${
        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
      }`}>
        {description}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {notificationTypes.map(notifType => {
          const prefKey = `${type}_${notifType.key}`;
          const isEnabled = preferences[prefKey] !== false; // Default to true
          
          return (
            <label
              key={notifType.key}
              className={`
                flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                ${theme === 'dark'
                  ? 'hover:bg-slate-700/50'
                  : 'hover:bg-slate-100'
                }
              `}
            >
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => onUpdate(notifType.key, type, e.target.checked)}
                disabled={saving}
                className={`
                  w-5 h-5 rounded border-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                  ${theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-purple-600 focus:ring-purple-500'
                    : 'bg-white border-slate-300 text-purple-600 focus:ring-purple-500'
                  }
                `}
              />
              <span className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {notifType.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;
