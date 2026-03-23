import React, { useState } from 'react';
import { View, Text, TextInput, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { StackNavigationProp } from '@react-navigation/stack';
import apiService from '../../services/apiService'; // Import the API service

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
  const [loading, setLoading] = useState(false);

  const handleVerifyBVN = async () => {
    if (bvn.length !== 11) {
      Alert.alert('Invalid BVN', 'Please enter a valid 11-digit BVN');
      return;
    }

    setLoading(true);
    try {
      // Call API to verify BVN and update KYC
      const result = await apiService.submitBVN(bvn);
      setLoading(false);
      if (result.success) {
        Alert.alert(
          'BVN Verified',
          'Your BVN has been verified successfully. You are now Tier 1 (Basic) with a daily limit of ₦50,000',
          [{ text: 'Continue', onPress: () => navigation.navigate('LoginPin') }]
        );
      } else {
        Alert.alert('Verification Failed', result.error || 'Unable to verify BVN. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Verification Error', 'An error occurred while verifying your BVN. Please try again.');
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
            Verify your identity
          </Text>
          <Text style={[styles.subheading, { marginTop: 20, paddingHorizontal: 5 }]}>
            Enter your BVN to fetch your details securely
          </Text>
          
          <View style={{
            backgroundColor: colors.primary + '10',
            padding: 12,
            borderRadius: 10,
            marginTop: 16,
            marginHorizontal: 5,
          }}>
            <Text style={{ fontSize: 12, color: colors.text, lineHeight: 18 }}>
              🔒 Your BVN is secure and used only for identity verification. This completes Tier 1 verification (₦50,000/day limit).
            </Text>
          </View>

          <Text style={{ marginTop: 24, color: colors.primary, paddingHorizontal: 5, fontWeight: '600' }}>
            Bank Verification Number (BVN)
          </Text>
          <TextInput
            style={[
              styles.body,
              field,
              { marginTop: 8, marginHorizontal: 5, borderColor: colors.accent, borderWidth: 1 },
              isFocused && { borderColor: colors.primary, borderWidth: 2 }
            ]}
            placeholder="Enter 11-digit BVN"
            placeholderTextColor={colors.gray + '60'}
            value={bvn}
            onChangeText={setBvn}
            keyboardType="number-pad"
            maxLength={11}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            editable={!loading}
          />
        </View>
        <View style={{ width: '100%', marginBottom: 30 }}>
          <Button 
            title={loading ? 'Verifying...' : 'Confirm BVN'} 
            onPress={handleVerifyBVN} 
            style={{ width: '100%' }} 
            disabled={bvn.length !== 11 || loading}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default BVNVerificationScreen;
