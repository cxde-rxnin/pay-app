import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Share } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../theme/colors';
import Button from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';
import TransactionImage from '../../components/TransactionImage';
import { captureRef } from 'react-native-view-shot';
import { useNotifications } from '../../contexts/NotificationContext';
import PushNotificationService from '../../services/pushNotificationService';

const resultGifs: Record<string, any> = {
  success: require('../../assets/gifs/paid.gif'),
  sent: require('../../assets/gifs/sent.gif'),
  error: require('../../assets/gifs/insufficient.gif'),
};

const TransactionResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { showNotification, addNotification } = useNotifications();
  // @ts-ignore
  const { status, message, transaction } = route.params || {};
  
  // Trigger notifications when transaction completes
  useEffect(() => {
    if (!transaction) return;

    const now = new Date();
    const timestamp = 'Just now';
    const date = 'Today';

    // Extract amount from transaction
    const getAmount = () => {
      if (transaction.price) return transaction.price; // Data bundle
      if (transaction.amount) return transaction.amount;
      return '₦0';
    };

    const amount = getAmount();
    const cleanAmount = parseFloat(amount.replace('₦', '').replace(',', ''));

    // Determine notification details based on transaction type
    let notificationTitle = '';
    let notificationMessage = '';
    let notificationType: 'success' | 'failed' = status === 'success' ? 'success' : 'failed';
    let icon: 'success' | 'failed' | 'sent' = notificationType;

    if (transaction.type === 'Airtime') {
      if (status === 'success') {
        notificationTitle = 'Airtime Purchase Successful';
        notificationMessage = `You purchased ${amount} ${transaction.network} airtime for ${transaction.contact}`;
      } else {
        notificationTitle = 'Airtime Purchase Failed';
        notificationMessage = `Failed to purchase ${amount} ${transaction.network} airtime for ${transaction.contact}`;
      }
      icon = notificationType;
    } else if (transaction.type === 'Data') {
      if (status === 'success') {
        notificationTitle = 'Data Purchase Successful';
        notificationMessage = `You purchased ${transaction.bundle} ${transaction.network} data for ${transaction.contact}`;
      } else {
        notificationTitle = 'Data Purchase Failed';
        notificationMessage = `Failed to purchase ${transaction.bundle} ${transaction.network} data for ${transaction.contact}`;
      }
      icon = notificationType;
    } else if (transaction.type === 'Internal Transfer') {
      if (status === 'success') {
        notificationTitle = 'Money Sent';
        const recipient = transaction.usertag || transaction.accountName || 'recipient';
        notificationMessage = `You sent ${amount} to ${recipient}`;
        icon = 'sent';
      } else {
        notificationTitle = 'Transfer Failed';
        notificationMessage = `Failed to send ${amount}. ${message}`;
        icon = 'failed';
      }
    } else if (transaction.type === 'Bank Transfer') {
      if (status === 'success') {
        notificationTitle = 'Transfer Successful';
        notificationMessage = `Your transfer of ${amount} to ${transaction.accountName} (${transaction.bankName}) was successful`;
        icon = 'sent';
      } else {
        notificationTitle = 'Transfer Failed';
        notificationMessage = `Transfer of ${amount} to ${transaction.accountName} failed. ${message}`;
        icon = 'failed';
      }
    }

    // Show toast notification
    showNotification({
      type: notificationType === 'success' ? 'success' : 'error',
      title: notificationTitle,
      message: notificationMessage,
      duration: 5000,
    });

    // Add to notification center
    addNotification({
      type: 'transaction',
      title: notificationTitle,
      message: notificationMessage,
      timestamp,
      date,
      read: false,
      icon,
      amount: status === 'success' ? `-${amount}` : amount,
    });

    // Send push notification (will be delivered even when app is closed)
    const pushNotificationType = 
      transaction.type === 'Internal Transfer' || transaction.type === 'Bank Transfer'
        ? (status === 'success' ? 'sent' : 'failed')
        : (status === 'success' ? 'success' : 'failed');
    
    console.log('🔔 Sending push notification:', {
      type: pushNotificationType,
      amount: cleanAmount,
      message: notificationMessage
    });

    // Send push notification asynchronously
    const sendPushNotification = async () => {
      try {
        await PushNotificationService.sendTransactionNotification(
          pushNotificationType as 'sent' | 'received' | 'success' | 'failed',
          cleanAmount,
          notificationMessage
        );
      } catch (pushError) {
        console.log('⚠️ Push notification failed (app continues normally):', pushError);
        // Transaction notification still saved locally and in notification center
      }
    };

    sendPushNotification();
  }, [transaction, status, message, showNotification, addNotification]);
  
  // Use sent.gif for internal transfers and bank transfers, paid.gif for other successful transactions
  const getGif = () => {
    if (status === 'success') {
      if (transaction?.type === 'Internal Transfer' || transaction?.type === 'Bank Transfer') {
        return resultGifs.sent;
      }
      return resultGifs.success;
    }
    return resultGifs.error;
  };

  const gif = getGif();

  // transaction info is now passed from the modal flow
  const transactionInfo = transaction || {};

  const transactionImageRef = React.useRef(null);

  const handleShare = async () => {
    try {
      if (transactionImageRef.current) {
        const uri = await captureRef(transactionImageRef.current, {
          format: 'png',
          quality: 0.95,
          width: 600,
          height: 900,
        });
        await Share.share({ url: uri });
      }
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={gif} style={styles.gif} resizeMode="contain" />
      <Text style={[styles.title, status === 'success' ? styles.success : styles.error]}>
        {status === 'success' ? 'Transaction Successful!' : 'Transaction Failed'}
      </Text>
      <Text style={styles.message}>{message}</Text>
      {/* Hidden TransactionImage for sharing - positioned off-screen */}
      <View style={styles.hiddenImageContainer}>
        <View ref={transactionImageRef} collapsable={false}>
          <TransactionImage
            backgroundImage={require('../../assets/receipt.png')}
            transaction={transactionInfo}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <Button
            title={<Ionicons name="download-outline" size={22} color={colors.primary} />}
            type="secondary"
            onPress={handleShare}
            style={styles.shareButton}
          />
          <Button
            title="Back to Home"
            onPress={() => (navigation as any).reset({ index: 0, routes: [{ name: 'App' }] })}
            style={styles.homeButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  gif: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  success: {
    color: colors.success || '#2ecc40',
  },
  error: {
    color: colors.error || '#e74c3c',
  },
  message: {
    fontSize: 16,
    color: colors.text || '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  hiddenImageContainer: {
    position: 'absolute',
    left: -10000, // Move far off-screen
    top: 0,
    // Don't constrain the size - let TransactionImage use its own dimensions
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  shareButton: {
    width: '20%',
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: colors.primary || '#1877F2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButton: {
    width: '75%',
  },
});

export default TransactionResultScreen;