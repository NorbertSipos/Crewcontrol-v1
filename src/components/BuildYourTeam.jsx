import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Plus, Edit2, Trash2, X, MapPin, Building2, Sparkles, Zap, 
  CheckCircle2, Globe, Clock, UserPlus, Briefcase, Search, XCircle,
  Users as UsersIcon, MapPin as MapPinIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import DashboardLayout from './DashboardLayout';

// Beautiful SVG Illustration Component
const TeamIllustration = ({ theme }) => (
  <svg width="300" height="200" viewBox="0 0 300 200" className="w-full h-auto">
    <defs>
      <linearGradient id="teamGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={theme === 'dark' ? '#8b5cf6' : '#a78bfa'} />
        <stop offset="100%" stopColor={theme === 'dark' ? '#6366f1' : '#818cf8'} />
      </linearGradient>
      <linearGradient id="teamGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={theme === 'dark' ? '#06b6d4' : '#22d3ee'} />
        <stop offset="100%" stopColor={theme === 'dark' ? '#3b82f6' : '#60a5fa'} />
      </linearGradient>
    </defs>
    {/* Team Members */}
    <circle cx="80" cy="80" r="25" fill="url(#teamGrad1)" opacity="0.8" />
    <circle cx="80" cy="80" r="20" fill="none" stroke="white" strokeWidth="2" />
    <circle cx="150" cy="80" r="25" fill="url(#teamGrad1)" opacity="0.8" />
    <circle cx="150" cy="80" r="20" fill="none" stroke="white" strokeWidth="2" />
    <circle cx="220" cy="80" r="25" fill="url(#teamGrad1)" opacity="0.8" />
    <circle cx="220" cy="80" r="20" fill="none" stroke="white" strokeWidth="2" />
    {/* Connection Lines */}
    <line x1="105" y1="80" x2="125" y2="80" stroke="url(#teamGrad1)" strokeWidth="3" opacity="0.6" />
    <line x1="175" y1="80" x2="195" y2="80" stroke="url(#teamGrad1)" strokeWidth="3" opacity="0.6" />
    {/* Location Pin */}
    <path d="M150 140 L150 160 L140 160 L160 160 Z" fill="url(#teamGrad2)" opacity="0.8" />
    <circle cx="150" cy="140" r="15" fill="url(#teamGrad2)" opacity="0.6" />
    {/* Sparkles */}
    <circle cx="60" cy="50" r="3" fill="#fbbf24" opacity="0.8">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="240" cy="50" r="2.5" fill="#60a5fa" opacity="0.8">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="50" cy="150" r="2" fill="#34d399" opacity="0.8">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);

