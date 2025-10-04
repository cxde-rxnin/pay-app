import React, { useState, useRef } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp as NativeRouteProp } from '@react-navigation/native';

type AuthStackParamList = {
  TransactionPinEntry: undefined;
  TransactionPinConfirm: { pin: string };
  DuressPinEntry: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'TransactionPinConfirm'>;
  route: NativeRouteProp<AuthStackParamList, 'TransactionPinConfirm'>;
};

const TransactionPinConfirmScreen: React.FC<ScreenProps> = ({ navigation, route }) => {
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const inputs = Array.from({ length: 4 }, () => useRef(null));
  const originalPin = route.params.pin;

  const handleChange = (text: string, idx: number) => {
    if (/^\d?$/.test(text)) {
      const newPin = [...confirmPin];
      newPin[idx] = text;
      setConfirmPin(newPin);
      if (text && idx < 3) {
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
  const isMatch = confirmValue.length === 4 && confirmValue === originalPin;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.screen, { backgroundColor: '#fff', flex: 1 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { fontSize: 44, marginTop: 30, paddingHorizontal: 5, fontFamily: fontConfig.heading }]}>Confirm your Transaction PIN</Text>
          <Text style={[styles.subheading, { marginTop: 20, paddingHorizontal: 5 }]}>Re-enter your 4-digit Transaction PIN to confirm.</Text>
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
          {confirmValue.length === 4 && !isMatch && (
            <Text style={{ color: colors.error, marginTop: 16, textAlign: 'center' }}>PINs do not match. Please try again.</Text>
          )}
        </View>
        <View style={{ width: '100%', marginBottom: 30 }}>
          <Button title="Confirm Transaction Pin" onPress={() => navigation.navigate('DuressPinEntry')} style={{ width: '100%' }} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default TransactionPinConfirmScreen;
