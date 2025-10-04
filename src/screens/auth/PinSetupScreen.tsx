import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  PinSetup: undefined;
  UserTag: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'PinSetup'>;
};

const field = { backgroundColor: '#F4F6FA', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14 } as const;

const PinSetupScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [loginPin, setLoginPin] = useState('');
  const [txnPin, setTxnPin] = useState('');
  const [duressPin, setDuressPin] = useState('');
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.screen, { backgroundColor: '#fff', flex: 1 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { fontSize: 44, marginTop: 30, paddingHorizontal: 5, fontFamily: fontConfig.heading }]}>Set up your PINs</Text>
          <Text style={[styles.subheading, { marginTop: 20, paddingHorizontal: 5 }]}>Use different codes to keep your account secure</Text>
          <Text style={{ marginTop: 20, color: colors.primary }}>Login PIN (6)</Text>
          <TextInput style={[styles.body, field, { marginTop: 8, letterSpacing: 6, borderColor: colors.accent, borderWidth: 1 }]} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022" value={loginPin} onChangeText={setLoginPin} keyboardType="number-pad" maxLength={6} secureTextEntry />

          <Text style={{ marginTop: 20, color: colors.primary }}>Transaction PIN (4)</Text>
          <TextInput style={[styles.body, field, { marginTop: 8, letterSpacing: 4, borderColor: colors.accent, borderWidth: 1 }]} placeholder="\u2022\u2022\u2022\u2022" value={txnPin} onChangeText={setTxnPin} keyboardType="number-pad" maxLength={4} secureTextEntry />

          <Text style={{ marginTop: 20, color: colors.primary }}>Duress PIN (6)</Text>
          <TextInput style={[styles.body, field, { marginTop: 8, letterSpacing: 6, borderColor: colors.accent, borderWidth: 1 }]} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022" value={duressPin} onChangeText={setDuressPin} keyboardType="number-pad" maxLength={6} secureTextEntry />
        </View>
        <View style={{ width: '100%', paddingHorizontal: 20, marginBottom: 30 }}>
          <Button title="Continue" onPress={() => navigation.navigate('UserTag')} style={{ width: '100%' }} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default PinSetupScreen;
