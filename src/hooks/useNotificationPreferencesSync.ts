import { useEffect } from 'react';
import { useNotificationPreferences } from '../contexts/NotificationPreferencesContext';
import NotificationService from '../services/notificationService';

/**
 * Hook to sync notification preferences with the notification service
 * This ensures that the service respects user preference settings
 */
export const useNotificationPreferencesSync = () => {
  const { preferences, isLoading } = useNotificationPreferences();

  useEffect(() => {
    if (!isLoading && preferences) {
      // Update the notification service with current preferences
      NotificationService.setPreferences(preferences);
      
      console.log('📱 Notification preferences synced with service:', {
        pushEnabled: preferences.pushEnabled,
        transactionAlerts: preferences.transactionAlerts,
        securityAlerts: preferences.securityAlerts,
        promotionalUpdates: preferences.promotionalUpdates,
      });
    }
  }, [preferences, isLoading]);

  return { preferences, isLoading };
};
