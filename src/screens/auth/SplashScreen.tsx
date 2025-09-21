import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../../theme/styles';
import colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import icon from '../../assets/icon.png';

// Define the type for AuthStack navigation
export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  Signup: undefined;
  OTP: undefined;
  PinSetup: undefined;
  UserTag: undefined;
  Login: undefined;
};

const SplashScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Splash'>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
      <Image
        source={icon}
        style={{ width: 100, height: 100, marginBottom: 24 }}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;
