# 📱 Testing Push Notifications with Expo Go

## 🚀 Quick Start

Your app is now configured to work with **Expo Go** on your iPhone! Follow these steps to test push notifications.

## 📲 Setup Steps

### 1. Start the Development Server

```bash
cd frontend
npx expo start
```

### 2. Connect with Expo Go

1. Open **Expo Go** app on your iPhone
2. Scan the QR code from the terminal
3. Wait for the app to load

### 3. Test Push Notifications

Once the app loads, you'll see a console log with your push token:
```
✅ Push Token: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
```

## ✅ What Works with Expo Go

✅ **Local Push Notifications** - Scheduled from the app  
✅ **Permission Requests** - iOS native permission dialog  
✅ **Foreground Notifications** - Notifications while app is open  
✅ **Background Notifications** - Notifications when app is minimized  
✅ **Notification Tap** - Opens app and handles navigation  
✅ **Badge Count** - App icon badge updates  
✅ **Transaction Notifications** - Automatic alerts for all transactions  

## 🧪 Test Scenarios

### Test 1: Transaction Notification (Easiest)

1. Open the app in Expo Go
2. Complete any transaction (Airtime, Data, or Transfer)
3. Expected Results:
   - ✅ Green toast appears at top (in-app)
   - ✅ Push notification appears after 2 seconds
   - ✅ Notification shows in notification center

### Test 2: Background Notification

1. Open the app in Expo Go
2. Complete a transaction
3. Immediately press home button (minimize app)
4. Expected Results:
   - ✅ Push notification appears in notification tray
   - ✅ Badge shows on Expo Go app icon
   - ✅ Sound plays

### Test 3: Notification Tap

1. Complete a transaction while app is minimized
2. Wait for push notification
3. Tap the notification
4. Expected Results:
   - ✅ App opens
   - ✅ Notification data logged to console
   - ✅ Badge updates

### Test 4: Permission Flow

1. Delete and reinstall the app in Expo Go (clear data)
2. Open the app
3. Expected Results:
   - ✅ iOS permission dialog appears
   - ✅ If "Allow" - notifications work
   - ✅ If "Don't Allow" - no notifications (as expected)

## 📊 Monitoring

### Check Console Logs

Watch for these logs in the terminal:

```
✅ Push Token: ExponentPushToken[...]           → Token registered
Notification received: {...}                    → Foreground notification
Notification pressed: {...}                     → User tapped notification
```

### Check Expo Go Developer Menu

1. Shake your iPhone
2. Select "Show Performance Monitor"
3. Watch for notification events

## 🔍 Debugging

### Problem: No Notifications Appearing

**Solutions:**
1. Check iOS notification permissions:
   - Settings > Expo Go > Notifications > Allow
2. Check Do Not Disturb is off
3. Restart Expo Go app
4. Check console for errors

### Problem: No Push Token Generated

**Solutions:**
1. Make sure you're using a physical iPhone (not simulator)
2. Check internet connection
3. Restart development server:
   ```bash
   npx expo start --clear
   ```
4. Reinstall Expo Go app

### Problem: Notifications Don't Play Sound

**Solutions:**
1. Check iPhone is not in silent mode (ring/silent switch)
2. Check volume is up
3. Check Do Not Disturb is off
4. Check Focus modes are off

### Problem: Badge Not Showing

**Solutions:**
1. Check Settings > Expo Go > Notifications > Badges > ON
2. Mark notifications as unread in the app
3. Complete a new transaction

## 🎯 Testing Checklist

Before marking push notifications as complete, test:

- [ ] Permission request appears on first launch
- [ ] Push token is generated and logged
- [ ] In-app toast notifications work
- [ ] Push notifications appear in notification tray
- [ ] Notifications work when app is minimized
- [ ] Notifications work when app is closed (force quit)
- [ ] Tapping notification opens the app
- [ ] Badge count updates correctly
- [ ] Sound plays with notifications
- [ ] All transaction types trigger notifications:
  - [ ] Airtime purchase (success)
  - [ ] Data purchase (success)
  - [ ] Internal transfer (sent)
  - [ ] Bank transfer (sent)
  - [ ] Failed transactions