const BuildYourTeam = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // Teams state
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamForm, setTeamForm] = useState({ name: '', description: '' });
  const [teamSubmitting, setTeamSubmitting] = useState(false);
  const [teamUsers, setTeamUsers] = useState({}); // { teamId: [users] }
  
  // Locations state
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [organization, setOrganization] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [locationForm, setLocationForm] = useState({ name: '', address: '', timezone: 'UTC' });
  const [locationSubmitting, setLocationSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('teams'); // 'teams' or 'locations'

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
      if (userProfile.role !== 'manager') {
        navigate('/dashboard');
        return;
      }
    }
  }, [user, userProfile, authLoading, navigate]);

  // Fetch organization first
  useEffect(() => {
    if (!userProfile?.organization_id) return;

    const fetchOrganization = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) return;

        const headers = {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Prefer': 'return=representation'
        };

        const orgResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/organizations?id=eq.${userProfile.organization_id}&select=*`,
          { method: 'GET', headers }
        );
        if (orgResponse.ok) {
          const orgData = await orgResponse.json();
          if (orgData && orgData.length > 0) {
            setOrganization(orgData[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
      }
    };

    fetchOrganization();
  }, [userProfile?.organization_id]);

  // Fetch teams and locations
  useEffect(() => {
    if (!userProfile?.organization_id) return;

    const fetchData = async () => {
      setTeamsLoading(true);
      setLocationsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) {
          setTeamsLoading(false);
          setLocationsLoading(false);
          return;
        }

        const headers = {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Prefer': 'return=representation'
        };

        // Fetch teams
        const teamsResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/teams?organization_id=eq.${userProfile.organization_id}&is_active=eq.true&select=*&order=name.asc`,
          { method: 'GET', headers }
        );
        let teamsData = [];
        if (teamsResponse.ok) {
          teamsData = await teamsResponse.json();
          setTeams(teamsData || []);
        }

        // Fetch users for all teams
        const usersResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?organization_id=eq.${userProfile.organization_id}&role=eq.employee&is_active=eq.true&select=id,full_name,email,job_title,team_id&order=full_name.asc`,
          { method: 'GET', headers }
        );
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          // Group users by team_id
          const usersByTeam = {};
          usersData.forEach(user => {
            if (user.team_id) {
              if (!usersByTeam[user.team_id]) {
                usersByTeam[user.team_id] = [];
              }
              usersByTeam[user.team_id].push(user);
            }
          });
          setTeamUsers(usersByTeam);
        }

        // Fetch locations (only if on-site or hybrid)
        if (organization && (organization.work_type === 'on-site' || organization.work_type === 'hybrid')) {
          const locationsResponse = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/locations?organization_id=eq.${userProfile.organization_id}&select=*&order=name.asc`,
            { method: 'GET', headers }
          );
          if (locationsResponse.ok) {
            const locationsData = await locationsResponse.json();
            setLocations(locationsData || []);
          }
        } else {
          setLocations([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setTeamsLoading(false);
        setLocationsLoading(false);
      }
    };

    fetchData();
  }, [userProfile?.organization_id, organization]);

  // Team functions
  const openAddTeamModal = () => {
    setEditingTeam(null);
    setTeamForm({ name: '', description: '' });
    setShowTeamModal(true);
  };

  const openEditTeamModal = (team) => {
    setEditingTeam(team);
    setTeamForm({ name: team.name, description: team.description || '' });
    setShowTeamModal(true);
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    setTeamSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        alert('Error: No access token');
        setTeamSubmitting(false);
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Prefer': 'return=representation'
      };

      const teamData = {
        organization_id: userProfile.organization_id,
        name: teamForm.name.trim(),
        description: teamForm.description.trim() || null,
        is_active: true,
        updated_at: new Date().toISOString()
      };

      let response;
      if (editingTeam) {
        response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/teams?id=eq.${editingTeam.id}`,
          { method: 'PATCH', headers, body: JSON.stringify(teamData) }
        );
      } else {
        response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/teams`,
          { method: 'POST', headers, body: JSON.stringify(teamData) }
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save team');
      }

      // Refresh teams
      const refreshResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/teams?organization_id=eq.${userProfile.organization_id}&is_active=eq.true&select=*&order=name.asc`,
        { method: 'GET', headers }
      );
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setTeams(data || []);
      }

      // Refresh users for teams
      const usersRefreshResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?organization_id=eq.${userProfile.organization_id}&role=eq.employee&is_active=eq.true&select=id,full_name,email,job_title,team_id&order=full_name.asc`,
        { method: 'GET', headers }
      );
      if (usersRefreshResponse.ok) {
        const usersData = await usersRefreshResponse.json();
        const usersByTeam = {};
        usersData.forEach(user => {
          if (user.team_id) {
            if (!usersByTeam[user.team_id]) {
              usersByTeam[user.team_id] = [];
            }
            usersByTeam[user.team_id].push(user);
          }
        });
        setTeamUsers(usersByTeam);
      }

      setShowTeamModal(false);
      setTeamSubmitting(false);
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Error saving team: ' + error.message);
      setTeamSubmitting(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!confirm('Are you sure you want to delete this team? This will remove team assignments from employees.')) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        alert('Error: No access token');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/teams?id=eq.${teamId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ is_active: false })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete team');
      }

      setTeams(teams.filter(t => t.id !== teamId));
      
      // Refresh users to update team assignments
      const usersRefreshResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?organization_id=eq.${userProfile.organization_id}&role=eq.employee&is_active=eq.true&select=id,full_name,email,job_title,team_id&order=full_name.asc`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      if (usersRefreshResponse.ok) {
        const usersData = await usersRefreshResponse.json();
        const usersByTeam = {};
        usersData.forEach(user => {
          if (user.team_id) {
            if (!usersByTeam[user.team_id]) {
              usersByTeam[user.team_id] = [];
            }
            usersByTeam[user.team_id].push(user);
          }
        });
        setTeamUsers(usersByTeam);
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Error deleting team: ' + error.message);
    }
  };

  // Location functions
  const openAddLocationModal = () => {
    setEditingLocation(null);
    setLocationForm({ name: '', address: '', timezone: 'UTC' });
    setShowLocationModal(true);
  };

  const openEditLocationModal = (location) => {
    setEditingLocation(location);
    setLocationForm({
      name: location.name || '',
      address: location.address || '',
      timezone: location.timezone || 'UTC'
    });
    setShowLocationModal(true);
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setLocationSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        alert('Error: No access token');
        setLocationSubmitting(false);
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Prefer': 'return=representation'
      };

      const locationData = {
        organization_id: userProfile.organization_id,
        name: locationForm.name.trim(),
        address: locationForm.address.trim() || null,
        timezone: locationForm.timezone || 'UTC',
        is_active: true
      };

      let response;
      if (editingLocation) {
        response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/locations?id=eq.${editingLocation.id}`,
          { method: 'PATCH', headers, body: JSON.stringify(locationData) }
        );
      } else {
        response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/locations`,
          { method: 'POST', headers, body: JSON.stringify(locationData) }
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save location');
      }

      // Refresh locations
      const refreshResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/locations?organization_id=eq.${userProfile.organization_id}&select=*&order=name.asc`,
        { method: 'GET', headers }
      );
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setLocations(data || []);
      }

      setShowLocationModal(false);
      setLocationSubmitting(false);
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Error saving location: ' + error.message);
      setLocationSubmitting(false);
    }
  };

  const handleToggleLocationActive = async (location) => {
    if (!confirm(`Are you sure you want to ${location.is_active ? 'deactivate' : 'activate'} this location?`)) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        alert('Error: No access token');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/locations?id=eq.${location.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ is_active: !location.is_active })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      setLocations(locations.map(loc => 
        loc.id === location.id ? { ...loc, is_active: !loc.is_active } : loc
      ));
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Error updating location: ' + error.message);
    }
  };

  // Filter locations
  const filteredLocations = useMemo(() => {
    return locations.filter(loc => 
      loc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [locations, searchQuery]);

  // Lock body scroll when modals are open
  useEffect(() => {
    if (showTeamModal || showLocationModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showTeamModal, showLocationModal]);

  if (authLoading || !user || !userProfile?.organization_id) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Loading...</div>
      </div>
    );
  }

  const showLocations = organization && (organization.work_type === 'on-site' || organization.work_type === 'hybrid');

  return (
    <DashboardLayout>
      <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        {/* Hero Section */}
        <div className={`
          relative overflow-hidden rounded-3xl p-8 sm:p-12 mb-8 sm:mb-12
          ${theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-slate-900 border border-purple-500/20' 
            : 'bg-gradient-to-br from-purple-50 via-indigo-50 to-white border border-purple-200'
          }
        `}>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className={`
                  p-3 rounded-2xl
                  ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}
                `}>
                  <Users className={`w-8 h-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Build Your Team
                  </h1>
                  <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-purple-200' : 'text-purple-700'}`}>
                    Organize your teams and manage work locations
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <div className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl
                  ${theme === 'dark' ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-white border border-purple-200'}
                `}>
                  <Users className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                    {teams.length} Team{teams.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {showLocations && (
                  <div className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl
                    ${theme === 'dark' ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-white border border-indigo-200'}
                  `}>
                    <MapPin className={`w-4 h-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <span className={`text-xs font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
                      {locations.length} Location{locations.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                <div className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl
                  ${theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-white border border-blue-200'}
                `}>
                  <Zap className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                    Quick Setup
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block w-64 flex-shrink-0">
              <TeamIllustration theme={theme} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveTab('teams')}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all
              ${activeTab === 'teams'
                ? theme === 'dark'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-purple-600 text-white shadow-lg'
                : theme === 'dark'
                  ? 'bg-slate-800 text-slate-400 hover:text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }
            `}
          >
            <Users size={18} />
            Teams
            {teams.length > 0 && (
              <span className={`
                px-2 py-0.5 rounded-lg text-xs
                ${activeTab === 'teams'
                  ? 'bg-white/20 text-white'
                  : theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                }
              `}>
                {teams.length}
              </span>
            )}
          </button>
          {showLocations && (
            <button
              onClick={() => setActiveTab('locations')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all
                ${activeTab === 'locations'
                  ? theme === 'dark'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-indigo-600 text-white shadow-lg'
                  : theme === 'dark'
                    ? 'bg-slate-800 text-slate-400 hover:text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }
              `}
            >
              <MapPin size={18} />
              Locations
              {locations.length > 0 && (
                <span className={`
                  px-2 py-0.5 rounded-lg text-xs
                  ${activeTab === 'locations'
                    ? 'bg-white/20 text-white'
                    : theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                  }
                `}>
                  {locations.length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <>
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h2 className={`text-xl sm:text-2xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Your Teams
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Organize employees into teams for better scheduling
                </p>
              </div>
              <button
                onClick={openAddTeamModal}
                className={`
                  w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all
                  hover:scale-105 active:scale-95 shadow-lg
                  ${theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                  }
                `}
              >
                <Plus size={20} className="sm:w-5 sm:h-5" />
                <span>New Team</span>
              </button>
            </div>

            {/* Teams Grid */}
            {teamsLoading ? (
              <div className={`text-center py-20 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                <p className="text-lg font-bold">Loading teams...</p>
              </div>
            ) : teams.length === 0 ? (
              <div className={`
                text-center py-16 sm:py-20 rounded-3xl border-2 border-dashed
                ${theme === 'dark' 
                  ? 'bg-slate-900/50 border-slate-700' 
                  : 'bg-white border-slate-200'
                }
              `}>
                <div className="max-w-md mx-auto">
                  <div className={`
                    inline-flex items-center justify-center w-24 h-24 rounded-full mb-6
                    ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-100'}
                  `}>
                    <Users className={`w-12 h-12 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <h3 className={`text-2xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    No teams yet
                  </h3>
                  <p className={`text-base mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Create your first team to organize employees and streamline scheduling
                  </p>
                  <button
                    onClick={openAddTeamModal}
                    className={`
                      inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black transition-all
                      hover:scale-105 active:scale-95
                      ${theme === 'dark'
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }
                    `}
                  >
                    <Plus size={20} />
                    Create Your First Team
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                  <div
                    key={team.id}
                    className={`
                      group relative rounded-2xl p-6 border-2 transition-all duration-300
                      hover:scale-[1.02] hover:shadow-2xl
                      ${theme === 'dark'
                        ? 'bg-slate-900/50 border-slate-700 hover:border-purple-500/50'
                        : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-xl'
                      }
                    `}
                  >
                    <div className={`
                      absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      ${theme === 'dark'
                        ? 'bg-gradient-to-br from-purple-500/5 to-indigo-500/5'
                        : 'bg-gradient-to-br from-purple-50/50 to-indigo-50/50'
                      }
                    `}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`
                              p-2 rounded-xl
                              ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}
                            `}>
                              <Users className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                            </div>
                            <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {team.name}
                            </h3>
                          </div>
                          {team.description && (
                            <p className={`
                              text-sm mb-4 line-clamp-2
                              ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                            `}>
                              {team.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Team Members */}
                      {teamUsers[team.id] && teamUsers[team.id].length > 0 ? (
                        <div className="mb-4">
                          <div className={`flex items-center gap-2 mb-3 ${
                            theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            <UserPlus size={14} />
                            <span className="text-xs font-bold">
                              {teamUsers[team.id].length} Member{teamUsers[team.id].length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {teamUsers[team.id].slice(0, 5).map((user) => (
                              <div
                                key={user.id}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                  theme === 'dark'
                                    ? 'bg-slate-800/50 border border-slate-700/50'
                                    : 'bg-slate-50 border border-slate-200'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                  theme === 'dark'
                                    ? 'bg-purple-500/20 text-purple-300'
                                    : 'bg-purple-100 text-purple-700'
                                }`}>
                                  {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-semibold truncate ${
                                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                                  }`}>
                                    {user.full_name || user.email}
                                  </p>
                                  {user.job_title && (
                                    <p className={`text-xs truncate ${
                                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                    }`}>
                                      {user.job_title}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                            {teamUsers[team.id].length > 5 && (
                              <p className={`text-xs text-center pt-1 ${
                                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                              }`}>
                                +{teamUsers[team.id].length - 5} more
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className={`mb-4 px-3 py-2 rounded-lg text-center ${
                          theme === 'dark'
                            ? 'bg-slate-800/30 border border-slate-700/30'
                            : 'bg-slate-50 border border-slate-200'
                        }`}>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            No members assigned
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
                        <button
                          onClick={() => openEditTeamModal(team)}
                          className={`
                            flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all
                            hover:scale-105 active:scale-95
                            ${theme === 'dark'
                              ? 'bg-slate-800 hover:bg-slate-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                            }
                          `}
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(team.id)}
                          className={`
                            px-4 py-2.5 rounded-xl text-sm font-bold transition-all
                            hover:scale-105 active:scale-95
                            ${theme === 'dark'
                              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                              : 'bg-red-50 hover:bg-red-100 text-red-600'
                            }
                          `}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Locations Tab */}
        {activeTab === 'locations' && showLocations && (
          <>
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h2 className={`text-xl sm:text-2xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Your Locations
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Manage work sites and physical locations
                </p>
              </div>
              <button
                onClick={openAddLocationModal}
                className={`
                  w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all
                  hover:scale-105 active:scale-95 shadow-lg
                  ${theme === 'dark'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white'
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white'
                  }
                `}
              >
                <Plus size={20} className="sm:w-5 sm:h-5" />
                <span>New Location</span>
              </button>
            </div>

            {/* Search */}
            <div className={`
              rounded-2xl p-6 mb-6 backdrop-blur-sm
              ${theme === 'dark' 
                ? 'bg-slate-800/50 border border-slate-700/50' 
                : 'bg-white border border-slate-200 shadow-sm'
              }
            `}>
              <div className={`
                flex items-center gap-3 px-4 py-2 rounded-xl
                ${theme === 'dark'
                  ? 'bg-slate-700/50 border border-slate-600'
                  : 'bg-slate-100 border border-slate-200'
                }
              `}>
                <Search size={18} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} />
                <input
                  type="text"
                  placeholder="Search locations by name or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`
                    flex-1 bg-transparent border-none outline-none text-sm
                    ${theme === 'dark' ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}
                  `}
                />
              </div>
            </div>

            {/* Locations Grid */}
            {locationsLoading ? (
              <div className={`text-center py-20 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
                <p className="text-lg font-bold">Loading locations...</p>
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className={`
                text-center py-16 sm:py-20 rounded-3xl border-2 border-dashed
                ${theme === 'dark' 
                  ? 'bg-slate-900/50 border-slate-700' 
                  : 'bg-white border-slate-200'
                }
              `}>
                <div className="max-w-md mx-auto">
                  <div className={`
                    inline-flex items-center justify-center w-24 h-24 rounded-full mb-6
                    ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-100'}
                  `}>
                    <MapPin className={`w-12 h-12 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  </div>
                  <h3 className={`text-2xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {searchQuery ? 'No locations found' : 'No locations yet'}
                  </h3>
                  <p className={`text-base mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {searchQuery 
                      ? 'Try adjusting your search terms'
                      : 'Create your first location to manage on-site work sites'
                    }
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={openAddLocationModal}
                      className={`
                        inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black transition-all
                        hover:scale-105 active:scale-95
                        ${theme === 'dark'
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }
                      `}
                    >
                      <Plus size={20} />
                      Create Your First Location
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLocations.map(location => (
                  <div
                    key={location.id}
                    className={`
                      group relative rounded-2xl p-6 border-2 transition-all duration-300
                      hover:scale-[1.02] hover:shadow-2xl
                      ${theme === 'dark'
                        ? 'bg-slate-900/50 border-slate-700 hover:border-indigo-500/50'
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xl'
                      }
                    `}
                  >
                    <div className={`
                      absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      ${theme === 'dark'
                        ? 'bg-gradient-to-br from-indigo-500/5 to-blue-500/5'
                        : 'bg-gradient-to-br from-indigo-50/50 to-blue-50/50'
                      }
                    `}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`
                              p-2 rounded-xl
                              ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100'}
                            `}>
                              <MapPin className={`w-5 h-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                            </div>
                            <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {location.name}
                            </h3>
                          </div>
                          {location.address && (
                            <p className={`
                              text-sm mb-3 line-clamp-2
                              ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                            `}>
                              {location.address}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mb-3">
                            <Globe className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                            <span className={`
                              text-xs font-bold
                              ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}
                            `}>
                              {location.timezone || 'UTC'}
                            </span>
                            {location.is_active ? (
                              <span className={`
                                ml-auto px-2 py-1 rounded-lg text-xs font-bold
                                ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}
                              `}>
                                <CheckCircle2 className="inline w-3 h-3 mr-1" />
                                Active
                              </span>
                            ) : (
                              <span className={`
                                ml-auto px-2 py-1 rounded-lg text-xs font-bold
                                ${theme === 'dark' ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'}
                              `}>
                                <XCircle className="inline w-3 h-3 mr-1" />
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
                        <button
                          onClick={() => openEditLocationModal(location)}
                          className={`
                            flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all
                            hover:scale-105 active:scale-95
                            ${theme === 'dark'
                              ? 'bg-slate-800 hover:bg-slate-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                            }
                          `}
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleLocationActive(location)}
                          className={`
                            px-4 py-2.5 rounded-xl text-sm font-bold transition-all
                            hover:scale-105 active:scale-95
                            ${location.is_active
                              ? theme === 'dark'
                                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                                : 'bg-red-50 hover:bg-red-100 text-red-600'
                              : theme === 'dark'
                                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                            }
                          `}
                        >
                          {location.is_active ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Remote Work Message */}
        {activeTab === 'locations' && !showLocations && (
          <div className={`
            text-center py-16 sm:py-20 rounded-3xl border-2 border-dashed
            ${theme === 'dark' 
              ? 'bg-slate-900/50 border-slate-700' 
              : 'bg-white border-slate-200'
            }
          `}>
            <div className="max-w-md mx-auto">
              <div className={`
                inline-flex items-center justify-center w-24 h-24 rounded-full mb-6
                ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-100'}
              `}>
                <Globe className={`w-12 h-12 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
              <h3 className={`text-2xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Locations Not Available
              </h3>
              <p className={`text-base ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Your organization is set to remote work. Locations are only available for on-site or hybrid organizations.
              </p>
            </div>
          </div>
        )}

        {/* Team Modal */}
        {showTeamModal && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998] transition-opacity"
              onClick={() => setShowTeamModal(false)}
            />
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
              <div
                className={`
                  relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-8 pointer-events-auto
                  shadow-2xl transform transition-all
                  ${theme === 'dark' 
                    ? 'bg-slate-900 border-2 border-slate-700' 
                    : 'bg-white border-2 border-slate-200'
                  }
                `}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-3 rounded-xl
                      ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}
                    `}>
                      {editingTeam ? (
                        <Edit2 className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                      ) : (
                        <Plus className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                      )}
                    </div>
                    <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {editingTeam ? 'Edit Team' : 'New Team'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowTeamModal(false)}
                    className={`
                      p-2 rounded-xl transition-colors
                      ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}
                    `}
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleTeamSubmit} className="space-y-5">
                  <div>
                    <label className={`block text-sm font-black mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Team Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={teamForm.name}
                      onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                      placeholder="e.g., Development Team, Sales Team"
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]
                        ${theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                        }
                      `}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-black mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Description
                    </label>
                    <textarea
                      value={teamForm.description}
                      onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                      rows="3"
                      placeholder="Optional description for this team..."
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all resize-none focus:scale-[1.01]
                        ${theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                        }
                      `}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowTeamModal(false)}
                      className={`
                        flex-1 px-6 py-3 rounded-xl font-black transition-all
                        hover:scale-105 active:scale-95
                        ${theme === 'dark'
                          ? 'bg-slate-800 hover:bg-slate-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                        }
                      `}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={teamSubmitting}
                      className={`
                        flex-1 px-6 py-3 rounded-xl font-black transition-all
                        hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                        bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white
                      `}
                    >
                      {teamSubmitting ? 'Saving...' : editingTeam ? 'Update Team' : 'Create Team'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {/* Location Modal */}
        {showLocationModal && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998] transition-opacity"
              onClick={() => setShowLocationModal(false)}
            />
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
              <div
                className={`
                  relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-8 pointer-events-auto
                  shadow-2xl transform transition-all
                  ${theme === 'dark' 
                    ? 'bg-slate-900 border-2 border-slate-700' 
                    : 'bg-white border-2 border-slate-200'
                  }
                `}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-3 rounded-xl
                      ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100'}
                    `}>
                      {editingLocation ? (
                        <Edit2 className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      ) : (
                        <Plus className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      )}
                    </div>
                    <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {editingLocation ? 'Edit Location' : 'New Location'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className={`
                      p-2 rounded-xl transition-colors
                      ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}
                    `}
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleLocationSubmit} className="space-y-5">
                  <div>
                    <label className={`block text-sm font-black mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      <MapPin className="inline w-4 h-4 mr-2" />
                      Location Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={locationForm.name}
                      onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                      placeholder="e.g., Downtown Office, Site A"
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]
                        ${theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                        }
                      `}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-black mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Address
                    </label>
                    <textarea
                      value={locationForm.address}
                      onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                      rows="3"
                      placeholder="Street address, city, state, ZIP"
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all resize-none focus:scale-[1.01]
                        ${theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                        }
                      `}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-black mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      <Globe className="inline w-4 h-4 mr-2" />
                      Timezone *
                    </label>
                    <select
                      required
                      value={locationForm.timezone}
                      onChange={(e) => setLocationForm({ ...locationForm, timezone: e.target.value })}
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]
                        ${theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                        }
                      `}
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowLocationModal(false)}
                      className={`
                        flex-1 px-6 py-3 rounded-xl font-black transition-all
                        hover:scale-105 active:scale-95
                        ${theme === 'dark'
                          ? 'bg-slate-800 hover:bg-slate-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                        }
                      `}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={locationSubmitting}
                      className={`
                        flex-1 px-6 py-3 rounded-xl font-black transition-all
                        hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                        bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white
                      `}
                    >
                      {locationSubmitting ? 'Saving...' : editingLocation ? 'Update Location' : 'Create Location'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BuildYourTeam;
