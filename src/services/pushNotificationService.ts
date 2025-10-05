/**
 * Push Notification Service
 * Handles Expo push notification registration, permissions, and delivery
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushNotificationToken {
  token: string;
  type: 'expo' | 'android' | 'ios';
}

export class PushNotificationService {
  private static instance: PushNotificationService;
  private pushToken: string | null = null;
  private notificationListener: any = null;
  private responseListener: any = null;

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Register for push notifications and get token
   */
  async registerForPushNotifications(): Promise<PushNotificationToken | null> {
    try {
      console.log('🔧 Starting push notification registration...');
      
      // Check if running on physical device
      if (!Device.isDevice) {
        console.log('❌ Push notifications only work on physical devices');
        console.log('📱 Device.isDevice:', Device.isDevice);
        return null;
      }
      console.log('✅ Running on physical device');

      // Request permissions
      console.log('🔐 Checking notification permissions...');
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('📋 Existing permission status:', existingStatus);
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        console.log('🙏 Requesting notification permissions...');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('📋 New permission status:', finalStatus);
      }

      if (finalStatus !== 'granted') {
        console.log('❌ Failed to get push notification permissions');
        console.log('💡 Go to Settings > Expo Go > Notifications and enable them');
        return null;
      }
      console.log('✅ Notification permissions granted');

      // Get push token
      console.log('🎫 Getting Expo push token...');
      
      // For Expo Go, we don't need to pass projectId - it uses the experience ID automatically
      const tokenData = await Notifications.getExpoPushTokenAsync();

      this.pushToken = tokenData.data;
      console.log('✅ Push Token Generated:', this.pushToken);
      console.log('📱 Token Type:', tokenData.type);

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'default',
        });

        // Create channels for different notification types
        await Notifications.setNotificationChannelAsync('transactions', {
          name: 'Transactions',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('security', {
          name: 'Security Alerts',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 100, 100, 100, 100, 100],
          sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('promotions', {
          name: 'Promotions',
          importance: Notifications.AndroidImportance.DEFAULT,
          sound: 'default',
        });
      }

      console.log('Push token registered:', this.pushToken);

      return {
        token: this.pushToken,
        type: 'expo',
      };
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  /**
   * Get the current push token
   */
  getPushToken(): string | null {
    return this.pushToken;
  }

  /**
   * Setup notification listeners
   */
  setupNotificationListeners(
    onNotificationReceived: (notification: Notifications.Notification) => void,
    onNotificationPressed: (response: Notifications.NotificationResponse) => void
  ) {
    // Listen for notifications received while app is in foreground
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        onNotificationReceived(notification);
      }
    );

    // Listen for user interactions with notifications
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification pressed:', response);
        onNotificationPressed(response);
      }
    );
  }

  /**
   * Remove notification listeners
   */
  removeNotificationListeners() {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }
  }

  /**
   * Schedule a local notification
   */
  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    seconds?: number
  ) {
    try {
      console.log('📲 Scheduling notification:', {
        title,
        body: body.substring(0, 50) + '...',
        delay: seconds ? `${seconds}s` : 'immediate',
        hasData: !!data
      });

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
          badge: 1,
        },
        trigger: {
          seconds: seconds || 1, // Use 1 second as minimum for iOS to show outside app
          repeats: false,
        } as any
      });

      console.log('✅ Notification scheduled with ID:', identifier);
      return identifier;
    } catch (error) {
      console.error('❌ Error scheduling notification:', error);
      throw error;
    }
  }

  /**
   * Send transaction notification
   */
  async sendTransactionNotification(
    type: 'sent' | 'received' | 'success' | 'failed',
    amount: number,
    details: string,
    transactionId?: string
  ) {
    const titles: Record<string, string> = {
      sent: 'Money Sent',
      received: 'Money Received',
      success: 'Transaction Successful',
      failed: 'Transaction Failed',
    };

    const emojis: Record<string, string> = {
      sent: '💸',
      received: '💰',
      success: '✅',
      failed: '❌',
    };

    console.log(`📢 Sending ${type} transaction notification:`, {
      title: `${emojis[type]} ${titles[type]}`,
      amount,
      details: details.substring(0, 50) + '...'
    });

    await this.scheduleLocalNotification(
      `${emojis[type]} ${titles[type]}`,
      details,
      { 
        type: 'transaction', 
        transactionType: type, 
        amount,
        transactionId,
        screen: 'App',
        params: { screen: 'History' }
      },
      2 // 2 seconds delay to avoid overlapping with in-app toast
    );

    console.log('✅ Transaction notification scheduled successfully');
  }

  /**
   * Send security alert notification
   */
  async sendSecurityNotification(title: string, message: string) {
    await this.scheduleLocalNotification(
      `🔐 ${title}`,
      message,
      { type: 'security', priority: 'high' }
    );
  }

  /**
   * Send promotional notification
   */
  async sendPromotionalNotification(title: string, message: string) {
    await this.scheduleLocalNotification(
      `🎉 ${title}`,
      message,
      { type: 'promotional' }
    );
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications() {
    await Notifications.dismissAllNotificationsAsync();
  }

  /**
   * Clear notification badge
   */
  async clearBadge() {
    await Notifications.setBadgeCountAsync(0);
  }

  /**
   * Set notification badge count
   */
  async setBadgeCount(count: number) {
    await Notifications.setBadgeCountAsync(count);
  }

  /**
   * Get notification permissions status
   */
  async getPermissionsStatus() {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }

  /**
   * Open notification settings
   */
  async openSettings() {
    const { Linking } = await import('react-native');
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    } else {
      await Linking.openSettings();
    }
  }
}

export default PushNotificationService.getInstance();
