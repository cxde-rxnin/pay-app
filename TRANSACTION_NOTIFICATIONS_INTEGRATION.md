# Transaction Notifications Integration - Complete Guide

## 🎯 Overview

All transaction types in your app now automatically trigger notifications:

✅ **Airtime Purchases** - MTN, Airtel, Glo, 9mobile  
✅ **Data Bundle Purchases** - All networks  
✅ **Internal Transfers** - Send to Lemo users (@usertag)  
✅ **Bank Transfers** - External bank transfers  

## 🔄 Transaction Flow with Notifications

```
1. User initiates transaction (Airtime/Data/Transfer Modal)
   ↓
2. LoadingScreen (5s processing simulation)
   ↓
3. PaymentScreen (PIN entry)
   ↓
4. TransactionResultScreen
   ↓
5. 🔔 NOTIFICATIONS TRIGGERED HERE (Toast + Notification Center)
```

## 📝 What Gets Notified

### ✅ Success Notifications

#### Airtime Purchase
- **Toast**: Green success notification appears at top
- **Title**: "Airtime Purchase Successful"
- **Message**: "You purchased ₦500 MTN airtime for 08012345678"
- **Badge**: Updates unread count
- **Notification Center**: Stored with amount and timestamp

#### Data Purchase
- **Toast**: Green success notification
- **Title**: "Data Purchase Successful"
- **Message**: "You purchased 2GB MTN data for 08012345678"
- **Icon**: Success checkmark
- **Amount**: Shows price (e.g., "-₦600")

#### Internal Transfer (Lemo to Lemo)
- **Toast**: Green success with "sent" indicator
- **Title**: "Money Sent"
- **Message**: "You sent ₦5,000 to @johndoe"
- **Icon**: Arrow up (sent)
- **Amount**: "-₦5,000"

#### Bank Transfer
- **Toast**: Green success with "sent" indicator
- **Title**: "Transfer Successful"
- **Message**: "Your transfer of ₦25,000 to John Doe (GTBank) was successful"
- **Icon**: Arrow up (sent)
- **Amount**: "-₦25,000"

### ❌ Failure Notifications

All failed transactions show:
- **Toast**: Red error notification
- **Title**: "[Transaction Type] Failed"
- **Message**: Specific failure reason
- **Icon**: Error/failed icon
- **Stored in**: Notification center for review

## 🔧 Technical Implementation

### TransactionResultScreen.tsx

This is the central point where all notifications are triggered:

```tsx
useEffect(() => {
  // When transaction completes, trigger notifications
  
  // 1. Show toast notification (immediate feedback)
  showNotification({
    type: status === 'success' ? 'success' : 'error',
    title: notificationTitle,
    message: notificationMessage,
    duration: 5000,
  });

  // 2. Add to notification center (persistent)
  addNotification({
    type: 'transaction',
    title: notificationTitle,
    message: notificationMessage,
    timestamp: 'Just now',
    date: 'Today',
    read: false,
    icon: iconType,
    amount: `-${amount}`,
  });

  // 3. Trigger NotificationService (for subscribers)
  NotificationService.notifyTransaction({
    type: status === 'success' ? 'success' : 'failed',
    amount: cleanAmount,
    description: notificationMessage,
  });
}, [transaction, status]);
```

### Notification Details by Transaction Type

#### 1. Airtime Purchase
```tsx
{
  type: 'transaction',
  title: 'Airtime Purchase Successful',
  message: 'You purchased ₦500 MTN airtime for 08012345678',
  icon: 'success',
  amount: '-₦500'
}
```

#### 2. Data Purchase
```tsx
{
  type: 'transaction',
  title: 'Data Purchase Successful',
  message: 'You purchased 2GB MTN data for 08012345678',
  icon: 'success',
  amount: '-₦600'
}
```

#### 3. Internal Transfer
```tsx
{
  type: 'transaction',
  title: 'Money Sent',
  message: 'You sent ₦5,000 to @johndoe',
  icon: 'sent',
  amount: '-₦5,000'
}
```

#### 4. Bank Transfer
```tsx
{
  type: 'transaction',
  title: 'Transfer Successful',
  message: 'Your transfer of ₦25,000 to John Doe (GTBank) was successful',
  icon: 'sent',
  amount: '-₦25,000'
}
```

## 🧪 Testing Notifications

### Test Success Transactions

1. **Airtime Purchase:**
   - Open HomeScreen → Tap Airtime
   - Enter phone number, select network
   - Enter amount, continue
   - Enter any PIN except "0000"
   - ✅ Should show success toast + add to notification center

2. **Data Purchase:**
   - Open HomeScreen → Tap Data
   - Select bundle, enter phone number
   - Enter PIN (not "0000")
   - ✅ Should show success notification

3. **Internal Transfer:**
   - Send to Lemo user via usertag
   - Complete transaction with PIN
   - ✅ Should show "Money Sent" notification

4. **Bank Transfer:**
   - Send to external bank
   - Complete with PIN
   - ✅ Should show transfer success notification

### Test Failed Transactions

- **Trigger Failure:** Enter PIN "0000" on any transaction
- ✅ Should show red error toast
- ✅ Should add failed transaction to notification center
- ✅ Badge should update with unread count

### Verify Badge Updates

1. Complete 3-5 transactions
2. Check HomeScreen notification icon
3. Badge should show unread count (up to "9+")
4. Open NotificationsScreen
5. Mark as read
6. Badge should update/disappear

