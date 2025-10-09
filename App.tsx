import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import { useAppFonts } from './src/theme/fonts';
import { ActivityIndicator, View } from 'react-native';
import { NotificationProvider } from './src/contexts/NotificationContext';
import NotificationContainer from './src/components/NotificationContainer';
import { usePushNotifications } from './src/hooks/usePushNotifications';

function AppContent() {
  const { pushToken, permissionStatus, registerForPushNotifications } = usePushNotifications();

  useEffect(() => {
    // Register for push notifications on app start
    const initializePushNotifications = async () => {
      try {
        await registerForPushNotifications();
      } catch (error) {
        console.log('Push notification initialization failed:', error);
        // App continues to work without push notifications
      }
    };

    initializePushNotifications();
  }, [registerForPushNotifications]);

  useEffect(() => {
    // Log the token when available (in production, send this to your backend)
    if (pushToken) {
      console.log('✅ Push notification token available:', pushToken);
      // TODO: Send token to your backend
      // await fetch('https://your-api.com/register-device', {
      //   method: 'POST',
      //   body: JSON.stringify({ token: pushToken, userId: currentUserId })
      // });
    } else {
      console.log('ℹ️ Push notifications not available - app works normally with local notifications only');
    }

    if (permissionStatus) {
      console.log('📱 Push notification permission status:', permissionStatus);
    }
  }, [pushToken, permissionStatus]);

  return (
    <>
      <RootNavigator />
      <NotificationContainer />
      <StatusBar style="auto" />
    </>
  );
}

export default function App() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </GestureHandlerRootView>
  );
}
