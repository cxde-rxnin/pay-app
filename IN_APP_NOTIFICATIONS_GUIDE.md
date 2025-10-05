# In-App Notification System - Complete Guide

## 🎯 Overview

This in-app notification system provides two types of notifications:

1. **Toast/Banner Notifications** - Real-time alerts that appear at the top of the screen
2. **Stored Notifications** - Persistent notifications accessible from the notifications screen

## 📁 Architecture

```
frontend/
├── src/
│   ├── contexts/
│   │   └── NotificationContext.tsx       # Global state management
│   ├── components/
│   │   ├── NotificationToast.tsx         # Individual toast component
│   │   └── NotificationContainer.tsx     # Toast container overlay
│   ├── services/
│   │   └── notificationService.ts        # Business logic & formatting
│   └── screens/
│       └── modals/
│           └── NotificationsScreen.tsx   # Notifications history screen
```

## 🔧 Setup

### 1. Install Dependencies

```powershell
cd frontend
npm install react-native-gesture-handler
```

### 2. Provider Setup

The `NotificationProvider` is already integrated in `App.tsx`:

```tsx
import { NotificationProvider } from './src/contexts/NotificationContext';
import NotificationContainer from './src/components/NotificationContainer';

<NotificationProvider>
  <RootNavigator />
  <NotificationContainer />  {/* Renders toast notifications */}
</NotificationProvider>
```

## 📝 Usage

### Basic Toast Notifications

```tsx
import { useNotifications } from '../../contexts/NotificationContext';

function MyComponent() {
  const { showNotification } = useNotifications();

  const handleSuccess = () => {
    showNotification({
      type: 'success',
      title: 'Transfer Successful',
      message: 'Your transfer of ₦5,000 was completed',
      duration: 4000, // optional, defaults to 4000ms
    });
  };

  const handleError = () => {
    showNotification({
      type: 'error',
      title: 'Transfer Failed',
      message: 'Insufficient funds in your account',
    });
  };

  return (
    <Button onPress={handleSuccess} title="Send Money" />
  );
}
```

### Toast with Action Button

```tsx
showNotification({
  type: 'warning',
  title: 'Verification Required',
  message: 'Complete your KYC to unlock full features',
  action: {
    label: 'Verify Now',
    onPress: () => navigation.navigate('AccountVerification'),
  },
});
```

### Using Notification Service

For consistent formatting and business logic:

```tsx
import NotificationService from '../../services/notificationService';
import { useNotifications } from '../../contexts/NotificationContext';

function TransferScreen() {
  const { showNotification, addNotification } = useNotifications();

  // Subscribe to notification events
  useEffect(() => {
    const unsubscribe = NotificationService.subscribe((payload) => {
      // Show toast notification
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
  }, []);

  const handleTransfer = async () => {
    try {
      const result = await transferMoney(amount, recipient);
      
      // Trigger transaction notification
      NotificationService.notifyTransaction({
        type: 'success',
        amount: result.amount,
        recipient: result.recipientName,
        description: `Transfer to ${result.recipientName} successful`,
      });
    } catch (error) {
      NotificationService.notifyTransaction({
        type: 'failed',
        amount: amount,
        description: error.message,
      });
    }
  };
}
```

## 🎨 Notification Types

### Toast Types

