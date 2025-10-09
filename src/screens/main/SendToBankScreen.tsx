import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { ArrowLeft, ArrowDown2, Bank } from 'iconsax-react-nativejs';
import Button from '../../components/Button';

const { height } = Dimensions.get('window');

type RootStackParamList = {
  SendToBank: undefined;
  SendToBankSummary: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    amount: string;
  };
};

type SendToBankScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SendToBank'>;

interface SendToBankScreenProps {
  navigation: SendToBankScreenNavigationProp;
}

const nigerianBanks = [
  'Access Bank',
  'Citibank',
  'Ecobank Nigeria',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'First City Monument Bank (FCMB)',
  'Globus Bank',
  'Guaranty Trust Bank (GTBank)',
  'Heritage Bank',
  'Keystone Bank',
  'Polaris Bank',
  'Providus Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Sterling Bank',
  'SunTrust Bank',
  'Titan Trust Bank',
  'Union Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Unity Bank',
  'Wema Bank',
  'Zenith Bank',
];

const amountStamps = [
  { label: '₦500', value: '500' },
  { label: '₦1,000', value: '1000' },
  { label: '₦2,000', value: '2000' },
  { label: '₦5,000', value: '5000' },
  { label: '₦10,000', value: '10000' },
  { label: '₦20,000', value: '20000' },
  { label: '₦50,000', value: '50000' },
];

