import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import { fontConfig } from '../../theme/fonts';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { DocumentText, TickCircle } from 'iconsax-react-nativejs';

type KYCStackParamList = {
  UtilityBillVerification: undefined;
  App: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<KYCStackParamList, 'UtilityBillVerification'>;
};

const UtilityBillVerificationScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [billUri, setBillUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickDocument = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setBillUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!billUri) {
      Alert.alert('Document Required', 'Please upload a utility bill to continue');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Verification Complete!',
        'Congratulations! You are now Tier 3 (Premium) with a daily limit of ₦5,000,000',
        [{ text: 'Get Started', onPress: () => navigation.navigate('App') }]
      );
    }, 2000);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={[styles.heading, { fontSize: 32, marginTop: 20, fontFamily: fontConfig.heading }]}>
        Utility Bill Upload
      </Text>
      <Text style={styles.subheading}>
        Complete Tier 3 verification to unlock maximum transaction limits
      </Text>

      <View style={{
        backgroundColor: colors.primary + '10',
        padding: 12,
        borderRadius: 10,
        marginTop: 16,
      }}>
        <Text style={{ fontSize: 12, color: colors.text, lineHeight: 18 }}>
          📄 Upload a recent utility bill to unlock ₦5,000,000/day limit
        </Text>
      </View>

      <Text style={{ marginTop: 24, color: colors.primary, fontWeight: '600', marginBottom: 12 }}>
        Document Upload
      </Text>

      {billUri ? (
        <View>
          <View style={{
            backgroundColor: colors.background,
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.primary + '30',
          }}>
            <DocumentText size={24} color={colors.primary} variant="Bold" />
            <Text style={{ 
              flex: 1, 
              fontSize: 14, 
              color: colors.text, 
              marginLeft: 12,
              fontWeight: '600',
            }}>
              Utility bill uploaded
            </Text>
            <TickCircle size={20} color={colors.primary} variant="Bold" />
          </View>
          <Button 
            title="Upload Different Document" 
            onPress={handlePickDocument} 
            style={{ marginBottom: 16 }}
          />
        </View>
      ) : (
        <TouchableOpacity
          onPress={handlePickDocument}
          style={{
            backgroundColor: colors.background,
            padding: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.gray + '30',
            borderStyle: 'dashed',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <DocumentText size={40} color={colors.primary} variant="Bold" />
          <Text style={{ 
            fontSize: 16, 
            fontWeight: '600', 
            color: colors.text, 
            marginTop: 12,
            marginBottom: 4,
          }}>
            Upload Utility Bill
          </Text>
          <Text style={{ fontSize: 13, color: colors.gray, textAlign: 'center' }}>
            Water, electricity, or internet bill
          </Text>
        </TouchableOpacity>
      )}

      <View style={{
        backgroundColor: colors.background,
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
      }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text, lineHeight: 18, marginBottom: 6 }}>
          Accepted documents:
        </Text>
        <Text style={{ fontSize: 12, color: colors.gray, lineHeight: 18 }}>
          • Electricity bill{'\n'}
          • Water bill{'\n'}
          • Internet/Cable TV bill{'\n'}
          • Must be dated within the last 3 months
        </Text>
      </View>

      <Button 
        title={loading ? 'Submitting...' : 'Complete Verification'} 
        onPress={handleSubmit} 
        style={{ marginTop: 8 }} 
        disabled={!billUri || loading}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('App')}
        style={{ marginTop: 16, padding: 12 }}
      >
        <Text style={{ fontSize: 14, color: colors.gray, textAlign: 'center' }}>
          Skip for now
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UtilityBillVerificationScreen;
