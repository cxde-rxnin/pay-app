import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Sms } from 'iconsax-react-nativejs';
import colors from '../../theme/colors';
import Button from '../../components/Button';

const SecurityPinEmailCodeScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  
  // @ts-ignore
  const { pinType, email } = route.params || {};
  
  const inputs = Array.from({ length: 6 }, () => useRef<TextInput>(null));

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const handleChange = (text: string, idx: number) => {
    if (/^\d?$/.test(text)) {
      const newCode = [...code];
      newCode[idx] = text;
      setCode(newCode);
      
      if (text && idx < 5) {
        inputs[idx + 1].current?.focus();
      }
      
      // Auto-verify when all 6 digits are entered
      if (newCode.every(digit => digit !== '') && text) {
        handleVerifyCode(newCode.join(''));
      }
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[idx] && idx > 0) {
      inputs[idx - 1].current?.focus();
    }
  };

  const handleVerifyCode = async (codeToVerify?: string) => {
    const verificationCode = codeToVerify || code.join('');
    
    if (verificationCode.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Implement API call to verify code
      // await verifySecurityCode(verificationCode, pinType);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to PIN change screen
      // @ts-ignore
      navigation.navigate('SecurityPinChange', { pinType });
    } catch (error) {
      console.error('Failed to verify code:', error);
      Alert.alert('Invalid Code', 'The verification code you entered is incorrect. Please try again.');
      
      // Clear the code
      setCode(['', '', '', '', '', '']);
      inputs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);
    
    try {
      // TODO: Implement API call to resend code
      // await sendSecurityVerificationCode(pinType);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
      setCountdown(30);
      
      // Restart countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to resend code:', error);
      Alert.alert('Error', 'Failed to resend verification code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const codeValue = code.join('');
  const isCodeComplete = codeValue.length === 6;

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
              <Sms size={40} color={colors.primary} variant="Bold" />
            </View>
          </View>

          <Text style={styles.title}>Enter Verification Code</Text>
          
          <Text style={styles.description}>
            We've sent a 6-digit verification code to {email}
          </Text>

          {/* Code Input */}
          <View style={styles.codeContainer}>
            {code.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={inputs[idx]}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : null
                ]}
                value={digit}
                onChangeText={(text) => handleChange(text, idx)}
                onKeyPress={(e) => handleKeyPress(e, idx)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                autoFocus={idx === 0}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Resend Code */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <TouchableOpacity 
              onPress={handleResendCode}
              disabled={countdown > 0 || resendLoading}
              style={styles.resendButton}
            >
              {resendLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={[
                  styles.resendButtonText,
                  countdown > 0 && styles.resendDisabled
                ]}>
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <Button
            title={
              loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="white" style={styles.buttonLoader} />
                  <Text style={styles.buttonText}>Verifying...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Verify Code</Text>
              )
            }
            onPress={() => handleVerifyCode()}
            disabled={!isCodeComplete || loading}
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
    justifyContent: 'center',
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    gap: 12,
  },
  codeInput: {
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
  codeInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.accent,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
    color: colors.gray,
    marginBottom: 8,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    fontSize: 16,
    fontFamily: 'PoppinsMedium',
    color: colors.primary,
  },
  resendDisabled: {
    color: colors.gray,
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

export default SecurityPinEmailCodeScreen;
