import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Users, BarChart3, Settings, 
  Search, Bell, Plus, Clock, AlertTriangle, 
  ChevronRight, ChevronLeft, MoreVertical, CheckCircle2, Zap, Filter,
  Moon, Sun, TrendingUp, TrendingDown, Activity, FileText, Timer, UserCheck, CalendarCheck, Mail,
  Edit2, Trash2, MapPin, X, CalendarDays, Grid3x3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase';
import { createNotification } from '../lib/notificationService';
import NotificationCenter from './NotificationCenter';

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
  const { user, userProfile, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
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
  const [editingShift, setEditingShift] = useState(null);
  const [shiftForm, setShiftForm] = useState({
    employee_id: '',
    location_id: '',
    start_time: '',
    end_time: '',
    break_duration_minutes: 0,
    status: 'scheduled',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    employee: 'all',
    location: 'all',
    jobTitle: 'all',
    team: 'all'
  });
  const [teams, setTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scheduleTemplates, setScheduleTemplates] = useState([]);
  const [draggedShift, setDraggedShift] = useState(null);
  const [dragOverCell, setDragOverCell] = useState(null);
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
        weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

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
          fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?organization_id=eq.${orgId}&role=eq.employee&is_active=eq.true&select=id`,
            {
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          ),
          // Pending invitations
          fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/invitations?organization_id=eq.${orgId}&accepted_at=is.null&select=id`,
            {
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          ),
          // Pending time-off requests
          fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/time_off_requests?organization_id=eq.${orgId}&status=eq.pending&select=id`,
            {
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          ),
          // Today's shifts
          fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts?organization_id=eq.${orgId}&start_time=gte.${todayStart.toISOString()}&start_time=lt.${todayEnd.toISOString()}&select=id`,
            {
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          ),
          // Active now (people currently clocked in)
          fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/attendance?organization_id=eq.${orgId}&clock_out=is.null&select=id`,
            {
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          ),
          // New hires this month
          fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?organization_id=eq.${orgId}&joined_at=gte.${monthStart.toISOString()}&select=id`,
            {
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          ),
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
        weekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Start of week (Sunday)
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

        // #region agent log
        const shiftDates = filteredShifts.map(s => ({
          id: s.id,
          startTime: s.start_time,
          dateStrUTC: new Date(s.start_time).toISOString().split('T')[0],
          dateStrLocal: `${new Date(s.start_time).getFullYear()}-${String(new Date(s.start_time).getMonth()+1).padStart(2,'0')}-${String(new Date(s.start_time).getDate()).padStart(2,'0')}`
        }));
        fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:418',message:'Setting shifts state after fetch',data:{shiftCount:filteredShifts.length,dateRangeStart:startDate.toISOString(),dateRangeEnd:endDate.toISOString(),shiftDates},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion

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
    weekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Start of week (Sunday)
    
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
      const shiftDate = new Date(shift.start_time);
      const shiftDateStrLocal = `${shiftDate.getFullYear()}-${String(shiftDate.getMonth()+1).padStart(2,'0')}-${String(shiftDate.getDate()).padStart(2,'0')}`;
      
      // #region agent log
      const matches = shiftDateStrLocal === dateStrLocal;
      if (shift.id && matches) {
        fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:640',message:'Shift matched in getShiftsForDate',data:{dateStrLocal,shiftDateStrLocal,shiftId:shift.id,shiftStartTime:shift.start_time,dateISO:date.toISOString(),dateLocal:date.toString(),matches},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      }
      // #endregion
      
      // Compare using LOCAL dates, not UTC dates
      return shiftDateStrLocal === dateStrLocal;
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

  const getViewTitle = () => {
    if (view === 'weekly') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
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
    
    setShiftForm({
      employee_id: employeeId || '',
      location_id: '',
      start_time: startTime,
      end_time: endTime,
      break_duration_minutes: template?.break_duration_minutes || 0,
      status: 'scheduled',
      notes: ''
    });
    setShowShiftModal(true);
  };

  // Open edit shift modal
  const openEditShiftModal = (shift) => {
    setEditingShift(shift);
    const startDate = new Date(shift.start_time);
    const endDate = new Date(shift.end_time);
    
    setShiftForm({
      employee_id: shift.employee_id,
      location_id: shift.location_id || '',
      start_time: startDate.toISOString().slice(0, 16),
      end_time: endDate.toISOString().slice(0, 16),
      break_duration_minutes: shift.break_duration_minutes || 0,
      status: shift.status || 'scheduled',
      notes: shift.notes || ''
    });
    setShowShiftModal(true);
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
          // Use LOCAL date strings for comparison
          const shiftDate = new Date(s.start_time);
          const shiftDateStrLocal = `${shiftDate.getFullYear()}-${String(shiftDate.getMonth()+1).padStart(2,'0')}-${String(shiftDate.getDate()).padStart(2,'0')}`;
          return shiftDateStrLocal === startDateStrLocal;
        });
        
        if (existingShift) {
          alert(`This employee already has a shift on ${startDateStr}. Only one shift per employee per day is allowed.`);
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

      const shiftData = {
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

      let response;
      if (editingShift) {
        response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts?id=eq.${editingShift.id}`,
          {
            method: 'PATCH',
            headers,
            body: JSON.stringify(shiftData)
          }
        );
      } else {
        response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify(shiftData)
          }
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
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
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:910',message:'Drag start - stored displayed times',data:{shiftId:originalShift.id,shiftStartTime:originalShift.start_time,displayedStartTime,displayedEndTime,foundInState:!!shifts.find(s => s.id === shift.id),stateShiftCount:shifts.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    
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
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:897',message:'handleDrop entry',data:{targetDay:targetDay?.toString(),targetDayISO:targetDay?.toISOString(),targetDayType:typeof targetDay,targetEmployeeId,draggedShiftId:draggedShift?.id,draggedShiftStartTime:draggedShift?.start_time,draggedShiftEndTime:draggedShift?.end_time},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
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
    const originalShiftDate = new Date(shiftToMove.start_time);
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
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:1025',message:'Original times parsed',data:{originalStartISO:originalStart.toISOString(),originalStartLocal:originalStart.toString(),originalStartHours:originalStart.getHours(),originalStartMinutes:originalStart.getMinutes(),displayedStartTime,displayedStartHours,displayedStartMinutes,hasStoredTimes:draggedShift?._displayedStartTime?true:false,storedStartTime:draggedShift?._displayedStartTime,storedEndTime:draggedShift?._displayedEndTime,originalEndISO:originalEnd.toISOString(),originalEndLocal:originalEnd.toString(),originalEndHours:originalEnd.getHours(),originalEndMinutes:originalEnd.getMinutes(),displayedEndTime,displayedEndHours,displayedEndMinutes},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      // Calculate duration in milliseconds to preserve exact shift length
      const duration = originalEnd - originalStart;

      // Create new start time: use target day but keep the same DISPLAYED hours/minutes
      // Ensure targetDay is a Date object
      const targetDate = new Date(targetDay);
      // Reset to start of day to avoid time issues
      targetDate.setHours(0, 0, 0, 0);
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:1020',message:'Target date prepared',data:{targetDayOriginal:targetDay?.toString(),targetDateISO:targetDate.toISOString(),targetDateLocal:targetDate.toString(),targetYear:targetDate.getFullYear(),targetMonth:targetDate.getMonth(),targetDateNum:targetDate.getDate()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth();
      const targetDateNum = targetDate.getDate();
      
      // Create new date with the target date and DISPLAYED time (what user sees)
      // Using Date constructor avoids timezone conversion
      const newStart = new Date(targetYear, targetMonth, targetDateNum, displayedStartHours, displayedStartMinutes, 0, 0);
      
      // Create new end time: add the duration to maintain the exact same shift length
      const newEnd = new Date(newStart.getTime() + duration);
      
      // #region agent log
      const newDisplayedStartTime = formatTime(newStart.toISOString());
      const newDisplayedEndTime = formatTime(newEnd.toISOString());
      fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:1035',message:'New times calculated',data:{newStartISO:newStart.toISOString(),newStartLocal:newStart.toString(),newStartHours:newStart.getHours(),newStartMinutes:newStart.getMinutes(),newEndISO:newEnd.toISOString(),newEndLocal:newEnd.toString(),newEndHours:newEnd.getHours(),newEndMinutes:newEnd.getMinutes(),durationMinutes:duration/(1000*60),displayedStartTime,newDisplayedStartTime,displayedEndTime,newDisplayedEndTime,timesMatch:displayedStartTime===newDisplayedStartTime&&displayedEndTime===newDisplayedEndTime},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
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
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:1040',message:'Date string comparison',data:{targetDateStrLocal,targetDayISO:targetDay.toISOString(),newStartDateStr:newStart.toISOString().split('T')[0],newStartDateStrLocal:`${newStart.getFullYear()}-${String(newStart.getMonth()+1).padStart(2,'0')}-${String(newStart.getDate()).padStart(2,'0')}`},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      const existingShift = shifts.find(s => {
        if (s.employee_id !== targetEmployeeId) return false;
        // Compare using LOCAL dates, not UTC dates
        const shiftDate = new Date(s.start_time);
        const shiftDateStrLocal = `${shiftDate.getFullYear()}-${String(shiftDate.getMonth()+1).padStart(2,'0')}-${String(shiftDate.getDate()).padStart(2,'0')}`;
        return shiftDateStrLocal === targetDateStrLocal;
      });
      
      if (existingShift) {
        alert(`This employee already has a shift on ${targetDateStr}. Only one shift per employee per day is allowed.`);
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
        throw new Error(errorText);
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
      
      // #region agent log
      const newShiftDateLocal = newShift?.start_time ? `${new Date(newShift.start_time).getFullYear()}-${String(new Date(newShift.start_time).getMonth()+1).padStart(2,'0')}-${String(new Date(newShift.start_time).getDate()).padStart(2,'0')}` : null;
      fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:1115',message:'Shift created from API',data:{newShiftId:newShift?.id,newShiftStartTime:newShift?.start_time,newShiftStartDateStr:newShift?.start_time?new Date(newShift.start_time).toISOString().split('T')[0]:null,newShiftStartDateStrLocal:newShiftDateLocal,targetDateStrLocal,employeeId:newShift?.employee_id,dateMatch:newShiftDateLocal===targetDateStrLocal},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

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
          
          // #region agent log
          const enrichedShiftDateLocal = `${new Date(enrichedShift.start_time).getFullYear()}-${String(new Date(enrichedShift.start_time).getMonth()+1).padStart(2,'0')}-${String(new Date(enrichedShift.start_time).getDate()).padStart(2,'0')}`;
          fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:1136',message:'State updated with new shift',data:{newShiftId:enrichedShift.id,newShiftStartTime:enrichedShift.start_time,newShiftStartDateStr:new Date(enrichedShift.start_time).toISOString().split('T')[0],newShiftStartDateStrLocal:enrichedShiftDateLocal,targetDateStrLocal,employeeId:enrichedShift.employee_id,totalShifts:updated.length,dateMatch:enrichedShiftDateLocal===targetDateStrLocal},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
          // #endregion
          
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
            { icon: <Calendar size={20} />, label: "Shift Templates", path: "/schedule", active: location.pathname === '/schedule', roles: ['manager'] },
            { icon: <Users size={20} />, label: "Team", path: "/team", active: location.pathname === '/team', roles: ['manager', 'hr'] },
            { icon: <Users size={20} />, label: "Build Team", path: "/build-team", active: location.pathname === '/build-team', roles: ['manager'] },
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
            
            <img 
              src={userProfile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.full_name || 'User')}&background=8b5cf6&color=fff`} 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-purple-500/20 flex-shrink-0" 
              alt="Avatar" 
            />
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

          {/* Modular Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
            {metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} theme={theme} loading={metricsLoading} />
            ))}
          </div>

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
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {/* Search */}
                <div className={`
                  flex-1 sm:flex-none flex items-center gap-2 px-3 py-2 rounded-xl min-w-[200px]
                  ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100'}
                `}>
                  <Search size={16} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`
                      flex-1 bg-transparent border-none outline-none text-xs
                      ${theme === 'dark' ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}
                    `}
                  />
                </div>
                
                {/* Employee Filter */}
                <select 
                  value={filters.employee}
                  onChange={(e) => setFilters({ ...filters, employee: e.target.value })}
                  className={`
                    flex-1 sm:flex-none rounded-xl px-3 sm:px-4 py-2 text-xs font-bold outline-none cursor-pointer transition-all min-w-0
                    ${theme === 'dark'
                      ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }
                  `}
                >
                  <option value="all">All Employees</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                  ))}
                </select>
                
                {/* Location Filter (if locations exist) */}
                {locations.length > 0 && (
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className={`
                      flex-1 sm:flex-none rounded-xl px-3 sm:px-4 py-2 text-xs font-bold outline-none cursor-pointer transition-all min-w-0
                      ${theme === 'dark'
                        ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }
                    `}
                  >
                    <option value="all">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                )}
                
                {/* Job Title Filter */}
                {jobTitles.length > 0 && (
                  <select
                    value={filters.jobTitle}
                    onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
                    className={`
                      flex-1 sm:flex-none rounded-xl px-3 sm:px-4 py-2 text-xs font-bold outline-none cursor-pointer transition-all min-w-0
                      ${theme === 'dark'
                        ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }
                    `}
                  >
                    <option value="all">All Job Titles</option>
                    {jobTitles.map(title => (
                      <option key={title} value={title}>{title}</option>
                    ))}
                  </select>
                )}
                
                {/* Team Filter (only show for managers with more than 1 team) */}
                {userProfile?.role === 'manager' && teams.length > 1 && (
                  <select
                    value={filters.team}
                    onChange={(e) => {
                      // Reset employee filter when team changes to avoid showing invalid selections
                      setFilters({ ...filters, team: e.target.value, employee: 'all' });
                    }}
                    className={`
                      flex-1 sm:flex-none rounded-xl px-3 sm:px-4 py-2 text-xs font-bold outline-none cursor-pointer transition-all min-w-0
                      ${theme === 'dark'
                        ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }
                    `}
                  >
                    <option value="all">All Teams</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
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
                        <th className="pb-4 sm:pb-6 pr-4 sm:pr-6 w-48 sm:w-64 sticky left-0 z-10 bg-inherit">
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
                                  px-4 py-3 sticky left-0 z-10 font-medium
                                  ${theme === 'dark' ? 'bg-slate-900/40 text-white' : 'bg-white text-slate-900'}
                                `}>
                                  <div className="font-bold">{employee.full_name}</div>
                                  {employee.job_title && (
                                    <div className="text-xs text-slate-500 mt-0.5">{employee.job_title}</div>
                                  )}
                                </td>
                                {days.map((day, dayIdx) => {
                                  // Use LOCAL date strings for comparison to avoid timezone issues
                                  const dayStrLocal = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
                                  const dayShifts = employeeShifts.filter(shift => {
                                    if (!shift.start_time) return false;
                                    const shiftDate = new Date(shift.start_time);
                                    // Get local date string to avoid timezone issues
                                    const shiftDateStrLocal = `${shiftDate.getFullYear()}-${String(shiftDate.getMonth()+1).padStart(2,'0')}-${String(shiftDate.getDate()).padStart(2,'0')}`;
                                    
                                    // #region agent log
                                    if (shift.id && shiftDateStrLocal === dayStrLocal) {
                                      fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:1669',message:'Shift matched for rendering',data:{shiftId:shift.id,shiftStartTime:shift.start_time,dayStrLocal,shiftDateStrLocal,employeeId:employee.id,dayOfWeek:day.getDay(),dayDate:day.getDate()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
                                    }
                                    // #endregion
                                    
                                    return shiftDateStrLocal === dayStrLocal;
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
                                        
                                        // #region agent log
                                        if (currentShift.id && dayStrLocal === `${new Date(currentShift.start_time).getFullYear()}-${String(new Date(currentShift.start_time).getMonth()+1).padStart(2,'0')}-${String(new Date(currentShift.start_time).getDate()).padStart(2,'0')}`) {
                                          fetch('http://127.0.0.1:7242/ingest/e743be5c-e294-4c2c-a895-e039bdbe26fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:1767',message:'Shift being rendered for drag',data:{shiftId:currentShift.id,shiftStartTime:currentShift.start_time,displayedStartTime:formatTime(currentShift.start_time),displayedEndTime:formatTime(currentShift.end_time),dayStrLocal,employeeId:employee.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
                                        }
                                        // #endregion
                                        
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
                                            ${theme === 'dark'
                                              ? 'bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30'
                                              : 'bg-purple-50 border border-purple-200 hover:bg-purple-100'
                                            }
                                            ${isManager ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
                                          `}
                                          onClick={(e) => {
                                            // Only open edit modal if not dragging
                                            if (isManager && !draggedShift) {
                                              openEditShiftModal(shift);
                                            }
                                          }}
                                        >
                                          <div className="flex items-center justify-between mb-1">
                                            <div className="font-bold text-purple-400">
                                              {formatTime(currentShift.start_time)} - {formatTime(currentShift.end_time)}
                                            </div>
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
                                              // Show template modal if templates exist, otherwise open shift modal
                                              if (scheduleTemplates && scheduleTemplates.length > 0) {
                                                setTemplateModalContext({ day, employeeId: employee.id });
                                                setShowTemplateModal(true);
                                              } else {
                                                openAddShiftModal(day, employee.id);
                                              }
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
                <div className="grid grid-cols-7 gap-0.5 p-2">
                  {days.map((day, idx) => {
                    const dayShifts = getShiftsForDate(day);
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isDragOver = dragOverCell?.day?.toISOString().split('T')[0] === day.toISOString().split('T')[0] && !dragOverCell?.employeeId;
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                    
                    return (
                      <div
                        key={idx}
                        className={`
                          relative min-h-[120px] sm:min-h-[140px] p-2 sm:p-3 rounded-xl transition-all duration-200
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
                        <div className="space-y-1.5 sm:space-y-2">
                          {dayShifts.slice(0, isCurrentMonth ? 4 : 2).map((shift, shiftIdx) => (
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
                                group relative overflow-hidden rounded-lg p-2 sm:p-2.5 transition-all duration-200
                                ${theme === 'dark'
                                  ? 'bg-gradient-to-r from-purple-600/20 via-purple-500/15 to-indigo-600/20 border border-purple-500/30 hover:from-purple-600/30 hover:via-purple-500/25 hover:to-indigo-600/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20'
                                  : 'bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200 hover:from-purple-100 hover:via-indigo-100 hover:to-purple-100 hover:border-purple-300 hover:shadow-md'
                                }
                                ${isManager ? 'cursor-grab active:cursor-grabbing hover:scale-[1.02]' : 'cursor-pointer'}
                              `}
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
                                  <div className={`
                                    text-xs sm:text-sm font-bold truncate flex-1
                                    ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}
                                  `}>
                                    {shift.employee?.full_name || 'Unknown'}
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
                                <div className={`
                                  flex items-center gap-1.5 text-[10px] sm:text-xs
                                  ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                                `}>
                                  <Clock size={10} className="flex-shrink-0" />
                                  <span className="font-semibold">
                                    {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                                  </span>
                                </div>
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
                          {dayShifts.length > (isCurrentMonth ? 4 : 2) && (
                            <div className={`
                              text-center py-1.5 rounded-lg text-[10px] sm:text-xs font-bold
                              ${theme === 'dark'
                                ? 'bg-slate-700/50 text-purple-400 border border-purple-500/20'
                                : 'bg-slate-100 text-purple-600 border border-purple-200'
                              }
                            `}>
                              +{dayShifts.length - (isCurrentMonth ? 4 : 2)} more
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
                                onClick={() => {
                                  if (scheduleTemplates.length > 0) {
                                    setTemplateModalContext({ day, employeeId: null });
                                    setShowTemplateModal(true);
                                  } else {
                                    openAddShiftModal(day);
                                  }
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
              </div>
            )}
          </div>

          {/* Schedule Template Selection Modal */}
          {showTemplateModal && (
            <>
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                onClick={() => setShowTemplateModal(false)}
              />
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
              >
                <div
                  className={`
                    relative w-full max-w-md rounded-2xl p-6 pointer-events-auto
                    ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}
                  `}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Select Schedule Template
                      </h2>
                      {templateModalContext.employeeId && (
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          {employees.find(e => e.id === templateModalContext.employeeId)?.full_name || 'Employee'}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setShowTemplateModal(false)}
                      className={`
                        p-2 rounded-lg transition-colors
                        ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}
                      `}
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  {!scheduleTemplates || scheduleTemplates.length === 0 ? (
                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      <p className="mb-4 font-bold">No schedule templates found.</p>
                      <p className="text-sm mb-4">Create templates in the Schedule page to use them here.</p>
                      <button
                        onClick={() => {
                          navigate('/schedule');
                          setShowTemplateModal(false);
                        }}
                        className={`
                          px-4 py-2 rounded-lg font-bold transition-all
                          ${theme === 'dark'
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }
                        `}
                      >
                        Go to Schedule Templates
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-4">
                      {scheduleTemplates.map(template => (
                        <button
                          key={template.id}
                          onClick={async () => {
                            const day = templateModalContext.day || new Date();
                            const employeeId = templateModalContext.employeeId;
                            
                            if (!employeeId) {
                              // If no employee selected (e.g., clicked from header button), open the form to select one
                              openAddShiftModal(day, null, template);
                              setShowTemplateModal(false);
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
                                // Use LOCAL date strings for comparison
                                const shiftDate = new Date(s.start_time);
                                const shiftDateStrLocal = `${shiftDate.getFullYear()}-${String(shiftDate.getMonth()+1).padStart(2,'0')}-${String(shiftDate.getDate()).padStart(2,'0')}`;
                                return shiftDateStrLocal === targetDateStrLocal;
                              });
                              
                              if (existingShift) {
                                alert(`This employee already has a shift on ${targetDateStrLocal}. Only one shift per employee per day is allowed.`);
                                setSubmitting(false);
                                return;
                              }

                              // Parse template times and apply to the selected day
                              // Ensure we're working with the correct day (handle timezone issues)
                              const targetDay = new Date(day);
                              // Reset to local midnight to avoid timezone issues
                              targetDay.setHours(0, 0, 0, 0);
                              
                              const startTimeParts = template.start_time.split(':');
                              const endTimeParts = template.end_time.split(':');
                              
                              const startHours = parseInt(startTimeParts[0]) || 0;
                              const startMinutes = parseInt(startTimeParts[1]) || 0;
                              const endHours = parseInt(endTimeParts[0]) || 0;
                              const endMinutes = parseInt(endTimeParts[1]) || 0;
                              
                              // Create start and end times in local timezone
                              const start = new Date(targetDay);
                              start.setHours(startHours, startMinutes, 0, 0);
                              
                              const end = new Date(targetDay);
                              // Handle end time that might be next day (e.g., 23:00 - 07:00)
                              if (endHours < startHours || (endHours === startHours && endMinutes < startMinutes)) {
                                end.setDate(end.getDate() + 1);
                              }
                              end.setHours(endHours, endMinutes, 0, 0);

                              const headers = {
                                'Content-Type': 'application/json',
                                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                                'Authorization': `Bearer ${accessToken}`,
                                'Prefer': 'return=representation'
                              };

                              const shiftData = {
                                organization_id: userProfile.organization_id,
                                employee_id: employeeId,
                                location_id: null, // Can be set later if needed
                                start_time: start.toISOString(),
                                end_time: end.toISOString(),
                                break_duration_minutes: template.break_duration_minutes || 0,
                                status: 'scheduled',
                                notes: template.description || null,
                                created_by: user.id,
                                updated_at: new Date().toISOString()
                              };

                              console.log('Creating shift:', {
                                day: day.toISOString().split('T')[0],
                                employeeId,
                                start: start.toISOString(),
                                end: end.toISOString(),
                                shiftData
                              });

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
                                throw new Error(errorText);
                              }

                              const createdShiftData = await response.json();
                              // Supabase returns array when using Prefer: return=representation
                              const createdShift = Array.isArray(createdShiftData) ? createdShiftData[0] : createdShiftData;
                              console.log('Shift created successfully:', createdShift);

                              // Immediately add the shift to state if it matches current filters
                              if (createdShift) {
                                // Check if shift is in current date range
                                const shiftDate = new Date(createdShift.start_time);
                                const isInRange = view === 'weekly' 
                                  ? (() => {
                                      const weekStart = new Date(currentDate);
                                      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
                                      weekStart.setHours(0, 0, 0, 0);
                                      const weekEnd = new Date(weekStart);
                                      weekEnd.setDate(weekStart.getDate() + 6);
                                      weekEnd.setHours(23, 59, 59, 999);
                                      return shiftDate >= weekStart && shiftDate <= weekEnd;
                                    })()
                                  : (() => {
                                      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                                      monthStart.setHours(0, 0, 0, 0);
                                      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                                      monthEnd.setHours(23, 59, 59, 999);
                                      return shiftDate >= monthStart && shiftDate <= monthEnd;
                                    })();

                                if (isInRange) {
                                  // Fetch employee and location data for the shift
                                  const employee = employees.find(e => e.id === createdShift.employee_id);
                                  const location = locations.find(l => l.id === createdShift.location_id);
                                  
                                  const enrichedShift = {
                                    ...createdShift,
                                    employee: employee ? { id: employee.id, full_name: employee.full_name, email: employee.email, job_title: employee.job_title } : null,
                                    location: location ? { id: location.id, name: location.name } : null
                                  };

                                  // Add to shifts state immediately
                                  setShifts(prev => {
                                    // Check if shift already exists (avoid duplicates)
                                    const exists = prev.some(s => s.id === enrichedShift.id);
                                    if (exists) return prev;
                                    // Add and sort by start_time
                                    return [...prev, enrichedShift].sort((a, b) => 
                                      new Date(a.start_time) - new Date(b.start_time)
                                    );
                                  });
                                }
                              }

                              // Refresh shifts to get full data - wait for it to complete
                              await fetchShifts(accessToken);
                              
                              setShowTemplateModal(false);
                              setSubmitting(false);
                            } catch (error) {
                              console.error('Error creating shift from template:', error);
                              alert('Error creating shift: ' + error.message);
                              setSubmitting(false);
                            }
                          }}
                          disabled={submitting}
                          className={`
                            w-full p-4 rounded-lg text-left transition-all hover:scale-[1.02]
                            ${theme === 'dark'
                              ? 'bg-slate-700 hover:bg-slate-600 border border-slate-600'
                              : 'bg-slate-100 hover:bg-slate-200 border border-slate-200'
                            }
                            ${submitting ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          <div className="font-bold mb-1">{template.name}</div>
                          <div className="text-sm text-slate-500">
                            {template.start_time} - {template.end_time} {template.timezone}
                          </div>
                          {template.description && (
                            <div className="text-xs text-slate-400 mt-1">{template.description}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {scheduleTemplates && scheduleTemplates.length > 0 && (
                    <button
                      onClick={() => {
                        const day = templateModalContext.day || new Date();
                        openAddShiftModal(day, templateModalContext.employeeId || '', null);
                        setShowTemplateModal(false);
                      }}
                      className={`
                        w-full px-4 py-2 rounded-lg font-bold transition-all mt-4
                        ${theme === 'dark'
                          ? 'bg-slate-700 hover:bg-slate-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                        }
                      `}
                    >
                      Custom Time
                    </button>
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
    </div>
  );
};

export default Dashboard;
