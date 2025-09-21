import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  Signup: undefined;
  OTP: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Signup'>;
};

const field = { backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14 } as const;

const SignupScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.screen, { flex: 1 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { fontSize: 44, marginTop: 30, paddingHorizontal: 5 }]}>Create your account</Text>
          <Text style={[styles.subheading, {marginTop: 20, paddingHorizontal: 5 }]}>We’ll send a one-time code to verify you</Text>
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
        </View>
        <View style={{ width: '100%', marginBottom: 30 }}>
          <Button title="Continue" onPress={() => navigation.navigate('OTP')} style={{ width: '100%' }} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignupScreen;
