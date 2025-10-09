import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import Button from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import Keypad from '../../components/Keypad';
import { useBiometricAuth } from '../../hooks/useBiometricAuth';

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { type, network, contact, amount, bundle, price, usertag, accountNumber, accountName, bankName } = route.params || {};

  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Biometric authentication
  const { 
    isEnabledForTransactions, 
    authenticateTransaction, 
    isAvailable, 
    isEnabled,
    enableBiometric 
  } = useBiometricAuth();

  // Debug logging
  React.useEffect(() => {
    console.log('🔐 Biometric Debug in PaymentScreen:', {
      isAvailable,
      isEnabled,
      isEnabledForTransactions,
      showBiometric: isEnabledForTransactions
    });
  }, [isAvailable, isEnabled, isEnabledForTransactions]);

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
      // Clear error when user starts typing
      if (error) setError('');
    }
  };
  
  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleBiometricAuth = async () => {
    try {
      const transactionType = type || 'transaction';
      const transactionAmount = amount || price;
      
      const result = await authenticateTransaction(
        transactionType,
        transactionAmount ? `₦${transactionAmount}` : undefined
      );
      
      if (result.success) {
        // Bypass PIN entry and proceed with transaction
        processTransaction();
      } else {
        Alert.alert(
          'Authentication Failed',
          result.error || 'Biometric authentication failed. Please try again or enter your PIN.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      Alert.alert(
        'Error',
        'An error occurred during biometric authentication. Please enter your PIN.',
        [{ text: 'OK' }]
      );
    }
  };

  const processTransaction = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate transaction result
      const isSuccess = pin === '' ? true : pin !== '0000'; // Biometric auth always succeeds, PIN 0000 fails
      const now = new Date();
      let transactionObj;
        
      if (type === 'Data') {
        // Data transaction
        transactionObj = {
          type: 'Data',
          network,
          contact,
          bundle,
          price,
          amount: price,
          date: now.toISOString().slice(0, 10),
          time: now.toTimeString().slice(0, 5),
          sender: 'Obed Ihekaike',
          receiver: contact,
          phone: contact,
          sessionId: 'DATA' + now.getTime(),
          bankName: network,
          status: isSuccess ? 'success' : 'error',
        };
      } else if (type === 'internal') {
        // Internal transfer (usertag or account)
        const recipient = usertag || accountName || 'Unknown';
        transactionObj = {
          type: 'Internal Transfer',
          amount,
          date: now.toISOString().slice(0, 10),
          time: now.toTimeString().slice(0, 5),
          sender: 'Obed Ihekaike',
          receiver: recipient,
          usertag,
          accountNumber,
          accountName,
          sessionId: 'INT' + now.getTime(),
          bankName: 'Payyy',
          status: isSuccess ? 'success' : 'error',
        };
      } else if (type === 'bank') {
        // Bank transfer
        transactionObj = {
          type: 'Bank Transfer',
          amount,
          fee: '₦10',
          total: `₦${(parseFloat(amount.replace('₦', '').replace(',', '')) + 10).toLocaleString()}`,
          date: now.toISOString().slice(0, 10),
          time: now.toTimeString().slice(0, 5),
          sender: 'Obed Ihekaike',
          receiver: accountName,
          accountNumber,
          accountName,
          bankName,
          sessionId: 'BANK' + now.getTime(),
          status: isSuccess ? 'success' : 'error',
        };
      } else {
        // Airtime transaction
        transactionObj = {
          type: 'Airtime',
          network,
          contact,
          amount,
          date: now.toISOString().slice(0, 10),
          time: now.toTimeString().slice(0, 5),
          sender: 'Obed Ihekaike',
          receiver: contact,
          phone: contact,
          sessionId: 'AIRTIME' + now.getTime(),
          bankName: network,
          status: isSuccess ? 'success' : 'error',
        };
      }

      // Create appropriate success message
      let successMessage = '';
      if (type === 'Data') {
        successMessage = `${bundle} sent to ${contact}`;
      } else if (type === 'internal') {
        const recipient = usertag || accountName || contact;
        successMessage = `${amount} is on its way to ${recipient}`;
      } else if (type === 'bank') {
        successMessage = `${amount} is on its way to ${accountName}`;
      } else {
        successMessage = `${amount} sent to ${contact}`;
      }

      (navigation as any).replace('TransactionResult', {
        status: isSuccess ? 'success' : 'error',
        message: isSuccess
          ? successMessage
          : 'Insufficient balance or invalid PIN.',
        transaction: transactionObj,
      });
    }, 5000);
  };

  const handleSubmit = () => {
    if (pin.length !== 4) {
      setError('Please enter your 4-digit PIN');
      return;
    }
    processTransaction();
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontFamily: fontConfig.heading }]}>Enter Payment Pin</Text>

      <View style={styles.pinRow}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={styles.pinDot}>
            <Text style={styles.pinText}>{pin[i] ? '●' : ''}</Text>
          </View>
        ))}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      <Keypad 
        onKeyPress={handleKeyPress} 
        onDelete={handleDelete} 
        onBiometric={handleBiometricAuth}
        showBiometric={isEnabledForTransactions}
      />
      <View style={styles.buttonRow}>
        <Button
          title="Cancel"
          type="secondary"
          onPress={() => navigation.goBack()}
          style={{ width: '48%' }}
          disabled={loading}
        />
        <Button
          title={loading ? 'Processing...' : 'Submit'}
          onPress={handleSubmit}
          style={{ width: '48%', opacity: pin.length === 4 && !loading ? 1 : 0.5 }}
          disabled={loading || pin.length !== 4}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 28,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 18,
    color: colors.text,
    textAlign: 'center',
  },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F8FA',
  },
  pinText: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '700',
    marginTop: -1.5,
  },
  errorText: {
    color: colors.error || '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 28,
    right: 28,
    bottom: 32,
  },
});

export default PaymentScreen;