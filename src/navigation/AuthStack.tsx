import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import PinSetupScreen from '../screens/auth/PinSetupScreen';
import UserTagScreen from '../screens/auth/UserTagScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import LoginPinScreen from '../screens/auth/LoginPinScreen';
import TransactionPinScreen from '../screens/auth/TransactionPinScreen';
import DuressPinScreen from '../screens/auth/DuressPinScreen';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="OTP" component={OTPScreen} />
    <Stack.Screen name="LoginPin" component={LoginPinScreen} />
    <Stack.Screen name="LoginPinConfirm" component={require('../screens/auth/LoginPinConfirmScreen').default} />
    <Stack.Screen name="TransactionPinEntry" component={require('../screens/auth/TransactionPinEntryScreen').default} />
    <Stack.Screen name="TransactionPinConfirm" component={require('../screens/auth/TransactionPinConfirmScreen').default} />
    <Stack.Screen name="DuressPinEntry" component={require('../screens/auth/DuressPinEntryScreen').default} />
    <Stack.Screen name="DuressPinConfirm" component={require('../screens/auth/DuressPinConfirmScreen').default} />
    <Stack.Screen name="BVNVerification" component={require('../screens/kyc/BVNVerificationScreen').default} />
    <Stack.Screen name="NINSelfieVerification" component={require('../screens/kyc/NINSelfieVerificationScreen').default} />
    <Stack.Screen name="UserTag" component={UserTagScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

export default AuthStack;
