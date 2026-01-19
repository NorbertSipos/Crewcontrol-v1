import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Users, BarChart3, Settings, 
  Zap, Search, Bell, Moon, Sun, MapPin, LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase';
import NotificationCenter from './NotificationCenter';

const DashboardLayout = ({ children }) => {
  const { userProfile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [organization, setOrganization] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

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

  // Debug: Check if avatar button is accessible
  useEffect(() => {
    // #region agent log
    const checkAvatarButton = () => {
      const button = userMenuRef.current?.querySelector('button[type="button"]');
      const rect = button?.getBoundingClientRect();
      const computedStyle = button ? window.getComputedStyle(button) : null;
      const parentRect = userMenuRef.current?.getBoundingClientRect();
      fetch('http://127.0.0.1:7243/ingest/fdda5182-9242-4c03-be38-7b454f53c1a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.jsx:88',message:'Avatar button accessibility check',data:{buttonExists:!!button,buttonZIndex:computedStyle?.zIndex,buttonPointerEvents:computedStyle?.pointerEvents,buttonPosition:computedStyle?.position,buttonRect:rect?{x:rect.x,y:rect.y,width:rect.width,height:rect.height}:null,parentRect:parentRect?{x:parentRect.x,y:parentRect.y,width:parentRect.width,height:parentRect.height}:null,userMenuRefExists:!!userMenuRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    };
    // #endregion
    const timer = setTimeout(checkAvatarButton, 100);
    return () => clearTimeout(timer);
  }, [userProfile]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/fdda5182-9242-4c03-be38-7b454f53c1a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.jsx:103',message:'handleClickOutside called',data:{target:event.target?.tagName,targetClass:event.target?.className,userMenuRefExists:!!userMenuRef.current,containsTarget:userMenuRef.current?.contains(event.target)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
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
            { icon: <Users size={20} />, label: "Build Team", path: "/build-team", roles: ['manager'] },
            { icon: <Users size={20} />, label: "Team", path: "/team", roles: ['manager', 'hr'] },
            { icon: <Calendar size={20} />, label: "Shift Templates", path: "/schedule", roles: ['manager'] },
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
        <header 
          className={`
            h-20 border-b flex items-center justify-between px-8 sticky top-0 z-30 backdrop-blur-md
            ${theme === 'dark' 
              ? 'border-slate-800 bg-slate-950/80' 
              : 'border-slate-200 bg-white/80'
            }
          `}
          onClick={(e) => {
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/fdda5182-9242-4c03-be38-7b454f53c1a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.jsx:162',message:'Header click event',data:{target:e.target?.tagName,targetClass:e.target?.className,isAvatarButton:e.target?.closest('button[type="button"]')?.getAttribute('aria-label')==='User menu'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
            // #endregion
          }}
        >
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
            
            {/* User Menu Dropdown */}
            <div className="relative z-40" ref={userMenuRef}>
              <button
                type="button"
                onMouseDown={(e) => {
                  // #region agent log
                  fetch('http://127.0.0.1:7243/ingest/fdda5182-9242-4c03-be38-7b454f53c1a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.jsx:230',message:'Avatar button onMouseDown',data:{eventType:e.type,currentTarget:e.currentTarget?.tagName,target:e.target?.tagName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                  // #endregion
                }}
                onClick={(e) => {
                  // #region agent log
                  fetch('http://127.0.0.1:7243/ingest/fdda5182-9242-4c03-be38-7b454f53c1a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.jsx:237',message:'Avatar button onClick handler called',data:{eventType:e.type,currentTarget:e.currentTarget?.tagName,target:e.target?.tagName,showUserMenuBefore:showUserMenu},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
                  // #endregion
                  e.stopPropagation();
                  e.preventDefault();
                  setShowUserMenu(!showUserMenu);
                  // #region agent log
                  fetch('http://127.0.0.1:7243/ingest/fdda5182-9242-4c03-be38-7b454f53c1a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.jsx:242',message:'setShowUserMenu called',data:{newValue:!showUserMenu},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
                  // #endregion
                }}
                onMouseEnter={() => {
                  // #region agent log
                  fetch('http://127.0.0.1:7243/ingest/fdda5182-9242-4c03-be38-7b454f53c1a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.jsx:247',message:'Avatar button hover detected',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
                  // #endregion
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
                    w-10 h-10 rounded-xl border-2 transition-all duration-200 pointer-events-none
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
