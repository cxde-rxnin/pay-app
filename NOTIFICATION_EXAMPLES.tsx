// Example: How to use the notification system in your app

import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import { useNotifications } from './src/contexts/NotificationContext';
import NotificationService from './src/services/notificationService';

/**
 * EXAMPLE 1: Basic Toast Notifications
 */
export const BasicToastExample = () => {
  const { showNotification } = useNotifications();

  return (
    <View>
      <Button
        title="Show Success"
        onPress={() => {
          showNotification({
            type: 'success',
            title: 'Transfer Successful',
            message: 'Your transfer of ₦5,000 was completed',
          });
        }}
      />

      <Button
        title="Show Error"
        onPress={() => {
          showNotification({
            type: 'error',
            title: 'Transfer Failed',
            message: 'Insufficient funds in your account',
          });
        }}
      />

      <Button
        title="Show with Action"
        onPress={() => {
          showNotification({
            type: 'warning',
            title: 'Verification Required',
            message: 'Complete your KYC to unlock features',
            action: {
              label: 'Verify Now',
              onPress: () => console.log('Navigate to verification'),
            },
          });
        }}
      />
    </View>
  );
};

/**
 * EXAMPLE 2: Transaction Notifications
 */
export const TransactionExample = () => {
  const { showNotification, addNotification } = useNotifications();

  const handleTransfer = async () => {
    try {
      // Simulate transfer
      const result = { amount: 5000, recipientName: 'John Doe', success: true };

      if (result.success) {
        // Method 1: Using NotificationService
        NotificationService.notifyTransaction({
          type: 'sent',
          amount: result.amount,
          recipient: result.recipientName,
        });

        // Method 2: Direct usage
        showNotification({
          type: 'success',
          title: 'Money Sent',
          message: `You sent ₦${result.amount.toLocaleString()} to ${result.recipientName}`,
        });

        addNotification({
          type: 'transaction',
          title: 'Money Sent',
          message: `You sent ₦${result.amount.toLocaleString()} to ${result.recipientName}`,
          timestamp: 'Just now',
          date: 'Today',
          read: false,
          icon: 'sent',
          amount: `-₦${result.amount.toLocaleString()}`,
        });
      }
    } catch (error) {
      NotificationService.notifyTransaction({
        type: 'failed',
        amount: 5000,
        description: 'Transfer failed due to network error',
      });
    }
  };

  return <Button title="Send Money" onPress={handleTransfer} />;
};

/**
 * EXAMPLE 3: Listening to Notification Events
 */
export const NotificationListenerExample = () => {
  const { showNotification, addNotification } = useNotifications();

  useEffect(() => {
    // Subscribe to notification events
    const unsubscribe = NotificationService.subscribe((payload) => {
      // Show toast
      showNotification({
        type: NotificationService.getToastType(payload.type),
        title: payload.title,
        message: payload.message,
      });

      // Add to stored notifications
      addNotification({
        ...payload,
        timestamp: 'Just now',
        date: 'Today',
        read: false,
      });
    });

    return unsubscribe;
  }, [showNotification, addNotification]);

  return <View>{/* Your component */}</View>;
};

/**
 * EXAMPLE 4: Backend Integration
 */
