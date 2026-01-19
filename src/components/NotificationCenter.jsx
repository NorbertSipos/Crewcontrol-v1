import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, X, CheckCheck, Trash2, ExternalLink, 
  Mail, Calendar, Users, AlertCircle, CheckCircle2, 
  XCircle, Clock, Zap, Info, Sparkles
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';

const NotificationCenter = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all', 'unread'
  const [isClosing, setIsClosing] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  if (!isOpen && !isClosing) return null;

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const getNotificationIcon = (type) => {
    const iconClass = `w-5 h-5`;
    
    switch (type) {
      case 'invitation':
        return <Mail className={iconClass} />;
      case 'shift_assigned':
      case 'shift_updated':
      case 'shift_cancelled':
      case 'schedule_change':
        return <Calendar className={iconClass} />;
      case 'leave_request':
      case 'leave_approved':
      case 'leave_rejected':
        return <Clock className={iconClass} />;
      case 'team_update':
      case 'new_team_member':
        return <Users className={iconClass} />;
      case 'system':
        return <Info className={iconClass} />;
      case 'reminder':
        return <AlertCircle className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getNotificationGradient = (type) => {
    switch (type) {
      case 'invitation':
        return 'from-blue-500/20 via-blue-400/10 to-transparent';
      case 'shift_assigned':
      case 'shift_updated':
        return 'from-purple-500/20 via-purple-400/10 to-transparent';
      case 'shift_cancelled':
        return 'from-red-500/20 via-red-400/10 to-transparent';
      case 'leave_approved':
        return 'from-emerald-500/20 via-emerald-400/10 to-transparent';
      case 'leave_rejected':
        return 'from-red-500/20 via-red-400/10 to-transparent';
      case 'system':
        return 'from-amber-500/20 via-amber-400/10 to-transparent';
      default:
        return 'from-slate-500/20 via-slate-400/10 to-transparent';
    }
  };

  const getNotificationBorder = (type) => {
    switch (type) {
      case 'invitation':
        return 'border-blue-500/30';
      case 'shift_assigned':
      case 'shift_updated':
        return 'border-purple-500/30';
      case 'shift_cancelled':
        return 'border-red-500/30';
      case 'leave_approved':
        return 'border-emerald-500/30';
      case 'leave_rejected':
        return 'border-red-500/30';
      case 'system':
        return 'border-amber-500/30';
      default:
        return 'border-slate-500/20';
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    // Navigate if action URL exists
    if (notification.action_url) {
      navigate(notification.action_url);
      handleClose();
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Enhanced Backdrop with blur */}
      <div
        className={`
          fixed inset-0 z-[9998] transition-opacity duration-300
          ${isOpen && !isClosing 
            ? 'opacity-100' 
            : 'opacity-0 pointer-events-none'
          }
        `}
        onClick={handleClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20"></div>
      </div>

      {/* Notification Panel with modern design */}
      <div className={`
        fixed inset-y-0 right-0 z-[9999] w-full sm:w-[420px] lg:w-[480px] pointer-events-none
        transition-transform duration-300 ease-out
        ${isOpen && !isClosing 
          ? 'translate-x-0' 
          : 'translate-x-full'
        }
      `}>
        <div
          className={`
            h-full w-full pointer-events-auto relative overflow-hidden
            ${theme === 'dark' 
              ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950' 
              : 'bg-gradient-to-b from-white via-slate-50 to-white'
            }
            shadow-2xl
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>

          {/* Header with glassmorphism */}
          <div className={`
            relative border-b backdrop-blur-xl
            ${theme === 'dark' 
              ? 'border-slate-800/50 bg-slate-900/80' 
              : 'border-slate-200/50 bg-white/80'
            }
          `}>
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`
                    relative p-3 rounded-2xl
                    ${theme === 'dark' 
                      ? 'bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30' 
                      : 'bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-200'
                    }
                  `}>
                    <Bell className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div>
                    <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Notifications
                    </h2>
                    {unreadCount > 0 && (
                      <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                        {unreadCount} unread
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className={`
                    p-2 rounded-xl transition-all hover:scale-110 active:scale-95
                    ${theme === 'dark' 
                      ? 'hover:bg-slate-800 text-slate-400 hover:text-white' 
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                    }
                  `}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Enhanced Filters */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`
                    flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                    ${filter === 'all'
                      ? theme === 'dark'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                      : theme === 'dark'
                        ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }
                  `}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`
                    flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 relative
                    ${filter === 'unread'
                      ? theme === 'dark'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                      : theme === 'dark'
                        ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }
                  `}
                >
                  Unread
                  {unreadCount > 0 && (
                    <span className={`
                      ml-2 px-2 py-0.5 rounded-full text-xs
                      ${filter === 'unread' 
                        ? 'bg-white/20' 
                        : theme === 'dark' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-purple-100 text-purple-600'
                      }
                    `}>
                      {unreadCount}
                    </span>
                  )}
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className={`
                      px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105
                      ${theme === 'dark'
                        ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                      }
                    `}
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notifications List with smooth scrolling */}
          <div className="overflow-y-auto h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className={`
                  relative mb-6 p-6 rounded-3xl
                  ${theme === 'dark' 
                    ? 'bg-slate-800/50 border border-slate-700/50' 
                    : 'bg-slate-100 border border-slate-200'
                  }
                `}>
                  <Bell className={`w-16 h-16 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`} />
                  <div className="absolute top-2 right-2">
                    <Sparkles className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-500/50' : 'text-purple-400/50'}`} />
                  </div>
                </div>
                <p className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {filter === 'unread' ? 'All caught up!' : 'No notifications'}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                  {filter === 'unread' ? 'You have no unread notifications' : 'You\'re all caught up!'}
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {filteredNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`
                      group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer
                      ${!notification.is_read 
                        ? theme === 'dark' 
                          ? 'bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-purple-500/30 shadow-lg shadow-purple-500/10' 
                          : 'bg-gradient-to-br from-purple-50/80 to-purple-50/40 border border-purple-200 shadow-lg shadow-purple-500/5'
                        : theme === 'dark' 
                          ? 'bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50' 
                          : 'bg-white/50 border border-slate-200/50 hover:bg-white'
                      }
                      hover:scale-[1.02] hover:shadow-xl
                      animate-in fade-in slide-in-from-right
                    `}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getNotificationGradient(notification.type)} opacity-50 pointer-events-none`}></div>
                    
                    {/* Content */}
                    <div className="relative p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon with gradient background */}
                        <div className={`
                          flex-shrink-0 p-3 rounded-xl
                          ${theme === 'dark' 
                            ? `bg-gradient-to-br ${getNotificationGradient(notification.type)} border ${getNotificationBorder(notification.type)}` 
                            : `bg-gradient-to-br ${getNotificationGradient(notification.type)} border ${getNotificationBorder(notification.type)}`
                          }
                        `}>
                          <div className={theme === 'dark' ? 'text-white' : 'text-slate-700'}>
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        
                        {/* Notification content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className={`
                              text-sm font-bold line-clamp-1
                              ${!notification.is_read 
                                ? theme === 'dark' ? 'text-white' : 'text-slate-900'
                                : theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                              }
                            `}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {!notification.is_read && (
                                <div className={`
                                  w-2 h-2 rounded-full
                                  ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-600'}
                                  animate-pulse
                                `} />
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className={`
                                  p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity
                                  ${theme === 'dark' 
                                    ? 'hover:bg-slate-700 text-slate-400 hover:text-red-400' 
                                    : 'hover:bg-slate-100 text-slate-500 hover:text-red-600'
                                  }
                                `}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className={`
                            text-sm mb-2 line-clamp-2 leading-relaxed
                            ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                          `}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`
                              text-xs font-semibold
                              ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}
                            `}>
                              {formatTime(notification.created_at)}
                            </span>
                            {notification.action_url && (
                              <div className={`
                                flex items-center gap-1 text-xs font-bold
                                ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}
                              `}>
                                <span>View</span>
                                <ExternalLink className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;
