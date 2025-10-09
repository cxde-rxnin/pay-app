import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { ArrowLeft, User } from 'iconsax-react-nativejs';
import Button from '../../components/Button';

type RootStackParamList = {
  SendToLemo: undefined;
  TransactionDetails: {
    recipientTag: string;
    amount: string;
    type: 'lemo';
  };
};

type SendToLemoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SendToLemo'>;

interface SendToLemoScreenProps {
  navigation: SendToLemoScreenNavigationProp;
}

const amountStamps = [
  { label: '₦500', value: '500' },
  { label: '₦1,000', value: '1000' },
  { label: '₦2,000', value: '2000' },
  { label: '₦5,000', value: '5000' },
  { label: '₦10,000', value: '10000' },
  { label: '₦20,000', value: '20000' },
  { label: '₦50,000', value: '50000' },
];

const SendToLemoScreen: React.FC<SendToLemoScreenProps> = ({ navigation }) => {
  const [tag, setTag] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    tag: '',
    amount: ''
  });

  const handleStampPress = (value: string) => {
    setAmount(value);
    setSelectedStamp(value);
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

  const handleTagChange = (text: string) => {
    setTag(text);
    // Clear tag error when user types
    if (errors.tag) {
      setErrors(prev => ({ ...prev, tag: '' }));
    }
  };

  const handleContinue = () => {
    const newErrors = {
      tag: '',
      amount: ''
    };

    // Validate tag field
    if (!tag.trim()) {
      newErrors.tag = 'Recipient tag is required';
    } else if (!tag.startsWith('@')) {
      newErrors.tag = 'Tag must start with @';
    } else if (tag.length < 3) {
      newErrors.tag = 'Tag must be at least 3 characters';
    }

    // Validate amount field
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
    if (tag && amount) {
      // @ts-ignore
      navigation.navigate('SendToLemoSummary', {
        recipientTag: tag,
        amount: amount,
      });
    }
  };

  const isValid = tag.trim().length > 0 && amount.trim().length > 0 && parseInt(amount) > 0;

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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, textAlign: 'center', flex: 1, marginLeft: -20, fontFamily: fontConfig.heading }}>
            Send to Lemo
          </Text>
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          {/* Recipient Tag Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 }}>
              Recipient Tag
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.white,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: errors.tag ? (colors.error || '#e74c3c') : (tag ? colors.primary : colors.gray + '30'),
            }}>
              <Text style={{ fontSize: 18, color: colors.gray, marginRight: 4 }}>@</Text>
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: colors.text,
                  paddingVertical: 12,
                }}
                placeholder="Enter username"
                placeholderTextColor={colors.gray}
                value={tag}
                onChangeText={handleTagChange}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <User size={20} color={colors.gray} />
            </View>
            {errors.tag && (
              <Text style={{ color: colors.error || '#e74c3c', fontSize: 14, marginTop: 4 }}>
                {errors.tag}
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
                  fontFamily: fontConfig.heading,
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
              marginBottom: 0, 
              marginTop: 100,
            }}>
              <Text style={{ fontSize: 14, color: colors.gray, marginBottom: 8 }}>
                You're sending
              </Text>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 4, fontFamily: fontConfig.heading }}>
                ₦{parseInt(amount).toLocaleString()}
              </Text>
              <Text style={{ fontSize: 14, color: colors.gray }}>
                to @{tag}
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
    </View>
  );
};

export default SendToLemoScreen;