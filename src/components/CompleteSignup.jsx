import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Plus, X, Check, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const CompleteSignup = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const isSubmittingRef = useRef(false); // Prevent interference during submission
  const abortControllerRef = useRef(null);
  const sessionTokenRef = useRef(null); // Cache session token to avoid abort issues

  // Company Information
  const [companyData, setCompanyData] = useState({
    companyName: '',
    industry: '',
    workType: 'remote' // 'remote', 'on-site', 'hybrid'
  });

  // Teams (optional - for companies with multiple teams)
  const [teams, setTeams] = useState([
    { name: '', description: '' }
  ]);

  // Locations (only if on-site or hybrid)
  const [locations, setLocations] = useState([
    { name: '', address: '', timezone: 'UTC' }
  ]);

  // Plan Selection
  const [selectedPlan, setSelectedPlan] = useState('starter');

  // Industries list
  const industries = [
    'Restaurant & Food Service',
    'Construction',
    'Retail',
    'Healthcare',
    'Logistics & Warehouse',
    'Hospitality',
    'Manufacturing',
    'Event Management',
    'Security Services',
    'Other'
  ];

  // Track component lifecycle
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Cache session token from localStorage to avoid abort issues with getSession() in dev
  useEffect(() => {
    if (user?.id && !sessionTokenRef.current) {
      try {
        // Supabase stores session in localStorage when persistSession: true
        // Try to find the auth token in localStorage by checking common key patterns
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('supabase') || key.includes('sb-'))) {
            try {
              const sessionStr = localStorage.getItem(key);
              if (sessionStr) {
                const sessionData = JSON.parse(sessionStr);
                // Try multiple possible token locations
                const token = sessionData?.access_token || sessionData?.accessToken || sessionData?.currentSession?.access_token || (Array.isArray(sessionData) && sessionData[0]?.access_token);
                if (token) {
                  sessionTokenRef.current = token;
                  break;
                }
              }
            } catch (parseErr) {
              // Continue searching other keys
            }
          }
        }
      } catch (err) {
        // Silently fail - will try again during submission
      }
    }
  }, [user]);

  // Check if user is logged in and if they already have an organization
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CompleteSignup.jsx:92',message:'CompleteSignup useEffect triggered',data:{isSubmitting:isSubmittingRef.current,hasUser:!!user,userId:user?.id,hasUserProfile:!!userProfile,userProfileIsNull:userProfile===null,hasOrgId:!!userProfile?.organization_id,orgId:userProfile?.organization_id,authLoading},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
    // Don't navigate during form submission
    if (isSubmittingRef.current) {
      return;
    }
    
    if (!user) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CompleteSignup.jsx:100',message:'CompleteSignup: No user, redirecting to signin',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
      // Not logged in, redirect to sign in
      navigate('/signin');
    } else if (userProfile?.organization_id) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CompleteSignup.jsx:103',message:'CompleteSignup: User has org_id, redirecting to dashboard',data:{orgId:userProfile?.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
      // User already has an organization, redirect to dashboard
      navigate('/dashboard');
    }
  }, [user, userProfile, navigate]);

  // Show loading while checking auth or waiting for userProfile to load
  // authLoading is true until userProfile fetch completes (even if profile is null)
  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CompleteSignup.jsx:109',message:'CompleteSignup render check',data:{authLoading,hasUser:!!user,hasUserProfile:!!userProfile,userProfileIsNull:userProfile===null,hasOrgId:!!userProfile?.organization_id,orgId:userProfile?.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
  }
  // #endregion
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleTeamChange = (index, field, value) => {
    const updated = [...teams];
    updated[index][field] = value;
    setTeams(updated);
  };

  const addTeam = () => {
    setTeams([...teams, { name: '', description: '' }]);
  };

  const removeTeam = (index) => {
    if (teams.length > 1) {
      setTeams(teams.filter((_, i) => i !== index));
    }
  };

  const handleLocationChange = (index, field, value) => {
    const updated = [...locations];
    updated[index][field] = value;
    setLocations(updated);
  };

  const addLocation = () => {
    setLocations([...locations, { name: '', address: '', timezone: 'UTC' }]);
  };

  const removeLocation = (index) => {
    if (locations.length > 1) {
      setLocations(locations.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (!companyData.companyName || !companyData.industry || !companyData.workType) {
      setError('Please fill in all company details');
      return false;
    }
    if (companyData.workType !== 'remote') {
      const hasEmptyLocations = locations.some(loc => !loc.name.trim());
      if (hasEmptyLocations) {
        setError('Please fill in all location names');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Prevent double submission
    if (isSubmittingRef.current || loading) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      if (!user?.id) {
        setError('You must be logged in to complete signup');
        setLoading(false);
        return;
      }

      // Step 1: Create Organization and User using database function
      // This bypasses RLS and creates both in a single transaction, avoiding AbortError issues
      // Add retry logic for AbortError (React StrictMode issue)
      
      let functionResult, functionError;
      let retryCount = 0;
      const maxRetries = 3;
      const rpcParams = {
        p_user_id: user.id,
        p_user_email: user.email,
        p_user_full_name: user.user_metadata?.full_name || user.email,
        p_org_name: companyData.companyName,
        p_org_industry: companyData.industry,
        p_org_work_type: companyData.workType,
        p_org_plan: selectedPlan
      };
      
      // Retry logic for AbortError on RPC call
      while (retryCount <= maxRetries) {
        // Use direct fetch to Supabase REST API to bypass Supabase client abort controllers
        // Use cached session token to avoid abort issues with getSession() call
        try {
          let accessToken = sessionTokenRef.current;
          
          // If we don't have a cached token, try to get it (may abort in dev)
          if (!accessToken) {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              accessToken = session?.access_token;
              if (accessToken) {
                sessionTokenRef.current = accessToken; // Cache it for next time
              }
            } catch (sessionErr) {
              // getSession() may abort - continue with null token and let fetch fail with 401
            }
          }
          
          if (!accessToken) {
            functionError = { message: 'No session token available' };
            break;
          }
          
          // Add a small delay before fetch to let any pending aborts clear
          if (retryCount > 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/create_organization_and_user`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
                'Prefer': 'return=representation'
              },
              body: JSON.stringify(rpcParams),
              // Don't use AbortController - let the request complete naturally
              signal: undefined
            }
          );
          
          if (!response.ok) {
            const errorText = await response.text();
            functionError = { 
              message: `HTTP ${response.status}: ${errorText}`,
              code: response.status.toString()
            };
          } else {
            functionResult = await response.json();
            functionError = null;
          }
        } catch (fetchErr) {
          // Check if it's still an AbortError
          if (fetchErr.name === 'AbortError' || fetchErr.message?.includes('aborted')) {
            functionError = { message: fetchErr.message || 'AbortError: signal is aborted without reason' };
          } else {
            functionError = { message: fetchErr.message || 'Network error during RPC call' };
          }
        }
        
        // If successful or non-AbortError, break
        if (!functionError || (!functionError.message?.includes('AbortError') && !functionError.message?.includes('aborted'))) {
          break;
        }
        
        // If AbortError and we have retries left, wait and retry
        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
        } else {
          break;
        }
      }

      if (functionError) {
        // Check if it's still an AbortError after retries
        const isAbortError = functionError.message?.includes('AbortError') || functionError.message?.includes('aborted');
        isSubmittingRef.current = false;
        if (isAbortError) {
          setError('Request was cancelled. Please try again. If this persists, check your network connection or disable React StrictMode in development.');
        } else {
          setError(functionError.message || 'Failed to create organization and user profile');
        }
        setLoading(false);
        return;
      }

      if (!functionResult || !functionResult[0] || !functionResult[0].organization_id) {
        setError('Failed to create organization. Please try again.');
        setLoading(false);
        return;
      }

      const organizationId = functionResult[0].organization_id;
      const userWasCreated = functionResult[0].user_created;

      // Step 2: Create Locations (if on-site or hybrid)
      if (companyData.workType !== 'remote' && locations.length > 0) {
        const locationsToInsert = locations
          .filter(loc => loc.name.trim())
          .map(loc => ({
            id: crypto.randomUUID(),
            organization_id: organizationId,
            name: loc.name.trim(),
            address: loc.address.trim() || null,
            timezone: loc.timezone || 'UTC'
          }));

        if (locationsToInsert.length > 0) {
          const { error: locError } = await supabase
            .from('locations')
            .insert(locationsToInsert);

          if (locError) {
            console.error('Location creation error:', locError);
          }
        }
      }

      // Step 3: User record is already created by the database function above
      // No need to create it separately

      // Step 4: Create Teams (if provided)
      if (teams.length > 0) {
        const teamsToInsert = teams
          .filter(team => team.name.trim())
          .map(team => ({
            organization_id: organizationId,
            name: team.name.trim(),
            description: team.description.trim() || null
          }));

        if (teamsToInsert.length > 0) {
          const { data: createdTeams, error: teamsError } = await supabase
            .from('teams')
            .insert(teamsToInsert)
            .select();

          if (teamsError) {
            console.error('Teams creation error:', teamsError);
            // Don't block signup if teams creation fails
          }
        }
      }

      // Success! Navigate immediately
      // Reset submitting flag before navigation
      isSubmittingRef.current = false;
      
      // Use setTimeout to ensure navigation happens after all async operations complete
      // Also give AuthContext time to refresh userProfile after user creation
      setTimeout(() => {
        // Always navigate using window.location to avoid React Router issues
        // Use replace to prevent back button issues
        window.location.replace('/dashboard');
      }, 200);

    } catch (err) {
      // Reset submitting flag on error
      isSubmittingRef.current = false;
      
      // Handle AbortError gracefully
      if (err?.name === 'AbortError') {
        // AbortError is usually harmless (request cancelled due to unmount/navigation)
        // Don't show error to user, but also don't navigate (let the user retry)
        setLoading(false);
        return;
      }
      
      console.error('Complete signup error:', err);
      setError(err?.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="pt-8 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              Complete Your Setup
            </h1>
            <p className="text-slate-400 text-lg">
              Tell us about your organization to get started
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl shadow-purple-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
              
              <div className="relative z-10">
                {error && !error.includes('AbortError') && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400 mb-5">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Name */}
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-slate-300 mb-2">
                      Company Name *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Building2 className="text-slate-500" size={18} />
                      </div>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={companyData.companyName}
                        onChange={handleCompanyChange}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        placeholder="Acme Inc."
                      />
                    </div>
                  </div>

                  {/* Industry */}
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-slate-300 mb-2">
                      Industry *
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={companyData.industry}
                      onChange={handleCompanyChange}
                      required
                      className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-900">Select an industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry} className="bg-slate-900">
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Work Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Work Type *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { value: 'remote', label: 'Remote', desc: 'Everyone works from home' },
                        { value: 'on-site', label: 'On-Site', desc: 'Physical locations required' },
                        { value: 'hybrid', label: 'Hybrid', desc: 'Mix of remote and on-site' }
                      ].map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setCompanyData(prev => ({ ...prev, workType: option.value }))}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            companyData.workType === option.value
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-white/10 bg-black/30 hover:border-purple-500/50'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              companyData.workType === option.value
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-white/30'
                            }`}>
                              {companyData.workType === option.value && (
                                <Check size={12} className="text-white" />
                              )}
                            </div>
                            <span className="font-semibold text-white">{option.label}</span>
                          </div>
                          <p className="text-xs text-slate-400 ml-7">{option.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Locations (if on-site or hybrid) */}
                  {companyData.workType !== 'remote' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        Work Locations *
                      </label>
                      <p className="text-slate-400 text-sm mb-4">
                        Add your work locations. Employees will be assigned to shifts at these locations.
                      </p>
                      {locations.map((location, index) => (
                        <div key={index} className="p-4 bg-black/20 rounded-xl border border-white/10 space-y-3 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                              <MapPin className="text-purple-400" size={16} />
                              Location {index + 1}
                            </label>
                            {locations.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLocation(index)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <X size={18} />
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={location.name}
                            onChange={(e) => handleLocationChange(index, 'name', e.target.value)}
                            placeholder="Site A, Downtown Office, etc."
                            required
                            className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                          />
                          <input
                            type="text"
                            value={location.address}
                            onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                            placeholder="Address (optional)"
                            className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addLocation}
                        className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-slate-400 hover:text-white hover:border-purple-500/50 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        Add Another Location
                      </button>
                    </div>
                  )}

                  {/* Teams (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Teams <span className="text-slate-500">(Optional)</span>
                    </label>
                    <p className="text-slate-400 text-sm mb-4">
                      Add teams within your organization. You can add more later.
                    </p>
                    {teams.map((team, index) => (
                      <div key={index} className="p-4 bg-black/20 rounded-xl border border-white/10 space-y-3 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Users className="text-purple-400" size={16} />
                            Team {index + 1}
                          </label>
                          {teams.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTeam(index)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={team.name}
                          onChange={(e) => handleTeamChange(index, 'name', e.target.value)}
                          placeholder="Team name (e.g., Front of House, Kitchen, etc.)"
                          className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        />
                        <input
                          type="text"
                          value={team.description}
                          onChange={(e) => handleTeamChange(index, 'description', e.target.value)}
                          placeholder="Description (optional)"
                          className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTeam}
                      className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-slate-400 hover:text-white hover:border-purple-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Add Another Team
                    </button>
                  </div>

                  {/* Plan Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Choose Your Plan *
                    </label>
                    <p className="text-slate-400 text-sm mb-4">
                      You can upgrade or downgrade anytime.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          id: 'starter',
                          name: 'Starter',
                          price: '$19.99',
                          period: '/mo',
                          desc: 'Perfect for small teams',
                          features: ['Up to 10 employees', 'All core features', 'Email support']
                        },
                        {
                          id: 'professional',
                          name: 'Professional',
                          price: '$49.99',
                          period: '/mo',
                          desc: 'For growing businesses',
                          features: ['Up to 50 employees', 'Advanced features', 'Priority support']
                        }
                      ].map(plan => (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setSelectedPlan(plan.id)}
                          className={`p-5 rounded-xl border-2 transition-all text-left ${
                            selectedPlan === plan.id
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-white/10 bg-black/30 hover:border-purple-500/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-white">{plan.name}</span>
                            {selectedPlan === plan.id && (
                              <Check className="text-purple-400" size={20} />
                            )}
                          </div>
                          <div className="mb-2">
                            <span className="text-2xl font-black text-white">{plan.price}</span>
                            <span className="text-slate-400 text-sm">{plan.period}</span>
                          </div>
                          <p className="text-sm text-slate-400 mb-3">{plan.desc}</p>
                          <ul className="space-y-1">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="text-xs text-slate-400 flex items-center gap-2">
                                <Check size={12} className="text-purple-400" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-slate-950 py-4 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {loading ? 'Setting up...' : 'Complete Setup'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteSignup;
