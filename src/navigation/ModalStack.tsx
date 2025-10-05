import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScanPayScreen from '../screens/modals/ScanPayScreen';
import UtilityPaymentsScreen from '../screens/modals/UtilityPaymentsScreen';
import TransactionDetailsScreen from '../screens/modals/TransactionDetailsScreen';
import NotificationsScreen from '../screens/modals/NotificationsScreen';
import LoadingScreen from '../screens/main/LoadingScreen';
import PaymentScreen from '../screens/main/PaymentScreen';

const Stack = createStackNavigator();

const ModalStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
    <Stack.Screen name="ScanPay" component={ScanPayScreen} />
    <Stack.Screen name="UtilityPayments" component={UtilityPaymentsScreen} />
    <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Loading" component={LoadingScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
  </Stack.Navigator>
);

export default ModalStack;
