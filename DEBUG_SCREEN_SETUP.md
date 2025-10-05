# 🐛 Push Notification Debug Screen - Setup Guide

## Problem: Notifications Not Appearing Outside the App

I've created a **debug screen** to help test push notifications and figure out what's wrong.

## 🚀 Quick Setup (2 minutes)

### Option 1: Add to Settings Screen (Temporary Button)

1. Open `src/screens/main/SettingsScreen.tsx` (or HomeScreen)

2. Add this import at the top:
```typescript
import { useNavigation } from '@react-navigation/native';
```

3. Add this button anywhere in the screen (temporarily):
```typescript
<TouchableOpacity
  onPress={() => navigation.navigate('PushDebug' as any)}
  style={{
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 8,
    margin: 16,
  }}
>
  <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
    🔔 Test Push Notifications
  </Text>
</TouchableOpacity>
```

4. Add the screen to your navigator in `src/navigation/RootNavigator.tsx`:
```typescript
import PushNotificationDebugScreen from '../screens/main/PushNotificationDebugScreen';

// Inside RootStack.Navigator, add:
<RootStack.Screen 
  name="PushDebug" 
  component={PushNotificationDebugScreen}
  options={{ headerShown: true, title: 'Push Notification Test' }}
/>
```

## 🧪 How to Use the Debug Screen

1. **Navigate to the debug screen** using the button you added

2. **Check the Status section** - You should see:
   - Permission: `granted` ✅
   - Push Token: `✅ Generated`

3. **Tap "Test Transaction Notification"**

4. **IMPORTANT**: When the alert appears:
   - Tap "OK"
   - **IMMEDIATELY press the HOME button** (minimize the app)
   - Wait 3 seconds
   - **Swipe down** from the top of your iPhone

5. **You should see** the notification in your notification tray!

## 🔍 What the Console Should Show

```bash
🔧 Starting push notification registration...
✅ Running on physical device
🔐 Checking notification permissions...
📋 Existing permission status: granted
✅ Notification permissions granted
🎫 Getting Expo push token...
✅ Push Token Generated: ExponentPushToken[xxxxxx]
📱 Token Type: expo

🧪 Testing transaction notification
📢 Sending sent transaction notification: {...}
📲 Scheduling notification: {...}
✅ Notification scheduled with ID: [id]
✅ Transaction notification scheduled successfully
```

## ❓ Troubleshooting

### If Permission Shows "denied":
1. Go to iPhone **Settings**
2. Scroll to **Expo Go**
3. Tap **Notifications**
4. Turn everything **ON**
5. Close app completely (swipe up in app switcher)
6. Reopen app in Expo Go

### If Push Token Shows "Not generated":
Check console for errors. You should see:
- ✅ "Running on physical device"
- ✅ "Push Token Generated"

If you see "Push notifications only work on physical devices":
- You're using a simulator/emulator
- **MUST use a real iPhone**

### If Notification Doesn't Appear:
1. Did you **minimize the app**? (press home button)
2. Did you **wait 3 seconds**?
3. Did you **swipe down** to check notification center?
4. Is iPhone in **silent mode**? (check switch on left side)
5. Is **Do Not Disturb** on? (check Control Center)

## 🎯 Expected Behavior

**What SHOULD happen:**

1. You tap "Test Transaction Notification"
2. Alert appears → Tap "OK"
3. You press HOME button (minimize app)
4. After 2-3 seconds...
5. **Notification appears at top of screen:**
```
┌─────────────────────────────────────┐
│ Expo Go                        now  │
│ 💸 Money Sent                       │
│ You sent ₦5,000 to @testuser       │
└─────────────────────────────────────┘
```
6. Sound plays (if not in silent mode)
7. Badge appears on Expo Go icon

## 📱 Alternative Quick Test (Without Debug Screen)

If you don't want to add the debug screen, you can test directly from console:

1. Open your app in Expo Go
2. In the Metro/Expo terminal, press `m` to open developer menu on phone
3. Select "Debug Remote JS"
4. In the Chrome console that opens, paste this:

```javascript
import('expo-notifications').then(Notifications => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: '💸 Test Notification',
      body: 'You sent ₦5,000 to @test',
      sound: 'default',
      badge: 1,
    },
    trigger: { seconds: 2, repeats: false }
  }).then(() => console.log('✅ Scheduled!'));
});
```

Then **immediately minimize the app** and wait!

## 🎬 Video Walkthrough (What You Should Do)

```
1. Open debug screen
      ↓
2. See Status (should be ✅ granted)
      ↓
3. Tap "Test Transaction Notification"
      ↓
4. See alert "Notification Scheduled"
      ↓
5. Tap "OK"
      ↓
6. IMMEDIATELY press HOME button
      ↓
7. Wait: 1... 2... 3...
      ↓
8. Look at top of iPhone screen
      ↓
9. See notification appear! 🎉
```

## ✅ Success Criteria

Notifications are working if:
- ✅ Permission status shows "granted"
- ✅ Push token is generated
- ✅ Console shows "Notification scheduled"
- ✅ Notification appears in tray after minimizing
- ✅ Sound plays (if not silent)
- ✅ Can tap to open app

## 🆘 If Still Not Working

Share these details:
1. Permission status from debug screen
2. Does push token show?
3. Console output (copy/paste)
4. iOS version
5. Are you using **physical iPhone** or simulator?

---

**The debug screen is ready! Add it to your app and test notifications properly.** 🚀
