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
  const { pushToken, registerForPushNotifications } = usePushNotifications();

  useEffect(() => {
    // Register for push notifications on app start
    registerForPushNotifications();

    // Log the token (in production, send this to your backend)
    if (pushToken) {
      console.log('Push notification token:', pushToken);
      // TODO: Send token to your backend
      // await fetch('https://your-api.com/register-device', {
      //   method: 'POST',
      //   body: JSON.stringify({ token: pushToken, userId: currentUserId })
      // });
    }
  }, [pushToken, registerForPushNotifications]);

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
