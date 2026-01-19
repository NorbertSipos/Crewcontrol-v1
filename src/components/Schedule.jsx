import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit2, Trash2, X, Clock, Calendar, Sparkles, Zap, 
  Sunrise, Sunset, Coffee, Timer, Globe, CheckCircle2, Moon, Sun
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import DashboardLayout from './DashboardLayout';

// Beautiful SVG Illustration Component
const ScheduleIllustration = ({ theme }) => (
  <svg width="300" height="200" viewBox="0 0 300 200" className="w-full h-auto">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={theme === 'dark' ? '#8b5cf6' : '#a78bfa'} />
        <stop offset="100%" stopColor={theme === 'dark' ? '#6366f1' : '#818cf8'} />
      </linearGradient>
    </defs>
    {/* Calendar Grid */}
    <rect x="50" y="30" width="200" height="140" rx="12" fill={theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(167, 139, 250, 0.2)'} stroke="url(#grad1)" strokeWidth="2" />
    {/* Calendar Days */}
    {[0, 1, 2, 3, 4, 5, 6].map((day, i) => (
      <rect key={i} x={60 + i * 26} y="50" width="20" height="20" rx="4" fill={theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(167, 139, 250, 0.3)'} />
    ))}
    {/* Clock Icon */}
    <circle cx="150" cy="120" r="25" fill="url(#grad1)" opacity="0.8" />
    <circle cx="150" cy="120" r="20" fill="none" stroke="white" strokeWidth="2" />
    <line x1="150" y1="120" x2="150" y2="110" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="150" y1="120" x2="158" y2="120" stroke="white" strokeWidth="2" strokeLinecap="round" />
    {/* Sparkles */}
    <circle cx="80" cy="50" r="3" fill="#fbbf24" opacity="0.8">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="220" cy="60" r="2.5" fill="#60a5fa" opacity="0.8">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="240" cy="140" r="2" fill="#34d399" opacity="0.8">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);

const Schedule = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    start_time: '',
    end_time: '',
    timezone: 'CET',
    break_duration_minutes: 0,
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch templates
  useEffect(() => {
    if (!userProfile?.organization_id) return;

    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) {
          console.error('No access token');
          setLoading(false);
          return;
        }

        const headers = {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Prefer': 'return=representation'
        };

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/schedule_templates?organization_id=eq.${userProfile.organization_id}&is_active=eq.true&select=*&order=name.asc`,
          { method: 'GET', headers }
        );

        if (response.ok) {
          const data = await response.json();
          setTemplates(data || []);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [userProfile?.organization_id]);

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

  // Open add template modal
  const openAddTemplateModal = () => {
    setEditingTemplate(null);
    setTemplateForm({
      name: '',
      start_time: '',
      end_time: '',
      timezone: 'CET',
      break_duration_minutes: 0,
      description: ''
    });
    setShowModal(true);
  };

  // Open edit template modal
  const openEditTemplateModal = (template) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      start_time: template.start_time,
      end_time: template.end_time,
      timezone: template.timezone || 'CET',
      break_duration_minutes: template.break_duration_minutes || 0,
      description: template.description || ''
    });
    setShowModal(true);
  };

  // Handle template submit (add or edit)
  const handleTemplateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        alert('Error: No access token');
        setSubmitting(false);
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Prefer': 'return=representation'
      };

      const templateData = {
        organization_id: userProfile.organization_id,
        name: templateForm.name,
        start_time: templateForm.start_time,
        end_time: templateForm.end_time,
        timezone: templateForm.timezone,
        break_duration_minutes: parseInt(templateForm.break_duration_minutes) || 0,
        description: templateForm.description || null,
        created_by: editingTemplate ? undefined : user.id,
        updated_at: new Date().toISOString()
      };

      let response;
      if (editingTemplate) {
        response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/schedule_templates?id=eq.${editingTemplate.id}`,
          {
            method: 'PATCH',
            headers,
            body: JSON.stringify(templateData)
          }
        );
      } else {
        response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/schedule_templates`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify(templateData)
          }
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      // Refresh templates
      const refreshResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/schedule_templates?organization_id=eq.${userProfile.organization_id}&is_active=eq.true&select=*&order=name.asc`,
        { method: 'GET', headers }
      );
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setTemplates(data || []);
      }

      setShowModal(false);
      setSubmitting(false);
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template: ' + error.message);
      setSubmitting(false);
    }
  };

  // Handle delete template
  const handleDeleteTemplate = async (templateId) => {
    if (!confirm('Are you sure you want to delete this schedule template?')) {
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
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/schedule_templates?id=eq.${templateId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ is_active: false })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      // Refresh templates
      const refreshResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/schedule_templates?organization_id=eq.${userProfile.organization_id}&is_active=eq.true&select=*&order=name.asc`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setTemplates(data || []);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Error deleting template: ' + error.message);
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  // Helper function to get time icon
  const getTimeIcon = (time) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 12) return <Sunrise className="w-5 h-5" />;
    if (hour >= 12 && hour < 17) return <Sun className="w-5 h-5" />;
    if (hour >= 17 && hour < 21) return <Sunset className="w-5 h-5" />;
    return <Moon className="w-5 h-5" />;
  };

  // Calculate duration
  const calculateDuration = (start, end) => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;
    const duration = endTotal - startTotal;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return { hours, minutes, total: duration };
  };

  if (authLoading || !user || !userProfile?.organization_id) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Loading...</div>
      </div>
    );
  }

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
                  <Calendar className={`w-8 h-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Schedule Templates
                  </h1>
                  <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-purple-200' : 'text-purple-700'}`}>
                    Create reusable shift templates for quick scheduling
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <div className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl
                  ${theme === 'dark' ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-white border border-purple-200'}
                `}>
                  <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                    Quick Setup
                  </span>
                </div>
                <div className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl
                  ${theme === 'dark' ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-white border border-indigo-200'}
                `}>
                  <Zap className={`w-4 h-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    One-Click Apply
                  </span>
                </div>
                <div className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl
                  ${theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-white border border-blue-200'}
                `}>
                  <CheckCircle2 className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                    {templates.length} Template{templates.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block w-64 flex-shrink-0">
              <ScheduleIllustration theme={theme} />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className={`text-xl sm:text-2xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Your Templates
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Manage your reusable schedule templates
            </p>
          </div>
          <button
            onClick={openAddTemplateModal}
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
            <span>New Template</span>
          </button>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className={`text-center py-20 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
            <p className="text-lg font-bold">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
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
                <Calendar className={`w-12 h-12 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <h3 className={`text-2xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                No templates yet
              </h3>
              <p className={`text-base mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Create your first schedule template to quickly assign shifts to your team
              </p>
              <button
                onClick={openAddTemplateModal}
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
                Create Your First Template
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => {
              const duration = calculateDuration(template.start_time, template.end_time);
              return (
                <div
                  key={template.id}
                  className={`
                    group relative rounded-2xl p-6 border-2 transition-all duration-300
                    hover:scale-[1.02] hover:shadow-2xl
                    ${theme === 'dark'
                      ? 'bg-slate-900/50 border-slate-700 hover:border-purple-500/50'
                      : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-xl'
                    }
                  `}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`
                    absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    ${theme === 'dark'
                      ? 'bg-gradient-to-br from-purple-500/5 to-indigo-500/5'
                      : 'bg-gradient-to-br from-purple-50/50 to-indigo-50/50'
                    }
                  `}></div>
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTimeIcon(template.start_time)}
                          <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {template.name}
                          </h3>
                        </div>
                        <div className={`
                          flex items-center gap-2 text-sm font-bold mb-3
                          ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}
                        `}>
                          <Clock className="w-4 h-4" />
                          <span>{template.start_time} - {template.end_time}</span>
                          <span className={`
                            px-2 py-0.5 rounded-lg text-xs
                            ${theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}
                          `}>
                            {template.timezone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Duration & Break Info */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg
                        ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}
                      `}>
                        <Timer className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`} />
                        <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                          {duration.hours}h {duration.minutes > 0 ? `${duration.minutes}m` : ''}
                        </span>
                      </div>
                      {template.break_duration_minutes > 0 && (
                        <div className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-lg
                          ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}
                        `}>
                          <Coffee className={`w-4 h-4 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
                          <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            {template.break_duration_minutes}m break
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {template.description && (
                      <p className={`
                        text-sm mb-4 line-clamp-2
                        ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                      `}>
                        {template.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
                      <button
                        onClick={() => openEditTemplateModal(template)}
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
                        onClick={() => handleDeleteTemplate(template.id)}
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
              );
            })}
          </div>
        )}

        {/* Add/Edit Template Modal */}
        {showModal && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998] transition-opacity"
              onClick={() => setShowModal(false)}
            />
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
            >
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
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-3 rounded-xl
                      ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}
                    `}>
                      {editingTemplate ? (
                        <Edit2 className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                      ) : (
                        <Plus className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                      )}
                    </div>
                    <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {editingTemplate ? 'Edit Template' : 'New Template'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`
                      p-2 rounded-xl transition-colors
                      ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}
                    `}
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleTemplateSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className={`block text-sm font-black mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Template Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                      placeholder="e.g., Morning Shift (8 AM - 4 PM)"
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]
                        ${theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                        }
                      `}
                    />
                  </div>

                  {/* Time Row */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Start Time */}
                    <div>
                      <label className={`block text-sm font-black mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        Start Time *
                      </label>
                      <input
                        type="time"
                        required
                        value={templateForm.start_time}
                        onChange={(e) => setTemplateForm({ ...templateForm, start_time: e.target.value })}
                        className={`
                          w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]
                          ${theme === 'dark'
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                          }
                        `}
                      />
                    </div>

                    {/* End Time */}
                    <div>
                      <label className={`block text-sm font-black mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        End Time *
                      </label>
                      <input
                        type="time"
                        required
                        value={templateForm.end_time}
                        onChange={(e) => setTemplateForm({ ...templateForm, end_time: e.target.value })}
                        className={`
                          w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]
                          ${theme === 'dark'
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                          }
                        `}
                      />
                    </div>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className={`block text-sm font-black mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      <Globe className="inline w-4 h-4 mr-2" />
                      Timezone *
                    </label>
                    <select
                      required
                      value={templateForm.timezone}
                      onChange={(e) => setTemplateForm({ ...templateForm, timezone: e.target.value })}
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]
                        ${theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                        }
                      `}
                    >
                      <option value="CET">CET (Central European Time)</option>
                      <option value="EST">EST (Eastern Standard Time)</option>
                      <option value="PST">PST (Pacific Standard Time)</option>
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="GMT">GMT (Greenwich Mean Time)</option>
                    </select>
                  </div>

                  {/* Break Duration */}
                  <div>
                    <label className={`block text-sm font-black mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      <Coffee className="inline w-4 h-4 mr-2" />
                      Break Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={templateForm.break_duration_minutes}
                      onChange={(e) => setTemplateForm({ ...templateForm, break_duration_minutes: e.target.value })}
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]
                        ${theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                        }
                      `}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className={`block text-sm font-black mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Description
                    </label>
                    <textarea
                      value={templateForm.description}
                      onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                      rows="3"
                      placeholder="Optional description for this template..."
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all resize-none focus:scale-[1.01]
                        ${theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                        }
                      `}
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
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
                      disabled={submitting}
                      className={`
                        flex-1 px-6 py-3 rounded-xl font-black transition-all
                        hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                        bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white
                      `}
                    >
                      {submitting ? 'Saving...' : editingTemplate ? 'Update Template' : 'Create Template'}
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

export default Schedule;