export const BackendIntegrationExample = () => {
  const { showNotification, addNotification } = useNotifications();

  useEffect(() => {
    // WebSocket connection
    const ws = new WebSocket('wss://your-api.com/notifications');

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);

      // Show toast notification
      showNotification({
        type: notification.toastType || 'info',
        title: notification.title,
        message: notification.message,
      });

      // Add to notification center
      addNotification({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        timestamp: 'Just now',
        date: 'Today',
        read: false,
        icon: notification.icon,
        amount: notification.amount,
      });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => ws.close();
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('https://your-api.com/api/notifications');
        const data = await response.json();
        // Update context with fetched notifications
        // You'd need to add a setNotifications method to context
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return <View>{/* Your component */}</View>;
};

/**
 * EXAMPLE 5: Security Notifications
 */
export const SecurityExample = () => {
  const handleLogin = (deviceInfo: any) => {
    NotificationService.notifySecurity({
      type: 'login',
      description: `New login from ${deviceInfo.platform} device in ${deviceInfo.location}`,
    });
  };

  const handlePinChange = () => {
    NotificationService.notifySecurity({
      type: 'pin-change',
      description: 'Your transaction PIN was changed successfully',
    });
  };

  const handleSuspiciousActivity = () => {
    NotificationService.notifySecurity({
      type: 'suspicious',
      description: 'Multiple failed login attempts detected',
    });
  };

  return (
    <View>
      <Button
        title="Trigger Login Notification"
        onPress={() => handleLogin({ platform: 'Windows', location: 'Lagos, Nigeria' })}
      />
      <Button title="Trigger PIN Change" onPress={handlePinChange} />
      <Button title="Trigger Security Alert" onPress={handleSuspiciousActivity} />
    </View>
  );
};

/**
 * EXAMPLE 6: Managing Notification State
 */
export const NotificationStateExample = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    unreadCount,
  } = useNotifications();

  return (
    <View>
      <Text>Unread Notifications: {unreadCount}</Text>

      <Button title="Mark All as Read" onPress={markAllAsRead} />

      {notifications.slice(0, 5).map((notif) => (
        <View key={notif.id}>
          <Text>{notif.title}</Text>
          <Text>{notif.message}</Text>
          {!notif.read && (
            <Button title="Mark as Read" onPress={() => markAsRead(notif.id)} />
          )}
          <Button title="Delete" onPress={() => deleteNotification(notif.id)} />
        </View>
      ))}
    </View>
  );
};

/**
 * EXAMPLE 7: Airtime/Data Purchase Notifications
 */
export const AirtimePurchaseExample = () => {
  const handleAirtimePurchase = async (amount: number, phone: string) => {
    try {
      // Simulate purchase
      await purchaseAirtime(amount, phone);

      NotificationService.notifyTransaction({
        type: 'success',
        amount: amount,
        description: `You purchased ₦${amount} airtime for ${phone}`,
      });
    } catch (error) {
      NotificationService.notifyTransaction({
        type: 'failed',
        amount: amount,
        description: 'Airtime purchase failed. Please try again.',
      });
    }
  };

  return <Button title="Buy Airtime" onPress={() => handleAirtimePurchase(500, '08012345678')} />;
};

/**
 * EXAMPLE 8: Promotional Notifications
 */
export const PromotionalExample = () => {
  const showPromotion = () => {
    NotificationService.notifyPromotion({
      title: '🎉 Weekend Special!',
      message: 'Get 5% cashback on all transactions this weekend',
    });
  };

  const showReferralBonus = () => {
    NotificationService.notifyPromotion({
      title: 'Invite & Earn',
      message: 'Earn ₦1,000 for every friend who signs up with your code',
    });
  };

  return (
    <View>
      <Button title="Show Promotion" onPress={showPromotion} />
      <Button title="Show Referral" onPress={showReferralBonus} />
    </View>
  );
};

/**
 * EXAMPLE 9: System Notifications
 */
export const SystemNotificationExample = () => {
  const showVerificationReminder = () => {
    NotificationService.notifySystem({
      type: 'verification',
      message: 'Complete your Tier 2 verification to unlock ₦200,000 daily limit',
    });
  };

  const showAppUpdate = () => {
    NotificationService.notifySystem({
      type: 'update',
      message: 'Version 2.1.0 is available with new features and improvements',
    });
  };

  const showMaintenance = () => {
    NotificationService.notifySystem({
      type: 'maintenance',
      message: 'Scheduled maintenance on Sunday 3:00 AM - 4:00 AM',
    });
  };

  return (
    <View>
      <Button title="Verification Reminder" onPress={showVerificationReminder} />
      <Button title="App Update" onPress={showAppUpdate} />
      <Button title="Maintenance Notice" onPress={showMaintenance} />
    </View>
  );
};

/**
 * EXAMPLE 10: Money Received Notification
 */
export const MoneyReceivedExample = () => {
  const handleMoneyReceived = (amount: number, sender: string) => {
    NotificationService.notifyTransaction({
      type: 'received',
      amount: amount,
      sender: sender,
    });
  };

  // Simulate receiving money
  return (
    <Button
      title="Simulate Money Received"
      onPress={() => handleMoneyReceived(15000, '@johndoe')}
    />
  );
};

// Helper function (example)
async function purchaseAirtime(amount: number, phone: string) {
  // API call here
  return new Promise((resolve) => setTimeout(resolve, 1000));
}
