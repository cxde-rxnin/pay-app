# 🔔 In-App Notifications - Quick Reference

## 🚀 Quick Start

```tsx
import { useNotifications } from './src/contexts/NotificationContext';

const { showNotification } = useNotifications();

showNotification({
  type: 'success',
  title: 'Success!',
  message: 'Your action completed successfully',
});
```

## 📋 Notification Types

| Type | Color | Icon | Use Case |
|------|-------|------|----------|
| `success` | Green | ✓ | Successful operations |
| `error` | Red | ✗ | Errors, failures |
| `warning` | Orange | ⚠ | Warnings, alerts |
| `info` | Blue | ℹ | Information |
| `transaction` | Primary | ↕ | Money movements |

## 🎯 Common Patterns

### Success Notification
```tsx
showNotification({
  type: 'success',
  title: 'Transfer Successful',
  message: 'Your transfer of ₦5,000 was completed',
});
```

### Error Notification
```tsx
showNotification({
  type: 'error',
  title: 'Transfer Failed',
  message: 'Insufficient funds in your account',
});
```

### With Action Button
```tsx
showNotification({
  type: 'warning',
  title: 'Verification Required',
  message: 'Complete your KYC',
  action: {
    label: 'Verify Now',
    onPress: () => navigation.navigate('AccountVerification'),
  },
});
```

### Transaction Notification (Using Service)
```tsx
import NotificationService from './src/services/notificationService';

NotificationService.notifyTransaction({
  type: 'sent',
  amount: 5000,
  recipient: '@johndoe',
});
```

### Security Alert
```tsx
NotificationService.notifySecurity({
  type: 'login',
  description: 'New login from Windows device',
});
```

## 🎨 NotificationService Methods

```tsx
// Transaction
NotificationService.notifyTransaction({
  type: 'sent' | 'received' | 'failed' | 'success',
  amount: number,
  recipient?: string,
  sender?: string,
  description?: string,
});

// Security
NotificationService.notifySecurity({
  type: 'login' | 'pin-change' | 'suspicious' | 'alert',
  description: string,
});

// Promotional
NotificationService.notifyPromotion({
  title: string,
  message: string,
});

// System
NotificationService.notifySystem({
  type: 'verification' | 'update' | 'maintenance' | 'info',
  message: string,
});
```

## 📊 Context API

```tsx
const {
  // Toast notifications
  showNotification,      // Show a toast
  hideNotification,      // Hide specific toast
  activeNotifications,   // Currently visible toasts
  
  // Stored notifications
  notifications,         // All notifications array
  addNotification,       // Add to notification center
  markAsRead,           // Mark notification as read
  markAllAsRead,        // Mark all as read
  deleteNotification,   // Delete notification
  unreadCount,          // Number of unread notifications
} = useNotifications();
```

## 🎭 Features

### Toast Notifications
- ✅ Auto-dismiss after duration (default 4s)
- ✅ Swipe up to dismiss
- ✅ Tap X button to close
- ✅ Action button support
- ✅ Stack multiple toasts
- ✅ Smooth animations
- ✅ Custom icons

### Notification Center
- ✅ Filter by All/Unread/Read
- ✅ Mark as read/unread
- ✅ Delete notifications
- ✅ Pull to refresh
- ✅ Date grouping
- ✅ Action navigation
- ✅ Badge counter

## 🔧 Installation

```powershell
cd frontend
npm install react-native-gesture-handler
```

## 📁 Key Files

- `contexts/NotificationContext.tsx` - State management
- `components/NotificationToast.tsx` - Toast component
- `components/NotificationContainer.tsx` - Toast overlay
- `services/notificationService.ts` - Business logic
- `screens/modals/NotificationsScreen.tsx` - Notification center

## 🎬 Complete Example

```tsx
import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import { useNotifications } from './src/contexts/NotificationContext';
import NotificationService from './src/services/notificationService';

export const MyScreen = ({ navigation }) => {
  const { showNotification, addNotification } = useNotifications();

  // Subscribe to notification events
  useEffect(() => {
    const unsubscribe = NotificationService.subscribe((payload) => {
      showNotification({
        type: NotificationService.getToastType(payload.type),
        title: payload.title,
        message: payload.message,
      });

      addNotification({
        ...payload,
        timestamp: 'Just now',
        date: 'Today',
        read: false,
      });
    });

    return unsubscribe;
  }, []);

  const handleTransfer = async () => {
    try {
      const result = await transferMoney(5000, '@johndoe');
      
      NotificationService.notifyTransaction({
        type: 'success',
        amount: result.amount,
        recipient: result.recipientName,
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Transfer Failed',
        message: error.message,
      });
    }
  };

  return (
    <View>
      <Button title="Send Money" onPress={handleTransfer} />
    </View>
  );
};
```

## 💡 Pro Tips

1. **Use NotificationService** for consistent formatting
2. **Keep messages short** - users see toasts for ~4 seconds
3. **Add actions** for notifications requiring user response
4. **Test gestures** on real devices
5. **Handle permissions** properly for push notifications
6. **Clean old notifications** regularly

## 🐛 Common Issues

### Toasts not showing?
- Check `NotificationProvider` wraps app
- Verify `NotificationContainer` is rendered
- Ensure `GestureHandlerRootView` is present

### Badge not updating?
- Use `unreadCount` from context
- Call `markAsRead` when viewing notifications

### Navigation errors?
- Use `goBack()` before navigating from modals
- Add `setTimeout` for smooth transitions

## 📚 Full Documentation

See `IN_APP_NOTIFICATIONS_GUIDE.md` for complete documentation.
See `NOTIFICATION_EXAMPLES.tsx` for 10+ code examples.
