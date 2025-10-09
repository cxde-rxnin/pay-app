import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import KYCStack from './KYCStack';
import AppTabs from './AppTabs';
import ModalStack from './ModalStack';
import TransactionResultScreen from '../screens/main/TransactionResultScreen';
import SendToLemoScreen from '../screens/main/SendToLemoScreen';
import SendToLemoSummaryScreen from '../screens/main/SendToLemoSummaryScreen';
import SendToBankScreen from '../screens/main/SendToBankScreen';
import SendToBankSummaryScreen from '../screens/main/SendToBankSummaryScreen';
import TransactionDetailsScreen from '../screens/modals/TransactionDetailsScreen';
import SecurityPinEmailVerificationScreen from '../screens/main/SecurityPinEmailVerificationScreen';
import SecurityPinEmailCodeScreen from '../screens/main/SecurityPinEmailCodeScreen';
import SecurityPinChangeScreen from '../screens/main/SecurityPinChangeScreen';
import SecurityPinConfirmScreen from '../screens/main/SecurityPinConfirmScreen';
import { navigationRef } from '../services/navigationService';

const RootStack = createStackNavigator();

const RootNavigator = () => (
  <NavigationContainer ref={navigationRef}>
    <RootStack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Auth" component={AuthStack} />
      <RootStack.Screen name="KYC" component={KYCStack} />
      <RootStack.Screen name="App" component={AppTabs} />
      <RootStack.Screen name="Modals" component={ModalStack} options={{ presentation: 'modal' }} />
      <RootStack.Screen name="Loading" component={require('../screens/main/LoadingScreen').default} />
      <RootStack.Screen name="Payment" component={require('../screens/main/PaymentScreen').default} />
      <RootStack.Screen name="SendToLemo" component={SendToLemoScreen} />
      <RootStack.Screen name="SendToLemoSummary" component={SendToLemoSummaryScreen} />
      <RootStack.Screen name="SendToBank" component={SendToBankScreen} />
      <RootStack.Screen name="SendToBankSummary" component={SendToBankSummaryScreen} />
      <RootStack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
      <RootStack.Screen name="AccountVerification" component={require('../screens/main/AccountVerificationScreen').default} />
      <RootStack.Screen name="TransactionResult" component={TransactionResultScreen} />
      <RootStack.Screen name="SecurityPinEmailVerification" component={SecurityPinEmailVerificationScreen} />
      <RootStack.Screen name="SecurityPinEmailCode" component={SecurityPinEmailCodeScreen} />
      <RootStack.Screen name="SecurityPinChange" component={SecurityPinChangeScreen} />
      <RootStack.Screen name="SecurityPinConfirm" component={SecurityPinConfirmScreen} />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;
