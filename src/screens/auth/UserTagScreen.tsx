import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../../theme/styles';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  UserTag: undefined;
  Login: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'UserTag'>;
};

const field = { backgroundColor: '#F4F6FA', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14 } as const;

const UserTagScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [tag, setTag] = useState('');
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.screen, { backgroundColor: '#fff', flex: 1 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { fontSize: 44, marginTop: 30, paddingHorizontal: 5 }]}>Choose your @usertag</Text>
          <Text style={[styles.subheading, { marginTop: 20, paddingHorizontal: 5 }]}>This is how friends can find you on PayApp</Text>
          <Text style={{ marginTop: 20, color: colors.primary }}>@usertag</Text>
          <TextInput
            style={[styles.body, field, { marginTop: 8, borderColor: colors.accent, borderWidth: 1 }]}
            placeholder="@ayodeji"
            value={tag}
            onChangeText={setTag}
            autoCapitalize="none"
          />
        </View>
        <View style={{ width: '100%', marginBottom: 30 }}>
          <Button title="Continue" onPress={() => navigation.navigate('Login')} style={{ width: '100%' }} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default UserTagScreen;
