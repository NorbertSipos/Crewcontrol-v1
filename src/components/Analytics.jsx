import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, Clock, Calendar, 
  Download, Filter, RefreshCw, Activity, Target, Zap, 
  CheckCircle2, XCircle, AlertTriangle, ArrowUpRight, ArrowDownRight,
  CalendarDays, Timer, UserCheck, FileText, PieChart, LineChart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import DashboardLayout from './DashboardLayout';

// Simple Chart Component (using SVG)
const SimpleBarChart = ({ data, theme, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barWidth = 100 / data.length;
  
  return (
    <svg width="100%" height={height} className="overflow-visible">
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * (height - 40);
        const x = (index * barWidth) + (barWidth / 2) - 8;
        const y = height - barHeight - 20;
        
        return (
          <g key={index}>
            <rect
              x={`${index * barWidth + 2}%`}
              y={y}
              width={`${barWidth - 4}%`}
              height={barHeight}
              rx="4"
              fill={theme === 'dark' 
                ? `url(#gradient-${index})` 
                : `url(#gradient-light-${index})`
              }
              className="transition-all duration-500 hover:opacity-80"
            />
            <text
              x={`${index * barWidth + barWidth / 2}%`}
              y={height - 5}
              textAnchor="middle"
              className={`text-xs font-bold ${theme === 'dark' ? 'fill-slate-400' : 'fill-slate-600'}`}
            >
              {item.label}
            </text>
            <text
              x={`${index * barWidth + barWidth / 2}%`}
              y={y - 5}
              textAnchor="middle"
              className={`text-xs font-black ${theme === 'dark' ? 'fill-white' : 'fill-slate-900'}`}
            >
              {item.value}
            </text>
          </g>
        );
      })}
      <defs>
        {data.map((_, index) => (
          <React.Fragment key={index}>
            <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id={`gradient-light-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.7" />
            </linearGradient>
          </React.Fragment>
        ))}
      </defs>
    </svg>
  );
};

const SimpleLineChart = ({ data, theme, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const width = 100;
  const stepX = width / (data.length - 1);
  
  const points = data.map((item, index) => {
    const x = index * stepX;
    const y = height - 40 - (item.value / maxValue) * (height - 40);
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width="100%" height={height} className="overflow-visible">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={theme === 'dark' ? '#8b5cf6' : '#a78bfa'} />
          <stop offset="100%" stopColor={theme === 'dark' ? '#6366f1' : '#818cf8'} />
        </linearGradient>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={theme === 'dark' ? '#8b5cf6' : '#a78bfa'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={theme === 'dark' ? '#6366f1' : '#818cf8'} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <polygon
        points={`0,${height - 20} ${points} ${width},${height - 20}`}
        fill="url(#areaGradient)"
      />
      
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Data points */}
      {data.map((item, index) => {
        const x = index * stepX;
        const y = height - 40 - (item.value / maxValue) * (height - 40);
        return (
          <g key={index}>
            <circle
              cx={x}
              cy={y}
              r="4"
              fill={theme === 'dark' ? '#8b5cf6' : '#a78bfa'}
              stroke={theme === 'dark' ? '#1e293b' : '#ffffff'}
              strokeWidth="2"
            />
            <text
              x={x}
              y={y - 10}
              textAnchor="middle"
              className={`text-xs font-black ${theme === 'dark' ? 'fill-white' : 'fill-slate-900'}`}
            >
              {item.value}
            </text>
            <text
              x={x}
              y={height - 5}
              textAnchor="middle"
              className={`text-xs font-bold ${theme === 'dark' ? 'fill-slate-400' : 'fill-slate-600'}`}
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const Analytics = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, quarter, year
  const [refreshing, setRefreshing] = useState(false);
  
  // Analytics data
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [metrics, setMetrics] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    totalShifts: 0,
    totalHours: 0,
    averageHoursPerEmployee: 0,
    attendanceRate: 0,
    coverageRate: 0
  });
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [shiftCoverageData, setShiftCoverageData] = useState([]);
  const [teamPerformanceData, setTeamPerformanceData] = useState([]);
  const [hourlyDistribution, setHourlyDistribution] = useState([]);

  // Redirect if not authorized
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
      if (userProfile.role !== 'manager' && userProfile.role !== 'hr') {
        navigate('/dashboard');
        return;
      }
    }
  }, [user, userProfile, authLoading, navigate]);

  // Calculate date range based on timeRange
  const getDateRange = () => {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }
    
    return { startDate, endDate: now };
  };

  // Fetch analytics data
  useEffect(() => {
    if (!userProfile?.organization_id) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) {
          setLoading(false);
          return;
        }

        const headers = {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Prefer': 'return=representation'
        };

        const { startDate, endDate } = getDateRange();
        const startISO = startDate.toISOString();
        const endISO = endDate.toISOString();

        // Fetch employees
        const employeesResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?organization_id=eq.${userProfile.organization_id}&is_active=eq.true&select=id,full_name,email,role,job_title,team_id,team_name&order=full_name.asc`,
          { method: 'GET', headers }
        );
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          setEmployees(employeesData || []);
        }

        // Fetch shifts within date range
        const shiftsResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/shifts?organization_id=eq.${userProfile.organization_id}&start_time=gte.${startISO}&start_time=lte.${endISO}&select=*,employee:users!shifts_employee_id_fkey(id,full_name,job_title,team_name)`,
          { method: 'GET', headers }
        );
        if (shiftsResponse.ok) {
          const shiftsData = await shiftsResponse.json();
          setShifts(shiftsData || []);
        }

      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchAnalytics();
  }, [userProfile?.organization_id, timeRange]);

  // Calculate metrics
  useEffect(() => {
    if (!shifts.length || !employees.length) return;

    const activeEmployees = employees.filter(emp => emp.role === 'employee').length;
    const totalShifts = shifts.length;
    
    // Calculate total hours
    let totalHours = 0;
    shifts.forEach(shift => {
      if (shift.start_time && shift.end_time) {
        const start = new Date(shift.start_time);
        const end = new Date(shift.end_time);
        const hours = (end - start) / (1000 * 60 * 60);
        totalHours += hours - (shift.break_duration || 0) / 60;
      }
    });

    const averageHours = activeEmployees > 0 ? totalHours / activeEmployees : 0;
    
    // Calculate attendance rate (simplified - assumes shifts scheduled = attendance)
    const expectedShifts = activeEmployees * 5; // Assuming 5 shifts per week per employee
    const attendanceRate = expectedShifts > 0 ? (totalShifts / expectedShifts) * 100 : 0;
    
    // Calculate coverage rate (shifts with employees / total possible shifts)
    const coverageRate = attendanceRate; // Simplified

    setMetrics({
      totalEmployees: employees.length,
      activeEmployees,
      totalShifts,
      totalHours: Math.round(totalHours),
      averageHoursPerEmployee: Math.round(averageHours * 10) / 10,
      attendanceRate: Math.round(attendanceRate * 10) / 10,
      coverageRate: Math.round(coverageRate * 10) / 10
    });

    // Prepare chart data
    prepareChartData(shifts, employees);
  }, [shifts, employees]);

  const prepareChartData = (shiftsData, employeesData) => {
    // Attendance data (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayShifts = shiftsData.filter(s => {
        const shiftDate = new Date(s.start_time);
        return shiftDate.toDateString() === date.toDateString();
      }).length;
      last7Days.push({ label: dateStr, value: dayShifts });
    }
    setAttendanceData(last7Days);

    // Shift coverage by day of week
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const coverageByDay = daysOfWeek.map(day => {
      const dayShifts = shiftsData.filter(s => {
        const shiftDate = new Date(s.start_time);
        return shiftDate.toLocaleDateString('en-US', { weekday: 'short' }) === day;
      }).length;
      return { label: day, value: dayShifts };
    });
    setShiftCoverageData(coverageByDay);

    // Team performance (if teams exist)
    const teams = [...new Set(employeesData.map(emp => emp.team_name).filter(Boolean))];
    if (teams.length > 0) {
      const teamData = teams.map(teamName => {
        const teamEmployees = employeesData.filter(emp => emp.team_name === teamName);
        const teamShifts = shiftsData.filter(s => {
          const emp = employeesData.find(e => e.id === s.employee_id);
          return emp?.team_name === teamName;
        });
        return {
          label: teamName.length > 10 ? teamName.substring(0, 10) + '...' : teamName,
          value: teamShifts.length
        };
      });
      setTeamPerformanceData(teamData);
    }

    // Hourly distribution
    const hourlyDist = Array.from({ length: 24 }, (_, hour) => {
      const hourShifts = shiftsData.filter(s => {
        const shiftDate = new Date(s.start_time);
        return shiftDate.getHours() === hour;
      }).length;
      return { label: `${hour}:00`, value: hourShifts };
    });
    setHourlyDistribution(hourlyDist.slice(6, 22)); // 6 AM to 10 PM
  };

  const handleExport = () => {
    // Simple CSV export
    const csv = [
      ['Metric', 'Value'],
      ['Total Employees', metrics.totalEmployees],
      ['Active Employees', metrics.activeEmployees],
      ['Total Shifts', metrics.totalShifts],
      ['Total Hours', metrics.totalHours],
      ['Average Hours per Employee', metrics.averageHoursPerEmployee],
      ['Attendance Rate (%)', metrics.attendanceRate],
      ['Coverage Rate (%)', metrics.coverageRate]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Trigger re-fetch
    const event = new Event('refresh');
    window.dispatchEvent(event);
  };

  if (authLoading || loading || !userProfile?.organization_id) {
    return (
      <DashboardLayout>
        <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
            <p className={`text-lg font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Loading analytics...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`
                  p-3 rounded-2xl
                  ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}
                `}>
                  <BarChart3 className={`w-8 h-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Analytics Dashboard
                </h1>
              </div>
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Insights and metrics for your workforce
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`
                  px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all
                  hover:scale-105 active:scale-95
                  ${theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }
                  ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className={`
                  px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all
                  hover:scale-105 active:scale-95
                  bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white
                `}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Time Range Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`} />
            <span className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Time Range:
            </span>
            {['week', 'month', 'quarter', 'year'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`
                  px-4 py-2 rounded-xl font-bold text-sm transition-all capitalize
                  hover:scale-105 active:scale-95
                  ${timeRange === range
                    ? theme === 'dark'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-purple-600 text-white shadow-lg'
                    : theme === 'dark'
                      ? 'bg-slate-800 text-slate-400 hover:text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }
                `}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <MetricCard
            theme={theme}
            icon={Users}
            label="Total Employees"
            value={metrics.totalEmployees}
            change={null}
            color="blue"
          />
          <MetricCard
            theme={theme}
            icon={Activity}
            label="Active Employees"
            value={metrics.activeEmployees}
            change={null}
            color="emerald"
          />
          <MetricCard
            theme={theme}
            icon={Calendar}
            label="Total Shifts"
            value={metrics.totalShifts}
            change={null}
            color="purple"
          />
          <MetricCard
            theme={theme}
            icon={Clock}
            label="Total Hours"
            value={metrics.totalHours}
            change={null}
            color="indigo"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <MetricCard
            theme={theme}
            icon={Timer}
            label="Avg Hours/Employee"
            value={metrics.averageHoursPerEmployee}
            change={null}
            color="amber"
          />
          <MetricCard
            theme={theme}
            icon={CheckCircle2}
            label="Attendance Rate"
            value={`${metrics.attendanceRate}%`}
            change={null}
            color="green"
          />
          <MetricCard
            theme={theme}
            label="Coverage Rate"
            value={`${metrics.coverageRate}%`}
            change={null}
            color="cyan"
            icon={Target}
          />
          <MetricCard
            theme={theme}
            icon={Zap}
            label="Efficiency"
            value="95%"
            change={null}
            color="pink"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
          {/* Attendance Trend */}
          <ChartCard
            theme={theme}
            title="Attendance Trend"
            subtitle="Last 7 days"
            icon={LineChart}
            color="purple"
          >
            <SimpleLineChart data={attendanceData} theme={theme} height={250} />
          </ChartCard>

          {/* Shift Coverage */}
          <ChartCard
            theme={theme}
            title="Shift Coverage"
            subtitle="By day of week"
            icon={BarChart3}
            color="indigo"
          >
            <SimpleBarChart data={shiftCoverageData} theme={theme} height={250} />
          </ChartCard>
        </div>

        {teamPerformanceData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
            {/* Team Performance */}
            <ChartCard
              theme={theme}
              title="Team Performance"
              subtitle="Shifts by team"
              icon={PieChart}
              color="blue"
            >
              <SimpleBarChart data={teamPerformanceData} theme={theme} height={250} />
            </ChartCard>

            {/* Hourly Distribution */}
            <ChartCard
              theme={theme}
              title="Hourly Distribution"
              subtitle="Shift start times"
              icon={Clock}
              color="emerald"
            >
              <SimpleBarChart data={hourlyDistribution} theme={theme} height={250} />
            </ChartCard>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// Metric Card Component
const MetricCard = ({ theme, icon: Icon, label, value, change, color = 'purple' }) => {
  const colorClasses = {
    purple: theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600',
    blue: theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600',
    emerald: theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600',
    indigo: theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600',
    amber: theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600',
    green: theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600',
    cyan: theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600',
    pink: theme === 'dark' ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-600',
  };

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-6 border-2 transition-all duration-300
      hover:scale-[1.02] hover:shadow-2xl
      ${theme === 'dark'
        ? 'bg-slate-900/50 border-slate-700 hover:border-purple-500/50'
        : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-xl'
      }
    `}>
      <div className={`
        absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300
        ${theme === 'dark'
          ? 'bg-gradient-to-br from-purple-500/5 to-indigo-500/5'
          : 'bg-gradient-to-br from-purple-50/50 to-indigo-50/50'
        }
      `}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          {change !== null && (
            <div className={`
              flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold
              ${change > 0
                ? theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                : theme === 'dark' ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
              }
            `}>
              {change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <h3 className={`text-sm font-bold mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          {label}
        </h3>
        <p className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

// Chart Card Component
const ChartCard = ({ theme, title, subtitle, icon: Icon, color = 'purple', children }) => {
  const colorClasses = {
    purple: theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600',
    blue: theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600',
    indigo: theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600',
    emerald: theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600',
  };

  return (
    <div className={`
      rounded-2xl p-6 border-2 transition-all duration-300
      hover:scale-[1.01] hover:shadow-xl
      ${theme === 'dark'
        ? 'bg-slate-900/50 border-slate-700 hover:border-purple-500/50'
        : 'bg-white border-slate-200 hover:border-purple-300'
      }
    `}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

export default Analytics;
