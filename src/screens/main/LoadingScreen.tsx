import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import colors from '../../theme/colors';
import { useNavigation, useRoute } from '@react-navigation/native';

const LoadingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore - Extract all possible route parameters
  const { type, network, contact, amount, bundle, price, usertag, accountNumber, accountName } = route.params || {};

  const spinAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      // Pass the correct parameters based on transaction type
      if (type === 'Data') {
        (navigation as any).replace('Payment', { 
          type,
          network, 
          contact, 
          bundle, 
          price 
        });
      } else if (type === 'internal') {
        // For internal transfers (usertag or account number)
        (navigation as any).replace('Payment', { 
          type,
          usertag,
          accountNumber,
          accountName, 
          amount 
        });
      } else {
        // For airtime or other transactions
        (navigation as any).replace('Payment', { 
          type,
          network, 
          contact, 
          amount 
        });
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigation, type, network, contact, amount, bundle, price, usertag, accountNumber, accountName, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Display appropriate message based on transaction type
  const getLoadingMessage = () => {
    if (type === 'Data') {
      return `Purchasing ${bundle || 'data bundle'} for ${contact}...`;
    } else if (type === 'Airtime') {
      return `Sending ${amount || 'airtime'} to ${contact}...`;
    } else if (type === 'internal') {
      // Internal transfer - check if it's usertag or account number based
      if (usertag) {
        return `Sending ${amount} to ${usertag}...`;
      } else if (accountName) {
        return `Sending ${amount} to ${accountName}...`;
      } else {
        return `Processing internal transfer of ${amount}...`;
      }
    }
    return 'Processing Transaction...';
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 5,
        borderColor: colors.primary,
        borderTopColor: '#eee',
        borderRightColor: '#eee',
        borderBottomColor: colors.primary,
        borderLeftColor: colors.primary,
        transform: [{ rotate: spin }],
      }} />
      <Text style={styles.text}>{getLoadingMessage()}</Text>
      <Text style={styles.subText}>
        {type === 'Data' ? `${network} • ${price}` : 
         type === 'internal' ? (usertag ? `Usertag Transfer • ${amount}` : `Account Transfer • ${amount}`) :
         `${network} • ${amount}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 24,
    fontSize: 18,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  subText: {
    marginTop: 8,
    fontSize: 16,
    color: colors.gray,
    fontWeight: '500',
  },
});

export default LoadingScreen;