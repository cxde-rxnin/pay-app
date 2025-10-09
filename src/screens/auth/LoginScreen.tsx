import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  Login: undefined;
  App: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
};

const field = { backgroundColor: '#F4F6FA', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14 } as const;

const LoginScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [errors, setErrors] = useState({ email: '', pin: '' });
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePinChange = (text: string) => {
    setPin(text);
    if (errors.pin) {
      setErrors(prev => ({ ...prev, pin: '' }));
    }
  };

  const handleLogin = () => {
    const newErrors = { email: '', pin: '' };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!pin.trim()) {
      newErrors.pin = 'PIN is required';
    } else if (pin.length !== 6) {
      newErrors.pin = 'PIN must be 6 digits';
    } else if (!/^\d{6}$/.test(pin)) {
      newErrors.pin = 'PIN must contain only numbers';
    }

    if (newErrors.email || newErrors.pin) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Add actual login logic here
      navigation.navigate('App');
    }, 1500);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.screen, { backgroundColor: '#fff', flex: 1 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { fontSize: 44, marginTop: 30, paddingHorizontal: 5, fontFamily: fontConfig.heading }]}>Welcome back ⚡</Text>
          <Text style={[styles.subheading, { marginTop: 20, paddingHorizontal: 5 }]}>Sign in to continue</Text>
          <Text style={{ marginTop: 20, color: colors.primary }}>Email</Text>
          <TextInput
            style={[
              styles.body,
              field,
              { marginTop: 8, borderColor: errors.email ? (colors.error || '#e74c3c') : colors.accent, borderWidth: 1 },
              isFocused && { borderColor: errors.email ? (colors.error || '#e74c3c') : colors.primary, borderWidth: 2 }
            ]}
            placeholder="you@example.com"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {errors.email && (
            <Text style={{ color: colors.error || '#e74c3c', fontSize: 14, marginTop: 4 }}>
              {errors.email}
            </Text>
          )}
          <Text style={{ marginTop: 20, color: colors.primary }}>Login PIN</Text>
          <TextInput
            style={[
              styles.body, 
              field, 
              { 
                marginTop: 8, 
                letterSpacing: 6, 
                borderColor: errors.pin ? (colors.error || '#e74c3c') : colors.accent, 
                borderWidth: 1 
              }
            ]}
            placeholder="* * * * * *"
            value={pin}
            onChangeText={handlePinChange}
            keyboardType="number-pad"
            maxLength={6}
            secureTextEntry
          />
          {errors.pin && (
            <Text style={{ color: colors.error || '#e74c3c', fontSize: 14, marginTop: 4 }}>
              {errors.pin}
            </Text>
          )}
        </View>
        <View style={{ width: '100%', marginBottom: 30 }}>
          <Button 
            title={isLoading ? "Logging in..." : "Login"} 
            onPress={handleLogin} 
            style={{ width: '100%' }} 
            disabled={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
