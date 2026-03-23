import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { StackNavigationProp } from '@react-navigation/stack';
import apiService from '../../services/apiService';
import { AuthStackParamList } from '../../navigation/AuthStack';

type ScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Signup'>;
};

const field = { backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14 } as const;

const SignupScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = async () => {
    setError('');
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // Call backend to check email availability
      const result = await apiService.checkEmailAvailability({
        email: email.trim()
      });

      if (result.success) {
        // Email is available, user created, and OTP sent
        navigation.navigate('OTP', { 
          userId: result.data?.userId || '',
          email: email.trim()
        });
      } else {
        setError(result.error || 'This email is already registered. Please use a different email or try logging in.');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setError('Unable to verify email. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.screen, { flex: 1 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { fontSize: 44, marginTop: 30, paddingHorizontal: 5, fontFamily: fontConfig.heading }]}>
            Create your account
          </Text>
          <Text style={[styles.subheading, { marginTop: 20, paddingHorizontal: 5 }]}>
            We'll send a one-time code to verify you
          </Text>
          <Text style={{ marginTop: 20, color: colors.primary }}>Email</Text>
          <TextInput
            style={[
              styles.body,
              field,
              { marginTop: 8, borderColor: colors.accent, borderWidth: 1, backgroundColor: '#F4F6FA' },
              isFocused && { borderColor: colors.primary, borderWidth: 2 }
            ]}
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {error && (
            <Text style={{ color: colors.error || '#e74c3c', fontSize: 14, marginTop: 8 }}>
              {error}
            </Text>
          )}
        </View>
        <View style={{ width: '100%', marginBottom: 30 }}>
          <Button
            title={isLoading ? 'Sending Email' : 'Continue'}
            onPress={handleContinue}
            style={{ width: '100%' }}
            disabled={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignupScreen;