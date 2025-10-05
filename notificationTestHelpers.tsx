/**
 * Test Helpers for Transaction Notifications
 * 
 * Use these helpers in development to test notification flows
 */

import { useNotifications } from './src/contexts/NotificationContext';
import NotificationService from './src/services/notificationService';

/**
 * Simulate receiving money from another user
 * Use this in HomeScreen or any component for testing
 */
export const useTestNotifications = () => {
  const { showNotification, addNotification } = useNotifications();

  const simulateMoneyReceived = (amount: number, sender: string) => {
    const formattedAmount = `₦${amount.toLocaleString()}`;

    // Show toast
    showNotification({
      type: 'transaction',
      title: 'Money Received',
      message: `You received ${formattedAmount} from ${sender}`,
      duration: 5000,
    });

    // Add to notification center
    addNotification({
      type: 'transaction',
      title: 'Money Received',
      message: `You received ${formattedAmount} from ${sender}`,
      timestamp: 'Just now',
      date: 'Today',
      read: false,
      icon: 'received',
      amount: `+${formattedAmount}`,
    });

    // Trigger service
    NotificationService.notifyTransaction({
      type: 'received',
      amount,
      sender,
    });
  };

  const simulateAirtimePurchase = (amount: number, network: string, phone: string) => {
    const formattedAmount = `₦${amount.toLocaleString()}`;

    showNotification({
      type: 'success',
      title: 'Airtime Purchase Successful',
      message: `You purchased ${formattedAmount} ${network} airtime for ${phone}`,
    });

    addNotification({
      type: 'transaction',
      title: 'Airtime Purchase Successful',
      message: `You purchased ${formattedAmount} ${network} airtime for ${phone}`,
      timestamp: 'Just now',
      date: 'Today',
      read: false,
      icon: 'success',
      amount: `-${formattedAmount}`,
    });
  };

  const simulateDataPurchase = (bundle: string, price: number, network: string, phone: string) => {
    const formattedPrice = `₦${price.toLocaleString()}`;

    showNotification({
      type: 'success',
      title: 'Data Purchase Successful',
      message: `You purchased ${bundle} ${network} data for ${phone}`,
    });

    addNotification({
      type: 'transaction',
      title: 'Data Purchase Successful',
      message: `You purchased ${bundle} ${network} data for ${phone}`,
      timestamp: 'Just now',
      date: 'Today',
      read: false,
      icon: 'success',
      amount: `-${formattedPrice}`,
    });
  };

  const simulateInternalTransfer = (amount: number, recipient: string) => {
    const formattedAmount = `₦${amount.toLocaleString()}`;

    showNotification({
      type: 'success',
      title: 'Money Sent',
      message: `You sent ${formattedAmount} to ${recipient}`,
    });

    addNotification({
      type: 'transaction',
      title: 'Money Sent',
      message: `You sent ${formattedAmount} to ${recipient}`,
      timestamp: 'Just now',
      date: 'Today',
      read: false,
      icon: 'sent',
      amount: `-${formattedAmount}`,
    });
  };

  const simulateBankTransfer = (amount: number, accountName: string, bankName: string) => {
    const formattedAmount = `₦${amount.toLocaleString()}`;

    showNotification({
      type: 'success',
      title: 'Transfer Successful',
      message: `Your transfer of ${formattedAmount} to ${accountName} (${bankName}) was successful`,
    });

    addNotification({
      type: 'transaction',
      title: 'Transfer Successful',
      message: `Your transfer of ${formattedAmount} to ${accountName} (${bankName}) was successful`,
      timestamp: 'Just now',
      date: 'Today',
      read: false,
      icon: 'sent',
      amount: `-${formattedAmount}`,
    });
  };

  const simulateTransactionFailure = (type: string, reason: string) => {
    showNotification({
      type: 'error',
      title: `${type} Failed`,
      message: reason,
    });

    addNotification({
      type: 'transaction',
      title: `${type} Failed`,
      message: reason,
      timestamp: 'Just now',
      date: 'Today',
      read: false,
      icon: 'failed',
    });
  };

  const simulateSecurityAlert = (message: string) => {
    NotificationService.notifySecurity({
      type: 'alert',
      description: message,
    });

    showNotification({
      type: 'warning',
      title: 'Security Alert',
      message,
    });

    addNotification({
      type: 'security',
      title: 'Security Alert',
      message,
      timestamp: 'Just now',
      date: 'Today',
      read: false,
      icon: 'security',
      actionable: true,
    });
  };

  const simulatePromotion = (title: string, message: string) => {
    NotificationService.notifyPromotion({ title, message });

    showNotification({
      type: 'info',
      title,
      message,
    });

    addNotification({
      type: 'promotional',
      title,
      message,
      timestamp: 'Just now',
      date: 'Today',
      read: false,
      icon: 'gift',
    });
  };

  const simulateVerificationReminder = () => {
    NotificationService.notifySystem({
      type: 'verification',
      message: 'Complete your Tier 2 verification to unlock ₦200,000 daily limit',
    });

    showNotification({
      type: 'warning',
      title: 'Account Verification',
      message: 'Complete your Tier 2 verification to unlock ₦200,000 daily limit',
      action: {
        label: 'Verify Now',
        onPress: () => console.log('Navigate to verification'),
      },
    });

    addNotification({
      type: 'system',
      title: 'Account Verification',
      message: 'Complete your Tier 2 verification to unlock ₦200,000 daily limit',
      timestamp: 'Just now',
      date: 'Today',
      read: false,
      icon: 'document',
      actionable: true,
    });
  };

  const runFullNotificationTest = () => {
    // Test all notification types in sequence
    setTimeout(() => simulateMoneyReceived(15000, '@chukwudi'), 500);
    setTimeout(() => simulateAirtimePurchase(500, 'MTN', '08012345678'), 2000);
    setTimeout(() => simulateDataPurchase('2GB', 600, 'MTN', '08012345678'), 3500);
    setTimeout(() => simulateInternalTransfer(5000, '@johndoe'), 5000);
    setTimeout(() => simulateBankTransfer(25000, 'Jane Doe', 'GTBank'), 6500);
    setTimeout(() => simulateTransactionFailure('Transfer', 'Insufficient funds'), 8000);
    setTimeout(() => simulateSecurityAlert('New login detected from unknown device'), 9500);
    setTimeout(() => simulatePromotion('🎉 Weekend Special!', 'Get 5% cashback on all transactions'), 11000);
    setTimeout(() => simulateVerificationReminder(), 12500);

    console.log('Running full notification test sequence...');
  };

  return {
    simulateMoneyReceived,
    simulateAirtimePurchase,
    simulateDataPurchase,
    simulateInternalTransfer,
    simulateBankTransfer,
    simulateTransactionFailure,
    simulateSecurityAlert,
    simulatePromotion,
    simulateVerificationReminder,
    runFullNotificationTest,
  };
};