| Type | Color | Use Case |
|------|-------|----------|
| `success` | Green (#34C759) | Successful operations |
| `error` | Red (#FF3B30) | Failures, errors |
| `warning` | Orange (#FF9500) | Important alerts |
| `info` | Blue (#007AFF) | General information |
| `transaction` | Primary | Transaction updates |

### Stored Notification Types

| Type | Icon | Use Case |
|------|------|----------|
| `transaction` | Money arrows | Transfers, payments |
| `security` | Shield | Security alerts, login |
| `promotional` | Gift | Offers, rewards |
| `system` | Bell | App updates, info |

## 🔌 Backend Integration

### 1. Fetch Notifications from API

```tsx
// In NotificationContext.tsx or a custom hook
const fetchNotifications = async () => {
  try {
    const response = await fetch('/api/notifications');
    const data = await response.json();
    setNotifications(data);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  }
};

useEffect(() => {
  fetchNotifications();
}, []);
```

### 2. Mark as Read API Call

```tsx
const markAsRead = async (id: string) => {
  try {
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  } catch (error) {
    console.error('Failed to mark as read:', error);
  }
};
```

### 3. Real-time Notifications with WebSocket

```tsx
useEffect(() => {
  const ws = new WebSocket('wss://your-api.com/notifications');

  ws.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    
    // Add to stored notifications
    addNotification(notification);
    
    // Show toast
    showNotification({
      type: NotificationService.getToastType(notification.type),
      title: notification.title,
      message: notification.message,
    });
  };

  return () => ws.close();
}, []);
```

### 4. Push Notifications Integration

```tsx
import * as Notifications from 'expo-notifications';

// Register for push notifications
const registerForPushNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  const token = await Notifications.getExpoPushTokenAsync();
  // Send token to your backend
  await fetch('/api/push-token', {
    method: 'POST',
    body: JSON.stringify({ token: token.data }),
  });
};

// Handle foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Listen for notifications
const subscription = Notifications.addNotificationReceivedListener(notification => {
  const { title, body, data } = notification.request.content;
  
  showNotification({
    type: 'info',
    title: title || 'Notification',
    message: body || '',
  });
  
  addNotification({
    type: data.type || 'system',
    title: title || '',
    message: body || '',
    timestamp: 'Just now',
    date: 'Today',
    read: false,
  });
});
```

## 🎯 Common Use Cases

### Transaction Notifications

```tsx
// After successful transfer
NotificationService.notifyTransaction({
  type: 'sent',
  amount: 5000,
  recipient: '@johndoe',
  description: 'Transfer to @johndoe completed',
});

// When money is received
NotificationService.notifyTransaction({
  type: 'received',
  amount: 15000,
  sender: '@janedoe',
});
```

### Security Notifications

```tsx
// New login detected
NotificationService.notifySecurity({
  type: 'login',
  description: 'New login from Windows device in Lagos, Nigeria',
});

// PIN changed
NotificationService.notifySecurity({
  type: 'pin-change',
  description: 'Your transaction PIN was changed successfully',
});
```

### System Notifications

```tsx
// Verification reminder
NotificationService.notifySystem({
  type: 'verification',
  message: 'Complete your Tier 2 verification to unlock ₦200,000 daily limit',
});

// App update
NotificationService.notifySystem({
  type: 'update',
  message: 'Version 2.1.0 is available with new features',
});
```

### Promotional Notifications

```tsx
NotificationService.notifyPromotion({
  title: '🎉 Special Offer!',
  message: 'Get 5% cashback on all airtime purchases this weekend',
});
```

## 🎨 Customization

### Custom Toast Duration

```tsx
showNotification({
  type: 'info',
  title: 'Quick Message',
  message: 'This will disappear quickly',
  duration: 2000, // 2 seconds
});
```

### Custom Icon

```tsx
import { Gift } from 'iconsax-react-nativejs';

showNotification({
  type: 'info',
  title: 'Bonus Received',
  message: 'You earned ₦500 bonus',
  icon: <Gift size={24} color="#FFD700" variant="Bold" />,
});
```

### Custom Action

```tsx
showNotification({
  type: 'info',
  title: 'New Message',
  message: 'You have 3 unread messages',
  action: {
    label: 'View',
    onPress: () => navigation.navigate('Messages'),
  },
  onClose: () => console.log('Notification closed'),
});
```

## 📊 State Management

### Access Notification State

```tsx
const {
  // Toast notifications
  showNotification,
  hideNotification,
  activeNotifications,
  
  // Stored notifications
  notifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  unreadCount,
} = useNotifications();
```

### Update Badge Count

The badge in HomeScreen automatically updates based on `unreadCount`:

```tsx
const { unreadCount } = useNotifications();

// Badge will show when unreadCount > 0
// Shows "9+" when count exceeds 9
```

## 🧪 Testing

### Manual Testing

1. **Test Toast Notifications:**
   - Trigger different notification types
   - Test swipe-to-dismiss gesture
   - Test action button navigation
   - Test auto-dismiss after duration

2. **Test Stored Notifications:**
   - Add new notifications
   - Mark as read/unread
   - Delete notifications
   - Test filters (All/Unread/Read)
   - Test navigation to actionable screens

3. **Test Badge:**
   - Verify badge appears with correct count
   - Verify badge updates when marking as read
   - Verify "9+" displays for 10+ notifications

### Example Test Triggers

```tsx
// Add this to HomeScreen for testing
const testNotifications = () => {
  // Test success toast
  showNotification({
    type: 'success',
    title: 'Test Success',
    message: 'This is a success notification',
  });

  // Test with action
  setTimeout(() => {
    showNotification({
      type: 'warning',
      title: 'Test Action',
      message: 'This has an action button',
      action: {
        label: 'Take Action',
        onPress: () => alert('Action pressed!'),
      },
    });
  }, 1000);

  // Add stored notification
  addNotification({
    type: 'transaction',
    title: 'Test Transaction',
    message: 'You received ₦1,000',
    timestamp: 'Just now',
    date: 'Today',
    read: false,
    icon: 'received',
    amount: '+₦1,000',
  });
};

// Add test button
<Button onPress={testNotifications} title="Test Notifications" />
```

## 🚀 Best Practices

1. **Use NotificationService for consistency** - Always use the service methods for formatted notifications
2. **Handle errors gracefully** - Show error toasts when operations fail
3. **Keep messages concise** - Toast messages should be readable in 2-3 seconds
4. **Use appropriate types** - Match notification type to the action context
5. **Add actions when needed** - Include action buttons for notifications requiring user response
6. **Update stored notifications** - Keep the notification center in sync with toasts
7. **Test on devices** - Test gesture handling on actual devices
8. **Implement rate limiting** - Prevent notification spam
9. **Clear old notifications** - Implement auto-cleanup for old notifications
10. **Handle permission requests** - Properly request and handle notification permissions

## 🔒 Security Considerations

- Validate notification data from backend
- Sanitize user-generated content in notifications
- Implement notification rate limiting
- Secure WebSocket connections (WSS)
- Validate push notification tokens
- Don't include sensitive data in notification messages

## 📱 Platform Considerations

### iOS
- Respect system notification settings
- Test with Do Not Disturb mode
- Handle notification permissions correctly

### Android
- Test with different notification channel settings
- Handle background restrictions
- Test with battery optimization enabled

## 🐛 Troubleshooting

### Toasts not appearing
- Ensure `NotificationContainer` is rendered in App.tsx
- Check that `NotificationProvider` wraps the entire app
- Verify `GestureHandlerRootView` is present

### Badge not updating
- Ensure `unreadCount` is used from `useNotifications()` hook
- Check that notifications have correct `read` property
- Verify `markAsRead` is called when needed

### Navigation not working from notifications
- Ensure navigation prop is passed correctly
- Use `goBack()` before navigating from modals
- Add `setTimeout` for smooth transitions

### Gesture handler errors
- Install `react-native-gesture-handler`
- Import `GestureHandlerRootView` in App.tsx
- Wrap app content with GestureHandlerRootView

## 📚 API Reference

See inline documentation in:
- `/src/contexts/NotificationContext.tsx` - Context API
- `/src/services/notificationService.ts` - Service methods
- `/src/components/NotificationToast.tsx` - Toast component props
