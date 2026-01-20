import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Users, BarChart3, Settings, 
  Search, Bell, Plus, Clock, AlertTriangle, AlertCircle,
  ChevronRight, ChevronLeft, MoreVertical, CheckCircle2, Zap, Filter,
  Moon, Sun, TrendingUp, TrendingDown, Activity, FileText, Timer, UserCheck, CalendarCheck, Mail,
  Edit2, Trash2, MapPin, X, CalendarDays, Grid3x3, LogOut, Eraser
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase';
import { createNotification } from '../lib/notificationService';
import NotificationCenter from './NotificationCenter';

// Template Card Component for the redesigned modal
const TemplateCard = ({ template, theme, isDefault, onClick }) => {
  const isEmergency = template.shift_type === 'emergency';
  const isPaidLeave = template.shift_type === 'paid_leave';
  const isDayOff = template.shift_type === 'day_off';
  const isFullDay = (isEmergency || isPaidLeave || isDayOff) && 
                    template.start_time === '00:00:00' && template.end_time === '23:59:59';
  
  // Get icon for default templates
  const getIcon = () => {
    if (isEmergency) return <AlertCircle size={16} />;
    if (isPaidLeave) return <FileText size={16} />;
    if (isDayOff) return <CalendarDays size={16} />;
    return <Clock size={16} />;
  };
  
  // Format time display
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${minutes} ${ampm}`;
  };
  
  return (
    <button
      onClick={onClick}
      className={`
        group relative p-3 rounded-xl border-2 transition-all duration-200
        hover:scale-105 hover:shadow-lg active:scale-95
        ${isDefault
          ? theme === 'dark'
            ? 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
          : theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700/30 hover:border-purple-500/50'
            : 'bg-white border-slate-200 hover:border-purple-300'
        }
      `}
      style={!isDefault ? { borderLeftColor: template.color || '#6366f1', borderLeftWidth: '4px' } : {}}
    >
      {/* Color indicator bar for user templates */}
      {!isDefault && (
        <div 
          className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
          style={{ backgroundColor: template.color || '#6366f1' }}
        />
      )}
      
      <div className="flex flex-col items-center text-center gap-1.5">
        {/* Icon or color circle */}
        <div
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center transition-all
            group-hover:scale-110
            ${isDefault
              ? isEmergency
                ? 'bg-red-500/20 text-red-400'
                : isPaidLeave
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-500/20 text-slate-400'
              : 'text-white'
            }
          `}
          style={!isDefault ? { backgroundColor: template.color || '#6366f1' } : {}}
        >
          {isDefault ? getIcon() : <Clock size={18} />}
        </div>
        
        {/* Template name */}
        <div className="w-full">
          <div className={`
            text-xs font-bold truncate
            ${theme === 'dark' ? 'text-white' : 'text-slate-900'}
          `}>
            {template.name}
          </div>
          
          {/* Time display */}
          {!isFullDay && (
            <div className={`
              text-[10px] mt-0.5
              ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}
            `}>
              {formatTime(template.start_time)} - {formatTime(template.end_time)}
            </div>
          )}
          
          {/* Default badge */}
          {isDefault && (
            <div className={`
              text-[9px] mt-1 px-1.5 py-0.5 rounded-full font-bold
              ${isEmergency
                ? 'bg-red-500/10 text-red-400'
                : isPaidLeave
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-slate-500/10 text-slate-400'
              }
            `}>
              Default
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

// Default template colors (for Emergency, Paid Leave, and Day Off)
const DEFAULT_TEMPLATE_COLORS = {
  emergency: '#dc2626', // Red
  paid_leave: '#059669', // Emerald
  day_off: '#64748b', // Slate/Gray
};

// Modular Metric Card Component
const MetricCard = ({ metric, theme, loading }) => {
  const { label, value, change, changeType, icon: Icon, color, bgGradient } = metric;
  
  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 
        transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
        ${theme === 'dark' 
          ? 'bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm' 
          : 'bg-white border border-slate-200 shadow-sm'
        }
        ${bgGradient ? `bg-gradient-to-br ${bgGradient}` : ''}
      `}
    >
      {/* Decorative gradient overlay */}
      <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full blur-3xl opacity-10 ${bgGradient || `bg-${color}-500`}`}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className={`
            p-2 sm:p-3 rounded-lg sm:rounded-xl 
            ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-100'}
          `}>
            {Icon && <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />}
          </div>
          {change && (
            <span className={`
              text-xs font-bold px-2 py-1 rounded-lg
              ${changeType === 'positive' 
                ? theme === 'dark' ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-600 bg-emerald-50'
                : changeType === 'negative'
                ? theme === 'dark' ? 'text-red-400 bg-red-500/10' : 'text-red-600 bg-red-50'
                : theme === 'dark' ? 'text-amber-400 bg-amber-500/10' : 'text-amber-600 bg-amber-50'
              }
            `}>
              {changeType === 'positive' && <TrendingUp className="inline w-3 h-3 mr-1" />}
              {changeType === 'negative' && <TrendingDown className="inline w-3 h-3 mr-1" />}
              {change}
            </span>
          )}
        </div>
        
        <div className={`
          text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1 sm:mb-2
          ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
        `}>
          {label}
        </div>
        
        <div className={`
          text-2xl sm:text-3xl font-black tracking-tight
          ${theme === 'dark' ? 'text-white' : 'text-slate-900'}
          ${loading ? 'animate-pulse' : ''}
        `}>
          {loading ? '...' : value}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, userProfile, loading: authLoading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const [view, setView] = useState('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [metricsData, setMetricsData] = useState({
    totalEmployees: 0,
    pendingInvitations: 0,
    pendingRequests: 0,
    todayShifts: 0,
    activeNow: 0,
    totalHours: 0,
    upcomingTimeOff: 0,
    newHires: 0,
  });
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Calendar state
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateModalContext, setTemplateModalContext] = useState({ day: null, employeeId: null });
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0, visible: false, day: null, employeeId: null });
  const [editingShift, setEditingShift] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null); // { date: Date, shifts: [], position: { x, y } }
  const [shiftForm, setShiftForm] = useState({
    employee_id: '',
    location_id: '',
    start_time: '',
    end_time: '',
    break_duration_minutes: 0,
    status: 'scheduled',
    shift_type: 'on_shift', // 'on_shift', 'paid_leave', 'emergency'
    color: '#8b5cf6', // Default purple color
    notes: ''
  });
  
  // Default shift types with colors (works on both dark and light themes)
  const shiftTypes = [
    { value: 'on_shift', label: 'On Shift', color: '#6366f1', defaultColor: '#6366f1' }, // Indigo - good contrast on both themes
    { value: 'paid_leave', label: 'Paid Leave', color: '#059669', defaultColor: '#059669' }, // Emerald - good contrast on both themes
    { value: 'emergency', label: 'Emergency', color: '#dc2626', defaultColor: '#dc2626' }, // Red - good contrast on both themes
  ];
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    employee: 'all',
    location: 'all',
    jobTitle: 'all',
    team: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [teams, setTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scheduleTemplates, setScheduleTemplates] = useState([]);
  const [draggedShift, setDraggedShift] = useState(null);
  const [dragOverCell, setDragOverCell] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const prevLocationRef = useRef(location.pathname);

  // Modular metrics configuration - connected to real data
  const metrics = useMemo(() => [
    { 
      id: 'active_now',
      label: "Active Now", 
      value: metricsLoading ? "..." : metricsData.activeNow.toString(), 
      change: null, 
      changeType: "positive",
      icon: Activity,
      color: "text-emerald-500",
      bgGradient: "from-emerald-500/20 to-teal-500/10"
    },
    { 
      id: 'pending_requests',
      label: "Pending Requests", 
      value: metricsLoading ? "..." : metricsData.pendingRequests.toString(), 
      change: metricsData.pendingRequests > 0 ? "Action required" : null, 
      changeType: "warning",
      icon: FileText,
      color: "text-amber-500",
      bgGradient: "from-amber-500/20 to-orange-500/10"
    },
    { 
      id: 'total_employees',
      label: "Total Employees", 
      value: metricsLoading ? "..." : metricsData.totalEmployees.toString(), 
      change: metricsData.newHires > 0 ? `+${metricsData.newHires} this month` : null, 
      changeType: "positive",
      icon: Users,
      color: "text-blue-500",
      bgGradient: "from-blue-500/20 to-indigo-500/10"
    },
    { 
      id: 'today_shifts',
      label: "Today's Shifts", 
      value: metricsLoading ? "..." : metricsData.todayShifts.toString(), 
      change: null, 
      changeType: "positive",
      icon: CalendarCheck,
      color: "text-purple-500",
      bgGradient: "from-purple-500/20 to-pink-500/10"
    },
    { 
      id: 'total_hours',
      label: view === 'weekly' ? "Total Hours This Week" : "Total Hours This Month", 
      value: metricsLoading ? "..." : metricsData.totalHours.toLocaleString(), 
      change: null, 
      changeType: "positive",
      icon: Clock,
      color: "text-green-500",
      bgGradient: "from-green-500/20 to-emerald-500/10"
    },
    { 
      id: 'upcoming_timeoff',
      label: "Upcoming Time Off", 
      value: metricsLoading ? "..." : metricsData.upcomingTimeOff.toString(), 
      change: "Next 30 days", 
      changeType: "neutral",
      icon: Timer,
      color: "text-indigo-500",
      bgGradient: "from-indigo-500/20 to-blue-500/10"
    },
    { 
      id: 'pending_invites',
      label: "Pending Invites", 
      value: metricsLoading ? "..." : metricsData.pendingInvitations.toString(), 
      change: metricsData.pendingInvitations > 0 ? "Action required" : null, 
      changeType: "warning",
      icon: Mail,
      color: "text-amber-500",
      bgGradient: "from-amber-500/20 to-orange-500/10"
    },
    { 
      id: 'new_hires',
      label: "New Hires This Month", 
      value: metricsLoading ? "..." : metricsData.newHires.toString(), 
      change: null, 
      changeType: "positive",
      icon: UserCheck,
      color: "text-rose-500",
      bgGradient: "from-rose-500/20 to-pink-500/10"
    }
  ], [view, metricsData, metricsLoading]);

  // Fetch dashboard metrics
  useEffect(() => {
    if (!userProfile?.organization_id) return;

    const fetchMetrics = async () => {
      setMetricsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) {
          setMetricsLoading(false);
          return;
        }

        const orgId = userProfile.organization_id;
        const now = new Date();
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        const todayEnd = new Date(now.setHours(23, 59, 59, 999));
        const weekStart = new Date(now);
        const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Monday, 6 = Sunday
        weekStart.setDate(now.getDate() - dayOfWeek); // Start of week (Monday)
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        // Fetch all metrics in parallel with timeout protection
        const fetchWithTimeout = (url, options, timeout = 5000) => {
          return Promise.race([
            fetch(url, options),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
          ]);
        };

        // Fetch all metrics in parallel
        const [
          employeesResponse,
          invitationsResponse,
          timeOffResponse,
          shiftsResponse,
          attendanceResponse,
          newHiresResponse,
        ] = await Promise.all([
          // Total employees
          fetchWithTimeout(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?organization_id=eq.${orgId}&role=eq.employee&is_active=eq.true&select=id`,
            {
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          ).catch(() => ({ json: async () => [] })),
          // Pending invitations
          fetchWithTimeout(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/invitations?organization_id=eq.${orgId}&accepted_at=is.null&select=id`,
            {
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          ).catch(() => ({ json: async () => [] })),
          // Pending time-off requests
          fetchWithTimeout(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/time_off_requests?organization_id=eq.${orgId}&status=eq.pending&select=id`,
            {
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          ).catch(() => ({ json: async () => [] })),
          // Today's shifts
          fetchWithTimeout(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts?organization_id=eq.${orgId}&start_time=gte.${todayStart.toISOString()}&start_time=lt.${todayEnd.toISOString()}&select=id`,
            {
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          ).catch(() => ({ json: async () => [] })),
          // Active now (people currently clocked in)
          fetchWithTimeout(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/attendance?organization_id=eq.${orgId}&clock_out=is.null&select=id`,
            {
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          ).catch(() => ({ json: async () => [] })),
          // New hires this month
          fetchWithTimeout(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?organization_id=eq.${orgId}&joined_at=gte.${monthStart.toISOString()}&select=id`,
            {
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          ).catch(() => ({ json: async () => [] })),
        ]);

        const employees = await employeesResponse.json();
        const invitations = await invitationsResponse.json();
        const timeOff = await timeOffResponse.json();
        const shifts = await shiftsResponse.json();
        const attendance = await attendanceResponse.json();
        const newHires = await newHiresResponse.json();

        // Calculate total hours (simplified - would need actual shift data)
        const totalHours = view === 'weekly' ? 0 : 0; // TODO: Calculate from shifts

        setMetricsData({
          totalEmployees: employees?.length || 0,
          pendingInvitations: invitations?.length || 0,
          pendingRequests: timeOff?.length || 0,
          todayShifts: shifts?.length || 0,
          activeNow: attendance?.length || 0,
          totalHours: totalHours,
          upcomingTimeOff: 0, // TODO: Calculate from time_off_requests
          newHires: newHires?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchMetrics();
  }, [userProfile?.organization_id, view]);

  // Fetch shifts based on current view and filters
  const fetchShifts = async (accessToken = null) => {
    if (!userProfile?.organization_id) return;
    
    if (!accessToken) {
      const { data: { session } } = await supabase.auth.getSession();
      accessToken = session?.access_token;
      if (!accessToken) {
        console.error('No access token');
        return;
      }
    }
    try {
      const headers = {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Prefer': 'return=representation'
      };

      // Calculate date range based on view
      let startDate, endDate;
      if (view === 'weekly') {
        const weekStart = new Date(currentDate);
        const dayOfWeek = (currentDate.getDay() + 6) % 7; // 0 = Monday, 6 = Sunday
        weekStart.setDate(currentDate.getDate() - dayOfWeek); // Start of week (Monday)
        weekStart.setHours(0, 0, 0, 0);
        startDate = weekStart;

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        endDate = weekEnd;
      } else {
        // Monthly view
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        monthStart.setHours(0, 0, 0, 0);
        startDate = monthStart;

        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        monthEnd.setHours(23, 59, 59, 999);
        endDate = monthEnd;
      }

      // Build query with filters
      let query = `organization_id=eq.${userProfile.organization_id}`;
      query += `&start_time=gte.${startDate.toISOString()}`;
      query += `&start_time=lte.${endDate.toISOString()}`;

      if (filters.employee !== 'all') {
        query += `&employee_id=eq.${filters.employee}`;
      }

      if (filters.location !== 'all' && filters.location !== '') {
        query += `&location_id=eq.${filters.location}`;
      }

      // Fetch shifts with related data
      // Use explicit relationship names to avoid ambiguity (shifts has two FKs to users: employee_id and created_by)
      const shiftsResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts?${query}&select=*,employee:users!shifts_employee_id_fkey(id,full_name,email,job_title),location:locations(id,name)&order=start_time.asc`,
        { method: 'GET', headers }
      );

      if (shiftsResponse.ok) {
        const shiftsData = await shiftsResponse.json();
        console.log('Fetched shifts:', {
          count: shiftsData?.length || 0,
          dateRange: { start: startDate.toISOString(), end: endDate.toISOString() },
          shifts: shiftsData
        });
        
        // Apply job title filter if set
        let filteredShifts = shiftsData || [];
        if (filters.jobTitle !== 'all') {
          filteredShifts = filteredShifts.filter(shift => 
            shift.employee?.job_title === filters.jobTitle
          );
        }

        // Apply search query if set
        if (searchQuery) {
          filteredShifts = filteredShifts.filter(shift => 
            shift.employee?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shift.employee?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shift.location?.name?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }


        console.log('Setting shifts state:', filteredShifts.length, 'shifts');
        setShifts(filteredShifts);
      } else {
        const errorText = await shiftsResponse.text();
        console.error('Error fetching shifts - response not OK:', shiftsResponse.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching shifts:', error);
    }
  };

  // Fetch calendar data (employees, locations, organization, shifts, templates)
  useEffect(() => {
    if (!userProfile?.organization_id) return;

    const fetchCalendarData = async () => {
      setCalendarLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) {
          console.error('No access token');
          setCalendarLoading(false);
          return;
        }

        const headers = {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Prefer': 'return=representation'
        };

        // Fetch organization
        const orgResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/organizations?id=eq.${userProfile.organization_id}&select=*`,
          { method: 'GET', headers }
        );
        if (orgResponse.ok) {
          const orgData = await orgResponse.json();
          if (orgData && orgData.length > 0) {
            setOrganization(orgData[0]);
            
            // Fetch locations (if on-site or hybrid)
            if (orgData[0].work_type === 'on-site' || orgData[0].work_type === 'hybrid') {
              const locationsResponse = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/locations?organization_id=eq.${userProfile.organization_id}&is_active=eq.true&select=*&order=name.asc`,
                { method: 'GET', headers }
              );
              if (locationsResponse.ok) {
                const locationsData = await locationsResponse.json();
                setLocations(locationsData || []);
              }
            }
          }
        }

        // Fetch teams (only for managers)
        if (userProfile.role === 'manager') {
          try {
            const teamsResponse = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/teams?organization_id=eq.${userProfile.organization_id}&is_active=eq.true&select=*&order=name.asc`,
              { method: 'GET', headers }
            );
            if (teamsResponse.ok) {
              const teamsData = await teamsResponse.json();
              setTeams(teamsData || []);
            } else {
              setTeams([]);
            }
          } catch (error) {
            console.error('Error fetching teams:', error);
            setTeams([]);
          }
        }

        // Fetch employees (only employees, not managers/hr)
        const employeesResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?organization_id=eq.${userProfile.organization_id}&role=eq.employee&is_active=eq.true&select=id,full_name,email,job_title,team_id,team_name&order=full_name.asc`,
          { method: 'GET', headers }
        );
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          setEmployees(employeesData || []);
        }

        // Fetch schedule templates (for managers and HR)
        if (userProfile.role === 'manager' || userProfile.role === 'hr') {
          try {
            const templatesResponse = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/schedule_templates?organization_id=eq.${userProfile.organization_id}&is_active=eq.true&select=*&order=name.asc`,
              { method: 'GET', headers }
            );
            if (templatesResponse.ok) {
              const templatesData = await templatesResponse.json();
              setScheduleTemplates(templatesData || []);
            } else {
              // If table doesn't exist (404/406) or other error, set empty array
              setScheduleTemplates([]);
            }
          } catch (error) {
            console.error('Error fetching templates:', error);
            setScheduleTemplates([]);
          }
        }

        // Fetch shifts
        await fetchShifts(accessToken);

      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setCalendarLoading(false);
      }
    };
    fetchCalendarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.organization_id, currentDate, view]);

  // Refetch templates when returning from Schedule page
  useEffect(() => {
    const prevPath = prevLocationRef.current;
    const currentPath = location.pathname;
    
    // If we just navigated back to dashboard from schedule page, refetch templates
    if (prevPath === '/schedule' && currentPath === '/dashboard' && (userProfile?.role === 'manager' || userProfile?.role === 'hr')) {
      const refetchTemplates = async () => {
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

          try {
            const templatesResponse = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/schedule_templates?organization_id=eq.${userProfile.organization_id}&is_active=eq.true&select=*&order=name.asc`,
              { method: 'GET', headers }
            );
            if (templatesResponse.ok) {
              const templatesData = await templatesResponse.json();
              setScheduleTemplates(templatesData || []);
            } else {
              setScheduleTemplates([]);
            }
          } catch (error) {
            console.error('Error refetching templates:', error);
            setScheduleTemplates([]);
          }
        } catch (error) {
          console.error('Error refetching templates:', error);
        }
      };
      refetchTemplates();
    }
    
    prevLocationRef.current = currentPath;
  }, [location.pathname, userProfile?.organization_id, userProfile?.role]);

  // Refetch shifts when filters or search query change (debounced)
  useEffect(() => {
    if (!userProfile?.organization_id) return;
    const refetchShifts = async () => { await fetchShifts(); };
    const timeoutId = setTimeout(refetchShifts, 300);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchQuery, userProfile?.organization_id]);

  // Redirect to complete signup if user doesn't have an organization
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
      return;
    }

    if (!authLoading && user) {
      const checkProfileTimeout = setTimeout(() => {
        if (userProfile !== null && !userProfile?.organization_id) {
          navigate('/complete-signup');
        }
      }, 3000);

      return () => clearTimeout(checkProfileTimeout);
    }
  }, [user, userProfile, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && user && userProfile !== null && !userProfile?.organization_id) {
      navigate('/complete-signup');
    }
  }, [userProfile, user, authLoading, navigate]);

  // Calendar helper functions
  const getWeekDays = () => {
    const weekStart = new Date(currentDate);
    // Start of week (Monday) - getDay() returns 0 for Sunday, 1 for Monday, etc.
    // We want Monday (1) to be day 0, so we adjust: (getDay() + 6) % 7 gives us days since Monday
    const dayOfWeek = (currentDate.getDay() + 6) % 7; // 0 = Monday, 6 = Sunday
    weekStart.setDate(currentDate.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from Sunday of the week containing the first day
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    // End on Saturday of the week containing the last day
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    const days = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const getShiftsForDate = (date) => {
    // Use LOCAL date strings for comparison to avoid timezone issues
    const dateStrLocal = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    const filtered = shifts.filter(shift => {
      if (!shift.start_time) return false;
      // Ensure UTC parsing: if the string doesn't end with Z, append it
      // Database timestamps are stored in UTC, so we need to parse them as UTC
      const timeStr = shift.start_time.endsWith('Z') ? shift.start_time : shift.start_time + 'Z';
      const shiftDate = new Date(timeStr);
      // Get LOCAL date components (not UTC) to correctly match shifts that start at midnight
      // This is critical for night shifts (00:00) which convert to previous day in UTC
      // When we create a Date from ISO string with Z, getFullYear/getMonth/getDate return LOCAL components
      const shiftYear = shiftDate.getFullYear();
      const shiftMonth = shiftDate.getMonth();
      const shiftDay = shiftDate.getDate();
      const shiftDateStrLocal = `${shiftYear}-${String(shiftMonth+1).padStart(2,'0')}-${String(shiftDay).padStart(2,'0')}`;
      
      // #region agent log
      const matches = shiftDateStrLocal === dateStrLocal;
      // Log night shifts (starting at 00:00) to debug timezone issues
      const shiftHour = shiftDate.getHours();
      if (shift.shift_type === 'emergency' || shift.shift_type === 'paid_leave' || shiftHour === 0) {
        fetch('http://127.0.0.1:7243/ingest/fdda5182-9242-4c03-be38-7b454f53c1a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:688',message:'Filtering shift',data:{shiftId:shift.id,shiftType:shift.shift_type,shiftStartTime:shift.start_time,timeStr,shiftDateStrLocal,dateStrLocal,matches,shiftYear,shiftMonth,shiftDay,shiftHour,shiftsCount:shifts.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
      }
      // #endregion
      
      // Compare using LOCAL dates, not UTC dates
      return matches;
    });
    return filtered;
  };

  const formatTime = (timestamp) => {
    // Ensure timestamp is treated as UTC if it doesn't have timezone info
    // If the string doesn't end with 'Z', it might be interpreted as local time
    let date;
    if (typeof timestamp === 'string' && !timestamp.endsWith('Z') && timestamp.includes('T')) {
      // If it's a timestamp string without timezone, assume it's UTC from database
      date = new Date(timestamp + 'Z');
    } else {
      date = new Date(timestamp);
    }
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'weekly') {
      newDate.setDate(currentDate.getDate() + (direction * 7));
    } else {
      newDate.setMonth(currentDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  // Handle template click - create shift from template
  const handleTemplateClick = async (template) => {
    const day = popupPosition.day || templateModalContext.day || new Date();
    const employeeId = popupPosition.employeeId || templateModalContext.employeeId;
    
    if (!employeeId) {
      // If no employee selected, open the form to select one
      openAddShiftModal(day, null, template);
      return;
    }
    
    // Automatically create the shift using the template
    try {
      setSubmitting(true);
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        alert('Error: No access token');
        setSubmitting(false);
        return;
      }

      // Check if employee already has a shift on this day (limit 1 per day)
      const targetDayDate = new Date(day);
      targetDayDate.setHours(0, 0, 0, 0);
      const targetDateStrLocal = `${targetDayDate.getFullYear()}-${String(targetDayDate.getMonth()+1).padStart(2,'0')}-${String(targetDayDate.getDate()).padStart(2,'0')}`;
      const existingShift = shifts.find(s => {
        if (s.employee_id !== employeeId) return false;
        const timeStr = s.start_time.endsWith('Z') ? s.start_time : s.start_time + 'Z';
        const shiftDate = new Date(timeStr);
        const shiftYear = shiftDate.getFullYear();
        const shiftMonth = shiftDate.getMonth();
        const shiftDay = shiftDate.getDate();
        const shiftDateStrLocal = `${shiftYear}-${String(shiftMonth+1).padStart(2,'0')}-${String(shiftDay).padStart(2,'0')}`;
        return shiftDateStrLocal === targetDateStrLocal;
      });
      
      if (existingShift) {
        alert(`This employee already has a shift on ${targetDateStrLocal}. Only one shift per employee per day is allowed.`);
        setSubmitting(false);
        return;
      }

      // Parse template times and apply to the selected day
      const dayYear = day.getFullYear();
      const dayMonth = day.getMonth();
      const dayDate = day.getDate();
      
      const startTimeParts = template.start_time.split(':');
      const endTimeParts = template.end_time.split(':');
      
      const startHours = parseInt(startTimeParts[0]) || 0;
      const startMinutes = parseInt(startTimeParts[1]) || 0;
      const endHours = parseInt(endTimeParts[0]) || 0;
      const endMinutes = parseInt(endTimeParts[1]) || 0;
      
      // For full-day shifts (emergency/paid_leave/day_off with 00:00:00-23:59:59)
      const isFullDayShift = (template.shift_type === 'emergency' || template.shift_type === 'paid_leave' || template.shift_type === 'day_off') &&
                            startHours === 0 && startMinutes === 0 && 
                            endHours === 23 && endMinutes === 59;
      
      const start = isFullDayShift 
        ? new Date(dayYear, dayMonth, dayDate, 12, 0, 0, 0)
        : new Date(dayYear, dayMonth, dayDate, startHours, startMinutes, 0, 0);
      
      const isOvernight = endHours < startHours || (endHours === startHours && endMinutes < startMinutes);
      
      const end = isFullDayShift
        ? new Date(dayYear, dayMonth, dayDate, 23, 59, 59, 999)
        : new Date(dayYear, dayMonth, dayDate, endHours, endMinutes, 0, 0);
      if (isOvernight && !isFullDayShift) {
        end.setDate(end.getDate() + 1);
      }

      const headers = {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Prefer': 'return=representation'
      };

      const shiftType = template.shift_type || 'on_shift';
      const shiftColor = template.color || shiftTypes.find(st => st.value === shiftType)?.defaultColor || shiftTypes[0].defaultColor;
      
      const shiftData = {
        organization_id: userProfile.organization_id,
        employee_id: employeeId,
        location_id: null,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        break_duration_minutes: template.break_duration_minutes || 0,
        status: 'scheduled',
        shift_type: shiftType,
        color: shiftColor,
        notes: template.description || null,
        created_by: user.id,
        updated_at: new Date().toISOString()
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(shiftData)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Shift creation failed:', errorText);
        
        if (errorText.includes('column') && (errorText.includes('shift_type') || errorText.includes('color'))) {
          throw new Error('Database columns missing. Please run the migration: add_shift_type_and_color_migration.sql in Supabase SQL Editor.');
        }
        
        throw new Error(errorText || 'Failed to create shift');
      }

      // Refresh shifts to get full data
      await fetchShifts(accessToken);
      
      setSubmitting(false);
    } catch (error) {
      console.error('Error creating shift from template:', error);
      alert('Error creating shift: ' + error.message);
      setSubmitting(false);
    }
  };

  const getViewTitle = () => {
    if (view === 'weekly') {
      const weekStart = new Date(currentDate);
      const dayOfWeek = (currentDate.getDay() + 6) % 7; // 0 = Monday, 6 = Sunday
      weekStart.setDate(currentDate.getDate() - dayOfWeek); // Start of week (Monday)
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  // Get unique job titles for filter
  const jobTitles = useMemo(() => {
    const titles = new Set();
    employees.forEach(emp => {
      if (emp.job_title) titles.add(emp.job_title);
    });
    return Array.from(titles).sort();
  }, [employees]);

  // Open add shift modal (with optional template)
  const openAddShiftModal = (day = null, employeeId = null, template = null) => {
    setEditingShift(null);
    
    let startTime = '';
    let endTime = '';
    
    if (template) {
      // Use template times - template.start_time and template.end_time are TIME format (HH:MM:SS or HH:MM)
      const targetDay = day ? new Date(day) : new Date();
      // Reset to start of day to avoid timezone issues
      targetDay.setHours(0, 0, 0, 0);
      
      // Parse template times (format: "HH:MM:SS" or "HH:MM")
      const startTimeParts = template.start_time.split(':');
      const endTimeParts = template.end_time.split(':');
      
      const startHours = parseInt(startTimeParts[0]) || 0;
      const startMinutes = parseInt(startTimeParts[1]) || 0;
      const endHours = parseInt(endTimeParts[0]) || 0;
      const endMinutes = parseInt(endTimeParts[1]) || 0;
      
      // Create new date objects for start and end times
      const start = new Date(targetDay);
      start.setHours(startHours, startMinutes, 0, 0);
      
      const end = new Date(targetDay);
      end.setHours(endHours, endMinutes, 0, 0);
      
      // Convert to local datetime string for datetime-local input (YYYY-MM-DDTHH:mm)
      // Get local date components to avoid timezone conversion issues
      const year = start.getFullYear();
      const month = String(start.getMonth() + 1).padStart(2, '0');
      const date = String(start.getDate()).padStart(2, '0');
      const startHour = String(start.getHours()).padStart(2, '0');
      const startMin = String(start.getMinutes()).padStart(2, '0');
      const endHour = String(end.getHours()).padStart(2, '0');
      const endMin = String(end.getMinutes()).padStart(2, '0');
      
      startTime = `${year}-${month}-${date}T${startHour}:${startMin}`;
      endTime = `${year}-${month}-${date}T${endHour}:${endMin}`;
    } else if (day) {
      // Default to 9 AM - 5 PM
      const dayStart = new Date(day);
      dayStart.setHours(9, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(17, 0, 0, 0);
      
      const year = dayStart.getFullYear();
      const month = String(dayStart.getMonth() + 1).padStart(2, '0');
      const date = String(dayStart.getDate()).padStart(2, '0');
      const startHour = String(dayStart.getHours()).padStart(2, '0');
      const startMin = String(dayStart.getMinutes()).padStart(2, '0');
      const endHour = String(dayEnd.getHours()).padStart(2, '0');
      const endMin = String(dayEnd.getMinutes()).padStart(2, '0');
      
      startTime = `${year}-${month}-${date}T${startHour}:${startMin}`;
      endTime = `${year}-${month}-${date}T${endHour}:${endMin}`;
    }
    
    const defaultShiftType = shiftTypes[0];
    setShiftForm({
      employee_id: employeeId || '',
      location_id: '',
      start_time: startTime,
      end_time: endTime,
      break_duration_minutes: template?.break_duration_minutes || 0,
      status: 'scheduled',
      shift_type: 'on_shift',
      color: defaultShiftType.defaultColor,
      notes: ''
    });
    setShowShiftModal(true);
  };

  // Open edit shift modal
  const openEditShiftModal = (shift) => {
    setEditingShift(shift);
    const startDate = new Date(shift.start_time);
    const endDate = new Date(shift.end_time);
    
    const shiftType = shiftTypes.find(st => st.value === (shift.shift_type || 'on_shift')) || shiftTypes[0];
    setShiftForm({
      employee_id: shift.employee_id,
      location_id: shift.location_id || '',
      start_time: startDate.toISOString().slice(0, 16),
      end_time: endDate.toISOString().slice(0, 16),
      break_duration_minutes: shift.break_duration_minutes || 0,
      status: shift.status || 'scheduled',
      shift_type: shift.shift_type || 'on_shift',
      color: shift.color || shiftType.defaultColor,
      notes: shift.notes || ''
    });
    setShowShiftModal(true);
  };

  // Auto-fill calendar with shifts
  // Clear Schedule function
  const handleClearSchedule = async () => {
    if (!isManager) {
      alert('Only managers can clear schedules.');
      return;
    }

    const period = view === 'weekly' ? 'week' : 'month';
    if (!confirm(`This will delete ALL shifts for ALL employees in this ${period}. This action cannot be undone. Continue?`)) {
      return;
    }

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

      // Get date range
      let startDate, endDate;
      if (view === 'weekly') {
        startDate = new Date(currentDate);
        const dayOfWeek = (currentDate.getDay() + 6) % 7; // 0 = Monday, 6 = Sunday
        startDate.setDate(currentDate.getDate() - dayOfWeek); // Start of week (Monday)
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
      } else {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
      }

      // Delete all shifts in the date range for the organization
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts?organization_id=eq.${userProfile.organization_id}&start_time=gte.${startDate.toISOString()}&start_time=lte.${endDate.toISOString()}`,
        {
          method: 'DELETE',
          headers
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to clear schedule');
      }

      // Refresh shifts
      await fetchShifts(accessToken);
      
      setToastMessage('Schedule cleared successfully');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setSubmitting(false);
    } catch (error) {
      console.error('Error clearing schedule:', error);
      alert('Error clearing schedule: ' + error.message);
      setSubmitting(false);
    }
  };

  const handleAutoFill = async () => {
    if (!isManager || !employees.length) {
      alert('No employees available to schedule.');
      return;
    }

    // Get days off per week setting from organization (default to 2)
    const daysOffPerWeek = organization?.days_off_per_week || 2;
    
    if (!confirm(`This will auto-fill the ${view === 'weekly' ? 'week' : 'month'} with shifts for all employees. Each employee will have ${daysOffPerWeek} day${daysOffPerWeek > 1 ? 's' : ''} off per week. Continue?`)) {
      return;
    }

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

      // Get date range
      let startDate, endDate;
      if (view === 'weekly') {
        startDate = new Date(currentDate);
        const dayOfWeek = (currentDate.getDay() + 6) % 7; // 0 = Monday, 6 = Sunday
        startDate.setDate(currentDate.getDate() - dayOfWeek); // Start of week (Monday)
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
      } else {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
      }

      // Employees are already filtered by the API (is_active=eq.true&role=eq.employee)
      // So we can use the employees array directly
      if (!employees || employees.length === 0) {
        alert('No active employees found. Please add employees first.');
        setSubmitting(false);
        return;
      }

      const createdShifts = [];
      const errors = [];

      // Track days off per employee to ensure they don't overlap
      const employeeDaysOff = new Map(); // Map<employeeId, Set<dayStrLocal>>
      
      // Get days off per week setting from organization (default to 2)
      const daysOffPerWeek = organization?.days_off_per_week || 2;
      const daysOffDistribution = organization?.days_off_distribution || 'random';
      
      // Find Day Off template
      const dayOffTemplate = scheduleTemplates.find(t => t.shift_type === 'day_off');
      
      // Filter out default templates (Emergency, Paid Leave) - only use user-created templates
      const userTemplates = scheduleTemplates.filter(t => 
        t.shift_type === 'on_shift' && !t.is_default
      );
      
      // Calculate days in range (same for all employees)
      const daysInRange = [];
      const currentDay = new Date(startDate);
      while (currentDay <= endDate) {
        daysInRange.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
      }
      
      // For each employee, create shifts
      for (let employeeIndex = 0; employeeIndex < employees.length; employeeIndex++) {
        const employee = employees[employeeIndex];
        
        // Initialize days off set for this employee
        if (!employeeDaysOff.has(employee.id)) {
          employeeDaysOff.set(employee.id, new Set());
        }
        const daysOff = employeeDaysOff.get(employee.id);
        
        // Calculate days off for this employee based on distribution setting
        if (daysOffDistribution === 'weekends') {
          // Always use weekends (Saturday = 6, Sunday = 0 in getDay())
          for (const day of daysInRange) {
            const dayOfWeek = day.getDay(); // 0 = Sunday, 6 = Saturday
            if (dayOfWeek === 0 || dayOfWeek === 6) {
              const dayYear = day.getFullYear();
              const dayMonth = day.getMonth();
              const dayDate = day.getDate();
              const dayStrLocal = `${dayYear}-${String(dayMonth+1).padStart(2,'0')}-${String(dayDate).padStart(2,'0')}`;
              daysOff.add(dayStrLocal);
            }
          }
        } else {
          // Random distribution - distribute evenly across weeks, but stagger by employee index
          const weeksInRange = Math.ceil(daysInRange.length / 7);
          
          // For each week, distribute days off evenly, but offset by employee index to avoid overlap
          for (let week = 0; week < weeksInRange; week++) {
            const weekStart = week * 7;
            const weekEnd = Math.min(weekStart + 7, daysInRange.length);
            const weekDays = daysInRange.slice(weekStart, weekEnd);
            
            if (weekDays.length === 0) continue;
            
            // Stagger days off by employee index to avoid all employees having same days off
            // Employee 0: days 2, 5
            // Employee 1: days 3, 6
            // Employee 2: days 4, 0 (Sunday)
            // etc.
            const employeeOffset = employeeIndex % weekDays.length;
            
            for (let i = 0; i < daysOffPerWeek && i < weekDays.length; i++) {
              // Calculate index with employee offset to stagger days off
              const step = weekDays.length / (daysOffPerWeek + 1);
              let dayIndexInWeek = Math.floor((i + 1) * step) + employeeOffset;
              
              // Wrap around if needed
              if (dayIndexInWeek >= weekDays.length) {
                dayIndexInWeek = dayIndexInWeek % weekDays.length;
              }
              
              // Check if this day is already taken by another employee
              let attempts = 0;
              while (attempts < weekDays.length) {
                const day = weekDays[dayIndexInWeek];
                const dayYear = day.getFullYear();
                const dayMonth = day.getMonth();
                const dayDate = day.getDate();
                const dayStrLocal = `${dayYear}-${String(dayMonth+1).padStart(2,'0')}-${String(dayDate).padStart(2,'0')}`;
                
                // Check if any other employee already has this day off
                let dayTaken = false;
                for (const [otherEmployeeId, otherDaysOff] of employeeDaysOff.entries()) {
                  if (otherEmployeeId !== employee.id && otherDaysOff.has(dayStrLocal)) {
                    dayTaken = true;
                    break;
                  }
                }
                
                if (!dayTaken) {
                  daysOff.add(dayStrLocal);
                  break;
                }
                
                // Try next day
                dayIndexInWeek = (dayIndexInWeek + 1) % weekDays.length;
                attempts++;
              }
            }
          }
        }

        // Create shifts for each day
        for (const day of daysInRange) {
          // Use local date string for consistency
          const dayYear = day.getFullYear();
          const dayMonth = day.getMonth();
          const dayDate = day.getDate();
          const dayStrLocal = `${dayYear}-${String(dayMonth+1).padStart(2,'0')}-${String(dayDate).padStart(2,'0')}`;
          
          // Check if shift already exists for this employee on this day
          const existingShiftForDay = shifts.find(s => {
            if (s.employee_id !== employee.id) return false;
            // Ensure UTC parsing for date comparison
            const timeStr = s.start_time.endsWith('Z') ? s.start_time : s.start_time + 'Z';
            const shiftDate = new Date(timeStr);
            const shiftYear = shiftDate.getFullYear();
            const shiftMonth = shiftDate.getMonth();
            const shiftDay = shiftDate.getDate();
            const shiftDateStrLocal = `${shiftYear}-${String(shiftMonth+1).padStart(2,'0')}-${String(shiftDay).padStart(2,'0')}`;
            return shiftDateStrLocal === dayStrLocal;
          });

          if (existingShiftForDay) {
            continue; // Skip if shift already exists
          }

          // If this is a day off, create Day Off shift
          if (daysOff.has(dayStrLocal)) {
            if (dayOffTemplate) {
              // Create Day Off shift using the template
              const dayYear = day.getFullYear();
              const dayMonth = day.getMonth();
              const dayDate = day.getDate();
              
              // For day off (full day), use noon for start and 11:59 PM for end to avoid timezone issues
              const start = new Date(dayYear, dayMonth, dayDate, 12, 0, 0, 0);
              const end = new Date(dayYear, dayMonth, dayDate, 23, 59, 59, 999);
              
              const dayOffShiftData = {
                organization_id: userProfile.organization_id,
                employee_id: employee.id,
                location_id: null,
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                break_duration_minutes: 0,
                status: 'scheduled',
                shift_type: 'day_off',
                color: dayOffTemplate.color || DEFAULT_TEMPLATE_COLORS.day_off,
                notes: null,
                created_by: user.id,
                updated_at: new Date().toISOString()
              };

              try {
                const response = await fetch(
                  `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts`,
                  {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(dayOffShiftData)
                  }
                );

                if (response.ok) {
                  const result = await response.json();
                  const createdShift = Array.isArray(result) ? result[0] : result;
                  createdShifts.push(createdShift);
                } else {
                  const errorText = await response.text();
                  console.error(`Auto-fill error for ${employee.full_name} Day Off on ${dayStrLocal}:`, errorText);
                  errors.push(`Failed to create Day Off shift for ${employee.full_name} on ${dayStrLocal}`);
                }
              } catch (error) {
                errors.push(`Error creating Day Off shift for ${employee.full_name} on ${dayStrLocal}: ${error.message}`);
              }
            }
            continue; // Skip creating regular shift for day off
          }

          // Use on_shift type only (exclude Emergency and Paid Leave from auto-fill)
          const shiftType = 'on_shift';
          
          // Rotate through templates: employee 1 gets template 1, employee 2 gets template 2, etc.
          // Cycle through all templates before repeating
          let shiftStart, shiftEnd, color, breakDuration = 30;
          
          if (userTemplates.length > 0) {
            // Calculate which template to use for this employee
            // Use employee index modulo template count to rotate through templates
            const templateIndex = employeeIndex % userTemplates.length;
            const selectedTemplate = userTemplates[templateIndex];
            color = selectedTemplate.color || shiftTypes[0].defaultColor;
            breakDuration = selectedTemplate.break_duration_minutes || 30;
            
            // Parse template times
            const startTimeParts = selectedTemplate.start_time.split(':');
            const endTimeParts = selectedTemplate.end_time.split(':');
            const startHours = parseInt(startTimeParts[0]) || 9;
            const startMinutes = parseInt(startTimeParts[1]) || 0;
            const endHours = parseInt(endTimeParts[0]) || 17;
            const endMinutes = parseInt(endTimeParts[1]) || 0;
            
            shiftStart = new Date(day);
            shiftStart.setHours(startHours, startMinutes, 0, 0);
            shiftEnd = new Date(day);
            shiftEnd.setHours(endHours, endMinutes, 0, 0);
            
            // Handle overnight shifts
            if (shiftEnd <= shiftStart) {
              shiftEnd.setDate(shiftEnd.getDate() + 1);
            }
          } else {
            // Default shift times (9 AM - 5 PM)
            color = shiftTypes[0].defaultColor;
            shiftStart = new Date(day);
            shiftStart.setHours(9, 0, 0, 0);
            shiftEnd = new Date(day);
            shiftEnd.setHours(17, 0, 0, 0);
          }

          const shiftData = {
            organization_id: userProfile.organization_id,
            employee_id: employee.id,
            location_id: null,
            start_time: shiftStart.toISOString(),
            end_time: shiftEnd.toISOString(),
            break_duration_minutes: breakDuration,
            status: 'scheduled',
            shift_type: shiftType,
            color: color,
            notes: null,
            created_by: user.id,
            updated_at: new Date().toISOString()
          };

          try {
            const response = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts`,
              {
                method: 'POST',
                headers,
                body: JSON.stringify(shiftData)
              }
            );

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Auto-fill error for ${employee.full_name} on ${dayStrLocal}:`, errorText);
              
              // Check if error is due to missing columns
              if (errorText.includes('column') && (errorText.includes('shift_type') || errorText.includes('color'))) {
                errors.push(`Database columns missing. Please run the migration: add_shift_type_and_color_migration.sql`);
                setSubmitting(false);
                alert('Database migration required! Please run add_shift_type_and_color_migration.sql in Supabase SQL Editor, then try again.');
                return;
              }
              
              errors.push(`Failed to create shift for ${employee.full_name} on ${dayStrLocal}: ${errorText}`);
              continue;
            }

            const result = await response.json();
            const createdShift = Array.isArray(result) ? result[0] : result;
            createdShifts.push(createdShift);
          } catch (error) {
            errors.push(`Error creating shift for ${employee.full_name} on ${dayStrLocal}: ${error.message}`);
          }
        }
      }

      // Refresh shifts
      await fetchShifts(accessToken);

      // Show results
      if (errors.length > 0) {
        alert(`Auto-fill completed with ${createdShifts.length} shifts created. ${errors.length} errors occurred.`);
        console.error('Auto-fill errors:', errors);
      } else {
        setToastMessage(`Auto-fill completed! ${createdShifts.length} shift${createdShifts.length !== 1 ? 's' : ''} created.`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }

      setSubmitting(false);
    } catch (error) {
      console.error('Error in auto-fill:', error);
      alert('Error during auto-fill: ' + error.message);
      setSubmitting(false);
    }
  };

  // Handle shift submit (add or edit)
  const handleShiftSubmit = async (e) => {
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

      // Check if employee already has a shift on this day (limit 1 per day) - only for new shifts
      if (!editingShift) {
        const startDate = new Date(shiftForm.start_time);
        const startDateStrLocal = `${startDate.getFullYear()}-${String(startDate.getMonth()+1).padStart(2,'0')}-${String(startDate.getDate()).padStart(2,'0')}`;
        const existingShift = shifts.find(s => {
          if (s.employee_id !== shiftForm.employee_id) return false;
          if (s.id === editingShift?.id) return false; // Skip the shift being edited
          // Ensure UTC parsing for date comparison
          const timeStr = s.start_time.endsWith('Z') ? s.start_time : s.start_time + 'Z';
          const shiftDate = new Date(timeStr);
          // Use LOCAL date strings for comparison
          const shiftYear = shiftDate.getFullYear();
          const shiftMonth = shiftDate.getMonth();
          const shiftDay = shiftDate.getDate();
          const shiftDateStrLocal = `${shiftYear}-${String(shiftMonth+1).padStart(2,'0')}-${String(shiftDay).padStart(2,'0')}`;
          return shiftDateStrLocal === startDateStrLocal;
        });
        
        if (existingShift) {
          alert(`This employee already has a shift on ${startDateStrLocal}. Only one shift per employee per day is allowed.`);
          setSubmitting(false);
          return;
        }
      }

      const headers = {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Prefer': 'return=representation'
      };

      // Build base shift data (without shift_type and color - these may not exist in DB)
      const shiftDataBase = {
        organization_id: userProfile.organization_id,
        employee_id: shiftForm.employee_id,
        location_id: shiftForm.location_id || null,
        start_time: new Date(shiftForm.start_time).toISOString(),
        end_time: new Date(shiftForm.end_time).toISOString(),
        break_duration_minutes: parseInt(shiftForm.break_duration_minutes) || 0,
        status: shiftForm.status,
        notes: shiftForm.notes || null,
        created_by: editingShift ? undefined : user.id,
        updated_at: new Date().toISOString()
      };
      
      // Prepare shift_type and color values (we'll try including them, fallback if needed)
      const shiftType = shiftForm.shift_type || 'on_shift';
      const shiftColor = shiftForm.color || shiftTypes.find(st => st.value === shiftType)?.defaultColor || '#8b5cf6';


      let response;
      if (editingShift) {
        // For editing, try with shift_type and color first, fallback if needed
        const shiftDataWithType = {
          ...shiftDataBase,
          shift_type: shiftType,
          color: shiftColor
        };
        
        
        try {
          response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts?id=eq.${editingShift.id}`,
            {
              method: 'PATCH',
              headers,
              body: JSON.stringify(shiftDataWithType)
            }
          );
          
          // If failed due to missing columns, retry without them
          if (!response.ok) {
            let errorText = '';
            try {
              errorText = await response.text();
            } catch (e) {
              errorText = `Status ${response.status}: ${response.statusText}`;
            }
            
            const isColumnError = errorText.includes('column') && 
              (errorText.includes('shift_type') || errorText.includes('color') || 
               errorText.includes('does not exist') || errorText.includes('unknown'));
            
            if (isColumnError || response.status === 400) {
              
              response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts?id=eq.${editingShift.id}`,
                {
                  method: 'PATCH',
                  headers,
                  body: JSON.stringify(shiftDataBase) // Without shift_type and color
                }
              );
            }
          }
        } catch (fetchError) {
          throw fetchError;
        }
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/fdda5182-9242-4c03-be38-7b454f53c1a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:1113',message:'POST request to create shift',data:{url:`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts`,shiftData,headers:Object.keys(headers),hasAccessToken:!!accessToken},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        
        try {
          // Try with shift_type and color first
          const shiftDataWithType = {
            ...shiftDataBase,
            shift_type: shiftType,
            color: shiftColor
          };
          
          
          try {
            response = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts`,
              {
                method: 'POST',
                headers,
                body: JSON.stringify(shiftDataWithType)
              }
            );
            
          } catch (networkError) {
            // Network error (CORS, connectivity, etc.) - try without new fields
            
            response = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts`,
              {
                method: 'POST',
                headers,
                body: JSON.stringify(shiftDataBase) // Retry without shift_type and color
              }
            );
            
          }
          
          // If request failed and it might be due to missing columns, try without them
          if (!response.ok) {
            let errorText = '';
            try {
              errorText = await response.text();
            } catch (e) {
              errorText = `Status ${response.status}: ${response.statusText}`;
            }
            
            
            // Check if error mentions missing columns or unknown column
            const isColumnError = errorText.includes('column') && 
              (errorText.includes('shift_type') || errorText.includes('color') || 
               errorText.includes('does not exist') || errorText.includes('unknown'));
            
            if (isColumnError || response.status === 400) {
              // Retry without shift_type and color
              
              try {
              response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts`,
                {
                  method: 'POST',
                  headers,
                  body: JSON.stringify(shiftDataBase) // Without shift_type and color
                }
              );
                
                
                if (response.ok) {
                  // Success - but warn user about migration
                  console.warn('Shift created without shift_type/color. Please run add_shift_type_and_color_migration.sql to enable these features.');
                }
              } catch (retryError) {
                throw retryError;
              }
            }
          }
        } catch (fetchError) {
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/fdda5182-9242-4c03-be38-7b454f53c1a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:1157',message:'Fetch error (network/CORS)',data:{error:fetchError.message,errorName:fetchError.name,errorStack:fetchError.stack,url:`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts`},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
          console.error('Network error creating shift:', fetchError);
          throw new Error(`Network error: ${fetchError.message}. Please check your internet connection and Supabase configuration.`);
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        const statusCode = response.status;
        const statusText = response.statusText;
        
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/fdda5182-9242-4c03-be38-7b454f53c1a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:1120',message:'Shift save API error response',data:{statusCode,statusText,errorText,shiftData,responseHeaders:Object.fromEntries(response.headers.entries())},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        console.error('Shift save error:', { statusCode, statusText, errorText, shiftData });
        
        // Check if error is due to missing columns
        if (errorText.includes('column') && (errorText.includes('shift_type') || errorText.includes('color'))) {
          throw new Error('Database columns missing. Please run the migration: add_shift_type_and_color_migration.sql in Supabase SQL Editor.');
        }
        
        // Check for other common errors
        if (errorText.includes('null value') || errorText.includes('NOT NULL')) {
          throw new Error('Missing required fields. Please check all required fields are filled.');
        }
        
        throw new Error(errorText || `Failed to save shift (${statusCode}: ${statusText})`);
      }

      const shiftResult = await response.json();
      const savedShift = Array.isArray(shiftResult) ? shiftResult[0] : shiftResult;

      // Create notification for the employee
      if (savedShift && shiftForm.employee_id) {
        const employee = employees.find(emp => emp.id === shiftForm.employee_id);
        if (employee) {
          const shiftDate = new Date(shiftForm.start_time);
          const dateStr = shiftDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          const timeStr = `${formatTime(shiftForm.start_time)} - ${formatTime(shiftForm.end_time)}`;
          
          await createNotification({
            userId: shiftForm.employee_id,
            organizationId: userProfile.organization_id,
            type: editingShift ? 'shift_updated' : 'shift_assigned',
            title: editingShift ? 'Shift Updated' : 'New Shift Assigned',
            message: editingShift 
              ? `Your shift on ${dateStr} has been updated. New time: ${timeStr}`
              : `You've been assigned a new shift on ${dateStr} from ${timeStr}`,
            actionUrl: '/dashboard',
            metadata: { 
              shift_id: savedShift.id,
              date: dateStr,
              time: timeStr
            }
          }).catch(err => console.error('Error creating shift notification:', err));
        }
      }

      await fetchShifts(accessToken);
      setShowShiftModal(false);
      setSubmitting(false);
    } catch (error) {
      console.error('Error saving shift:', error);
      alert('Error saving shift: ' + error.message);
      setSubmitting(false);
    }
  };

  // Handle drag start
  const handleDragStart = (e, shift) => {
    if (!isManager) return;
    e.stopPropagation(); // Prevent event bubbling
    console.log('Drag start:', shift);
    
    // CRITICAL: Find the original shift from the shifts state by ID
    // This ensures we always use the current shift data, not a stale reference
    const originalShift = shifts.find(s => s.id === shift.id) || shift;
    
    // Store a deep copy of the shift to prevent mutations
    // Also capture the displayed time strings at drag start (from the ORIGINAL shift)
    const displayedStartTime = formatTime(originalShift.start_time);
    const displayedEndTime = formatTime(originalShift.end_time);
    
    // Create a complete copy with all original data plus displayed times
    const shiftCopy = {
      ...originalShift,
      // Store the displayed time strings (what user sees) so we can preserve them
      _displayedStartTime: displayedStartTime,
      _displayedEndTime: displayedEndTime,
      // Also store the original start_time and end_time as ISO strings for reference
      _originalStartTimeISO: originalShift.start_time,
      _originalEndTimeISO: originalShift.end_time
    };
    
    
    setDraggedShift(shiftCopy);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.setData('text/plain', originalShift.id);
    e.dataTransfer.setData('application/json', JSON.stringify(shiftCopy));
    // Make the dragged element semi-transparent
    e.currentTarget.style.opacity = '0.5';
  };

  // Handle drag end
  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedShift(null);
    setDragOverCell(null);
  };

  // Handle drag over (on drop zone)
  const handleDragOver = (e, day, employeeId) => {
    if (!isManager) return;
    // Always prevent default to allow drop
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCell({ day, employeeId });
  };

  // Handle drag leave
  const handleDragLeave = (e) => {
    // Only clear if we're actually leaving the drop zone
    // Check if we're moving to a child element (like the button)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    // If mouse is still within the bounds, don't clear
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      return;
    }
    
    setDragOverCell(null);
  };

  // Handle drop
  const handleDrop = async (e, targetDay, targetEmployeeId) => {
    if (!isManager) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    
    console.log('Drop event triggered', { targetDay, targetEmployeeId, draggedShift });
    
    // Get shift data from dataTransfer or state
    let shiftToMove = draggedShift;
    if (!shiftToMove) {
      try {
        const shiftData = e.dataTransfer.getData('application/json');
        if (shiftData) {
          shiftToMove = JSON.parse(shiftData);
          console.log('Got shift from dataTransfer (JSON):', shiftToMove);
        } else {
          const shiftId = e.dataTransfer.getData('text/plain');
          shiftToMove = shifts.find(s => s.id === shiftId);
          console.log('Got shift from dataTransfer (text):', shiftToMove);
        }
      } catch (err) {
        console.error('Error parsing shift data:', err);
      }
    } else {
      console.log('Using shift from state:', shiftToMove);
    }
    
    if (!shiftToMove) {
      console.error('No shift to move - draggedShift:', draggedShift, 'shifts:', shifts);
      alert('Error: Could not find shift to move. Please try again.');
      setDraggedShift(null);
      return;
    }
    
    setDragOverCell(null);

    // Check if dropping on the same cell (no need to copy)
    // Use LOCAL date strings for comparison
    // Ensure UTC parsing for the original shift date
    const originalTimeStr = shiftToMove.start_time.endsWith('Z') ? shiftToMove.start_time : shiftToMove.start_time + 'Z';
    const originalShiftDate = new Date(originalTimeStr);
    const originalShiftDateStrLocal = `${originalShiftDate.getFullYear()}-${String(originalShiftDate.getMonth()+1).padStart(2,'0')}-${String(originalShiftDate.getDate()).padStart(2,'0')}`;
    const targetDate = new Date(targetDay);
    targetDate.setHours(0, 0, 0, 0);
    const targetDateStrLocal = `${targetDate.getFullYear()}-${String(targetDate.getMonth()+1).padStart(2,'0')}-${String(targetDate.getDate()).padStart(2,'0')}`;
    
    if (originalShiftDateStrLocal === targetDateStrLocal && shiftToMove.employee_id === targetEmployeeId) {
      setDraggedShift(null);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        alert('Error: No access token');
        return;
      }

      // Calculate new start and end times for the COPY
      // Parse the original times - these are in UTC from database
      const originalStart = new Date(shiftToMove.start_time);
      const originalEnd = new Date(shiftToMove.end_time);
      
      // Get the displayed time components (what formatTime shows to the user)
      // CRITICAL: Always use stored displayed times from draggedShift if available
      // This preserves the original displayed time from when drag started
      // If draggedShift exists, it has the stored _displayedStartTime and _displayedEndTime
      let displayedStartTime, displayedEndTime;
      if (draggedShift && draggedShift._displayedStartTime && draggedShift._displayedEndTime) {
        // Use stored displayed times from drag start (most reliable)
        displayedStartTime = draggedShift._displayedStartTime;
        displayedEndTime = draggedShift._displayedEndTime;
      } else if (shiftToMove._displayedStartTime && shiftToMove._displayedEndTime) {
        // Fall back to stored times in shiftToMove (from dataTransfer)
        displayedStartTime = shiftToMove._displayedStartTime;
        displayedEndTime = shiftToMove._displayedEndTime;
      } else {
        // Last resort: format current shift time (may be wrong if shift was updated)
        displayedStartTime = formatTime(shiftToMove.start_time);
        displayedEndTime = formatTime(shiftToMove.end_time);
      }
      
      // Parse the displayed time strings to get hours and minutes
      const [displayedStartHours, displayedStartMinutes] = displayedStartTime.split(':').map(Number);
      const [displayedEndHours, displayedEndMinutes] = displayedEndTime.split(':').map(Number);
      
      
      // Calculate duration in milliseconds to preserve exact shift length
      const duration = originalEnd - originalStart;

      // Create new start time: use target day but keep the same DISPLAYED hours/minutes
      // Ensure targetDay is a Date object
      const targetDate = new Date(targetDay);
      // Reset to start of day to avoid time issues
      targetDate.setHours(0, 0, 0, 0);
      
      
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth();
      const targetDateNum = targetDate.getDate();
      
      // Create new date with the target date and DISPLAYED time (what user sees)
      // Using Date constructor avoids timezone conversion
      const newStart = new Date(targetYear, targetMonth, targetDateNum, displayedStartHours, displayedStartMinutes, 0, 0);
      
      // Create new end time: add the duration to maintain the exact same shift length
      const newEnd = new Date(newStart.getTime() + duration);
      
      // #region agent log
      
      // Verify times match (for debugging)
      const newStartLocalHours = newStart.getHours();
      const newStartLocalMinutes = newStart.getMinutes();
      const newEndLocalHours = newEnd.getHours();
      const newEndLocalMinutes = newEnd.getMinutes();
      
      if (newStartLocalHours !== displayedStartHours || newStartLocalMinutes !== displayedStartMinutes) {
        console.warn('Time mismatch in drag-drop:', {
          expected: `${String(displayedStartHours).padStart(2, '0')}:${String(displayedStartMinutes).padStart(2, '0')}`,
          actual: `${String(newStartLocalHours).padStart(2, '0')}:${String(newStartLocalMinutes).padStart(2, '0')}`
        });
      }
      
      // Verify the times are correct
      const newStartHours = newStart.getHours();
      const newStartMinutes = newStart.getMinutes();
      const newEndHours = newEnd.getHours();
      const newEndMinutes = newEnd.getMinutes();
      
      console.log('Time calculation:', {
        original: {
          displayed: {
            start: displayedStartTime,
            end: displayedEndTime
          },
          iso: { start: originalStart.toISOString(), end: originalEnd.toISOString() }
        },
        new: {
          start: `${String(newStartHours).padStart(2, '0')}:${String(newStartMinutes).padStart(2, '0')}`,
          end: `${String(newEndHours).padStart(2, '0')}:${String(newEndMinutes).padStart(2, '0')}`,
          iso: { start: newStart.toISOString(), end: newEnd.toISOString() }
        },
        durationMinutes: duration / (1000 * 60)
      });

      const headers = {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Prefer': 'return=representation'
      };

      // Check if employee already has a shift on this day (limit 1 per day)
      // Use LOCAL date strings for comparison to avoid timezone issues
      const targetDateStrLocal = `${targetDate.getFullYear()}-${String(targetDate.getMonth()+1).padStart(2,'0')}-${String(targetDate.getDate()).padStart(2,'0')}`;
      
      const existingShift = shifts.find(s => {
        if (s.employee_id !== targetEmployeeId) return false;
        // Exclude the shift being moved from the check
        if (s.id === shiftToMove.id) return false;
        // Ensure UTC parsing for date comparison
        const timeStr = s.start_time.endsWith('Z') ? s.start_time : s.start_time + 'Z';
        const shiftDate = new Date(timeStr);
        // Compare using LOCAL dates, not UTC dates
        const shiftYear = shiftDate.getFullYear();
        const shiftMonth = shiftDate.getMonth();
        const shiftDay = shiftDate.getDate();
        const shiftDateStrLocal = `${shiftYear}-${String(shiftMonth+1).padStart(2,'0')}-${String(shiftDay).padStart(2,'0')}`;
        
        return shiftDateStrLocal === targetDateStrLocal;
      });
      
      if (existingShift) {
        alert(`This employee already has a shift on ${targetDateStrLocal}. Only one shift per employee per day is allowed.`);
        setDraggedShift(null);
        return;
      }

      // Create a NEW shift (copy) instead of updating the existing one
      const newShiftData = {
        organization_id: userProfile.organization_id,
        employee_id: targetEmployeeId,
        location_id: shiftToMove.location_id || null,
        start_time: newStart.toISOString(),
        end_time: newEnd.toISOString(),
        break_duration_minutes: shiftToMove.break_duration_minutes || 0,
        status: shiftToMove.status || 'scheduled',
        shift_type: shiftToMove.shift_type || 'on_shift',
        color: shiftToMove.color || shiftTypes.find(st => st.value === (shiftToMove.shift_type || 'on_shift'))?.defaultColor || '#8b5cf6',
        notes: shiftToMove.notes || null,
        created_by: user.id,
        updated_at: new Date().toISOString()
      };

      console.log('Creating copy of shift:', {
        originalShiftId: shiftToMove.id,
        newShiftData,
        newStart: newStart.toISOString(),
        newEnd: newEnd.toISOString()
      });

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(newShiftData)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Shift copy failed:', errorText);
        
        // Check if error is due to missing columns
        if (errorText.includes('column') && (errorText.includes('shift_type') || errorText.includes('color'))) {
          throw new Error('Database columns missing. Please run the migration: add_shift_type_and_color_migration.sql in Supabase SQL Editor.');
        }
        
        throw new Error(errorText || 'Failed to move shift');
      }

      const createdShiftData = await response.json();
      const newShift = Array.isArray(createdShiftData) ? createdShiftData[0] : createdShiftData;
      console.log('Shift copied successfully:', newShift);

      // Create notification for the employee
      if (newShift && targetEmployeeId) {
        const employee = employees.find(emp => emp.id === targetEmployeeId);
        if (employee) {
          const shiftDate = new Date(newShift.start_time);
          const dateStr = shiftDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          const timeStr = `${formatTime(newShift.start_time)} - ${formatTime(newShift.end_time)}`;
          
          await createNotification({
            userId: targetEmployeeId,
            organizationId: userProfile.organization_id,
            type: 'shift_assigned',
            title: 'New Shift Assigned',
            message: `You've been assigned a new shift on ${dateStr} from ${timeStr}`,
            actionUrl: '/dashboard',
            metadata: { 
              shift_id: newShift.id,
              date: dateStr,
              time: timeStr
            }
          }).catch(err => console.error('Error creating shift notification:', err));
        }
      }
      

      // Immediately add the new shift to state
      if (newShift) {
        // Fetch employee and location data for the new shift
        const employee = employees.find(e => e.id === newShift.employee_id);
        const location = locations.find(l => l.id === newShift.location_id);
        
        const enrichedShift = {
          ...newShift,
          employee: employee ? { id: employee.id, full_name: employee.full_name, email: employee.email, job_title: employee.job_title } : shiftToMove.employee,
          location: location ? { id: location.id, name: location.name } : shiftToMove.location
        };

        // Add new shift to state (keep the original)
        setShifts(prev => {
          // Check if shift already exists (avoid duplicates)
          const exists = prev.some(s => s.id === enrichedShift.id);
          if (exists) return prev;
          // Add new shift and sort by start_time
          const updated = [...prev, enrichedShift].sort((a, b) => 
            new Date(a.start_time) - new Date(b.start_time)
          );
          
          
          return updated;
        });
      }

      // CRITICAL: Clear draggedShift BEFORE fetchShifts to prevent stale data
      // This ensures the next drag will get fresh shift data from state
      setDraggedShift(null);
      
      // Refresh shifts to ensure consistency
      // Use a small delay to let the immediate state update render first
      setTimeout(async () => {
        await fetchShifts(accessToken);
      }, 100);
    } catch (error) {
      console.error('Error moving shift:', error);
      alert('Error moving shift: ' + error.message);
      setDraggedShift(null);
    }
  };

  // Handle delete shift
  const handleDeleteShift = async (shiftId) => {
    if (!confirm('Are you sure you want to delete this shift?')) {
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
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts?id=eq.${shiftId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete shift');
      }

      await fetchShifts(accessToken);
      
      // Show success toast
      setToastMessage('Shift deleted successfully');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000); // Auto-dismiss after 3 seconds
    } catch (error) {
      console.error('Error deleting shift:', error);
      alert('Error deleting shift: ' + error.message);
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showShiftModal || showTemplateModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showShiftModal, showTemplateModal]);

  const days = view === 'weekly' ? getWeekDays() : getMonthDays();
  const isManager = userProfile?.role === 'manager';

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  if (authLoading || !user || !userProfile?.organization_id) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 relative overflow-hidden ${
      theme === 'dark' ? 'text-white' : 'text-slate-900'
    }`}>
      {/* Background Pattern & Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        {theme === 'dark' ? (
          <>
            {/* Dark mode background - gradient with subtle pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
            {/* Subtle radial gradients for depth */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-900/10 rounded-full blur-3xl"></div>
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
          </>
        ) : (
          <>
            {/* Light mode background - soft gradient with subtle pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>
            {/* Subtle radial gradients for depth */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-50/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-50/40 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-0 w-72 h-72 bg-blue-50/30 rounded-full blur-3xl"></div>
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </>
        )}
      </div>
      
      {/* SIDEBAR */}
      <aside className={`
        w-16 sm:w-20 md:w-64 border-r flex flex-col py-4 sm:py-6 lg:py-8 transition-colors relative z-10 backdrop-blur-sm
        ${theme === 'dark' 
          ? 'border-slate-800/50 bg-slate-900/40 backdrop-blur-md' 
          : 'border-slate-200/50 bg-white/60 backdrop-blur-md'
        }
      `}>
        <div className="px-3 sm:px-4 md:px-6 mb-8 sm:mb-10 lg:mb-12 flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
            <Zap size={20} className="sm:w-6 sm:h-6" fill="white" />
          </div>
          <span className="hidden md:block font-black text-xl tracking-tighter uppercase">
            Crew<span className="text-purple-500">Control</span>
          </span>
        </div>

        <nav className="flex-1 w-full px-2 sm:px-3 space-y-1 sm:space-y-2">
          {[
            { icon: <LayoutDashboard size={20} />, label: "Overview", path: "/dashboard", active: location.pathname === '/dashboard' },
            { icon: <Users size={20} />, label: "Build Team", path: "/build-team", active: location.pathname === '/build-team', roles: ['manager'] },
            { icon: <Users size={20} />, label: "Team", path: "/team", active: location.pathname === '/team', roles: ['manager', 'hr'] },
            { icon: <Calendar size={20} />, label: "Shift Templates", path: "/schedule", active: location.pathname === '/schedule', roles: ['manager'] },
            { icon: <BarChart3 size={20} />, label: "Analytics", path: "/analytics", roles: ['manager', 'hr'] },
            { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
          ].filter(item => {
            // If item has roles specified, only show if user's role is in the list
            // Otherwise, show for all roles
            if (!item.roles) {
              // No role restriction, show for everyone
              return true;
            }
            // Check if user's role matches
            const userRole = userProfile?.role;
            if (!userRole) {
              // User role not loaded yet, hide restricted items
              return false;
            }
            return item.roles.includes(userRole);
          })
          .map((item, i) => (
            <button 
              key={i}
              onClick={() => item.path && navigate(item.path)}
              className={`
                w-full flex items-center gap-2 sm:gap-3 md:gap-4 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl transition-all
                ${item.active 
                  ? theme === 'dark'
                    ? 'bg-purple-600/10 border border-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                    : 'bg-purple-50 border border-purple-200 text-purple-600 shadow-sm'
                  : theme === 'dark'
                    ? 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }
              `}
            >
              {item.icon}
              <span className="hidden md:block font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <header className={`
          min-h-20 border-b flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 py-3 sm:py-0 sticky top-0 z-30 backdrop-blur-md
          ${theme === 'dark' 
            ? 'border-slate-800 bg-slate-950/80' 
            : 'border-slate-200 bg-white/80'
          }
        `}>
          <div className={`
            flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 rounded-xl flex-1 sm:flex-none sm:w-80 lg:w-96 transition-all
            ${theme === 'dark'
              ? 'bg-slate-800/50 border border-slate-700 focus-within:border-purple-500/50'
              : 'bg-slate-100 border border-slate-200 focus-within:border-purple-300'
            }
          `}>
            <Search size={18} className={`flex-shrink-0 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
            <input 
              type="text" 
              placeholder="Search..." 
              className={`
                bg-transparent border-none outline-none text-sm w-full min-w-0
                ${theme === 'dark' 
                  ? 'placeholder:text-slate-600 text-white' 
                  : 'placeholder:text-slate-400 text-slate-900'
                }
              `} 
            />
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`
                p-2 sm:p-2.5 rounded-xl transition-all hover:scale-110
                ${theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }
              `}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} className="sm:w-5 sm:h-5" /> : <Moon size={18} className="sm:w-5 sm:h-5" />}
            </button>
            
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(true)}
              className={`
                relative p-2 sm:p-2.5 rounded-xl transition-all hover:scale-110
                ${theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }
              `}
              aria-label="Notifications"
            >
              <Bell size={18} className="sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className={`
                  absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black
                  ${theme === 'dark'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-600 text-white'
                  }
                `}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* User Menu Dropdown */}
            <div className="relative z-40" ref={userMenuRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowUserMenu(!showUserMenu);
                }}
                className={`
                  relative flex items-center gap-2 transition-all duration-200
                  cursor-pointer outline-none focus:outline-none
                  ${showUserMenu 
                    ? 'scale-95' 
                    : 'hover:scale-105'
                  }
                `}
                aria-label="User menu"
              >
                <img 
                  src={userProfile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.full_name || 'User')}&background=8b5cf6&color=fff`} 
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 transition-all duration-200 pointer-events-none flex-shrink-0
                    ${showUserMenu
                      ? theme === 'dark' 
                        ? 'border-purple-500 shadow-lg shadow-purple-500/50' 
                        : 'border-purple-400 shadow-lg shadow-purple-400/50'
                      : theme === 'dark'
                        ? 'border-purple-500/20 hover:border-purple-500/50'
                        : 'border-purple-300/50 hover:border-purple-400/70'
                    }
                  `}
                  alt="Avatar" 
                />
                {showUserMenu && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse pointer-events-none"></div>
                )}
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div 
                  className={`
                    absolute right-0 top-14 w-56 z-[100]
                    transform transition-all duration-300 ease-out
                    ${showUserMenu 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                    }
                  `}
                  style={{
                    animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1), fadeIn 0.3s ease-out'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <style>{`
                    @keyframes slideDown {
                      from {
                        transform: translateY(-10px) scale(0.95);
                        opacity: 0;
                      }
                      to {
                        transform: translateY(0) scale(1);
                        opacity: 1;
                      }
                    }
                    @keyframes fadeIn {
                      from { opacity: 0; }
                      to { opacity: 1; }
                    }
                  `}</style>
                  <div className={`
                    rounded-2xl shadow-2xl border-2 backdrop-blur-xl overflow-hidden
                    ${theme === 'dark'
                      ? 'bg-slate-800/95 border-slate-700/50 shadow-slate-900/50'
                      : 'bg-white/95 border-slate-200/50 shadow-slate-200/50'
                    }
                  `}>
                    {/* User Info Header */}
                    <div className={`
                      px-4 py-3 border-b
                      ${theme === 'dark' 
                        ? 'border-slate-700 bg-gradient-to-r from-purple-600/20 to-indigo-600/20' 
                        : 'border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50'
                      }
                    `}>
                      <p className={`
                        font-bold text-sm
                        ${theme === 'dark' ? 'text-white' : 'text-slate-900'}
                      `}>
                        {userProfile?.full_name || 'User'}
                      </p>
                      <p className={`
                        text-xs mt-0.5
                        ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                      `}>
                        {userProfile?.email || ''}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setShowUserMenu(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                          ${theme === 'dark'
                            ? 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                            : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                          }
                          hover:scale-[1.02] active:scale-[0.98]
                        `}
                      >
                        <Settings size={18} className="flex-shrink-0" />
                        <span className="font-semibold text-sm">Settings</span>
                      </button>

                      <div className={`
                        h-px my-1
                        ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}
                      `}></div>

                      <button
                        onClick={async () => {
                          await signOut();
                          navigate('/signin');
                          setShowUserMenu(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                          ${theme === 'dark'
                            ? 'hover:bg-red-600/20 text-red-400 hover:text-red-300 border border-transparent hover:border-red-500/30'
                            : 'hover:bg-red-50 text-red-600 hover:text-red-700 border border-transparent hover:border-red-300'
                          }
                          hover:scale-[1.02] active:scale-[0.98]
                        `}
                      >
                        <LogOut size={18} className="flex-shrink-0" />
                        <span className="font-semibold text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-10">
            <div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {userProfile?.role === 'employee' && userProfile?.team_name
                  ? `Team ${userProfile.team_name} Dashboard`
                  : userProfile?.role === 'hr'
                  ? 'HR Dashboard'
                  : 'Manager Dashboard'}
              </h1>
              <p className={`text-xs sm:text-sm font-medium ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
              }`}>
                Welcome back, {userProfile?.full_name || 'User'}
              </p>
            </div>
            {/* Only show "New Shift Template" button for managers and HR, not employees */}
            {(userProfile?.role === 'manager' || userProfile?.role === 'hr') && (
              <button 
                onClick={() => navigate('/schedule')}
                className={`
                  px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg w-full sm:w-auto
                  ${theme === 'dark'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }
                `}
              >
                <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> Shift Templates
              </button>
            )}
          </div>

          {/* Modular Metrics Grid - Optimized for Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
            {metrics.map((metric, index) => (
              <div
                key={metric.id}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: metricsLoading ? 'none' : 'fadeIn 0.3s ease-in forwards'
                }}
                className={metricsLoading ? '' : 'opacity-0'}
              >
                <MetricCard metric={metric} theme={theme} loading={metricsLoading} />
              </div>
            ))}
          </div>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Schedule Section */}
          <div className={`
            rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl transition-colors
            ${theme === 'dark'
              ? 'bg-slate-900/40 border border-slate-800'
              : 'bg-white border border-slate-200 shadow-xl'
            }
          `}>
            {/* Schedule Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-10">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className={`
                  flex p-1 rounded-xl border w-full sm:w-auto
                  ${theme === 'dark' 
                    ? 'bg-slate-800 border-slate-700' 
                    : 'bg-slate-100 border-slate-200'
                  }
                `}>
                  <button 
                    onClick={() => setView('weekly')} 
                    className={`
                      flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg text-xs font-bold transition-all
                      ${view === 'weekly' 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
                      }
                    `}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => setView('monthly')} 
                    className={`
                      flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg text-xs font-bold transition-all
                      ${view === 'monthly' 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
                      }
                    `}
                  >
                    Monthly
                  </button>
                </div>
                
                <div className={`
                  flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border w-full sm:w-auto
                  ${theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-slate-100 border-slate-200'
                  }
                `}>
                  <button
                    onClick={() => navigateDate(-1)}
                    className="p-1"
                  >
                    <ChevronLeft size={18} className={`flex-shrink-0 ${
                      theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`} />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    Today
                  </button>
                  <span className={`text-xs font-bold flex-1 text-center sm:w-48 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>{getViewTitle()}</span>
                  <button
                    onClick={() => navigateDate(1)}
                    className="p-1"
                  >
                    <ChevronRight size={18} className={`flex-shrink-0 ${
                      theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`} />
                  </button>
                </div>

                {/* Action Buttons */}
                {isManager && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAutoFill}
                      disabled={submitting}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                        hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                        bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white
                      `}
                      title={`Auto-fill ${view === 'weekly' ? 'week' : 'month'} with shifts (2 days off per week per employee)`}
                    >
                      <Zap size={16} />
                      <span className="hidden sm:inline">Auto-Fill</span>
                    </button>
                    <button
                      onClick={handleClearSchedule}
                      disabled={submitting}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                        hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                        bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white
                      `}
                      title={`Clear all shifts for this ${view === 'weekly' ? 'week' : 'month'}`}
                    >
                      <Eraser size={16} />
                      <span className="hidden sm:inline">Clear</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Filters - Redesigned */}
              <div className="mt-4 -mx-4 sm:mx-0 px-4 sm:px-0">
                {/* Filter Toggle Button and Search - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`
                      flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0
                      ${theme === 'dark'
                        ? 'bg-slate-800/50 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }
                    `}
                  >
                    <Filter size={16} />
                    <span>Filters</span>
                    {showFilters ? <ChevronRight size={16} className="rotate-90" /> : <ChevronRight size={16} />}
                  </button>
                  
                  {/* Search - Always visible, properly contained */}
                  <div className={`
                    flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:flex-1 sm:max-w-xs md:max-w-sm min-w-0
                    ${theme === 'dark' 
                      ? 'bg-slate-800/50 border-slate-700' 
                      : 'bg-slate-100 border-slate-200'
                    }
                  `}>
                    <Search size={16} className={`flex-shrink-0 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`
                        flex-1 bg-transparent border-none outline-none text-xs min-w-0
                        ${theme === 'dark' ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}
                      `}
                    />
                  </div>
                </div>

                {/* Collapsible Filter Panel */}
                {showFilters && (
                  <div className={`
                    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl border transition-all
                    ${theme === 'dark'
                      ? 'bg-slate-800/30 border-slate-700'
                      : 'bg-slate-50 border-slate-200'
                    }
                  `}>
                    {/* Employee Filter */}
                    <div>
                      <label className={`
                        block text-xs font-bold mb-2
                        ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                      `}>
                        Employee
                      </label>
                      <select 
                        value={filters.employee}
                        onChange={(e) => setFilters({ ...filters, employee: e.target.value })}
                        className={`
                          w-full rounded-lg px-3 py-2 text-xs font-semibold outline-none cursor-pointer transition-all
                          ${theme === 'dark'
                            ? 'bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                          }
                        `}
                      >
                        <option value="all">All Employees</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Location Filter */}
                    {locations.length > 0 && (
                      <div>
                        <label className={`
                          block text-xs font-bold mb-2
                          ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                        `}>
                          Location
                        </label>
                        <select
                          value={filters.location}
                          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                          className={`
                            w-full rounded-lg px-3 py-2 text-xs font-semibold outline-none cursor-pointer transition-all
                            ${theme === 'dark'
                              ? 'bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600'
                              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                            }
                          `}
                        >
                          <option value="all">All Locations</option>
                          {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {/* Job Title Filter */}
                    {jobTitles.length > 0 && (
                      <div>
                        <label className={`
                          block text-xs font-bold mb-2
                          ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                        `}>
                          Job Title
                        </label>
                        <select
                          value={filters.jobTitle}
                          onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
                          className={`
                            w-full rounded-lg px-3 py-2 text-xs font-semibold outline-none cursor-pointer transition-all
                            ${theme === 'dark'
                              ? 'bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600'
                              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                            }
                          `}
                        >
                          <option value="all">All Job Titles</option>
                          {jobTitles.map(title => (
                            <option key={title} value={title}>{title}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {/* Team Filter */}
                    {userProfile?.role === 'manager' && teams.length > 1 && (
                      <div>
                        <label className={`
                          block text-xs font-bold mb-2
                          ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                        `}>
                          Team
                        </label>
                        <select
                          value={filters.team}
                          onChange={(e) => {
                            setFilters({ ...filters, team: e.target.value, employee: 'all' });
                          }}
                          className={`
                            w-full rounded-lg px-3 py-2 text-xs font-semibold outline-none cursor-pointer transition-all
                            ${theme === 'dark'
                              ? 'bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600'
                              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                            }
                          `}
                        >
                          <option value="all">All Teams</option>
                          {teams.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Clear Filters Button */}
                    {(filters.employee !== 'all' || filters.location !== 'all' || filters.jobTitle !== 'all' || filters.team !== 'all') && (
                      <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                        <button
                          onClick={() => setFilters({ employee: 'all', location: 'all', jobTitle: 'all', team: 'all' })}
                          className={`
                            px-4 py-2 rounded-lg text-xs font-bold transition-all
                            ${theme === 'dark'
                              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                              : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                            }
                          `}
                        >
                          Clear All Filters
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Calendar View */}
            {calendarLoading ? (
              <div className={`text-center py-12 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Loading schedule...
              </div>
            ) : view === 'weekly' ? (
              /* Weekly View */
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="w-full text-left border-collapse min-w-[800px] sm:min-w-[1000px]">
                    <thead>
                      <tr className={`
                        text-xs font-bold uppercase tracking-widest border-b
                        ${theme === 'dark'
                          ? 'text-slate-500 border-slate-800'
                          : 'text-slate-600 border-slate-200'
                        }
                      `}>
                        <th className={`
                          pb-4 sm:pb-6 pr-4 sm:pr-6 w-48 sm:w-64 sticky left-0 z-20
                          ${theme === 'dark' ? 'bg-slate-900/40' : 'bg-white'}
                          backdrop-blur-sm
                        `}>
                          <span className="block sm:hidden">Member</span>
                          <span className="hidden sm:block">Team Member</span>
                        </th>
                        {days.map((day, idx) => (
                          <th key={idx} className="pb-4 sm:pb-6 px-2 sm:px-4 text-center min-w-[100px] sm:min-w-[120px]">
                            <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div className="text-sm font-normal mt-1">{formatDate(day)}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className={theme === 'dark' ? 'divide-y divide-slate-800' : 'divide-y divide-slate-100'}>
                      {employees.length === 0 ? (
                        <tr>
                          <td colSpan={8} className={`px-4 py-8 text-center ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            No employees found. Invite team members to start scheduling.
                          </td>
                        </tr>
                      ) : (
                        employees
                          .filter(emp => {
                            if (filters.employee !== 'all' && emp.id !== filters.employee) return false;
                            if (filters.jobTitle !== 'all' && emp.job_title !== filters.jobTitle) return false;
                            if (filters.team !== 'all') {
                              // Filter by team_id if available, otherwise by team_name
                              if (filters.team !== emp.team_id && filters.team !== emp.team_name) return false;
                            }
                            if (searchQuery && !emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                            return true;
                          })
                          .map(employee => {
                            const employeeShifts = shifts.filter(s => s.employee_id === employee.id);
                            return (
                              <tr key={employee.id} className={`
                                border-b transition-colors
                                ${theme === 'dark' ? 'border-slate-700/50 hover:bg-slate-800/30' : 'border-slate-200 hover:bg-slate-50'}
                              `}>
                                <td className={`
                                  px-4 py-3 sticky left-0 z-20 font-medium
                                  ${theme === 'dark' ? 'bg-slate-900/40 text-white' : 'bg-white text-slate-900'}
                                  backdrop-blur-sm border-r
                                  ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}
                                `}>
                                  <div className="font-bold truncate">{employee.full_name}</div>
                                  {employee.job_title && (
                                    <div className="text-xs text-slate-500 mt-0.5 truncate">{employee.job_title}</div>
                                  )}
                                </td>
                                {days.map((day, dayIdx) => {
                                  // Use LOCAL date strings for comparison to avoid timezone issues
                                  const dayStrLocal = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
                                  const dayShifts = employeeShifts.filter(shift => {
                                    if (!shift.start_time) return false;
                                    // Ensure UTC parsing: if the string doesn't end with Z, append it
                                    // Database timestamps are stored in UTC, so we need to parse them as UTC
                                    const timeStr = shift.start_time.endsWith('Z') ? shift.start_time : shift.start_time + 'Z';
                                    const shiftDate = new Date(timeStr);
                                    // Get LOCAL date components (not UTC) to correctly match shifts that start at midnight
                                    // This is critical for night shifts (00:00) which convert to previous day in UTC
                                    const shiftYear = shiftDate.getFullYear();
                                    const shiftMonth = shiftDate.getMonth();
                                    const shiftDay = shiftDate.getDate();
                                    const shiftDateStrLocal = `${shiftYear}-${String(shiftMonth+1).padStart(2,'0')}-${String(shiftDay).padStart(2,'0')}`;
                                    
                                    // #region agent log
                                    const matches = shiftDateStrLocal === dayStrLocal;
                                    if (shift.start_time && (new Date(timeStr).getHours() === 0 || shift.shift_type === 'on_shift')) {
                                      fetch('http://127.0.0.1:7243/ingest/fdda5182-9242-4c03-be38-7b454f53c1a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:2370',message:'Weekly view filtering',data:{shiftId:shift.id,shiftType:shift.shift_type,shiftStartTime:shift.start_time,timeStr,shiftDateStrLocal,dayStrLocal,matches,shiftYear,shiftMonth,shiftDay,employeeId:employee.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
                                    }
                                    // #endregion
                                    
                                    return matches;
                                  });
                                  
                                  const isDragOver = dragOverCell?.day?.toISOString().split('T')[0] === day.toISOString().split('T')[0] && dragOverCell?.employeeId === employee.id;
                                  
                                  return (
                                    <td 
                                      key={dayIdx} 
                                      className={`px-2 py-3 align-top min-h-[80px] ${
                                        isDragOver ? theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100' : ''
                                      }`}
                                      onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDragOver(e, day, employee.id);
                                      }}
                                      onDragLeave={handleDragLeave}
                                      onDrop={(e) => {
                                        console.log('Drop on cell:', day, employee.id);
                                        handleDrop(e, day, employee.id);
                                      }}
                                    >
                                      {dayShifts.map(shift => {
                                        // Ensure we're using the shift from the current state, not a stale reference
                                        const currentShift = shifts.find(s => s.id === shift.id) || shift;
                                        
                                        
                                        return (
                                        <div
                                          key={currentShift.id}
                                          draggable={isManager}
                                          onDragStart={(e) => handleDragStart(e, currentShift)}
                                          onDragEnd={(e) => {
                                            e.currentTarget.style.opacity = '1';
                                            handleDragEnd(e);
                                          }}
                                          onMouseDown={(e) => {
                                            // Prevent text selection while dragging
                                            if (isManager) {
                                              e.currentTarget.style.userSelect = 'none';
                                            }
                                          }}
                                          className={`
                                            mb-2 p-2 rounded-lg text-xs transition-all group relative
                                            ${isManager ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
                                          `}
                                          style={{
                                            backgroundColor: currentShift.color ? `${currentShift.color}20` : (theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'),
                                            borderColor: currentShift.color ? `${currentShift.color}40` : (theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'),
                                            borderWidth: '1px',
                                            borderStyle: 'solid'
                                          }}
                                          onMouseEnter={(e) => {
                                            if (currentShift.color) {
                                              e.currentTarget.style.backgroundColor = `${currentShift.color}30`;
                                              e.currentTarget.style.borderColor = `${currentShift.color}60`;
                                            }
                                          }}
                                          onMouseLeave={(e) => {
                                            if (currentShift.color) {
                                              e.currentTarget.style.backgroundColor = `${currentShift.color}20`;
                                              e.currentTarget.style.borderColor = `${currentShift.color}40`;
                                            }
                                          }}
                                          onClick={(e) => {
                                            // Only open edit modal if not dragging
                                            if (isManager && !draggedShift) {
                                              openEditShiftModal(shift);
                                            }
                                          }}
                                        >
                                          <div className="flex items-center justify-between mb-1">
                                            {(currentShift.shift_type !== 'emergency' && currentShift.shift_type !== 'paid_leave' && currentShift.shift_type !== 'day_off') ? (
                                              <div 
                                                className="font-bold"
                                                style={{ color: currentShift.color || (theme === 'dark' ? '#a78bfa' : '#7c3aed') }}
                                              >
                                                {formatTime(currentShift.start_time)} - {formatTime(currentShift.end_time)}
                                              </div>
                                            ) : (
                                              <div 
                                                className={`font-bold uppercase tracking-wide text-xs ${
                                                  currentShift.shift_type === 'emergency'
                                                    ? theme === 'dark' ? 'text-red-300' : 'text-red-600'
                                                    : currentShift.shift_type === 'paid_leave'
                                                    ? theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'
                                                    : theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                                                }`}
                                              >
                                                {currentShift.shift_type === 'emergency' ? 'Emergency' : currentShift.shift_type === 'paid_leave' ? 'Paid Leave' : 'Day Off'}
                                              </div>
                                            )}
                                            {isManager && (
                                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditShiftModal(currentShift);
                                                  }}
                                                  className="p-1 hover:bg-purple-500/20 rounded"
                                                >
                                                  <Edit2 size={12} />
                                                </button>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteShift(currentShift.id);
                                                  }}
                                                  className="p-1 hover:bg-red-500/20 rounded text-red-400"
                                                >
                                                  <Trash2 size={12} />
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                          {currentShift.location && (
                                            <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                                              <MapPin size={10} />
                                              {currentShift.location.name}
                                            </div>
                                          )}
                                        </div>
                                        );
                                      })}
                                      {dayShifts.length === 0 && isManager && (
                                        <div
                                          onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDragOver(e, day, employee.id);
                                          }}
                                          onDragLeave={handleDragLeave}
                                          onDrop={(e) => {
                                            console.log('Drop on empty cell:', day, employee.id);
                                            handleDrop(e, day, employee.id);
                                          }}
                                          className={`
                                            w-full py-2 text-xs rounded-lg transition-all min-h-[40px] flex items-center justify-center
                                            ${dragOverCell?.day?.toISOString().split('T')[0] === day.toISOString().split('T')[0] && dragOverCell?.employeeId === employee.id
                                              ? theme === 'dark' ? 'bg-purple-500/30 border-2 border-purple-400 border-dashed' : 'bg-purple-100 border-2 border-purple-300 border-dashed'
                                              : theme === 'dark'
                                                ? 'hover:bg-slate-700 text-slate-400 hover:text-white border border-dashed border-slate-700'
                                                : 'hover:bg-slate-100 text-slate-400 hover:text-slate-900 border border-dashed border-slate-200'
                                            }
                                          `}
                                        >
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const rect = e.currentTarget.getBoundingClientRect();
                                              setPopupPosition({
                                                x: rect.left + rect.width / 2,
                                                y: rect.top + rect.height / 2,
                                                visible: true,
                                                day,
                                                employeeId: employee.id
                                              });
                                            }}
                                            onMouseDown={(e) => {
                                              // Prevent drag from starting when clicking the button
                                              e.stopPropagation();
                                            }}
                                            className="w-full h-full pointer-events-auto"
                                          >
                                            + Add Shift
                                          </button>
                                        </div>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Monthly View - Redesigned */
              <div className={`
                rounded-2xl overflow-hidden border shadow-xl
                ${theme === 'dark' 
                  ? 'bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border-slate-700/50' 
                  : 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-200 shadow-lg'
                }
              `}>
                {/* Enhanced Header Row */}
                <div className={`
                  grid grid-cols-7 gap-0.5 p-2
                  ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100/50'}
                `}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                    <div
                      key={day}
                      className={`
                        p-3 sm:p-4 text-center rounded-xl transition-all
                        ${theme === 'dark' 
                          ? 'bg-slate-800/30 text-slate-300 hover:bg-slate-700/50' 
                          : 'bg-white/50 text-slate-700 hover:bg-slate-100'
                        }
                      `}
                    >
                      <div className="text-xs sm:text-sm font-black uppercase tracking-wider">
                        {day}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1 p-1 sm:p-2 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  {days.map((day, idx) => {
                    const dayShifts = getShiftsForDate(day);
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isDragOver = dragOverCell?.day?.toISOString().split('T')[0] === day.toISOString().split('T')[0] && !dragOverCell?.employeeId;
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                    
                    return (
                      <div
                        key={idx}
                        onMouseEnter={(e) => {
                          if (dayShifts.length > 3 && isCurrentMonth) {
                            const cellRect = e.currentTarget.getBoundingClientRect();
                            setHoveredDay({
                              date: day,
                              shifts: dayShifts,
                              position: {
                                x: cellRect.left + cellRect.width / 2,
                                y: cellRect.bottom
                              }
                            });
                          }
                        }}
                        onMouseLeave={() => {
                          setHoveredDay(null);
                        }}
                        className={`
                          relative min-h-[100px] sm:min-h-[140px] md:min-h-[160px] p-2 sm:p-3 md:p-4 rounded-xl transition-all duration-200
                          ${!isCurrentMonth 
                            ? theme === 'dark' 
                              ? 'bg-slate-900/20 text-slate-600 opacity-50' 
                              : 'bg-slate-50/50 text-slate-400 opacity-60'
                            : ''
                          }
                          ${isToday 
                            ? theme === 'dark'
                              ? 'bg-gradient-to-br from-purple-600/30 via-purple-500/20 to-indigo-600/30 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                              : 'bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 border-2 border-purple-300 shadow-md'
                            : theme === 'dark' && isCurrentMonth
                              ? 'bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/30'
                              : isCurrentMonth
                                ? 'bg-white/80 hover:bg-white border border-slate-200/50'
                                : ''
                          }
                          ${isWeekend && isCurrentMonth && !isToday
                            ? theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-50/50'
                            : ''
                          }
                          ${isDragOver 
                            ? theme === 'dark' 
                              ? 'bg-purple-500/30 border-2 border-purple-400 border-dashed shadow-lg' 
                              : 'bg-purple-100 border-2 border-purple-400 border-dashed shadow-lg'
                            : ''
                          }
                        `}
                        onDragOver={(e) => {
                          if (isManager) {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragOverCell({ day, employeeId: null });
                          }
                        }}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => {
                          if (isManager) {
                            e.preventDefault();
                            e.stopPropagation();
                            let shiftToMove = draggedShift;
                            if (!shiftToMove) {
                              try {
                                const shiftData = e.dataTransfer.getData('application/json');
                                if (shiftData) {
                                  shiftToMove = JSON.parse(shiftData);
                                } else {
                                  const shiftId = e.dataTransfer.getData('text/plain');
                                  shiftToMove = shifts.find(s => s.id === shiftId);
                                }
                              } catch (err) {
                                console.error('Error parsing shift data:', err);
                              }
                            }
                            if (shiftToMove) {
                              handleDrop(e, day, shiftToMove.employee_id);
                            }
                          }
                        }}
                      >
                        {/* Date Number */}
                        <div className="flex items-center justify-between mb-2">
                          <div className={`
                            text-sm sm:text-base font-black rounded-lg px-2 py-0.5
                            ${isToday 
                              ? theme === 'dark'
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'bg-purple-600 text-white shadow-md'
                              : theme === 'dark' 
                                ? 'text-slate-300' 
                                : 'text-slate-700'
                            }
                            ${!isCurrentMonth ? 'opacity-40' : ''}
                          `}>
                            {day.getDate()}
                          </div>
                          {dayShifts.length > 0 && (
                            <div className={`
                              px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold
                              ${theme === 'dark'
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-purple-100 text-purple-600 border border-purple-200'
                              }
                            `}>
                              {dayShifts.length}
                            </div>
                          )}
                        </div>

                        {/* Shifts List */}
                        <div className="space-y-1 sm:space-y-1.5 md:space-y-2 relative">
                          {dayShifts.slice(0, isCurrentMonth ? 3 : 2).map((shift, shiftIdx) => (
                            <div
                              key={shift.id}
                              draggable={isManager}
                              onDragStart={(e) => handleDragStart(e, shift)}
                              onDragEnd={(e) => {
                                e.currentTarget.style.opacity = '1';
                                handleDragEnd(e);
                              }}
                              onMouseDown={(e) => {
                                if (isManager) {
                                  e.currentTarget.style.userSelect = 'none';
                                }
                              }}
                              className={`
                                group relative overflow-hidden rounded-lg p-1.5 sm:p-2 md:p-2.5 transition-all duration-200
                                ${isManager ? 'cursor-grab active:cursor-grabbing hover:scale-[1.02]' : 'cursor-pointer'}
                                ${shiftIdx === 2 ? 'hidden sm:block' : ''}
                              `}
                              style={{
                                backgroundColor: shift.color ? `${shift.color}15` : (theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'),
                                borderColor: shift.color ? `${shift.color}50` : (theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'),
                                borderWidth: '1px',
                                borderStyle: 'solid'
                              }}
                              onMouseEnter={(e) => {
                                if (shift.color) {
                                  e.currentTarget.style.backgroundColor = `${shift.color}25`;
                                  e.currentTarget.style.borderColor = `${shift.color}70`;
                                  e.currentTarget.style.boxShadow = `0 4px 12px ${shift.color}30`;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (shift.color) {
                                  e.currentTarget.style.backgroundColor = `${shift.color}15`;
                                  e.currentTarget.style.borderColor = `${shift.color}50`;
                                  e.currentTarget.style.boxShadow = 'none';
                                }
                              }}
                              onClick={(e) => {
                                if (isManager && !draggedShift) {
                                  openEditShiftModal(shift);
                                }
                              }}
                            >
                              {/* Gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 pointer-events-none"></div>
                              
                              {/* Content */}
                              <div className="relative">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex-1 min-w-0">
                                    {shift.shift_type === 'emergency' || shift.shift_type === 'paid_leave' || shift.shift_type === 'day_off' ? (
                                      <div className="flex flex-col gap-1">
                                        <div 
                                          className="text-[10px] sm:text-xs md:text-sm font-bold truncate"
                                          style={{ color: shift.color || (theme === 'dark' ? '#c4b5fd' : '#6d28d9') }}
                                        >
                                          {shift.employee?.full_name || 'Unknown'}
                                        </div>
                                        {/* Shift Type Badge for Special Shifts */}
                                        <div className={`
                                          inline-flex items-center gap-0.5 sm:gap-1 mt-0.5 px-1 sm:px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold uppercase tracking-wider
                                          ${shift.shift_type === 'emergency'
                                            ? theme === 'dark'
                                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                              : 'bg-red-50 text-red-600 border border-red-200'
                                            : shift.shift_type === 'paid_leave'
                                            ? theme === 'dark'
                                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                              : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                            : theme === 'dark'
                                              ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                              : 'bg-slate-100 text-slate-600 border border-slate-300'
                                          }
                                        `}>
                                          {shift.shift_type === 'emergency' ? (
                                            <>
                                              <AlertCircle size={7} className="sm:w-2 sm:h-2" />
                                              <span className="truncate">Emergency</span>
                                            </>
                                          ) : shift.shift_type === 'paid_leave' ? (
                                            <>
                                              <FileText size={7} className="sm:w-2 sm:h-2" />
                                              <span className="truncate">Paid Leave</span>
                                            </>
                                          ) : (
                                            <>
                                              <CalendarDays size={7} className="sm:w-2 sm:h-2" />
                                              <span className="truncate">Day Off</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col gap-0.5">
                                        <div 
                                          className="text-[10px] sm:text-xs md:text-sm font-bold truncate"
                                          style={{ color: shift.color || (theme === 'dark' ? '#c4b5fd' : '#6d28d9') }}
                                        >
                                          {shift.employee?.full_name || 'Unknown'}
                                        </div>
                                        <div className={`
                                          text-[9px] sm:text-[10px] opacity-80 font-medium
                                          ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                                        `}>
                                          {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  {isManager && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openEditShiftModal(shift);
                                        }}
                                        className={`
                                          p-1 rounded hover:scale-110 transition-all
                                          ${theme === 'dark' 
                                            ? 'hover:bg-purple-500/30 text-purple-300' 
                                            : 'hover:bg-purple-200 text-purple-600'
                                          }
                                        `}
                                        title="Edit shift"
                                      >
                                        <Edit2 size={12} />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteShift(shift.id);
                                        }}
                                        className={`
                                          p-1 rounded hover:scale-110 transition-all
                                          ${theme === 'dark' 
                                            ? 'hover:bg-red-500/30 text-red-400' 
                                            : 'hover:bg-red-100 text-red-600'
                                          }
                                        `}
                                        title="Delete shift"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                {(shift.shift_type !== 'emergency' && shift.shift_type !== 'paid_leave' && shift.shift_type !== 'day_off') && (
                                  <div className={`
                                    flex items-center gap-1.5 text-[10px] sm:text-xs
                                    ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                                  `}>
                                    <Clock size={10} className="flex-shrink-0" />
                                    <span className="font-semibold">
                                      {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                                    </span>
                                  </div>
                                )}
                                {shift.location && (
                                  <div className={`
                                    flex items-center gap-1 mt-1 text-[9px] sm:text-[10px]
                                    ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}
                                  `}>
                                    <MapPin size={9} className="flex-shrink-0" />
                                    <span className="truncate">{shift.location.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          
                          {/* More shifts indicator */}
                          {dayShifts.length > (isCurrentMonth ? 3 : 2) && (
                            <div className={`
                              text-center py-1.5 rounded-lg text-[10px] sm:text-xs font-bold cursor-pointer
                              transition-all hover:scale-105
                              ${theme === 'dark'
                                ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-300 border border-purple-500/40 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/20'
                                : 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-300 hover:border-purple-400 hover:shadow-md'
                              }
                            `}>
                              +{dayShifts.length - (isCurrentMonth ? 3 : 2)} more
                            </div>
                          )}
                          
                          {/* Empty state - Add button */}
                          {isManager && dayShifts.length === 0 && isCurrentMonth && (
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDragOverCell({ day, employeeId: null });
                              }}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                let shiftToMove = draggedShift;
                                if (!shiftToMove) {
                                  try {
                                    const shiftData = e.dataTransfer.getData('application/json');
                                    if (shiftData) {
                                      shiftToMove = JSON.parse(shiftData);
                                    } else {
                                      const shiftId = e.dataTransfer.getData('text/plain');
                                      shiftToMove = shifts.find(s => s.id === shiftId);
                                    }
                                  } catch (err) {
                                    console.error('Error parsing shift data:', err);
                                  }
                                }
                                if (shiftToMove) {
                                  setDragOverCell(null);
                                  handleDrop(e, day, shiftToMove.employee_id);
                                }
                              }}
                              className={`
                                w-full py-2 sm:py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center min-h-[36px]
                                ${isDragOver 
                                  ? theme === 'dark' 
                                    ? 'bg-purple-500/30 border-2 border-purple-400 border-dashed shadow-lg' 
                                    : 'bg-purple-100 border-2 border-purple-400 border-dashed shadow-lg'
                                  : theme === 'dark'
                                    ? 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-400 hover:text-white border border-dashed border-slate-600 hover:border-purple-500/50'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-dashed border-slate-200 hover:border-purple-300'
                                }
                              `}
                            >
                              <button
                                onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setPopupPosition({
                                    x: rect.left + rect.width / 2,
                                    y: rect.top + rect.height / 2,
                                    visible: true,
                                    day,
                                    employeeId: null
                                  });
                                }}
                                className={`
                                  flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-all
                                  ${theme === 'dark' 
                                    ? 'text-slate-400 hover:text-purple-400' 
                                    : 'text-slate-500 hover:text-purple-600'
                                  }
                                `}
                              >
                                <Plus size={14} />
                                <span>Add Shift</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Hover Popup for Days with Many Employees */}
                {hoveredDay && hoveredDay.shifts.length > 3 && (
                  <div
                    className="fixed z-[10000] pointer-events-none"
                    style={{
                      left: `${hoveredDay.position.x}px`,
                      top: `${hoveredDay.position.y + 8}px`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <div className={`
                      relative w-80 max-w-[90vw] max-h-[400px] overflow-hidden rounded-2xl shadow-2xl border-2
                      ${theme === 'dark'
                        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-purple-500/50 shadow-purple-500/20'
                        : 'bg-white border-purple-300 shadow-xl'
                      }
                    `}>
                      {/* Header */}
                      <div className={`
                        px-4 py-3 border-b
                        ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-purple-50'}
                      `}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`
                              text-sm font-black
                              ${theme === 'dark' ? 'text-white' : 'text-slate-900'}
                            `}>
                              {hoveredDay.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div className={`
                              text-xs mt-0.5
                              ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                            `}>
                              {hoveredDay.shifts.length} {hoveredDay.shifts.length === 1 ? 'shift' : 'shifts'}
                            </div>
                          </div>
                          <div className={`
                            px-3 py-1 rounded-full text-xs font-bold
                            ${theme === 'dark'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-purple-100 text-purple-700 border border-purple-200'
                            }
                          `}>
                            {hoveredDay.shifts.length} employees
                          </div>
                        </div>
                      </div>
                      
                      {/* Employees List */}
                      <div className="overflow-y-auto max-h-[320px] p-3 space-y-2">
                        {hoveredDay.shifts.map((shift, idx) => (
                          <div
                            key={shift.id}
                            className={`
                              group relative rounded-xl p-3 transition-all duration-200
                              ${theme === 'dark'
                                ? 'bg-gradient-to-r from-purple-600/20 via-purple-500/15 to-indigo-600/20 border border-purple-500/30 hover:from-purple-600/30 hover:via-purple-500/25 hover:to-indigo-600/30 hover:border-purple-400/50'
                                : 'bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200 hover:from-purple-100 hover:via-indigo-100 hover:to-purple-100 hover:border-purple-300'
                              }
                            `}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isManager) {
                                openEditShiftModal(shift);
                                setHoveredDay(null);
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              {/* Avatar */}
                              <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                                ${theme === 'dark'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-purple-100 text-purple-700 border border-purple-200'
                                }
                              `}>
                                {shift.employee?.full_name?.charAt(0)?.toUpperCase() || shift.employee?.email?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              
                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className={`
                                  font-bold text-sm mb-1
                                  ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}
                                `}>
                                  {shift.employee?.full_name || 'Unknown Employee'}
                                </div>
                                {(shift.shift_type !== 'emergency' && shift.shift_type !== 'paid_leave' && shift.shift_type !== 'day_off') && (
                                  <div className={`
                                    flex items-center gap-2 text-xs mb-1
                                    ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                                  `}>
                                    <Clock size={12} />
                                    <span className="font-semibold">
                                      {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                                    </span>
                                  </div>
                                )}
                                {(shift.shift_type === 'emergency' || shift.shift_type === 'paid_leave' || shift.shift_type === 'day_off') && (
                                  <div className={`
                                    flex items-center gap-2 text-xs mb-1 font-bold uppercase tracking-wide
                                    ${shift.shift_type === 'emergency'
                                      ? theme === 'dark' ? 'text-red-300' : 'text-red-600'
                                      : shift.shift_type === 'paid_leave'
                                      ? theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'
                                      : theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                                    }
                                  `}>
                                    {shift.shift_type === 'emergency' ? (
                                      <>
                                        <AlertCircle size={12} />
                                        <span>Emergency</span>
                                      </>
                                    ) : shift.shift_type === 'paid_leave' ? (
                                      <>
                                        <Calendar size={12} />
                                        <span>Paid Leave</span>
                                      </>
                                    ) : (
                                      <>
                                        <CalendarDays size={12} />
                                        <span>Day Off</span>
                                      </>
                                    )}
                                  </div>
                                )}
                                {shift.location && (
                                  <div className={`
                                    flex items-center gap-2 text-xs
                                    ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}
                                  `}>
                                    <MapPin size={11} />
                                    <span className="truncate">{shift.location.name}</span>
                                  </div>
                                )}
                                {shift.employee?.job_title && (
                                  <div className={`
                                    mt-1 text-xs
                                    ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}
                                  `}>
                                    {shift.employee.job_title}
                                  </div>
                                )}
                              </div>
                              
                              {/* Edit Icon (only for managers) */}
                              {isManager && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditShiftModal(shift);
                                    setHoveredDay(null);
                                  }}
                                  className={`
                                    opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg
                                    ${theme === 'dark'
                                      ? 'hover:bg-purple-500/30 text-purple-300'
                                      : 'hover:bg-purple-200 text-purple-600'
                                    }
                                  `}
                                >
                                  <Edit2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Footer */}
                      <div className={`
                        px-4 py-2 border-t text-center
                        ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-purple-50'}
                      `}>
                        <p className={`
                          text-xs
                          ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                        `}>
                          {isManager ? 'Click any shift to edit' : 'Hover to view details'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <div
                      className={`
                        absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45
                        ${theme === 'dark'
                          ? 'bg-slate-800 border-l border-t border-purple-500/50'
                          : 'bg-white border-l border-t border-purple-300'
                        }
                      `}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Add Shift Popup */}
          {popupPosition.visible && (() => {
            // Calculate smart positioning to keep popup within viewport
            const popupWidth = 320; // Estimated width
            const popupHeight = 400; // Estimated max height
            const padding = 16; // Padding from edges
            
            let left = popupPosition.x;
            let top = popupPosition.y;
            let transformX = '-50%';
            let transformY = '-50%';
            
            // Adjust horizontal position
            if (popupPosition.x < popupWidth / 2 + padding) {
              // Too close to left edge - align to left
              left = padding;
              transformX = '0';
            } else if (popupPosition.x > window.innerWidth - popupWidth / 2 - padding) {
              // Too close to right edge - align to right
              left = window.innerWidth - popupWidth - padding;
              transformX = '0';
            }
            
            // Adjust vertical position
            if (popupPosition.y < popupHeight / 2 + padding) {
              // Too close to top edge - show below
              top = popupPosition.y + 30;
              transformY = '0';
            } else if (popupPosition.y > window.innerHeight - popupHeight / 2 - padding) {
              // Too close to bottom edge - show above
              top = popupPosition.y - 30;
              transformY = '-100%';
            }
            
            return (
              <>
                <div
                  className="fixed inset-0 z-[9997]"
                  onClick={() => setPopupPosition({ ...popupPosition, visible: false })}
                />
                <div
                  className="fixed z-[9998] animate-in zoom-in-95 fade-in duration-200"
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    transform: `translate(${transformX}, ${transformY})`,
                    maxHeight: `${window.innerHeight - padding * 2}px`,
                    maxWidth: `${window.innerWidth - padding * 2}px`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                <div
                  className={`
                    rounded-xl p-4 shadow-2xl border min-w-[280px] max-w-[90vw] overflow-y-auto
                    ${theme === 'dark'
                      ? 'bg-slate-800/98 backdrop-blur-xl border-slate-700/80 ring-2 ring-purple-500/20'
                      : 'bg-white/98 backdrop-blur-xl border-slate-200/80 ring-2 ring-purple-500/10'
                    }
                  `}
                  style={{ maxHeight: `${window.innerHeight - padding * 2}px` }}
                >
                  {scheduleTemplates && scheduleTemplates.length > 0 ? (
                    <>
                      <div className="mb-3">
                        <h3 className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          Quick Add
                        </h3>
                        {popupPosition.employeeId && (
                          <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            {employees.find(e => e.id === popupPosition.employeeId)?.full_name || 'Employee'}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {/* Default Templates */}
                        {scheduleTemplates.filter(t => t.shift_type === 'emergency' || t.shift_type === 'paid_leave' || t.shift_type === 'day_off').length > 0 && (
                          <div>
                            <div className={`text-[10px] font-bold uppercase mb-1.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                              Default
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {scheduleTemplates
                                .filter(t => t.shift_type === 'emergency' || t.shift_type === 'paid_leave' || t.shift_type === 'day_off')
                                .map(template => (
                                  <TemplateCard
                                    key={template.id}
                                    template={template}
                                    theme={theme}
                                    isDefault={true}
                                    onClick={async () => {
                                      setTemplateModalContext({ day: popupPosition.day, employeeId: popupPosition.employeeId });
                                      await handleTemplateClick(template);
                                      setPopupPosition({ ...popupPosition, visible: false });
                                    }}
                                  />
                                ))}
                            </div>
                          </div>
                        )}
                        {/* User Templates */}
                        {scheduleTemplates.filter(t => t.shift_type === 'on_shift' && !t.is_default).length > 0 && (
                          <div>
                            <div className={`text-[10px] font-bold uppercase mb-1.5 mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                              Your Templates
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {scheduleTemplates
                                .filter(t => t.shift_type === 'on_shift' && !t.is_default)
                                .map(template => (
                                  <TemplateCard
                                    key={template.id}
                                    template={template}
                                    theme={theme}
                                    isDefault={false}
                                    onClick={async () => {
                                      setTemplateModalContext({ day: popupPosition.day, employeeId: popupPosition.employeeId });
                                      await handleTemplateClick(template);
                                      setPopupPosition({ ...popupPosition, visible: false });
                                    }}
                                  />
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setPopupPosition({ ...popupPosition, visible: false });
                          openAddShiftModal(popupPosition.day, popupPosition.employeeId || null);
                        }}
                        className={`
                          w-full mt-3 px-3 py-2 rounded-lg text-xs font-bold transition-all
                          ${theme === 'dark'
                            ? 'bg-slate-700 hover:bg-slate-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                          }
                        `}
                      >
                        Custom Time
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        No templates
                      </p>
                      <button
                        onClick={() => {
                          setPopupPosition({ ...popupPosition, visible: false });
                          openAddShiftModal(popupPosition.day, popupPosition.employeeId || null);
                        }}
                        className={`
                          w-full px-3 py-2 rounded-lg text-xs font-bold transition-all
                          bg-purple-600 hover:bg-purple-700 text-white
                        `}
                      >
                        Add Shift
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
            );
          })()}

          {/* Schedule Template Selection Modal - Redesigned */}
          {showTemplateModal && (
            <>
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] animate-in fade-in duration-200"
                onClick={() => setShowTemplateModal(false)}
              />
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
              >
                <div
                  className={`
                    relative w-full max-w-2xl rounded-2xl p-5 pointer-events-auto
                    transform transition-all duration-300 animate-in zoom-in-95 fade-in
                    ${theme === 'dark' 
                      ? 'bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl' 
                      : 'bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-2xl'
                    }
                  `}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Quick Add Shift
                      </h2>
                      {templateModalContext.employeeId && (
                        <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          {employees.find(e => e.id === templateModalContext.employeeId)?.full_name || 'Employee'}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setShowTemplateModal(false)}
                      className={`
                        p-1.5 rounded-lg transition-all hover:scale-110
                        ${theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100'}
                      `}
                    >
                      <X size={18} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} />
                    </button>
                  </div>
                  
                  {!scheduleTemplates || scheduleTemplates.length === 0 ? (
                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      <p className="mb-2 text-sm font-bold">No templates found</p>
                      <p className="text-xs mb-4">Create templates in the Schedule page</p>
                      <button
                        onClick={() => {
                          navigate('/schedule');
                          setShowTemplateModal(false);
                        }}
                        className={`
                          px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105
                          bg-purple-600 hover:bg-purple-700 text-white
                        `}
                      >
                        Go to Templates
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                      {/* Default Templates Section */}
                      {scheduleTemplates.filter(t => t.shift_type === 'emergency' || t.shift_type === 'paid_leave' || t.shift_type === 'day_off').length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                            <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                              Default
                            </span>
                            <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {scheduleTemplates
                              .filter(t => t.shift_type === 'emergency' || t.shift_type === 'paid_leave' || t.shift_type === 'day_off')
                              .map(template => {
                                const isEmergency = template.shift_type === 'emergency';
                                const isPaidLeave = template.shift_type === 'paid_leave';
                                const isDayOff = template.shift_type === 'day_off';
                                return (
                                  <TemplateCard
                                    key={template.id}
                                    template={template}
                                    theme={theme}
                                    isDefault={true}
                                    onClick={async () => {
                                      await handleTemplateClick(template);
                                    }}
                                  />
                                );
                              })}
                          </div>
                        </div>
                      )}

                      {/* User-Created Templates Section */}
                      {scheduleTemplates.filter(t => t.shift_type === 'on_shift' && !t.is_default).length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                            <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                              Your Templates
                            </span>
                            <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {scheduleTemplates
                              .filter(t => t.shift_type === 'on_shift' && !t.is_default)
                              .map(template => (
                                <TemplateCard
                                  key={template.id}
                                  template={template}
                                  theme={theme}
                                  isDefault={false}
                                  onClick={async () => {
                                    await handleTemplateClick(template);
                                  }}
                                />
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Add/Edit Shift Modal */}
          {showShiftModal && (
            <>
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                onClick={() => setShowShiftModal(false)}
              />
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
              >
                <div
                  className={`
                    relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-6 pointer-events-auto
                    ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}
                  `}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {editingShift ? 'Edit Shift' : 'New Shift'}
                    </h2>
                    <button
                      onClick={() => setShowShiftModal(false)}
                      className={`
                        p-2 rounded-lg transition-colors
                        ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}
                      `}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleShiftSubmit} className="space-y-4">
                    {/* Employee */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        Employee *
                      </label>
                      <select
                        required
                        value={shiftForm.employee_id}
                        onChange={(e) => setShiftForm({ ...shiftForm, employee_id: e.target.value })}
                        className={`
                          w-full px-4 py-2 rounded-lg border transition-all
                          ${theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                          }
                        `}
                      >
                        <option value="">Select employee...</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.full_name} {emp.job_title ? `(${emp.job_title})` : ''}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location (if on-site or hybrid) */}
                    {organization && (organization.work_type === 'on-site' || organization.work_type === 'hybrid') && (
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                          Location {organization.work_type === 'on-site' ? '*' : ''}
                        </label>
                        <select
                          required={organization.work_type === 'on-site'}
                          value={shiftForm.location_id}
                          onChange={(e) => setShiftForm({ ...shiftForm, location_id: e.target.value })}
                          className={`
                            w-full px-4 py-2 rounded-lg border transition-all
                            ${theme === 'dark'
                              ? 'bg-slate-700 border-slate-600 text-white'
                              : 'bg-white border-slate-300 text-slate-900'
                            }
                          `}
                        >
                          <option value="">{organization.work_type === 'on-site' ? 'Select location...' : 'Remote (No location)'}</option>
                          {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Start Time */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        Start Time *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={shiftForm.start_time}
                        onChange={(e) => setShiftForm({ ...shiftForm, start_time: e.target.value })}
                        className={`
                          w-full px-4 py-2 rounded-lg border transition-all
                          ${theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                          }
                        `}
                      />
                    </div>

                    {/* End Time */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        End Time *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={shiftForm.end_time}
                        onChange={(e) => setShiftForm({ ...shiftForm, end_time: e.target.value })}
                        className={`
                          w-full px-4 py-2 rounded-lg border transition-all
                          ${theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                          }
                        `}
                      />
                    </div>

                    {/* Break Duration */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        Break Duration (minutes)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={shiftForm.break_duration_minutes}
                        onChange={(e) => setShiftForm({ ...shiftForm, break_duration_minutes: e.target.value })}
                        className={`
                          w-full px-4 py-2 rounded-lg border transition-all
                          ${theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                          }
                        `}
                      />
                    </div>

                    {/* Shift Type */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        Shift Type
                      </label>
                      <select
                        value={shiftForm.shift_type}
                        onChange={(e) => {
                          const selectedType = shiftTypes.find(st => st.value === e.target.value);
                          setShiftForm({ 
                            ...shiftForm, 
                            shift_type: e.target.value,
                            color: selectedType ? selectedType.defaultColor : shiftForm.color
                          });
                        }}
                        className={`
                          w-full px-4 py-2 rounded-lg border transition-all
                          ${theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                          }
                        `}
                      >
                        {shiftTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Color Picker */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={shiftForm.color}
                          onChange={(e) => setShiftForm({ ...shiftForm, color: e.target.value })}
                          className="w-16 h-10 rounded-lg border-2 cursor-pointer"
                          style={{ borderColor: shiftForm.color }}
                        />
                        <input
                          type="text"
                          value={shiftForm.color}
                          onChange={(e) => setShiftForm({ ...shiftForm, color: e.target.value })}
                          placeholder="#8b5cf6"
                          className={`
                            flex-1 px-4 py-2 rounded-lg border transition-all font-mono text-sm
                            ${theme === 'dark'
                              ? 'bg-slate-700 border-slate-600 text-white'
                              : 'bg-white border-slate-300 text-slate-900'
                            }
                          `}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const selectedType = shiftTypes.find(st => st.value === shiftForm.shift_type);
                            if (selectedType) {
                              setShiftForm({ ...shiftForm, color: selectedType.defaultColor });
                            }
                          }}
                          className={`
                            px-3 py-2 rounded-lg text-xs font-bold transition-all
                            ${theme === 'dark'
                              ? 'bg-slate-700 hover:bg-slate-600 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                            }
                          `}
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        Status
                      </label>
                      <select
                        value={shiftForm.status}
                        onChange={(e) => setShiftForm({ ...shiftForm, status: e.target.value })}
                        className={`
                          w-full px-4 py-2 rounded-lg border transition-all
                          ${theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                          }
                        `}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        Notes
                      </label>
                      <textarea
                        value={shiftForm.notes}
                        onChange={(e) => setShiftForm({ ...shiftForm, notes: e.target.value })}
                        rows="3"
                        className={`
                          w-full px-4 py-2 rounded-lg border transition-all resize-none
                          ${theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                          }
                        `}
                        placeholder="Optional notes for this shift..."
                      />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowShiftModal(false)}
                        className={`
                          flex-1 px-4 py-2 rounded-lg font-bold transition-all
                          ${theme === 'dark'
                            ? 'bg-slate-700 hover:bg-slate-600 text-white'
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
                          flex-1 px-4 py-2 rounded-lg font-bold transition-all
                          bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50
                        `}
                      >
                        {submitting ? 'Saving...' : editingShift ? 'Update Shift' : 'Create Shift'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* Success Toast Notification */}
      {showToast && (
        <div 
          className={`
            fixed bottom-6 right-6 z-[10000]
            transform transition-all duration-500 ease-out
            ${showToast 
              ? 'opacity-100 translate-x-0 translate-y-0 scale-100' 
              : 'opacity-0 translate-x-8 translate-y-4 scale-95'
            }
          `}
          style={{
            animation: showToast 
              ? 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1), fadeIn 0.5s ease-out, scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'none'
          }}
        >
          <style>{`
            @keyframes slideInRight {
              from {
                transform: translateX(100px) translateY(20px) scale(0.9);
                opacity: 0;
              }
              to {
                transform: translateX(0) translateY(0) scale(1);
                opacity: 1;
              }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              from { transform: scale(0.9); }
              to { transform: scale(1); }
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
          `}</style>
          <div className={`
            flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl
            backdrop-blur-xl border-2
            ${theme === 'dark'
              ? 'bg-gradient-to-r from-emerald-600/95 via-emerald-600/90 to-emerald-500/95 border-emerald-400/50 text-white shadow-emerald-500/20'
              : 'bg-gradient-to-r from-emerald-50 via-emerald-50 to-emerald-100/80 border-emerald-300 text-emerald-900 shadow-emerald-200/50'
            }
            relative overflow-hidden
          `}>
            {/* Animated background gradient */}
            <div className={`
              absolute inset-0 opacity-20
              ${theme === 'dark' 
                ? 'bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400' 
                : 'bg-gradient-to-r from-emerald-200 via-emerald-100 to-emerald-200'
              }
              animate-pulse
            `}></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            <style>{`
              @keyframes shimmer {
                0% { transform: translateX(-100%) skewX(-15deg); }
                100% { transform: translateX(200%) skewX(-15deg); }
              }
            `}</style>
            
            {/* Content */}
            <div className="relative z-10 flex items-center gap-3">
              <div className={`
                p-2 rounded-xl
                ${theme === 'dark'
                  ? 'bg-emerald-500/20'
                  : 'bg-emerald-200/50'
                }
                animate-[bounce_0.6s_ease-out_0.2s]
              `}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              </div>
              <div>
                <p className="font-bold text-sm">{toastMessage || 'Operation completed successfully'}</p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className={`
                  ml-2 p-1.5 rounded-lg transition-all duration-200
                  ${theme === 'dark'
                    ? 'hover:bg-emerald-700/50 active:scale-95'
                    : 'hover:bg-emerald-100 active:scale-95'
                  }
                `}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
