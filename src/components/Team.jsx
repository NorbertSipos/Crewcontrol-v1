import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Plus, Mail, Filter, MoreVertical, 
  UserPlus, Briefcase, CheckCircle2, XCircle, Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { sendInvitationEmail } from '../lib/emailService';
import { createNotification } from '../lib/notificationService';
import DashboardLayout from './DashboardLayout';

const Team = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [teamMembers, setTeamMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [jobTitleFilter, setJobTitleFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'employee',
    jobTitle: '',
    teamId: '', // Use team_id instead of team_name
    teamName: '' // Keep for display/backward compatibility
  });
  const [inviteSubmitting, setInviteSubmitting] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showInviteModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showInviteModal]);

  // Redirect if not manager
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
      // Only managers can access team page
      if (userProfile.role !== 'manager') {
        navigate('/dashboard');
        return;
      }
    }
  }, [user, userProfile, authLoading, navigate]);

  // Fetch team members and invitations
  useEffect(() => {
    if (!userProfile?.organization_id) return;

    const fetchTeamData = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) {
          console.error('No access token');
          setLoading(false);
          return;
        }

        // Fetch team members
        const membersResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?organization_id=eq.${userProfile.organization_id}&select=*&order=created_at.desc`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${accessToken}`,
              'Prefer': 'return=representation'
            },
            signal: undefined
          }
        );

        // Fetch pending invitations
        const invitationsResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/invitations?organization_id=eq.${userProfile.organization_id}&accepted_at=is.null&select=*&order=created_at.desc`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${accessToken}`,
              'Prefer': 'return=representation'
            },
            signal: undefined
          }
        );

        let invitationsData = [];
        if (invitationsResponse.ok) {
          invitationsData = await invitationsResponse.json() || [];
          setInvitations(invitationsData);
        }

        // Fetch teams from teams table
        const teamsResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/teams?organization_id=eq.${userProfile.organization_id}&is_active=eq.true&select=*&order=name.asc`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${accessToken}`,
              'Prefer': 'return=representation'
            },
            signal: undefined
          }
        );

        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json() || [];
          setAvailableTeams(teamsData);
          
          // If there's only one team and invite modal is open for employee, auto-fill it
          if (teamsData.length === 1 && showInviteModal && inviteForm.role === 'employee') {
            setInviteForm(prev => ({ ...prev, teamId: teamsData[0].id, teamName: teamsData[0].name }));
          }
        } else {
          console.warn('Failed to fetch teams:', teamsResponse.status);
          setAvailableTeams([]);
        }

        // Fetch team members
        if (membersResponse.ok) {
          const membersData = await membersResponse.json();
          setTeamMembers(membersData || []);
        } else {
          console.error('Failed to fetch team members:', membersResponse.status, await membersResponse.text());
        }

      } catch (err) {
        console.error('Error fetching team data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [userProfile?.organization_id]);

  // Auto-fill team when modal opens or role changes to employee (if only one team exists)
  useEffect(() => {
    if (showInviteModal && inviteForm.role === 'employee' && availableTeams.length === 1) {
      setInviteForm(prev => ({ ...prev, teamId: availableTeams[0].id, teamName: availableTeams[0].name }));
    } else if (showInviteModal && inviteForm.role === 'employee' && availableTeams.length === 0) {
      // Reset team if no teams exist yet
      setInviteForm(prev => ({ ...prev, teamId: '', teamName: '' }));
    } else if (inviteForm.role !== 'employee') {
      // Clear team if role is not employee
      setInviteForm(prev => ({ ...prev, teamId: '', teamName: '' }));
    }
  }, [showInviteModal, availableTeams, inviteForm.role]);

  // Handle invite submission
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setInviteSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        alert('Error: No access token');
        return;
      }

      // Generate unique token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      // Find selected team to get team_name if team_id is set
      const selectedTeam = inviteForm.teamId 
        ? availableTeams.find(t => t.id === inviteForm.teamId)
        : null;

      // Create invitation
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/invitations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            email: inviteForm.email,
            organization_id: userProfile.organization_id,
            role: inviteForm.role,
            job_title: inviteForm.role === 'employee' ? inviteForm.jobTitle : null,
            team_id: inviteForm.role === 'employee' ? inviteForm.teamId : null,
            team_name: inviteForm.role === 'employee' && selectedTeam ? selectedTeam.name : null,
            invited_by: user.id,
            token: token,
            expires_at: expiresAt.toISOString()
          }),
          signal: undefined
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      // Send invitation email
      const inviteUrl = `${window.location.origin}/accept-invite?token=${token}`;
      
      // Get organization name for email
      const orgResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/organizations?id=eq.${userProfile.organization_id}&select=name`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      
      let organizationName = 'your organization';
      if (orgResponse.ok) {
        const orgData = await orgResponse.json();
        if (orgData && orgData.length > 0) {
          organizationName = orgData[0].name;
        }
      }

      // Send email using Supabase's built-in invite system
      const emailResult = await sendInvitationEmail({
        email: inviteForm.email,
        invitationUrl: inviteUrl,
        organizationId: userProfile.organization_id,
        organizationName: organizationName,
        role: inviteForm.role,
        jobTitle: inviteForm.jobTitle || null,
        teamName: inviteForm.teamName || null,
        invitedBy: user.id,
        token: token,
        expiresAt: expiresAt.toISOString()
      });

      if (emailResult.success) {
        // Show success message
        alert(`Invitation sent successfully to ${inviteForm.email}!`);
        
        // Create notification for the manager (inviter) - confirmation
        await createNotification({
          userId: user.id,
          organizationId: userProfile.organization_id,
          type: 'system',
          title: 'Invitation Sent',
          message: `Invitation sent successfully to ${inviteForm.email}`,
          actionUrl: '/team',
          metadata: { invitationEmail: inviteForm.email, role: inviteForm.role }
        }).catch(err => console.error('Error creating notification:', err));
      } else {
        // Email failed, but invitation was created - show link as fallback
        alert(`Invitation created! However, email sending failed: ${emailResult.error}\n\nPlease share this link manually:\n${inviteUrl}`);
        
        // Create notification about email failure
        await createNotification({
          userId: user.id,
          organizationId: userProfile.organization_id,
          type: 'system',
          title: 'Invitation Created (Email Failed)',
          message: `Invitation created for ${inviteForm.email}, but email sending failed. Please share the link manually.`,
          actionUrl: '/team',
          metadata: { invitationEmail: inviteForm.email, error: emailResult.error, fallbackUrl: inviteUrl }
        }).catch(err => console.error('Error creating notification:', err));
      }

      // Reset form and close modal
      // Auto-fill team if there's only one team available
      const defaultTeam = availableTeams.length === 1 
        ? { teamId: availableTeams[0].id, teamName: availableTeams[0].name }
        : { teamId: '', teamName: '' };
      setInviteForm({ 
        email: '', 
        role: 'employee', 
        jobTitle: '', 
        teamId: defaultTeam.teamId, 
        teamName: defaultTeam.teamName 
      });
      setShowInviteModal(false);

      // Refresh invitations list
      const invitationsResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/invitations?organization_id=eq.${userProfile.organization_id}&accepted_at=is.null&select=*&order=created_at.desc`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`,
            'Prefer': 'return=representation'
          },
          signal: undefined
        }
      );

      if (invitationsResponse.ok) {
        const invitationsData = await invitationsResponse.json();
        setInvitations(invitationsData || []);
      }

    } catch (err) {
      console.error('Error creating invitation:', err);
      alert('Error creating invitation. Please try again.');
    } finally {
      setInviteSubmitting(false);
    }
  };

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.job_title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesJobTitle = jobTitleFilter === 'all' || member.job_title === jobTitleFilter;
    const matchesTeam = teamFilter === 'all' || 
      member.team_id === teamFilter || 
      member.team_name === teamFilter;

    return matchesSearch && matchesRole && matchesJobTitle && matchesTeam;
  });

  // Get unique job titles for filter
  const jobTitles = [...new Set(teamMembers.map(m => m.job_title).filter(Boolean))].sort();

  if (authLoading || loading || !userProfile?.organization_id) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Loading...</div>
      </div>
    );
  }

  return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
            <div className="flex-1">
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Team Management
              </h1>
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>
                Manage your team members and invitations
              </p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className={`
                px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 
                transition-all hover:scale-105 shadow-lg w-full sm:w-auto
                bg-purple-600 hover:bg-purple-700 text-white
              `}
            >
              <UserPlus size={16} className="sm:w-[18px] sm:h-[18px]" /> Invite Member
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className={`
              rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm
              ${theme === 'dark' 
                ? 'bg-slate-800/50 border border-slate-700/50' 
                : 'bg-white border border-slate-200 shadow-sm'
              }
            `}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs sm:text-sm font-semibold ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>Total Members</span>
                <Users className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} size={18} className="sm:w-5 sm:h-5" />
              </div>
              <p className={`text-2xl sm:text-3xl font-black ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>{teamMembers.length}</p>
            </div>

            <div className={`
              rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm
              ${theme === 'dark' 
                ? 'bg-slate-800/50 border border-slate-700/50' 
                : 'bg-white border border-slate-200 shadow-sm'
              }
            `}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs sm:text-sm font-semibold ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>Employees</span>
                <Briefcase className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} size={18} className="sm:w-5 sm:h-5" />
              </div>
              <p className={`text-2xl sm:text-3xl font-black ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>{teamMembers.filter(m => m.role === 'employee').length}</p>
            </div>

            <div className={`
              rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm
              ${theme === 'dark' 
                ? 'bg-slate-800/50 border border-slate-700/50' 
                : 'bg-white border border-slate-200 shadow-sm'
              }
            `}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs sm:text-sm font-semibold ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>HR Staff</span>
                <Users className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} size={18} className="sm:w-5 sm:h-5" />
              </div>
              <p className={`text-2xl sm:text-3xl font-black ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>{teamMembers.filter(m => m.role === 'hr').length}</p>
            </div>

            <div className={`
              rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm
              ${theme === 'dark' 
                ? 'bg-slate-800/50 border border-slate-700/50' 
                : 'bg-white border border-slate-200 shadow-sm'
              }
            `}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs sm:text-sm font-semibold ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>Pending Invites</span>
                <Mail className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} size={18} className="sm:w-5 sm:h-5" />
              </div>
              <p className={`text-2xl sm:text-3xl font-black ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>{invitations.length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className={`
            rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 backdrop-blur-sm
            ${theme === 'dark' 
              ? 'bg-slate-800/50 border border-slate-700/50' 
              : 'bg-white border border-slate-200 shadow-sm'
            }
          `}>
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className={`
                flex-1 min-w-[200px] flex items-center gap-3 px-4 py-2 rounded-xl
                ${theme === 'dark'
                  ? 'bg-slate-700/50 border border-slate-600'
                  : 'bg-slate-100 border border-slate-200'
                }
              `}>
                <Search size={18} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} />
                <input
                  type="text"
                  placeholder="Search by name, email, or job title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`
                    flex-1 bg-transparent border-none outline-none text-sm
                    ${theme === 'dark' ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}
                  `}
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-semibold outline-none cursor-pointer
                  ${theme === 'dark'
                    ? 'bg-slate-700 border border-slate-600 text-slate-300'
                    : 'bg-white border border-slate-200 text-slate-700'
                  }
                `}
              >
                <option value="all">All Roles</option>
                <option value="manager">Managers</option>
                <option value="employee">Employees</option>
                <option value="hr">HR</option>
              </select>

              {/* Job Title Filter */}
              {jobTitles.length > 0 && (
                <select
                  value={jobTitleFilter}
                  onChange={(e) => setJobTitleFilter(e.target.value)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-semibold outline-none cursor-pointer
                    ${theme === 'dark'
                      ? 'bg-slate-700 border border-slate-600 text-slate-300'
                      : 'bg-white border border-slate-200 text-slate-700'
                    }
                  `}
                >
                  <option value="all">All Job Titles</option>
                  {jobTitles.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              )}

              {/* Team Filter */}
              {availableTeams.length > 0 && (
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-semibold outline-none cursor-pointer
                    ${theme === 'dark'
                      ? 'bg-slate-700 border border-slate-600 text-slate-300'
                      : 'bg-white border border-slate-200 text-slate-700'
                    }
                  `}
                >
                  <option value="all">All Teams</option>
                  {availableTeams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Pending Invitations */}
          {invitations.length > 0 && (
            <div className={`
              rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 backdrop-blur-sm
              ${theme === 'dark' 
                ? 'bg-amber-900/20 border border-amber-700/30' 
                : 'bg-amber-50 border border-amber-200'
              }
            `}>
              <h3 className={`text-lg font-bold mb-4 ${
                theme === 'dark' ? 'text-amber-300' : 'text-amber-700'
              }`}>
                Pending Invitations ({invitations.length})
              </h3>
              <div className="space-y-3">
                {invitations.map(invite => (
                  <div key={invite.id} className={`
                    flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 rounded-xl
                    ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'}
                  `}>
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <Mail className={`flex-shrink-0 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} size={20} />
                      <div className="min-w-0 flex-1">
                        <p className={`font-semibold truncate ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>{invite.email}</p>
                        <p className={`text-xs sm:text-sm ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {invite.role === 'employee' ? 'Employee' : 'HR'} 
                          {invite.job_title && ` • ${invite.job_title}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 sm:ml-auto">
                      <span className={`text-xs px-2 sm:px-3 py-1 rounded-lg whitespace-nowrap ${
                        theme === 'dark' 
                          ? 'bg-amber-500/20 text-amber-300' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        Expires: {new Date(invite.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Members Table */}
          <div className={`
            rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-sm
            ${theme === 'dark' 
              ? 'bg-slate-800/50 border border-slate-700/50' 
              : 'bg-white border border-slate-200 shadow-sm'
            }
          `}>
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full min-w-[600px]">
                <thead className={theme === 'dark' ? 'bg-slate-800/80' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Member</th>
                    <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Role</th>
                    <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Job Title</th>
                    <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Status</th>
                    <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Joined</th>
                    <th className={`px-3 sm:px-6 py-3 sm:py-4 text-right text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={theme === 'dark' ? 'divide-y divide-slate-700' : 'divide-y divide-slate-100'}>
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={`px-6 py-12 text-center ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        No team members found
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map(member => (
                      <tr key={member.id} className={`
                        hover:transition-colors
                        ${theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}
                      `}>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className={`
                              w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0
                              ${theme === 'dark'
                                ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                                : 'bg-purple-100 border border-purple-200 text-purple-600'
                              }
                            `}>
                              {member.full_name?.charAt(0) || member.email?.charAt(0) || 'U'}
                            </div>
                            <div className="min-w-0">
                              <p className={`text-xs sm:text-sm font-semibold truncate ${
                                theme === 'dark' ? 'text-white' : 'text-slate-900'
                              }`}>
                                {member.full_name || 'No name'}
                              </p>
                              <p className={`text-[10px] sm:text-sm truncate ${
                                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                              }`}>{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <span className={`
                            px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase
                            ${member.role === 'manager'
                              ? theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                              : member.role === 'hr'
                              ? theme === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                              : theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                            }
                          `}>
                            {member.role}
                          </span>
                        </td>
                        <td className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {member.job_title || '-'}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          {member.is_active ? (
                            <span className={`
                              inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold
                              ${theme === 'dark' 
                                ? 'bg-emerald-500/20 text-emerald-300' 
                                : 'bg-emerald-100 text-emerald-700'
                              }
                            `}>
                              <CheckCircle2 size={12} className="sm:w-[14px] sm:h-[14px]" /> Active
                            </span>
                          ) : (
                            <span className={`
                              inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold
                              ${theme === 'dark' 
                                ? 'bg-red-500/20 text-red-300' 
                                : 'bg-red-100 text-red-700'
                              }
                            `}>
                              <XCircle size={12} className="sm:w-[14px] sm:h-[14px]" /> Inactive
                            </span>
                          )}
                        </td>
                        <td className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {member.joined_at 
                            ? new Date(member.joined_at).toLocaleDateString()
                            : member.created_at 
                            ? new Date(member.created_at).toLocaleDateString()
                            : '-'
                          }
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                          <button className={`
                            p-1.5 sm:p-2 rounded-lg transition-colors
                            ${theme === 'dark' 
                              ? 'hover:bg-slate-700 text-slate-400 hover:text-white' 
                              : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                            }
                          `}>
                            <MoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Invite Modal - Using React Portal approach */}
        {showInviteModal && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
              onClick={() => setShowInviteModal(false)}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            ></div>
            {/* Modal Content */}
            <div 
              className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4 pointer-events-none"
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            >
              <div 
                className={`
                  w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md sm:rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl overflow-y-auto pointer-events-auto
                  ${theme === 'dark' 
                    ? 'bg-slate-800 border-0 sm:border border-slate-700' 
                    : 'bg-white border-0 sm:border border-slate-200'
                  }
                `}
                onClick={(e) => e.stopPropagation()}
              >
            <h2 className={`text-xl sm:text-2xl font-black mb-4 sm:mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>Invite Team Member</h2>
            
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className={`
                    w-full px-4 py-3 rounded-xl border outline-none transition-colors
                    ${theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
                    }
                  `}
                  placeholder="colleague@example.com"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Role
                </label>
                <select
                  required
                  value={inviteForm.role}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    const newTeam = newRole === 'employee' && availableTeams.length === 1 
                      ? { teamId: availableTeams[0].id, teamName: availableTeams[0].name }
                      : { teamId: '', teamName: '' };
                    setInviteForm({ ...inviteForm, role: newRole, jobTitle: '', teamId: newTeam.teamId, teamName: newTeam.teamName });
                  }}
                  className={`
                    w-full px-4 py-3 rounded-xl border outline-none transition-colors cursor-pointer
                    ${theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }
                  `}
                >
                  <option value="employee">Employee</option>
                  <option value="hr">HR</option>
                </select>
              </div>

              {inviteForm.role === 'employee' && (
                <>
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Job Title
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteForm.jobTitle}
                      onChange={(e) => setInviteForm({ ...inviteForm, jobTitle: e.target.value })}
                      className={`
                        w-full px-4 py-3 rounded-xl border outline-none transition-colors
                        ${theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
                        }
                      `}
                      placeholder="e.g., Software Developer, UI Designer"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Team {availableTeams.length > 1 && <span className="text-red-500">*</span>}
                    </label>
                    {availableTeams.length === 1 ? (
                      // Auto-fill if only one team exists
                      <input
                        type="text"
                        required
                        readOnly
                        value={availableTeams[0].name}
                        className={`
                          w-full px-4 py-3 rounded-xl border outline-none
                          ${theme === 'dark'
                            ? 'bg-slate-700/50 border-slate-600 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                          }
                        `}
                      />
                    ) : availableTeams.length > 1 ? (
                      // Dropdown if multiple teams exist
                      <select
                        required
                        value={inviteForm.teamId}
                        onChange={(e) => {
                          const selectedTeam = availableTeams.find(t => t.id === e.target.value);
                          setInviteForm({ 
                            ...inviteForm, 
                            teamId: e.target.value,
                            teamName: selectedTeam ? selectedTeam.name : ''
                          });
                        }}
                        className={`
                          w-full px-4 py-3 rounded-xl border outline-none transition-colors cursor-pointer
                          ${theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                          }
                        `}
                      >
                        <option value="">Select a team...</option>
                        {availableTeams.map(team => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                      </select>
                    ) : (
                      // Show message if no teams exist (teams should be created during setup)
                      <div className={`
                        w-full px-4 py-3 rounded-xl border
                        ${theme === 'dark'
                          ? 'bg-amber-900/20 border-amber-700/30 text-amber-300'
                          : 'bg-amber-50 border-amber-200 text-amber-700'
                        }
                      `}>
                        No teams found. Teams should be created during organization setup. Please go back to complete setup.
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className={`
                    flex-1 px-4 py-3 rounded-xl font-semibold transition-colors
                    ${theme === 'dark'
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }
                  `}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50"
                >
                  {inviteSubmitting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
              </div>
            </div>
          </>
        )}
      </DashboardLayout>
  );
};

export default Team;
