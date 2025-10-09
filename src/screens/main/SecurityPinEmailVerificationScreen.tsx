import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Sms } from 'iconsax-react-nativejs';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import Button from '../../components/Button';

const SecurityPinEmailVerificationScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  
  // @ts-ignore
  const { pinType } = route.params || {};

  // Mock user email - in real app, this would come from user context/state
  const userEmail = 'user@example.com';
  const maskedEmail = userEmail.replace(/(.{2})(.*)(@.*)/, '$1****$3');

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

  const handleSendCode = async () => {
    setLoading(true);
    
    try {
      // TODO: Implement API call to send verification code
      // await sendSecurityVerificationCode(pinType);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // @ts-ignore
      navigation.navigate('SecurityPinEmailCode', { 
        pinType, 
        email: maskedEmail 
      });
    } catch (error) {
      console.error('Failed to send verification code:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

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

          <Text style={styles.title}>Email Verification Required</Text>
          
          <Text style={styles.description}>
            For your security, we'll send a verification code to your registered email address to confirm this PIN change.
          </Text>

          <View style={styles.emailContainer}>
            <Text style={styles.emailLabel}>Sending code to:</Text>
            <Text style={styles.emailText}>{maskedEmail}</Text>
          </View>

          <View style={styles.securityNote}>
            <Text style={styles.securityNoteText}>
              🔐 This helps protect your account from unauthorized changes
            </Text>
          </View>
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <Button
            title={
              loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="white" style={styles.buttonLoader} />
                  <Text style={styles.buttonText}>Sending Code...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Send Verification Code</Text>
              )
            }
            onPress={handleSendCode}
            disabled={loading}
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
    marginBottom: 32,
  },
  emailContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emailLabel: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
    color: colors.gray,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    fontFamily: 'PoppinsMedium',
    color: colors.text,
  },
  securityNote: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  securityNoteText: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
    color: colors.gray,
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
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

export default SecurityPinEmailVerificationScreen;
