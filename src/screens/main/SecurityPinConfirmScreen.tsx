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
import { ArrowLeft, TickCircle, CloseCircle } from 'iconsax-react-nativejs';
import colors from '../../theme/colors';
import Button from '../../components/Button';
import { useNotifications } from '../../contexts/NotificationContext';

const SecurityPinConfirmScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { showNotification } = useNotifications();
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = Array.from({ length: 6 }, () => useRef<TextInput>(null));
  
  // @ts-ignore
  const { pinType, newPin } = route.params || {};

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
      const newConfirmPin = [...confirmPin];
      newConfirmPin[idx] = text;
      setConfirmPin(newConfirmPin);
      if (text && idx < 5) {
        inputs[idx + 1].current?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !confirmPin[idx] && idx > 0) {
      inputs[idx - 1].current?.focus();
    }
  };

  const handleConfirm = async () => {
    const confirmPinValue = confirmPin.join('');
    
    if (confirmPinValue.length !== 6) {
      Alert.alert('Invalid PIN', 'Please enter a complete 6-digit PIN.');
      return;
    }

    if (confirmPinValue !== newPin) {
      Alert.alert(
        'PIN Mismatch', 
        'The PINs you entered do not match. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => {
              setConfirmPin(['', '', '', '', '', '']);
              inputs[0].current?.focus();
            }
          }
        ]
      );
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Implement API call to update PIN
      // await updateSecurityPin(pinType, newPin);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success toast
      const pinTypeName = pinType === 'login' ? 'Login' : 
                         pinType === 'transaction' ? 'Transaction' : 
                         pinType === 'duress' ? 'Duress' : 'PIN';
      
      showNotification({
        type: 'success',
        title: 'PIN Updated Successfully!',
        message: `Your ${pinTypeName} PIN has been updated successfully.`,
        icon: 'success'
      });
      
      // Navigate back to main app after a short delay
      setTimeout(() => {
        // @ts-ignore
        navigation.navigate('App');
      }, 1000);
    } catch (error) {
      console.error('Failed to update PIN:', error);
      showNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update your PIN. Please try again.',
        icon: 'failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPinInputs = () => {
    const confirmPinValue = confirmPin.join('');
    const pinsMatch = confirmPinValue === newPin.slice(0, confirmPinValue.length);
    
    return confirmPin.map((digit, idx) => {
      return (
        <TextInput
          key={idx}
          ref={inputs[idx]}
          style={[
            styles.pinInput,
            digit && pinsMatch && styles.pinInputSuccess,
            digit && !pinsMatch && styles.pinInputError,
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
      );
    });
  };

  const renderMatchStatus = () => {
    const confirmPinValue = confirmPin.join('');
    if (confirmPinValue.length === 0) return null;
    
    const pinsMatch = confirmPinValue === newPin.slice(0, confirmPinValue.length);
    
    if (confirmPinValue.length === 6) {
      if (confirmPinValue === newPin) {
        return (
          <View style={styles.statusContainer}>
            <TickCircle size={20} color={colors.success} variant="Bold" />
            <Text style={styles.statusTextSuccess}>PINs match!</Text>
          </View>
        );
      } else {
        return (
          <View style={styles.statusContainer}>
            <CloseCircle size={20} color={colors.error} variant="Bold" />
            <Text style={styles.statusTextError}>PINs don't match</Text>
          </View>
        );
      }
    }
    
    return (
      <View style={styles.statusContainer}>
        <Text style={styles.statusTextTyping}>
          {pinsMatch ? 'Matching...' : 'Not matching...'}
        </Text>
      </View>
    );
  };

  const isPinComplete = confirmPin.join('').length === 6;
  const pinsMatch = confirmPin.join('') === newPin;

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
              <TickCircle size={40} color={colors.success} variant="Bold" />
            </View>
          </View>

          <Text style={styles.title}>Confirm New PIN</Text>
          
          <Text style={styles.description}>
            Please re-enter your new PIN to confirm the change.
          </Text>

          {/* PIN Inputs */}
          <View style={styles.pinContainer}>
            {renderPinInputs()}
          </View>

          {/* Match Status */}
          {renderMatchStatus()}

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Step 2 of 2: Confirm your new PIN
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
                  <Text style={styles.buttonText}>Updating PIN...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Update PIN</Text>
              )
            }
            onPress={handleConfirm}
            disabled={!isPinComplete || !pinsMatch || loading}
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
    marginBottom: 20,
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
  pinInputSuccess: {
    backgroundColor: colors.success,
    borderColor: colors.success,
    color: colors.white,
  },
  pinInputError: {
    backgroundColor: colors.error,
    borderColor: colors.error,
    color: colors.white,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  statusTextSuccess: {
    fontSize: 16,
    fontFamily: 'PoppinsMedium',
    color: colors.success,
  },
  statusTextError: {
    fontSize: 16,
    fontFamily: 'PoppinsMedium',
    color: colors.error,
  },
  statusTextTyping: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
    color: colors.gray,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
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

export default SecurityPinConfirmScreen;
