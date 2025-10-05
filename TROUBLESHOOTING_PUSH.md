# 🔧 Push Notifications Troubleshooting Guide

## Issue: Notifications Not Showing Outside the App

### ✅ Fix Applied

I've updated the notification trigger to ensure iOS shows notifications outside the app. The key change:

**Before:**
```typescript
trigger: null // ❌ iOS won't show this outside the app
```

**After:**
```typescript
trigger: { seconds: 2, repeats: false } // ✅ iOS will show this outside the app
```

## 🧪 How to Test

### Test 1: Send Money with App Open
1. Open the app in Expo Go
2. Send money (internal or bank transfer)
3. **Expected:**
   - ✅ Green toast appears immediately
   - ✅ After 2 seconds, push notification appears at the top
   - ✅ Notification stays in notification center

### Test 2: Send Money with App Minimized (IMPORTANT!)
1. Open the app in Expo Go
2. Start a money transfer
3. **Immediately after confirming**, press the home button
4. Wait 3-4 seconds
5. **Expected:**
   - ✅ Push notification appears in notification tray
   - ✅ Sound plays
   - ✅ Badge shows on Expo Go icon

### Test 3: Send Money then Close App
1. Complete a transaction
2. See the success screen
3. **Press home button** (don't close completely)
4. Wait for notification
5. **Expected:**
   - ✅ Notification appears in tray after 2 seconds
   - ✅ Can tap to open app

## 📱 What You Should See

### In Notification Tray (Outside App):

```
┌─────────────────────────────────────┐
│ Expo Go                        now  │
│ 💸 Money Sent                       │
│ You sent ₦5,000 to @john           │
└─────────────────────────────────────┘
```

For airtime/data:
```
┌─────────────────────────────────────┐
│ Expo Go                        now  │
│ ✅ Transaction Successful           │
│ You purchased ₦500 MTN airtime...  │
└─────────────────────────────────────┘
```

## 🔍 Check Console Logs

Watch for these logs in your terminal:

```bash
# When transaction completes
📢 Sending sent transaction notification: {
  title: "💸 Money Sent",
  amount: 5000,
  details: "You sent ₦5,000 to @john..."
}

# When scheduling
📲 Scheduling notification: {
  title: "💸 Money Sent",
  body: "You sent ₦5,000 to @john...",
  delay: "2s",
  hasData: true
}

# Success confirmation
✅ Notification scheduled with ID: [notification-id]
✅ Transaction notification scheduled successfully
```

## ❗ Common Issues & Solutions

### Issue 1: No Notification Permission Dialog
**Problem:** Never saw the permission dialog when app started

**Solution:**
1. Delete Expo Go app completely
2. Reinstall Expo Go from App Store
3. Reopen your app in Expo Go
4. You should see permission dialog

### Issue 2: Notifications Work In-App But Not Outside
**Problem:** Toast appears but no notification in tray

**Solution:**
Check iOS notification settings:
1. Go to iPhone **Settings**
2. Scroll down to **Expo Go**
3. Tap **Notifications**
4. Make sure:
   - ✅ Allow Notifications: ON
   - ✅ Lock Screen: ON
   - ✅ Notification Center: ON
   - ✅ Banners: ON
   - ✅ Sounds: ON
   - ✅ Badges: ON

### Issue 3: Notifications Not Making Sound
**Problem:** Notification appears silently

**Check:**
1. ✅ iPhone is not in Silent Mode (check switch on left side)
2. ✅ Volume is turned up
3. ✅ Focus modes are off (Control Center)
4. ✅ Do Not Disturb is off

### Issue 4: No Push Token Generated
**Problem:** Console shows no push token

**Check Console For:**
```bash
✅ Push Token: ExponentPushToken[xxxxxx]  # ✅ Good
```

If you see:
```bash
Push notifications only work on physical devices  # ❌ Using simulator
```

**Solution:** You MUST use a physical iPhone, not a simulator

### Issue 5: Permission Denied
**Problem:** Permission status shows "denied"

**Solution:**
1. Go to iPhone **Settings** > **Expo Go** > **Notifications**
2. Turn ON "Allow Notifications"
3. Close app completely (swipe up in app switcher)
4. Reopen app in Expo Go

## 🎯 Step-by-Step Testing

### Complete Test Flow:

```bash
# 1. Check Permission (in console)
✅ Push Token: ExponentPushToken[xxxxx]
Permission status: granted

# 2. Start Transaction
Navigate to Send Money → Enter details

# 3. Complete Transaction
Confirm payment → See success screen

# 4. Watch Console
📢 Sending sent transaction notification...
📲 Scheduling notification...
✅ Notification scheduled with ID: ...

# 5. Minimize App (HOME BUTTON)
Press home button within 2 seconds

# 6. Wait 3 Seconds
Count: 1... 2... 3...

# 7. Check Notification Tray
Swipe down from top
You should see: "💸 Money Sent"
```

## 🔧 Quick Debug Test

Add this to your HomeScreen to test notifications manually:

```typescript
import { usePushNotifications } from '../hooks/usePushNotifications';

// Inside HomeScreen component
const { sendTestNotification, permissionStatus } = usePushNotifications();

// Add this button temporarily
<TouchableOpacity 
  onPress={() => {
    console.log('🧪 Testing notification, permission:', permissionStatus);
    sendTestNotification();
    console.log('🧪 Test notification sent, check tray in 2 seconds');
  }}
  style={{
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
  }}
>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>
    🔔 Test Push
  </Text>
</TouchableOpacity>
```

Then:
1. Tap the button
2. **Immediately minimize the app**
3. Wait 2 seconds
4. Check notification tray

## 📊 Verification Checklist

Before saying it's not working, verify:

- [ ] Using physical iPhone (not simulator)
- [ ] Expo Go app is installed
- [ ] App is running in Expo Go
- [ ] Console shows push token
- [ ] Console shows "Permission status: granted"
- [ ] iOS Settings > Expo Go > Notifications: ON
- [ ] iPhone is not in Silent Mode
- [ ] Focus modes / Do Not Disturb are OFF
- [ ] Actually minimized the app (pressed home button)
- [ ] Waited at least 3 seconds
- [ ] Checked notification center (swipe down from top)

## 🎬 Video Test Scenario

Perfect test to verify:

1. **Setup**: Open terminal, see console logs
2. **Action**: Complete a money transfer
3. **Watch Toast**: Green "Money Sent" toast appears
4. **Quick!** Press home button (minimize app)
5. **Count**: 1... 2... 3...
6. **Check**: Swipe down from top of iPhone
7. **See**: Notification should be there!

## 💡 Pro Tips

1. **Always minimize after transaction** - Don't keep app open
2. **Watch the console** - Logs tell you everything
3. **Test with simple transactions** - ₦100 airtime is perfect
4. **Check settings first** - Most issues are permission-related
5. **Restart if stuck** - Close terminal, restart Expo, reopen app

## 🆘 Still Not Working?

If after all this, notifications still don't appear outside the app:

1. **Share console output** - Copy/paste what you see
2. **Check iOS version** - iOS 14+ required
3. **Try test button** - Use the debug test button above
4. **Reinstall Expo Go** - Nuclear option but works

## ✅ Success Looks Like

When working correctly:

```
You complete transaction
    ↓
Green toast appears (in-app)
    ↓
You press home button
    ↓
2 seconds pass...
    ↓
🔔 Notification appears in tray
    ↓
You tap notification
    ↓
App opens to History tab
```

---

**The fix has been applied! Try completing a transaction and immediately minimizing the app to see the notification in your notification tray.**
