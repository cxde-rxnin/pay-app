import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BVNVerificationScreen from '../screens/kyc/BVNVerificationScreen';
import NINSelfieVerificationScreen from '../screens/kyc/NINSelfieVerificationScreen';
import UtilityBillVerificationScreen from '../screens/kyc/UtilityBillVerificationScreen';

const Stack = createStackNavigator();

const KYCStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BVNVerification" component={BVNVerificationScreen} />
    <Stack.Screen name="NINSelfieVerification" component={NINSelfieVerificationScreen} />
    <Stack.Screen name="UtilityBillVerification" component={UtilityBillVerificationScreen} />
  </Stack.Navigator>
);

export default KYCStack;
