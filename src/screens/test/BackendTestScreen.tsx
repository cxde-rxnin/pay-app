import React from 'react';
import { View, Text } from 'react-native';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';

const BackendTestScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: fontConfig.heading, marginBottom: 12 }}>Backend Test Disabled</Text>
      <Text style={{ color: colors.gray, textAlign: 'center' }}>
        Backend integration and the test page have been disabled for now. All network calls in the app are routed to a local stub.
      </Text>
    </View>
  );
};

export default BackendTestScreen;
