import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TextInput
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Lock } from 'iconsax-react-nativejs';
import colors from '../../theme/colors';
import Button from '../../components/Button';

const SecurityPinChangeScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = Array.from({ length: 6 }, () => useRef<TextInput>(null));
  
  // @ts-ignore
  const { pinType } = route.params || {};

  const getPinTypeTitle = () => {
    switch (pinType) {
      case 'login':
        return 'Change Login PIN';
      case 'transaction':
        return 'Change Transaction PIN';
      case 'duress':
        return 'Change Duress PIN';
      default:
        return 'Change PIN';
    }
  };

  const getPinTypeDescription = () => {
    switch (pinType) {
      case 'login':
        return 'Enter your new 6-digit Login PIN. This PIN will be used to access your account.';
      case 'transaction':
        return 'Enter your new 6-digit Transaction PIN. This PIN will be used to authorize payments and transfers.';
      case 'duress':
        return 'Enter your new 6-digit Duress PIN. This PIN will be used for emergency situations.';
      default:
        return 'Enter your new 6-digit PIN.';
    }
  };

  const handleChange = (text: string, idx: number) => {
    if (/^\d?$/.test(text)) {
      const newPin = [...pin];
      newPin[idx] = text;
      setPin(newPin);
      if (text && idx < 5) {
        inputs[idx + 1].current?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[idx] && idx > 0) {
      inputs[idx - 1].current?.focus();
    }
  };

  const handleContinue = async () => {
    const pinValue = pin.join('');
    
    if (pinValue.length !== 6) {
      Alert.alert('Invalid PIN', 'Please enter a complete 6-digit PIN.');
      return;
    }

    // Basic PIN validation
    if (pinValue === '000000' || pinValue === '123456' || pinValue === '111111') {
      Alert.alert(
        'Weak PIN', 
        'Please choose a more secure PIN. Avoid using repeated digits or sequential numbers.'
      );
      return;
    }

    setLoading(true);
    
    try {
      // Navigate to confirmation screen
      // @ts-ignore
      navigation.navigate('SecurityPinConfirm', { 
        pinType, 
        newPin: pinValue 
      });
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPinInputs = () => {
    return pin.map((digit, idx) => (
      <TextInput
        key={idx}
        ref={inputs[idx]}
        style={[
          styles.pinInput,
          digit ? styles.pinInputFilled : null
        ]}
        value={digit}
        onChangeText={(text) => handleChange(text, idx)}
        onKeyPress={(e) => handleKeyPress(e, idx)}
        keyboardType="numeric"
        maxLength={1}
        textAlign="center"
        autoFocus={idx === 0}
        selectTextOnFocus
        secureTextEntry
      />
    ));
  };

  const isPinComplete = pin.join('').length === 6;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getPinTypeTitle()}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Lock size={40} color={colors.primary} variant="Bold" />
            </View>
          </View>

          <Text style={styles.title}>Enter New PIN</Text>
          
          <Text style={styles.description}>
            {getPinTypeDescription()}
          </Text>

          {/* PIN Inputs */}
          <View style={styles.pinContainer}>
            {renderPinInputs()}
          </View>

                  </View>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <Button
            title={
              loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="white" style={styles.buttonLoader} />
                  <Text style={styles.buttonText}>Processing...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )
            }
            onPress={handleContinue}
            disabled={!isPinComplete || loading}
            style={styles.button}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'PoppinsMedium',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 20,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'PoppinsBold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'PoppinsRegular',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 12,
  },
  pinInput: {
    width: 45,
    height: 56,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 12,
    fontSize: 24,
    fontFamily: 'PoppinsBold',
    color: colors.text,
    backgroundColor: colors.white,
  },
  pinInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.accent,
  },
  tipsContainer: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'PoppinsMedium',
    color: colors.text,
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
    color: colors.gray,
    lineHeight: 20,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  button: {
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLoader: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'PoppinsMedium',
    color: 'white',
  },
});

export default SecurityPinChangeScreen;
