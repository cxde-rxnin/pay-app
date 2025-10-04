import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { ArrowLeft, Bank } from 'iconsax-react-nativejs';
import Button from '../../components/Button';

const SendToBankSummaryScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { bankName, accountNumber, accountName, amount } = route.params || {};

  const handleContinue = () => {
    // Navigate directly to Loading screen which will then navigate to Payment screen for PIN entry
    // @ts-ignore
    navigation.navigate('Loading', {
      type: 'bank',
      bankName,
      accountNumber,
      accountName,
      amount: `₦${parseInt(amount).toLocaleString()}`,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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
          Transaction Summary
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 32 }}>
          {/* Summary Card */}
          <View style={{
            backgroundColor: colors.white,
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 14, color: colors.gray, marginBottom: 12 }}>
              You're sending
            </Text>
            <Text style={{ fontSize: 48, fontWeight: '900', color: colors.text, marginBottom: 20, fontFamily: fontConfig.heading }}>
              ₦{parseInt(amount).toLocaleString()}
            </Text>
            
            <View style={{
              backgroundColor: colors.primary + '10',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: 'center',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Bank size={18} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                  {accountName}
                </Text>
              </View>
              <Text style={{ fontSize: 14, color: colors.gray }}>
                {accountNumber} • {bankName}
              </Text>
            </View>
          </View>

          {/* Transaction Info */}
          <View style={{
            backgroundColor: colors.white,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
          }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 16 }}>
              Transaction Info
            </Text>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 14, color: colors.gray }}>Bank</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                {bankName}
              </Text>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 14, color: colors.gray }}>Account Number</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                {accountNumber}
              </Text>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 14, color: colors.gray }}>Account Name</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                {accountName}
              </Text>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 14, color: colors.gray }}>Amount</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                ₦{parseInt(amount).toLocaleString()}
              </Text>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 14, color: colors.gray }}>Fee</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                ₦10.00
              </Text>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: colors.gray + '20',
            }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.gray }}>Total</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                ₦{(parseInt(amount) + 10).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons - Fixed at bottom */}
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
        flexDirection: 'row',
        gap: 12,
      }}>
        <Button
          title="Back"
          type="secondary"
          onPress={() => navigation.goBack()}
          style={{ flex: 1 }}
        />
        <Button
          title="Continue"
          onPress={handleContinue}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

export default SendToBankSummaryScreen;
