import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Users, BarChart3, Settings, 
  Zap, Search, Bell, Moon, Sun, MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase';
import NotificationCenter from './NotificationCenter';

const DashboardLayout = ({ children }) => {
  const { userProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [organization, setOrganization] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch organization to check work_type for Locations navigation
  useEffect(() => {
    if (!userProfile?.organization_id) return;

    const fetchOrganization = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) return;

        const response = await fetch(
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

        if (response.ok) {
          const orgData = await response.json();
          if (orgData && orgData.length > 0) {
            setOrganization(orgData[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching organization:', err);
      }
    };

    fetchOrganization();
  }, [userProfile?.organization_id]);

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 relative overflow-hidden ${
      theme === 'dark' ? 'text-white' : 'text-slate-900'
    }`}>
      {/* Background Pattern & Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        {theme === 'dark' ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-900/10 rounded-full blur-3xl"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-50/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-50/40 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-0 w-72 h-72 bg-blue-50/30 rounded-full blur-3xl"></div>
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
            { icon: <LayoutDashboard size={20} />, label: "Overview", path: "/dashboard" },
            { icon: <Calendar size={20} />, label: "Shift Templates", path: "/schedule", roles: ['manager'] },
            { icon: <Users size={20} />, label: "Team", path: "/team", roles: ['manager', 'hr'] },
            { icon: <Users size={20} />, label: "Build Team", path: "/build-team", roles: ['manager'] },
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
          .map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <button 
                key={i}
                onClick={() => item.path && navigate(item.path)}
                className={`
                  w-full flex items-center gap-2 sm:gap-3 md:gap-4 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl transition-all
                  ${isActive 
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
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <header className={`
          h-20 border-b flex items-center justify-between px-8 sticky top-0 z-30 backdrop-blur-md
          ${theme === 'dark' 
            ? 'border-slate-800 bg-slate-950/80' 
            : 'border-slate-200 bg-white/80'
          }
        `}>
          <div className={`
            flex items-center gap-4 px-4 py-2 rounded-xl w-96 transition-all
            ${theme === 'dark'
              ? 'bg-slate-800/50 border border-slate-700 focus-within:border-purple-500/50'
              : 'bg-slate-100 border border-slate-200 focus-within:border-purple-300'
            }
          `}>
            <Search size={18} className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} />
            <input 
              type="text" 
              placeholder="Search..." 
              className={`
                bg-transparent border-none outline-none text-sm w-full
                ${theme === 'dark' 
                  ? 'placeholder:text-slate-600 text-white' 
                  : 'placeholder:text-slate-400 text-slate-900'
                }
              `} 
            />
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`
                p-2.5 rounded-xl transition-all hover:scale-110
                ${theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }
              `}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(true)}
              className={`
                relative p-2.5 rounded-xl transition-all hover:scale-110
                ${theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }
              `}
              aria-label="Notifications"
            >
              <Bell size={20} />
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
              className="w-10 h-10 rounded-xl border-2 border-purple-500/20" 
              alt="Avatar" 
            />
          </div>
        </header>

        {children}
      </main>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
};

export default DashboardLayout;
