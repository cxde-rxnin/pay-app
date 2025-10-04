import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { StackNavigationProp } from '@react-navigation/stack';

type KYCStackParamList = {
  NINSelfieVerification: undefined;
  UtilityBillVerification: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<KYCStackParamList, 'NINSelfieVerification'>;
};

const field = { backgroundColor: '#F4F6FA', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14 } as const;

const NINSelfieVerificationScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [nin, setNin] = useState('');
  return (
    <View style={styles.screen}>
      <Text style={[styles.heading, { fontSize: 24, fontFamily: fontConfig.heading }]}>NIN & selfie</Text>
      <Text style={[styles.subheading, { marginTop: 6 }]}>Provide your NIN and a quick selfie to continue</Text>
      <Text style={{ marginTop: 20, color: colors.primary }}>NIN</Text>
      <TextInput style={[styles.body, field, { marginTop: 8 }]} placeholder="11-digit NIN" value={nin} onChangeText={setNin} keyboardType="number-pad" maxLength={11} />
      <Button title="Upload Selfie" onPress={() => {}} style={{ marginTop: 16 }} />
      <Button title="Continue" onPress={() => navigation.navigate('UtilityBillVerification')} style={{ marginTop: 16 }} />
    </View>
  );
};

export default NINSelfieVerificationScreen;