const SendToBankScreen: React.FC<SendToBankScreenProps> = ({ navigation }) => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const [showBankPicker, setShowBankPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState({
    bankName: '',
    accountNumber: '',
    amount: ''
  });
  
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handleCloseBankPicker = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: height,
        useNativeDriver: true,
        speed: 20,
        bounciness: 0,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setModalVisible(false);
      setShowBankPicker(false);
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY: dragDistance, velocityY } = event.nativeEvent;
      
      if (dragDistance > 100 || velocityY > 500) {
        translateY.setValue(0);
        handleCloseBankPicker();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }).start();
      }
    }
  };

  useEffect(() => {
    if (showBankPicker) {
      setModalVisible(true);
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
      translateY.setValue(0);
      
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            speed: 18,
            bounciness: 8,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      }, 50);
    } else if (modalVisible) {
      handleCloseBankPicker();
    }
  }, [showBankPicker, modalVisible, slideAnim, fadeAnim, translateY]);

  const handleStampPress = (value: string) => {
    handleStampSelect(value);
  };

  const handleAmountChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setAmount(numericValue);
    setSelectedStamp(null); // Deselect stamp when manually typing
    // Clear amount error when user types
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleAccountNumberChange = (text: string) => {
    // Only allow numbers and limit to 10 digits
    const numericValue = text.replace(/[^0-9]/g, '').slice(0, 10);
    setAccountNumber(numericValue);
    // Clear account number error when user types
    if (errors.accountNumber) {
      setErrors(prev => ({ ...prev, accountNumber: '' }));
    }
    
    // Simulate account name lookup when 10 digits are entered
    if (numericValue.length === 10 && bankName) {
      // In a real app, this would be an API call
      setTimeout(() => {
        setAccountName('John Doe'); // Simulated account name
      }, 500);
    } else {
      setAccountName('');
    }
  };

  const handleBankSelect = (bank: string) => {
    setBankName(bank);
    setShowBankPicker(false);
    // Clear bank error when user selects a bank
    setErrors(prev => ({ ...prev, bankName: '' }));
    // Reset account name when bank changes
    if (accountNumber.length === 10) {
      setAccountName('');
      // Simulate re-fetching account name
      setTimeout(() => {
        setAccountName('John Doe');
      }, 500);
    }
  };

  const handleStampSelect = (value: string) => {
    setAmount(value);
    setSelectedStamp(value);
    // Clear amount error when user selects stamp
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleContinue = () => {
    const newErrors = {
      bankName: '',
      accountNumber: '',
      amount: ''
    };

    // Validate all fields
    if (!bankName.trim()) {
      newErrors.bankName = 'Please select a bank';
    }
    
    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (accountNumber.length !== 10) {
      newErrors.accountNumber = 'Account number must be 10 digits';
    }
    
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (parseInt(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseInt(amount) < 100) {
      newErrors.amount = 'Minimum amount is ₦100';
    }

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    // All validation passed
    if (bankName && accountNumber && accountName && amount) {
      // @ts-ignore
      navigation.navigate('SendToBankSummary', {
        bankName,
        accountNumber,
        accountName,
        amount,
      });
    }
  };

  const isValid = 
    bankName.trim().length > 0 && 
    accountNumber.length === 10 && 
    accountName.trim().length > 0 && 
    amount.trim().length > 0 && 
    parseInt(amount) > 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 60,
          paddingBottom: 20,
          backgroundColor: colors.white,
          borderBottomWidth: 1,
          borderBottomColor: colors.gray + '20',
        }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: fontConfig.heading }}>
            Send to Bank
          </Text>
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          {/* Bank Selection */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 }}>
              Select Bank
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.white,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: errors.bankName ? (colors.error || '#e74c3c') : (bankName ? colors.primary : colors.gray + '30'),
              }}
              onPress={() => setShowBankPicker(true)}
            >
              <Bank size={20} color={colors.gray} style={{ marginRight: 8 }} />
              <Text style={{
                flex: 1,
                fontSize: 16,
                color: bankName ? colors.text : colors.gray,
              }}>
                {bankName || 'Choose a bank'}
              </Text>
              <ArrowDown2 size={20} color={colors.gray} />
            </TouchableOpacity>
            {errors.bankName && (
              <Text style={{ color: colors.error || '#e74c3c', fontSize: 14, marginTop: 4 }}>
                {errors.bankName}
              </Text>
            )}
          </View>

          {/* Account Number Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 }}>
              Account Number
            </Text>
            <View style={{
              backgroundColor: colors.white,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: errors.accountNumber ? (colors.error || '#e74c3c') : (accountNumber ? colors.primary : colors.gray + '30'),
            }}>
              <TextInput
                style={{
                  fontSize: 16,
                  color: colors.text,
                  paddingVertical: 12,
                }}
                placeholder="Enter 10-digit account number"
                placeholderTextColor={colors.gray}
                value={accountNumber}
                onChangeText={handleAccountNumberChange}
                keyboardType="numeric"
                maxLength={10}
                editable={!!bankName}
              />
              {accountName && (
                <View style={{ paddingBottom: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary }}>
                    {accountName}
                  </Text>
                </View>
              )}
            </View>
            {errors.accountNumber && (
              <Text style={{ color: colors.error || '#e74c3c', fontSize: 14, marginTop: 4 }}>
                {errors.accountNumber}
              </Text>
            )}
            {!bankName && (
              <Text style={{ fontSize: 12, color: colors.gray, marginTop: 4 }}>
                Please select a bank first
              </Text>
            )}
          </View>

          {/* Amount Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 }}>
              Amount
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.white,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: errors.amount ? (colors.error || '#e74c3c') : (amount ? colors.primary : colors.gray + '30'),
            }}>
              <Text style={{ fontSize: 18, color: colors.gray, marginRight: 4 }}>₦</Text>
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 24,
                  fontWeight: '700',
                  color: colors.text,
                  paddingVertical: 12,
                }}
                placeholder="0"
                placeholderTextColor={colors.gray + '60'}
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
              />
            </View>
            {errors.amount && (
              <Text style={{ color: colors.error || '#e74c3c', fontSize: 14, marginTop: 4 }}>
                {errors.amount}
              </Text>
            )}
          </View>

          {/* Amount Stamps */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 }}>
              Quick Amount
            </Text>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 12,
            }}>
              {amountStamps.map((stamp) => (
                <TouchableOpacity
                  key={stamp.value}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 10,
                    backgroundColor: selectedStamp === stamp.value ? colors.primary : colors.white,
                    borderWidth: 1,
                    borderColor: selectedStamp === stamp.value ? colors.primary : colors.gray + '30',
                    minWidth: 100,
                    alignItems: 'center',
                  }}
                  onPress={() => handleStampPress(stamp.value)}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: selectedStamp === stamp.value ? colors.white : colors.text,
                  }}>
                    {stamp.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Transaction Summary */}
          {isValid && (
            <View style={{
              backgroundColor: colors.primary + '10',
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
            }}>
              <Text style={{ fontSize: 14, color: colors.gray, marginBottom: 8 }}>
                You're sending
              </Text>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 4, fontFamily: fontConfig.heading }}>
                ₦{parseInt(amount).toLocaleString()}
              </Text>
              <Text style={{ fontSize: 14, color: colors.gray }}>
                to {accountName} • {bankName}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Continue Button - Fixed at bottom */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 32,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.gray + '20',
      }}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isValid}
          style={{
            opacity: isValid ? 1 : 0.5,
          }}
        />
      </View>

      {/* Bank Picker Modal */}
      {modalVisible && (
        <Modal
          visible={modalVisible}
          animationType="none"
          transparent
          onRequestClose={handleCloseBankPicker}
        >
          <TouchableWithoutFeedback onPress={handleCloseBankPicker}>
            <Animated.View style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.85)',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: fadeAnim,
            }}>
              <BlurView style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} intensity={20} tint="dark" />
            </Animated.View>
          </TouchableWithoutFeedback>
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
            activeOffsetY={10}
            failOffsetY={-10}
          >
            <Animated.View style={{
              backgroundColor: colors.white,
              borderTopLeftRadius: 35,
              borderTopRightRadius: 35,
              maxHeight: '70%',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              transform: [
                { translateY: slideAnim },
                { translateY: translateY }
              ]
            }}>
              <View style={{
                width: 40,
                height: 4,
                backgroundColor: colors.gray,
                borderRadius: 2,
                alignSelf: 'center',
                marginTop: 12,
                marginBottom: 8,
                opacity: 0.4,
              }} />
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: colors.gray + '20',
              }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
                  Select Bank
                </Text>
                <TouchableOpacity onPress={handleCloseBankPicker}>
                  <Text style={{ fontSize: 16, color: colors.primary, fontWeight: '600' }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={nigerianBanks}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.gray + '10',
                    }}
                    onPress={() => handleBankSelect(item)}
                  >
                    <Text style={{
                      fontSize: 16,
                      color: colors.text,
                      fontWeight: bankName === item ? '600' : '400',
                    }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </Animated.View>
          </PanGestureHandler>
        </Modal>
      )}
    </View>
  );
};

export default SendToBankScreen;
