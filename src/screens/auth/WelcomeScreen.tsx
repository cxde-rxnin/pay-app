import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image } from 'react-native';

type AuthStackParamList = {
  Welcome: undefined;
  Signup: undefined;
  Login: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Welcome'>;
};

const WelcomeScreen: React.FC<ScreenProps> = ({ navigation }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: '#fff', flex: 1 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={40}
    >
      <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'flex-start', paddingHorizontal: 10, marginBottom: 30 }}>
        <Image
          source={require('../../assets/onboard2.png')}
          style={{ width: 800, height: 350, alignSelf: 'center', position: 'relative', top: -80 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 24, fontWeight: 'bold', 
          marginBottom: 8 }}>Supercharge your payments ⚡</Text>
        <Text style={{ fontSize: 16, marginBottom: 24, textAlign: 'left', color: '#222' }}>
          Create an account or sign in to continue.
        </Text>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <Button 
            title="Sign Up" 
            onPress={() => navigation.navigate('Signup')} 
            style={{ flex: 1, marginRight: 10 }} 
          />
          <Button 
            title="Login" 
            type="secondary" 
            onPress={() => navigation.navigate('Login')} 
            style={{ flex: 1, marginLeft: 10 }} 
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
);

export default WelcomeScreen;