## 🎨 Notification Appearance

### Toast Notifications

**Success (Green):**
```
┌─────────────────────────────────────┐
│  ─  Swipe up to dismiss             │
│  ✓  Airtime Purchase Successful     │
│     You purchased ₦500 MTN airtime  │
│     for 08012345678                 │
│                               [×]   │
└─────────────────────────────────────┘
```

**Error (Red):**
```
┌─────────────────────────────────────┐
│  ─  Swipe up to dismiss             │
│  ✗  Transfer Failed                 │
│     Insufficient funds in account   │
│                               [×]   │
└─────────────────────────────────────┘
```

### Notification Center

```
All (12)  Unread (3)  Read (9)

Today
────────────────────────────────
[↓] Airtime Purchase Successful   -₦500
    You purchased ₦500 MTN...     2 min ago
    
[↑] Money Sent                    -₦5,000
    You sent ₦5,000 to @john...   5 min ago
```

## 🔌 Adding More Transaction Types

To add notifications for new transaction types:

1. **Update transaction flow** to navigate to `TransactionResultScreen`
2. **Pass transaction object** with these fields:
   ```tsx
   {
     type: 'YourTransactionType',
     amount: '₦1,000',
     // ... other relevant fields
   }
   ```
3. **Add case in TransactionResultScreen.tsx:**
   ```tsx
   else if (transaction.type === 'YourTransactionType') {
     if (status === 'success') {
       notificationTitle = 'Your Success Title';
       notificationMessage = 'Your success message';
       icon = 'success';
     } else {
       notificationTitle = 'Your Failure Title';
       notificationMessage = 'Your failure message';
       icon = 'failed';
     }
   }
   ```

## 📊 Notification Statistics

After integration, you'll have:
- **Real-time feedback**: Toast appears immediately
- **Persistent history**: All transactions stored in notification center
- **Visual indicators**: Badge shows unread count
- **Smart filtering**: Filter by all/unread/read
- **Action support**: Tap to view transaction details

## 🚀 Production Considerations

### Backend Integration

When connecting to your backend API:

```tsx
// In TransactionResultScreen.tsx or a custom hook
useEffect(() => {
  const saveNotificationToBackend = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          type: 'transaction',
          title: notificationTitle,
          message: notificationMessage,
          metadata: {
            transactionId: transaction.sessionId,
            amount: cleanAmount,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error('Failed to save notification:', error);
    }
  };

  if (transaction) {
    saveNotificationToBackend();
  }
}, [transaction]);
```

### Real-time Money Receipt

For receiving money notifications (from other users):

```tsx
// In a global context or App.tsx
useEffect(() => {
  const ws = new WebSocket('wss://your-api.com/transactions');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'money_received') {
      // Show toast
      showNotification({
        type: 'transaction',
        title: 'Money Received',
        message: `You received ${data.amount} from ${data.sender}`,
        duration: 5000,
      });
      
      // Add to notification center
      addNotification({
        type: 'transaction',
        title: 'Money Received',
        message: `You received ${data.amount} from ${data.sender}`,
        timestamp: 'Just now',
        date: 'Today',
        read: false,
        icon: 'received',
        amount: `+${data.amount}`,
      });
    }
  };
  
  return () => ws.close();
}, []);
```

### Push Notifications

Integrate with Expo Notifications:

```tsx
import * as Notifications from 'expo-notifications';

// When transaction completes
const sendPushNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: notificationTitle,
      body: notificationMessage,
      data: { transactionId: transaction.sessionId },
    },
    trigger: null, // Immediate
  });
};
```

## 🎯 Best Practices

1. ✅ **Always show toast** for immediate feedback
2. ✅ **Always store in notification center** for history
3. ✅ **Update badge count** after each transaction
4. ✅ **Include transaction amount** in notifications
5. ✅ **Use appropriate icons** (sent/received/success/failed)
6. ✅ **Keep messages concise** but informative
7. ✅ **Test both success and failure** paths
8. ✅ **Handle edge cases** (network errors, timeouts)

## 📚 Files Modified

1. **TransactionResultScreen.tsx** - Added notification triggers
   - Imports notification context and service
   - useEffect hook triggers on transaction complete
   - Handles all 4 transaction types
   - Shows toast + adds to center
   - Differentiates success/failure

## 🐛 Troubleshooting

### Notifications not appearing
- Check that transaction object is passed to TransactionResultScreen
- Verify NotificationProvider wraps the entire app
- Check console for errors

### Badge not updating
- Ensure notifications are being added with `read: false`
- Verify HomeScreen is using `unreadCount` from context
- Check that NotificationProvider is in App.tsx

### Wrong notification message
- Verify transaction.type matches expected cases
- Check transaction object structure
- Add console.log to see what data is received

### Toast disappears too quickly
- Increase duration: `duration: 5000` (5 seconds)
- Default is 4 seconds

## ✨ Features Summary

✅ All transactions automatically notify  
✅ Success and failure handled  
✅ Toast + Notification Center integration  
✅ Badge updates in real-time  
✅ Transaction-specific messages  
✅ Amount tracking with +/- indicators  
✅ Icon differentiation (sent/received/success/failed)  
✅ Timestamp and date tracking  
✅ Filter by read/unread  
✅ Ready for backend integration  

Your transaction notification system is now fully integrated! 🎉
