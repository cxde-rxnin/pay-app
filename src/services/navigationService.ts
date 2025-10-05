import { createNavigationContainerRef } from '@react-navigation/native';

/**
 * Navigation Service for handling deep links and navigation from push notifications
 */

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.navigate(name, params);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function reset(routes: any) {
  if (navigationRef.isReady()) {
    navigationRef.reset(routes);
  }
}

/**
 * Handle notification navigation based on notification data
 */
export function handleNotificationNavigation(data: any) {
  if (!data) return;

  // Handle different notification types
  switch (data.type) {
    case 'transaction':
      // Navigate to transaction history or details
      if (data.transactionId) {
        navigate('TransactionDetails', { transactionId: data.transactionId });
      } else {
        // Navigate to home screen, then to history tab
        navigate('App', { screen: 'History' });
      }
      break;

    case 'security':
      // Navigate to security settings
      navigate('App', { 
        screen: 'Settings',
        params: { screen: 'SecuritySettings' }
      });
      break;

    case 'promotional':
      // Navigate to promotions or home
      if (data.screen) {
        navigate(data.screen, data.params);
      } else {
        navigate('App', { screen: 'Home' });
      }
      break;

    case 'kyc':
    case 'verification':
      // Navigate to account verification
      navigate('AccountVerification');
      break;

    case 'money_received':
      // Navigate to transaction details if available
      if (data.transactionId) {
        navigate('TransactionDetails', { transactionId: data.transactionId });
      } else {
        navigate('App', { screen: 'Home' });
      }
      break;

    default:
      // Default: navigate to notifications screen
      if (data.screen) {
        navigate(data.screen, data.params);
      } else {
        // Navigate to home screen
        navigate('App', { screen: 'Home' });
      }
  }
}
