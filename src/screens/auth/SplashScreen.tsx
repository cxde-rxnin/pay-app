import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../theme/styles';
import colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AuthStorageService from '../../services/authStorageService';

// Define the type for AuthStack navigation
export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  WelcomeBack: undefined;
  Signup: undefined;
  OTP: undefined;
  PinSetup: undefined;
  UserTag: undefined;
  Login: undefined;
};

const SplashScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Splash'>>();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Wait for splash duration
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if user is returning
        const isReturning = await AuthStorageService.isReturningUser();
        
        if (isReturning) {
          navigation.navigate('WelcomeBack');
        } else {
          // New user - show onboarding
          navigation.navigate('Onboarding');
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        // Default to onboarding on error
        navigation.navigate('Onboarding');
      }
    };

    checkUserStatus();
  }, [navigation]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
      <Image
        source={require('../../assets/icon.png')}
        style={{ width: 100, height: 100, marginBottom: 24 }}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;
