import React, { useState, useRef } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type AuthStackParamList = {
  LoginPinEntry: undefined;
  LoginPinConfirm: { pin: string };
  TransactionPinEntry: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'LoginPinConfirm'>;
  route: RouteProp<AuthStackParamList, 'LoginPinConfirm'>;
};

const LoginPinConfirmScreen: React.FC<ScreenProps> = ({ navigation, route }) => {
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const inputs = Array.from({ length: 6 }, () => useRef(null));
  const originalPin = route.params.pin;

  const handleChange = (text: string, idx: number) => {
    if (/^\d?$/.test(text)) {
      const newPin = [...confirmPin];
      newPin[idx] = text;
      setConfirmPin(newPin);
      if (text && idx < 5) {
        // @ts-ignore
        inputs[idx + 1].current.focus();
      }
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !confirmPin[idx] && idx > 0) {
      // @ts-ignore
      inputs[idx - 1].current.focus();
    }
  };

  const confirmValue = confirmPin.join('');
  const isMatch = confirmValue.length === 6 && confirmValue === originalPin;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.screen, { backgroundColor: '#fff', flex: 1 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { fontSize: 44, marginTop: 30, paddingHorizontal: 5, fontFamily: fontConfig.heading }]}>Confirm your Login PIN</Text>
          <Text style={[styles.subheading, { marginTop: 20, paddingHorizontal: 5 }]}>Re-enter your 6-digit Login PIN to confirm.</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 32 }}>
            {confirmPin.map((digit, idx) => (
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
          {confirmValue.length === 6 && !isMatch && (
            <Text style={{ color: colors.error, marginTop: 16, textAlign: 'center' }}>PINs do not match. Please try again.</Text>
          )}
        </View>
        <View style={{ width: '100%', marginBottom: 30 }}>
          <Button title="Confirm Login Pin" onPress={() => navigation.navigate('TransactionPinEntry')} style={{ width: '100%' }} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginPinConfirmScreen;
