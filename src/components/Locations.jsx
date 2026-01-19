import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Plus, Search, MoreVertical, 
  CheckCircle2, XCircle, Edit2, Trash2, Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import DashboardLayout from './DashboardLayout';

const Locations = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [locations, setLocations] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [locationForm, setLocationForm] = useState({
    name: '',
    address: '',
    timezone: 'UTC'
  });
  const [submitting, setSubmitting] = useState(false);

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
      // Only managers can access locations page
      if (userProfile.role !== 'manager') {
        navigate('/dashboard');
        return;
      }
    }
  }, [user, userProfile, authLoading, navigate]);

  // Fetch locations and organization
  useEffect(() => {
    if (!userProfile?.organization_id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) {
          console.error('No access token');
          setLoading(false);
          return;
        }

        // Fetch organization to check work_type
        const orgResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/organizations?id=eq.${userProfile.organization_id}&select=*`,
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

        if (orgResponse.ok) {
          const orgData = await orgResponse.json();
          if (orgData && orgData.length > 0) {
            setOrganization(orgData[0]);
            
            // Only fetch locations if work_type is on-site or hybrid
            if (orgData[0].work_type === 'on-site' || orgData[0].work_type === 'hybrid') {
              // Fetch locations
              const locationsResponse = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/locations?organization_id=eq.${userProfile.organization_id}&select=*&order=name.asc`,
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

              if (locationsResponse.ok) {
                const locationsData = await locationsResponse.json();
                setLocations(locationsData || []);
              }
            }
          }
        }

      } catch (err) {
        console.error('Error fetching locations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userProfile?.organization_id]);

  // Filter locations
  const filteredLocations = useMemo(() => {
    return locations.filter(loc => 
      loc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [locations, searchQuery]);

  // Handle form submit (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        alert('Error: No access token');
        return;
      }

      const url = editingLocation
        ? `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/locations?id=eq.${editingLocation.id}`
        : `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/locations`;

      const method = editingLocation ? 'PATCH' : 'POST';

      const body = {
        name: locationForm.name.trim(),
        address: locationForm.address.trim() || null,
        timezone: locationForm.timezone || 'UTC',
        organization_id: userProfile.organization_id,
        ...(editingLocation ? {} : { is_active: true })
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(body),
        signal: undefined
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save location');
      }

      // Refresh locations
      const locationsResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/locations?organization_id=eq.${userProfile.organization_id}&select=*&order=name.asc`,
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

      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json();
        setLocations(locationsData || []);
      }

      // Reset form and close modal
      setLocationForm({ name: '', address: '', timezone: 'UTC' });
      setEditingLocation(null);
      setShowAddModal(false);

    } catch (err) {
      console.error('Error saving location:', err);
      alert(`Failed to save location: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete/deactivate location
  const handleToggleActive = async (location) => {
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
            'Authorization': `Bearer ${accessToken}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ is_active: !location.is_active }),
          signal: undefined
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      // Refresh locations
      const locationsResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/locations?organization_id=eq.${userProfile.organization_id}&select=*&order=name.asc`,
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

      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json();
        setLocations(locationsData || []);
      }

    } catch (err) {
      console.error('Error updating location:', err);
      alert('Failed to update location');
    }
  };

  // Handle edit
  const handleEdit = (location) => {
    setEditingLocation(location);
    setLocationForm({
      name: location.name || '',
      address: location.address || '',
      timezone: location.timezone || 'UTC'
    });
    setShowAddModal(true);
  };

  if (authLoading || loading || !userProfile?.organization_id) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Loading...</div>
      </div>
    );
  }

  // Show message if organization is remote
  if (organization && organization.work_type === 'remote') {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-7xl mx-auto">
          <div className={`rounded-2xl p-8 text-center ${
            theme === 'dark' 
              ? 'bg-slate-800/50 border border-slate-700/50' 
              : 'bg-white border border-slate-200 shadow-sm'
          }`}>
            <Globe className={`mx-auto mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`} size={48} />
            <h2 className={`text-2xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Locations Not Available
            </h2>
            <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
              Your organization is set to remote work. Locations are only available for on-site or hybrid organizations.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-black tracking-tight mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Locations
            </h1>
            <p className={theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}>
              Manage your work sites and locations
            </p>
          </div>
          <button
            onClick={() => {
              setEditingLocation(null);
              setLocationForm({ name: '', address: '', timezone: 'UTC' });
              setShowAddModal(true);
            }}
            className={`
              px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 
              transition-all hover:scale-105 shadow-lg
              bg-purple-600 hover:bg-purple-700 text-white
            `}
          >
            <Plus size={18} /> Add Location
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`
            rounded-2xl p-6 backdrop-blur-sm
            ${theme === 'dark' 
              ? 'bg-slate-800/50 border border-slate-700/50' 
              : 'bg-white border border-slate-200 shadow-sm'
            }
          `}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>Total Locations</span>
              <MapPin className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} size={20} />
            </div>
            <p className={`text-3xl font-black ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>{locations.length}</p>
          </div>

          <div className={`
            rounded-2xl p-6 backdrop-blur-sm
            ${theme === 'dark' 
              ? 'bg-slate-800/50 border border-slate-700/50' 
              : 'bg-white border border-slate-200 shadow-sm'
            }
          `}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>Active Locations</span>
              <CheckCircle2 className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} size={20} />
            </div>
            <p className={`text-3xl font-black ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>{locations.filter(l => l.is_active).length}</p>
          </div>

          <div className={`
            rounded-2xl p-6 backdrop-blur-sm
            ${theme === 'dark' 
              ? 'bg-slate-800/50 border border-slate-700/50' 
              : 'bg-white border border-slate-200 shadow-sm'
            }
          `}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>Inactive Locations</span>
              <XCircle className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} size={20} />
            </div>
            <p className={`text-3xl font-black ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>{locations.filter(l => !l.is_active).length}</p>
          </div>
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

        {/* Locations Table */}
        <div className={`
          rounded-2xl overflow-hidden backdrop-blur-sm
          ${theme === 'dark' 
            ? 'bg-slate-800/50 border border-slate-700/50' 
            : 'bg-white border border-slate-200 shadow-sm'
          }
        `}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={theme === 'dark' ? 'bg-slate-800/80' : 'bg-slate-50'}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>Location Name</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>Address</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>Timezone</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>Status</th>
                  <th className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>Actions</th>
                </tr>
              </thead>
              <tbody className={theme === 'dark' ? 'divide-y divide-slate-700' : 'divide-y divide-slate-100'}>
                {filteredLocations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={`px-6 py-12 text-center ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {searchQuery ? 'No locations found matching your search' : 'No locations yet. Add your first location above.'}
                    </td>
                  </tr>
                ) : (
                  filteredLocations.map(location => (
                    <tr key={location.id} className={`
                      hover:transition-colors
                      ${theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}
                    `}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <MapPin className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} size={18} />
                          <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {location.name}
                          </p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {location.address || '-'}
                      </td>
                      <td className={`px-6 py-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {location.timezone || 'UTC'}
                      </td>
                      <td className="px-6 py-4">
                        {location.is_active ? (
                          <span className={`
                            inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold
                            ${theme === 'dark' 
                              ? 'bg-emerald-500/20 text-emerald-300' 
                              : 'bg-emerald-100 text-emerald-700'
                            }
                          `}>
                            <CheckCircle2 size={14} /> Active
                          </span>
                        ) : (
                          <span className={`
                            inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold
                            ${theme === 'dark' 
                              ? 'bg-red-500/20 text-red-300' 
                              : 'bg-red-100 text-red-700'
                            }
                          `}>
                            <XCircle size={14} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(location)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark' 
                                ? 'hover:bg-slate-700 text-slate-400 hover:text-white' 
                                : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleActive(location)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark' 
                                ? 'hover:bg-slate-700 text-slate-400 hover:text-white' 
                                : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {location.is_active ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Location Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowAddModal(false);
              setEditingLocation(null);
              setLocationForm({ name: '', address: '', timezone: 'UTC' });
            }}
          ></div>
          <div className={`
            relative w-full max-w-md rounded-2xl p-6 shadow-2xl
            ${theme === 'dark' 
              ? 'bg-slate-800 border border-slate-700' 
              : 'bg-white border border-slate-200'
            }
          `}>
            <h2 className={`text-2xl font-black mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {editingLocation ? 'Edit Location' : 'Add Location'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Location Name *
                </label>
                <input
                  type="text"
                  required
                  value={locationForm.name}
                  onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                  className={`
                    w-full px-4 py-3 rounded-xl border outline-none transition-colors
                    ${theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
                    }
                  `}
                  placeholder="e.g., Downtown Office, Site A"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Address
                </label>
                <textarea
                  value={locationForm.address}
                  onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                  rows={3}
                  className={`
                    w-full px-4 py-3 rounded-xl border outline-none transition-colors resize-none
                    ${theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
                    }
                  `}
                  placeholder="Street address, city, state, ZIP"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Timezone
                </label>
                <select
                  value={locationForm.timezone}
                  onChange={(e) => setLocationForm({ ...locationForm, timezone: e.target.value })}
                  className={`
                    w-full px-4 py-3 rounded-xl border outline-none transition-colors cursor-pointer
                    ${theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
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
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingLocation(null);
                    setLocationForm({ name: '', address: '', timezone: 'UTC' });
                  }}
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
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (editingLocation ? 'Update' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Locations;