/**
 * Example usage in HomeScreen.tsx:
 * 
 * import { useTestNotifications } from '../../test-helpers/notificationTestHelpers';
 * 
 * const HomeScreen = () => {
 *   const testHelpers = useTestNotifications();
 * 
 *   // Add test buttons (remove in production)
 *   return (
 *     <View>
 *       <Button 
 *         title="Test: Money Received" 
 *         onPress={() => testHelpers.simulateMoneyReceived(15000, '@johndoe')} 
 *       />
 *       <Button 
 *         title="Test: All Notifications" 
 *         onPress={() => testHelpers.runFullNotificationTest()} 
 *       />
 *     </View>
 *   );
 * };
 */

/**
 * Quick test scenarios
 */
export const TEST_SCENARIOS = {
  // Money received
  moneyReceived: {
    amount: 15000,
    sender: '@chukwudi',
    description: 'Simulate receiving money from another user',
  },

  // Airtime purchase
  airtimePurchase: {
    amount: 500,
    network: 'MTN',
    phone: '08012345678',
    description: 'Simulate successful airtime purchase',
  },

  // Data purchase
  dataPurchase: {
    bundle: '2GB',
    price: 600,
    network: 'MTN',
    phone: '08012345678',
    description: 'Simulate successful data bundle purchase',
  },

  // Internal transfer
  internalTransfer: {
    amount: 5000,
    recipient: '@johndoe',
    description: 'Simulate sending money to another Lemo user',
  },

  // Bank transfer
  bankTransfer: {
    amount: 25000,
    accountName: 'Jane Doe',
    bankName: 'GTBank',
    description: 'Simulate bank transfer',
  },

  // Failed transaction
  transactionFailure: {
    type: 'Transfer',
    reason: 'Insufficient funds in your account',
    description: 'Simulate failed transaction',
  },

  // Security alert
  securityAlert: {
    message: 'New login detected from Windows device in Lagos, Nigeria',
    description: 'Simulate security notification',
  },

  // Promotion
  promotion: {
    title: '🎉 Weekend Special!',
    message: 'Get 5% cashback on all transactions this weekend',
    description: 'Simulate promotional notification',
  },

  // Verification reminder
  verification: {
    message: 'Complete your Tier 2 verification to unlock ₦200,000 daily limit',
    description: 'Simulate verification reminder',
  },
};

/**
 * Bulk test data generator
 */
export const generateTestNotifications = (count: number) => {
  const notifications = [];
  const types = ['received', 'sent', 'airtime', 'data', 'bank'];
  const senders = ['@john', '@jane', '@mike', '@sarah', '@alex'];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = Math.floor(Math.random() * 50000) + 500;
    const sender = senders[Math.floor(Math.random() * senders.length)];
    
    notifications.push({
      type: 'transaction',
      title: type === 'received' ? 'Money Received' : 'Money Sent',
      message: `${type === 'received' ? 'You received' : 'You sent'} ₦${amount.toLocaleString()} ${type === 'received' ? 'from' : 'to'} ${sender}`,
      timestamp: `${Math.floor(Math.random() * 60)} min ago`,
      date: 'Today',
      read: Math.random() > 0.5,
      icon: type === 'received' ? 'received' : 'sent',
      amount: `${type === 'received' ? '+' : '-'}₦${amount.toLocaleString()}`,
    });
  }
  
  return notifications;
};
