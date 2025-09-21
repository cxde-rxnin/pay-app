import React, { useState, useRef } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  TransactionPinEntry: undefined;
  TransactionPinConfirm: { pin: string };
};

type ScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'TransactionPinEntry'>;
};

const TransactionPinEntryScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const inputs = Array.from({ length: 4 }, () => useRef(null));

  const handleChange = (text: string, idx: number) => {
    if (/^\d?$/.test(text)) {
      const newPin = [...pin];
      newPin[idx] = text;
      setPin(newPin);
      if (text && idx < 3) {
        // @ts-ignore
        inputs[idx + 1].current.focus();
      }
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[idx] && idx > 0) {
      // @ts-ignore
      inputs[idx - 1].current.focus();
    }
  };

  const pinValue = pin.join('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.screen, { backgroundColor: '#fff', flex: 1 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { fontSize: 44, marginTop: 30, paddingHorizontal: 5 }]}>Set your Transaction PIN</Text>
          <Text style={[styles.subheading, { marginTop: 20, paddingHorizontal: 5 }]}>Enter a 4-digit PIN to authorize payments.</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 32 }}>
            {pin.map((digit, idx) => (
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
        </View>
        <View style={{ width: '100%', marginBottom: 30 }}>
          <Button title="Continue" onPress={() => navigation.navigate('TransactionPinConfirm', { pin: pinValue })} style={{ width: '100%' }} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default TransactionPinEntryScreen;
