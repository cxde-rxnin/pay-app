import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { StackNavigationProp } from '@react-navigation/stack';
import { Camera } from 'iconsax-react-nativejs';

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
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickSelfie = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take a selfie');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelfieUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (nin.length !== 11) {
      Alert.alert('Invalid NIN', 'Please enter a valid 11-digit NIN');
      return;
    }

    if (!selfieUri) {
      Alert.alert('Selfie Required', 'Please take a selfie to continue');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Verification Successful',
        'Your NIN and selfie have been verified. You are now Tier 2 (Standard) with a daily limit of ₦200,000',
        [{ text: 'Continue', onPress: () => navigation.navigate('UtilityBillVerification') }]
      );
    }, 2000);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={[styles.heading, { fontSize: 32, marginTop: 20, fontFamily: fontConfig.heading }]}>
        NIN & Selfie Verification
      </Text>
      <Text style={[styles.subheading, { marginTop: 12 }]}>
        Upgrade to Tier 2 by providing your NIN and a selfie for enhanced transaction limits
      </Text>

      <View style={{
        backgroundColor: colors.primary + '10',
        padding: 12,
        borderRadius: 10,
        marginTop: 16,
      }}>
        <Text style={{ fontSize: 12, color: colors.text, lineHeight: 18 }}>
          📸 This verification unlocks a ₦200,000/day transaction limit
        </Text>
      </View>
      
      <Text style={{ marginTop: 24, color: colors.primary, fontWeight: '600' }}>
        National Identity Number (NIN)
      </Text>
      <TextInput 
        style={[
          styles.body, 
          field, 
          { marginTop: 8, borderWidth: 1, borderColor: nin ? colors.primary : colors.gray + '30' }
        ]} 
        placeholder="Enter 11-digit NIN" 
        placeholderTextColor={colors.gray + '60'}
        value={nin} 
        onChangeText={setNin} 
        keyboardType="number-pad" 
        maxLength={11}
        editable={!loading}
      />

      <Text style={{ marginTop: 24, color: colors.primary, fontWeight: '600', marginBottom: 12 }}>
        Selfie Verification
      </Text>
      
      {selfieUri ? (
        <View>
          <Image
            source={{ uri: selfieUri }}
            style={{
              width: '100%',
              height: 200,
              borderRadius: 12,
              marginBottom: 12,
            }}
            resizeMode="cover"
          />
          <Button 
            title="Retake Selfie" 
            onPress={handlePickSelfie} 
            style={{ marginBottom: 16 }}
          />
        </View>
      ) : (
        <TouchableOpacity
          onPress={handlePickSelfie}
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
          <Camera size={40} color={colors.primary} variant="Bold" />
          <Text style={{ 
            fontSize: 16, 
            fontWeight: '600', 
            color: colors.text, 
            marginTop: 12,
            marginBottom: 4,
          }}>
            Take a Selfie
          </Text>
          <Text style={{ fontSize: 13, color: colors.gray, textAlign: 'center' }}>
            Ensure your face is clearly visible
          </Text>
        </TouchableOpacity>
      )}

      <Button 
        title={loading ? 'Verifying...' : 'Submit Verification'} 
        onPress={handleSubmit} 
        style={{ marginTop: 8 }} 
        disabled={nin.length !== 11 || !selfieUri || loading}
      />
    </ScrollView>
  );
};

export default NINSelfieVerificationScreen;
