import React, { useState, useRef } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  OTP: undefined;
  LoginPin: undefined;
  BVNVerification: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'OTP'>;
};

const OTPScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = Array.from({ length: 6 }, () => useRef(null));

  const handleChange = (text: string, idx: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[idx] = text;
      setOtp(newOtp);
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.screen, { backgroundColor: '#fff', flex: 1 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { fontSize: 44, marginTop: 30, paddingHorizontal: 5 }]}>Verify your email</Text>
          <Text style={[styles.subheading, { marginTop: 20, paddingHorizontal: 5 }]}>Enter the 6‑digit code we sent to your inbox</Text>
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
                  borderColor: colors.accent,
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
          <Text style={[styles.subheading, { marginTop: 8 }]}>Didn’t get a code? Resend in 30s</Text>
        </View>
        <View style={{ width: '100%', marginBottom: 30 }}>
          <Button title="Verify" onPress={() => navigation.navigate('BVNVerification')} style={{ width: '100%' }} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default OTPScreen;
