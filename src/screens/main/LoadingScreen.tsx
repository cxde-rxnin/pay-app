import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import colors from '../../theme/colors';
import { useNavigation, useRoute } from '@react-navigation/native';

const LoadingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { network, contact, amount } = route.params || {};

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
      (navigation as any).replace('Payment', { network, contact, amount });
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigation, network, contact, amount, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
      <Text style={styles.text}>Processing Transaction...</Text>
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
  },
});

export default LoadingScreen;
