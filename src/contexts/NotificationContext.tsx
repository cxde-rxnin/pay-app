import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'transaction';

export interface InAppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // in milliseconds, default 4000
  icon?: ReactNode;
  action?: {
    label: string;
    onPress: () => void;
  };
  onClose?: () => void;
}

export interface StoredNotification {
  id: string;
  type: 'transaction' | 'security' | 'promotional' | 'system';
  title: string;
  message: string;
  timestamp: string;
  date: string;
  read: boolean;
  icon?: 'success' | 'failed' | 'info' | 'gift' | 'sent' | 'received' | 'document' | 'security';
  amount?: string;
  actionable?: boolean;
}

interface NotificationContextType {
  // Toast/Banner notifications
  showNotification: (notification: Omit<InAppNotification, 'id'>) => void;
  hideNotification: (id: string) => void;
  activeNotifications: InAppNotification[];
  
  // Stored notifications (for NotificationsScreen)
  notifications: StoredNotification[];
  addNotification: (notification: Omit<StoredNotification, 'id'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [activeNotifications, setActiveNotifications] = useState<InAppNotification[]>([]);
  const [notifications, setNotifications] = useState<StoredNotification[]>([
    // Sample data - replace with API data in production
    {
      id: '1',
      type: 'transaction',
      title: 'Money Received',
      message: 'You received ₦15,000 from @chukwudi',
      timestamp: '2 min ago',
      date: 'Today',
      read: false,
      icon: 'received',
      amount: '+₦15,000'
    },
    {
      id: '2',
      type: 'transaction',
      title: 'Transfer Successful',
      message: 'Your transfer of ₦5,420 to Kunle Sayo (Access Bank) was successful',
      timestamp: '1 hour ago',
      date: 'Today',
      read: false,
      icon: 'success',
      amount: '-₦5,420'
    },
  ]);

  const showNotification = useCallback((notification: Omit<InAppNotification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification: InAppNotification = {
      ...notification,
      id,
      duration: notification.duration || 4000,
    };

    setActiveNotifications(prev => [...prev, newNotification]);

    // Auto-hide after duration
    setTimeout(() => {
      hideNotification(id);
    }, newNotification.duration);
  }, []);

  const hideNotification = useCallback((id: string) => {
    setActiveNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const addNotification = useCallback((notification: Omit<StoredNotification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification: StoredNotification = {
      ...notification,
      id,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    showNotification,
    hideNotification,
    activeNotifications,
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    unreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