## 📱 Sending Test Notifications

### Method 1: Complete a Transaction
The easiest way! Just buy airtime or send money.

### Method 2: Use Expo's Push Notification Tool

1. Get your push token from the console
2. Go to: https://expo.dev/notifications
3. Enter your token: `ExponentPushToken[...]`
4. Fill in:
   - Title: "Test Notification"
   - Body: "This is a test"
5. Click "Send Notification"

### Method 3: Use curl command

```bash
curl -H "Content-Type: application/json" \
  -X POST "https://exp.host/--/api/v2/push/send" \
  -d '{
    "to": "ExponentPushToken[YOUR_TOKEN_HERE]",
    "title": "💰 Money Received",
    "body": "You received ₦5,000 from John Doe",
    "data": { "type": "transaction", "screen": "Home" },
    "sound": "default",
    "badge": 1
  }'
```

### Method 4: Add Test Button (Optional)

You can add a test button to your HomeScreen for quick testing. Here's the code:

```typescript
import { usePushNotifications } from '../hooks/usePushNotifications';

// Inside your HomeScreen component
const { sendTestNotification } = usePushNotifications();

// Add a button (hidden in production)
<TouchableOpacity 
  onPress={sendTestNotification}
  style={{ position: 'absolute', bottom: 20, right: 20 }}
>
  <Text>🔔 Test</Text>
</TouchableOpacity>
```

## 🌐 Remote Push Notifications (Backend)

Expo Go automatically handles push tokens! When you want to send notifications from your backend:

1. **Collect the push token** (already logged in console)
2. **Send it to your backend** (TODO: Add API endpoint)
3. **Use Expo Push API** from your server:

```javascript
// Backend code
const sendPushNotification = async (pushToken, title, body) => {
  const message = {
    to: pushToken,
    sound: 'default',
    title: title,
    body: body,
    data: { screen: 'Home' },
    badge: 1,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
};
```

## 🎨 Notification Examples

Here are the types of notifications your app sends:

### Transaction Success (Airtime/Data)
```
Title: ✅ Purchase Successful
Body: You purchased ₦500 airtime
```

### Money Sent
```
Title: 💸 Money Sent Successfully
Body: You sent ₦10,000 to John Doe
```

### Money Received (Future - Requires Backend)
```
Title: 💰 Money Received
Body: You received ₦5,000 from Jane Smith
```

### Security Alert (Future)
```
Title: 🔒 New Login Detected
Body: Login from iPhone 15 Pro in Lagos
```

## 📝 Notes for Expo Go

### Limitations
- ❌ Can't customize app icon (uses Expo Go icon)
- ❌ Can't use custom notification sounds (default only)
- ❌ Badge shows on Expo Go app, not your app icon

### Advantages
- ✅ No build process needed
- ✅ Instant testing
- ✅ Quick iteration
- ✅ All notifications work perfectly
- ✅ Same behavior as production app

### Production Build
When you build a standalone app (not Expo Go), you'll get:
- ✅ Your own app icon with badge
- ✅ Custom notification sounds
- ✅ Custom notification icon
- ✅ Better user experience

## 🚀 Next Steps

1. **Test all scenarios** using this guide
2. **Verify notifications work** in background and foreground
3. **Add backend integration** to save push tokens
4. **Build standalone app** for production testing

## 💡 Pro Tips

1. **Keep the terminal visible** - Watch for logs
2. **Test during development** - Don't wait until the end
3. **Test with real transactions** - Most reliable way
4. **Test on multiple devices** - iOS behavior can vary
5. **Check permissions first** - Most common issue

---

## ✅ Success Criteria

Your push notifications are working if:

✅ Permission dialog appears on first launch  
✅ Push token is generated (logged in console)  
✅ Transactions trigger notifications  
✅ Notifications appear when app is closed  
✅ Tapping notification opens the app  
✅ Badge count updates  

You're all set! 🎉 Start testing with a transaction.
