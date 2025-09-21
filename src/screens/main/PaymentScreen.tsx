import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import colors from '../../theme/colors';
import Button from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import Keypad from '../../components/Keypad';

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { network, contact, amount } = route.params || {};

  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) setPin(pin + digit);
  };
  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin.length === 4) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Simulate transaction result
        const isSuccess = pin !== '0000'; // Example: 0000 fails
        (navigation as any).replace('TransactionResult', {
          status: isSuccess ? 'success' : 'error',
          message: isSuccess
            ? `Airtime sent to ${contact}`
            : 'Insufficient balance or invalid PIN.',
        });
      }, 5000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Payment Pin</Text>
      <View style={styles.pinRow}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={styles.pinDot}>
            <Text style={styles.pinText}>{pin[i] ? '●' : ''}</Text>
          </View>
        ))}
      </View>
      <Keypad onKeyPress={handleKeyPress} onDelete={handleDelete} />
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
