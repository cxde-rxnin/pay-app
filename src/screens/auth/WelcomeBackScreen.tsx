import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Image,
  Dimensions 
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useBiometricAuth } from '../../hooks/useBiometricAuth';
import { BiometricContext } from '../../services/biometricAuthService';
import Keypad from '../../components/Keypad';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { FingerScan } from 'iconsax-react-nativejs';

const { height } = Dimensions.get('window');

type AuthStackParamList = {
  WelcomeBack: undefined;
  Login: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'WelcomeBack'>;
};

const WelcomeBackScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPinHint, setShowPinHint] = useState(false);

  // Biometric authentication
  const {
    isEnabledForLogin,
    isAvailable: biometricAvailable,
    authenticate,
    biometricNames
  } = useBiometricAuth();

  // Try biometric authentication on mount if enabled
  useEffect(() => {
    if (isEnabledForLogin && biometricAvailable) {
      // Small delay to ensure UI is ready
      setTimeout(() => {
        handleBiometricAuth();
      }, 1000);
    }
  }, [isEnabledForLogin, biometricAvailable]);

  const handleKeyPress = (digit: string) => {
    if (pin.length < 6) {
      setPin(pin + digit);
    }
    
    // Auto-submit when 6 digits are entered
    if (pin.length === 5) {
      const fullPin = pin + digit;
      setTimeout(() => handlePinSubmit(fullPin), 100);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handlePinSubmit = async (pinToSubmit: string = pin) => {
    if (pinToSubmit.length !== 6) return;

    setLoading(true);
    
    try {
      // Simulate pin verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes - in real app, verify against stored hash
      const isValidPin = pinToSubmit !== '000000'; // 000000 fails for demo
      const isCorrectDuressPin = pinToSubmit === '123456'; // Example duress pin
      
      if (isValidPin) {
        if (isCorrectDuressPin) {
          // Handle duress mode login - silently activate safe mode
          (navigation as any).replace('App');
        } else {
          // Normal login - navigate to main app
          (navigation as any).replace('App');
        }
      } else {
        setPin('');
        Alert.alert(
          'Incorrect PIN',
          'Please try again or use biometric authentication.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    setLoading(true);
    
    try {
      const result = await authenticate(
        BiometricContext.LOGIN,
        'Sign in to your account'
      );
      
      if (result.success) {
        // Show loading for 3-5 seconds before navigating
        await new Promise(resolve => setTimeout(resolve, 3500));
        (navigation as any).replace('App');
      } else {
        // Don't show error for user cancellation
        if (result.error && !result.error.includes('cancelled')) {
          Alert.alert(
            'Authentication Failed',
            result.error,
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBiometricIcon = () => {
    if (biometricNames.includes('Face ID')) {
      return '👤';
    } else if (biometricNames.includes('Fingerprint')) {
      return '👆';
    }
    return '🔐';
  };

  return (
    <View style={styles.container}>
      {/* Header with logo/branding */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.welcomeTitle}>Welcome back!</Text>
        <Text style={styles.welcomeSubtitle}>
          Enter your PIN to access your account
        </Text>
      </View>

      {/* PIN Display */}
      <View style={styles.pinContainer}>
        <View style={styles.pinRow}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <View key={i} style={styles.pinDot}>
              <Text style={styles.pinText}>{pin[i] ? '●' : ''}</Text>
            </View>
          ))}
        </View>
        
        {loading && (
          <Text style={styles.loadingText}>Verifying...</Text>
        )}
      </View>

      {/* Keypad */}
      <View style={styles.keypadContainer}>
        <Keypad
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onBiometric={isEnabledForLogin ? handleBiometricAuth : undefined}
          showBiometric={isEnabledForLogin && biometricAvailable}
        />
      </View>

      {/* Footer Options */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => setShowPinHint(!showPinHint)}
          activeOpacity={0.7}
        >
          <Text style={styles.footerButtonText}>Forgot PIN?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.footerButtonText}>Use different account</Text>
        </TouchableOpacity>
      </View>

      {showPinHint && (
        <View style={styles.pinHint}>
          <Text style={styles.pinHintText}>
            Contact support to reset your PIN or use biometric authentication if enabled.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    fontFamily: fontConfig.heading,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    fontFamily: fontConfig.body,
  },
  pinContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  pinText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
    marginTop: -2.1,
    marginLeft: 0.3,
  },
  loadingText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fontConfig.body,
    marginTop: 8,
  },
  keypadContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 120,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 30,
    paddingTop: 12,
  },
  footerButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  footerButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fontConfig.body,
    fontWeight: '500',
  },
  pinHint: {
    position: 'absolute',
    bottom: 120,
    left: 24,
    right: 24,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray + '30',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pinHintText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: fontConfig.body,
    textAlign: 'center',
  },
});

export default WelcomeBackScreen;
