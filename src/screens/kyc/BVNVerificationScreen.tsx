import React, { useState } from 'react';
import { View, Text, TextInput, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';

type KYCStackParamList = {
  BVNVerification: undefined;
  NINSelfieVerification: undefined;
  LoginPin: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<KYCStackParamList, 'BVNVerification'>;
};

const field = { backgroundColor: '#F4F6FA', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14 } as const;

const BVNVerificationScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [bvn, setBvn] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.screen, { flex: 1 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { fontSize: 44, marginTop: 30, paddingHorizontal: 5 }]}>Verify your identity</Text>
          <Text style={[styles.subheading, { marginTop: 20, paddingHorizontal: 5 }]}>Enter your BVN to fetch your details securely</Text>
          <Text style={{ marginTop: 20, color: colors.primary }}>BVN</Text>
          <TextInput
            style={[
              styles.body,
              field,
              { marginTop: 8, borderColor: colors.accent, borderWidth: 1 },
              isFocused && { borderColor: colors.primary, borderWidth: 2 }
            ]}
            placeholder="11-digit BVN"
            value={bvn}
            onChangeText={setBvn}
            keyboardType="number-pad"
            maxLength={11}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
        <View style={{ width: '100%', marginBottom: 30 }}>
          <Button title="Confirm BVN" onPress={() => navigation.navigate('LoginPin')} style={{ width: '100%' }} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default BVNVerificationScreen;
