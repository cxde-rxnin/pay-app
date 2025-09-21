import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import colors from '../../theme/colors';
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
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.screen, { backgroundColor: '#fff', flex: 1 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { fontSize: 44, marginTop: 30, paddingHorizontal: 5 }]}>Welcome back ⚡</Text>
          <Text style={[styles.subheading, { marginTop: 20, paddingHorizontal: 5 }]}>Sign in to continue</Text>
          <Text style={{ marginTop: 20, color: colors.primary }}>Email</Text>
          <TextInput
            style={[
              styles.body,
              field,
              { marginTop: 8, borderColor: colors.accent, borderWidth: 1 },
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
          <Text style={{ marginTop: 20, color: colors.primary }}>Login PIN</Text>
          <TextInput
            style={[styles.body, field, { marginTop: 8, letterSpacing: 6, borderColor: colors.accent, borderWidth: 1 }]}
            placeholder="* * * * * *"
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            maxLength={6}
            secureTextEntry
          />
        </View>
        <View style={{ width: '100%', marginBottom: 30 }}>
          <Button title="Login" onPress={() => navigation.navigate('App')} style={{ width: '100%' }} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
