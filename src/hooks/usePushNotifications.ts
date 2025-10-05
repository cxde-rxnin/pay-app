import { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import PushNotificationService from '../services/pushNotificationService';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationService from '../services/notificationService';
import { handleNotificationNavigation } from '../services/navigationService';

export const usePushNotifications = () => {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>('undetermined');
  const [isRegistering, setIsRegistering] = useState(false);
  const { showNotification, addNotification } = useNotifications();

  // Register for push notifications
  const registerForPushNotifications = useCallback(async () => {
    setIsRegistering(true);
    const tokenData = await PushNotificationService.registerForPushNotifications();
    if (tokenData) {
      setPushToken(tokenData.token);
      setPermissionStatus('granted');
      
      // TODO: Send token to your backend
      // await sendTokenToBackend(tokenData.token);
    } else {
      setPermissionStatus('denied');
    }
    setIsRegistering(false);
  }, []);

  // Handle notification received (app in foreground)
  const handleNotificationReceived = useCallback(
    (notification: Notifications.Notification) => {
      const { title, body, data } = notification.request.content;
      const notifData = data as any;

      // Show in-app toast notification
      showNotification({
        type: getNotificationType(notifData?.type),
        title: title || 'Notification',
        message: body || '',
        duration: 5000,
      });

      // Add to notification center
      addNotification({
        type: (notifData?.type as any) || 'system',
        title: title || 'Notification',
        message: body || '',
        timestamp: 'Just now',
        date: 'Today',
        read: false,
        icon: getNotificationIcon(notifData?.type),
        amount: notifData?.amount,
      });
    },
    [showNotification, addNotification]
  );

  // Handle notification pressed (user taps notification)
  const handleNotificationPressed = useCallback(
    (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data as any;

      console.log('📱 Notification tapped:', data);

      // Navigate based on notification data
      handleNotificationNavigation(data);

      // Mark as read or perform other actions
      if (data?.notificationId) {
        // TODO: Mark notification as read in backend
        console.log('Mark as read:', data.notificationId);
      }
    },
    []
  );

  // Setup listeners on mount
  useEffect(() => {
    // Register for push notifications
    registerForPushNotifications();

    // Setup listeners
    PushNotificationService.setupNotificationListeners(
      handleNotificationReceived,
      handleNotificationPressed
    );

    // Get initial permission status
    PushNotificationService.getPermissionsStatus().then((status) => {
      setPermissionStatus(status);
    });

    // Cleanup listeners on unmount
    return () => {
      PushNotificationService.removeNotificationListeners();
    };
  }, [registerForPushNotifications, handleNotificationReceived, handleNotificationPressed]);

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    await PushNotificationService.scheduleLocalNotification(
      'Test Notification',
      'This is a test push notification!',
      { test: true },
      2 // 2 seconds delay
    );
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    await PushNotificationService.clearAllNotifications();
    await PushNotificationService.clearBadge();
  }, []);

  // Set badge count
  const setBadgeCount = useCallback(async (count: number) => {
    await PushNotificationService.setBadgeCount(count);
  }, []);

  // Open notification settings
  const openSettings = useCallback(async () => {
    await PushNotificationService.openSettings();
  }, []);

  return {
    pushToken,
    permissionStatus,
    isRegistering,
    registerForPushNotifications,
    sendTestNotification,
    clearAllNotifications,
    setBadgeCount,
    openSettings,
  };
};

// Helper functions
const getNotificationType = (type?: string): 'success' | 'error' | 'warning' | 'info' | 'transaction' => {
  switch (type) {
    case 'transaction':
      return 'transaction';
    case 'security':
      return 'warning';
    case 'promotional':
      return 'info';
    case 'error':
      return 'error';
    default:
      return 'info';
  }
};

const getNotificationIcon = (type?: string): 'success' | 'failed' | 'info' | 'gift' | 'sent' | 'received' | 'document' | 'security' => {
  switch (type) {
    case 'transaction':
      return 'received';
    case 'security':
      return 'security';
    case 'promotional':
      return 'gift';
    default:
      return 'info';
  }
};
