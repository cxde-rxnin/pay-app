import React, { useState, useRef } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { StackNavigationProp } from '@react-navigation/stack';
import apiService from '../../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackParamList } from '../../navigation/AuthStack';

type ScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'OTP'>;
  route: { params: { userId: string; email: string } };
};

const OTPScreen: React.FC<ScreenProps> = ({ navigation, route }) => {
  const { userId, email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const inputs = Array.from({ length: 6 }, () => useRef(null));

  const handleChange = (text: string, idx: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[idx] = text;
      setOtp(newOtp);
      
      // Clear error when user starts typing
      if (error) {
        setError('');
      }
      
      if (text && idx < 5) {
        // @ts-ignore
        inputs[idx + 1].current.focus();
      }
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      // @ts-ignore
      inputs[idx - 1].current.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    
    if (!/^\d{6}$/.test(otpString)) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await apiService.verifyOTP({
        userId,
        otp: otpString
      });
      
      if (result.success) {
        // Store the token and user data
        if (result.data?.token) {
          await AsyncStorage.setItem('@auth_token', result.data.token);
        }
        if (result.data?.user) {
          console.log('OTPScreen: user object after OTP:', result.data.user);
          await AsyncStorage.setItem('@user_data', JSON.stringify(result.data.user));
        }
        
        // Check if user has completed their profile (has usertag)
        const hasCompletedProfile = result.data?.user?.usertag;
        
        if (!hasCompletedProfile) {
          // OTP verified, now navigate to BVN verification
          Alert.alert(
            'Email Verified!',
            'Your email has been verified. Please continue to BVN verification.',
            [
              {
                text: 'Continue',
                onPress: () => navigation.navigate('BVNVerification')
              }
            ]
          );
        } else {
          // Profile already complete, create virtual account
          console.log('📱 Profile complete, creating virtual account...');
          try {
            const accountResult = await apiService.createVirtualAccount();
            if (accountResult.success) {
              Alert.alert(
                'Account Created Successfully!',
                `Your virtual account has been created.\nAccount Number: ${accountResult.data?.accountNumber}\nBank: ${accountResult.data?.bankName}`,
                [
                  {
                    text: 'Continue',
                    onPress: () => navigation.navigate('BVNVerification')
                  }
                ]
              );
            } else {
              console.error('Virtual account creation failed:', accountResult.error);
              Alert.alert(
                'Verification Successful',
                'Your account has been verified, but there was an issue creating your virtual account. Please try again later.',
                [
                  {
                    text: 'Continue',
                    onPress: () => navigation.navigate('BVNVerification')
                  }
                ]
              );
            }
          } catch (accountError) {
            console.error('Virtual account creation error:', accountError);
            Alert.alert(
              'Verification Successful',
              'Your account has been verified, but there was an issue creating your virtual account. You can try again later.',
              [
                {
                  text: 'Continue',
                  onPress: () => navigation.navigate('BVNVerification')
                }
              ]
            );
          }
        }
      } else {
        setError(result.error || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Unable to verify OTP. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.screen, { backgroundColor: '#fff', flex: 1 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { fontSize: 44, marginTop: 30, paddingHorizontal: 5, fontFamily: fontConfig.heading }]}>Verify your email</Text>
          <Text style={[styles.subheading, { marginTop: 20, paddingHorizontal: 5 }]}>Enter the 6‑digit code we sent to {email}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 20 }}>
            {otp.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={inputs[idx]}
                style={{
                  width: 40,
                  height: 50,
                  marginHorizontal: 6,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: error ? (colors.error || '#e74c3c') : colors.accent,
                  backgroundColor: '#F4F6FA',
                  textAlign: 'center',
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={text => handleChange(text, idx)}
                onKeyPress={e => handleKeyPress(e, idx)}
                autoFocus={idx === 0}
              />
            ))}
          </View>
          {error && (
            <Text style={{ color: colors.error || '#e74c3c', fontSize: 14, marginTop: 8, textAlign: 'left' }}>
              {error}
            </Text>
          )}
          <Text style={[styles.subheading, { marginTop: 8 }]}>Didn’t get a code? Resend in 30s</Text>
        </View>
        <View style={{ width: '100%', marginBottom: 30 }}>
          <Button 
            title={isLoading ? "Verifying..." : "Verify"} 
            onPress={handleVerify} 
            style={{ width: '100%' }} 
            disabled={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default OTPScreen;
