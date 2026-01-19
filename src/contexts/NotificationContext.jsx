import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  getUserNotifications, 
  getUnreadNotificationCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification 
} from '../lib/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pollingInterval, setPollingInterval] = useState(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      const [notificationsResult, countResult] = await Promise.all([
        getUserNotifications(user.id, 50, 0),
        getUnreadNotificationCount(user.id)
      ]);

      if (notificationsResult.success) {
        setNotifications(notificationsResult.notifications || []);
      }

      if (countResult.success) {
        setUnreadCount(countResult.count || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up polling for real-time updates (every 30 seconds)
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Poll every 30 seconds

    setPollingInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user?.id, fetchNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    const result = await markNotificationAsRead(notificationId);
    
    if (result.success) {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true, read_at: new Date().toISOString() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    return result;
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return { success: false };

    const result = await markAllNotificationsAsRead(user.id);
    
    if (result.success) {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    }

    return result;
  }, [user?.id]);

  // Delete notification
  const removeNotification = useCallback(async (notificationId) => {
    const result = await deleteNotification(notificationId);
    
    if (result.success) {
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      // Decrease unread count if notification was unread
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }

    return result;
  }, [notifications]);

  // Refresh notifications
  const refresh = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    removeNotification,
    refresh
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
