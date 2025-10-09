import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationPreferences {
  // Channels
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  
  // Alert Types
  transactionAlerts: boolean;
  securityAlerts: boolean;
  promotionalUpdates: boolean;
  systemAlerts: boolean;
  
  // Specific Transaction Types
  sentTransactionAlerts: boolean;
  receivedTransactionAlerts: boolean;
  failedTransactionAlerts: boolean;
  
  // Other Settings
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  badgeEnabled: boolean;
}

interface NotificationPreferencesContextType {
  preferences: NotificationPreferences;
  updatePreference: <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  isLoading: boolean;
}

const defaultPreferences: NotificationPreferences = {
  // Channels
  pushEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
  
  // Alert Types
  transactionAlerts: true,
  securityAlerts: true, // Always enabled for security
  promotionalUpdates: false,
  systemAlerts: true,
  
  // Specific Transaction Types
  sentTransactionAlerts: true,
  receivedTransactionAlerts: true,
  failedTransactionAlerts: true,
  
  // Other Settings
  soundEnabled: true,
  vibrationEnabled: true,
  badgeEnabled: true,
};

const NotificationPreferencesContext = createContext<NotificationPreferencesContextType | undefined>(undefined);

const STORAGE_KEY = '@notification_preferences';

interface NotificationPreferencesProviderProps {
  children: ReactNode;
}

export const NotificationPreferencesProvider: React.FC<NotificationPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from storage on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedPreferences = JSON.parse(stored);
        // Merge with defaults to ensure new preferences are included
        setPreferences({ ...defaultPreferences, ...parsedPreferences });
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    }
  };

  const updatePreference = async <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    await savePreferences(newPreferences);
    
    // Log the change for debugging
    console.log(`📱 Notification preference updated: ${key} = ${value}`);
  };

  const resetToDefaults = async () => {
    setPreferences(defaultPreferences);
    await savePreferences(defaultPreferences);
    console.log('📱 Notification preferences reset to defaults');
  };

  const value: NotificationPreferencesContextType = {
    preferences,
    updatePreference,
    resetToDefaults,
    isLoading,
  };

  return (
    <NotificationPreferencesContext.Provider value={value}>
      {children}
    </NotificationPreferencesContext.Provider>
  );
};

export const useNotificationPreferences = (): NotificationPreferencesContextType => {
  const context = useContext(NotificationPreferencesContext);
  if (context === undefined) {
    throw new Error('useNotificationPreferences must be used within a NotificationPreferencesProvider');
  }
  return context;
};

// Helper function to check if a specific notification type should be sent
export const shouldSendNotification = (
  preferences: NotificationPreferences,
  notificationType: 'transaction' | 'security' | 'system' | 'promotional',
  channel: 'push' | 'email' | 'sms' = 'push',
  transactionSubType?: 'sent' | 'received' | 'failed'
): boolean => {
  // Check if the channel is enabled
  if (channel === 'push' && !preferences.pushEnabled) return false;
  if (channel === 'email' && !preferences.emailEnabled) return false;
  if (channel === 'sms' && !preferences.smsEnabled) return false;

  // Check specific notification type
  switch (notificationType) {
    case 'transaction':
      if (!preferences.transactionAlerts) return false;
      
      // Check specific transaction type if provided
      if (transactionSubType) {
        if (transactionSubType === 'sent' && !preferences.sentTransactionAlerts) return false;
        if (transactionSubType === 'received' && !preferences.receivedTransactionAlerts) return false;
        if (transactionSubType === 'failed' && !preferences.failedTransactionAlerts) return false;
      }
      return true;

    case 'security':
      // Security alerts are always enabled for user safety
      return preferences.securityAlerts;

    case 'system':
      return preferences.systemAlerts;

    case 'promotional':
      return preferences.promotionalUpdates;

    default:
      return true;
  }
};
