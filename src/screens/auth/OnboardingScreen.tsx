import React from 'react';
import { View, Text, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Button from '../../components/Button';
import styles from '../../theme/styles';
import { StackNavigationProp } from '@react-navigation/stack';

export type AuthStackParamList = {
  Onboarding: undefined;
  Welcome: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Onboarding'>;
};

const OnboardingScreen: React.FC<ScreenProps> = ({ navigation }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: '#fff', flex: 1 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={40}
    >
      <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
        <Image
          source={require('../../assets/Onboarding.png')}
          style={{ width: 370, height: 500, resizeMode: 'contain', position: 'relative', bottom: -40 }}
        />
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'left', marginTop: 32 }}>Welcome to the future of payments</Text>
        <Text style={{ fontSize: 16, marginBottom: 32, textAlign: 'left', paddingRight: 60 }}>
          Create your account and explore features to make payments easy and secure.
        </Text>
      </View>
      <View style={{ width: '100%', marginBottom: 30 }}>
        <Button title="Continue" onPress={() => navigation.navigate('Welcome')} style={{ width: '100%' }} />
      </View>
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
);

export default OnboardingScreen;