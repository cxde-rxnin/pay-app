import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import { StackNavigationProp } from '@react-navigation/stack';

type KYCStackParamList = {
  UtilityBillVerification: undefined;
  App: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<KYCStackParamList, 'UtilityBillVerification'>;
};

const UtilityBillVerificationScreen: React.FC<ScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <Text style={[styles.heading, { fontSize: 24 }]}>Utility bill</Text>
      <Text style={styles.subheading}>Upload a recent bill (water, power or internet)</Text>
      <Button title="Upload Utility Bill" onPress={() => {}} style={{ marginTop: 16 }} />
      <Button title="Finish" onPress={() => navigation.navigate('App')} style={{ marginTop: 16 }} />
    </View>
  );
};

export default UtilityBillVerificationScreen;
