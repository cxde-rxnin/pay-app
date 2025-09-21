import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/main/HomeScreen';
import TransactionsScreen from '../screens/main/TransactionsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import { Home, MoneySend, Setting2 } from 'iconsax-react-nativejs';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'Home') {
          return <Home size={size} color={color} variant="Bold" />;
        } else if (route.name === 'Transactions') {
          return <MoneySend size={size} color={color} variant="Bold" />;
        } else if (route.name === 'Settings') {
          return <Setting2 size={size} color={color} variant="Bold" />;
        }
        return null;
      },
      tabBarActiveTintColor: colors.card,
      tabBarInactiveTintColor: colors.gray,
      tabBarStyle: { backgroundColor: colors.background, paddingBottom: 70, paddingTop: 20 },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Transactions" component={TransactionsScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

export default AppTabs;
