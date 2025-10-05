# 🚀 EAS Project Setup - Get Push Notifications Working

## 📋 What You Need to Do

To fix the "No projectId found" error, you need to initialize an EAS project. This is **required** for push notifications in Expo Go.

### Step 1: Install EAS CLI (if not already installed)

```bash
npm install -g eas-cli
```

### Step 2: Login to Expo

```bash
eas login
```

Enter your Expo credentials (or create an account if you don't have one).

### Step 3: Initialize EAS Project

```bash
cd frontend
eas init
```

This will:
1. Create a project on Expo's servers
2. Generate a unique projectId (UUID)
3. Update your `app.json` with the projectId

### Step 4: Restart Everything

```bash
# Stop Metro (Ctrl+C), then:
npx expo start --clear
```

### Step 5: Reload App in Expo Go

1. Close Expo Go completely (swipe up in app switcher)
2. Reopen Expo Go
3. Scan QR code again

### Step 6: Verify Push Token

Watch the console - you should now see:

```bash
✅ Push Token Generated: ExponentPushToken[xxxxxx]
📱 Push Notification Status: {
  "permission": "granted",
  "hasToken": true,
  "token": "ExponentPushToken[xxx]"
}
```

## 🎯 Alternative: Manual projectId Setup

If you don't want to use EAS CLI, you can manually add a projectId:

1. Go to https://expo.dev
2. Sign in
3. Create a new project
4. Copy the projectId
5. Add it to `app.json`:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "paste-your-project-id-here"
      }
    }
  }
}
```

## ✅ After Setup

Once you have the projectId in place:

1. **Restart Metro**: `npx expo start --clear`
2. **Reload Expo Go**: Close and reopen the app
3. **Check console**: Should see push token generated
4. **Test notifications**:
   - Complete a transaction
   - Press HOME button immediately
   - Wait 3 seconds
   - Swipe down - see notification! 🎉

## 🔍 What's Changed

I've created:
- ✅ `eas.json` - EAS configuration file
- ✅ `app.json` - Added `extra.eas.projectId` placeholder

After running `eas init`, the projectId will be automatically filled in.

## 📱 Quick Commands

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Initialize project
cd frontend
eas init

# 4. Restart everything
npx expo start --clear
```

Then reload Expo Go and test!

---

**Run these commands now to get push notifications working!** 🚀
