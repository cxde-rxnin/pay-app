import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../theme/colors';
import { ArrowLeft, TickCircle, User } from 'iconsax-react-nativejs';
import Button from '../../components/Button';

const TransactionDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { recipientTag, amount, type } = route.params || {};

  const fee = 0; // No fee for Lemo transfers
  const totalAmount = parseInt(amount) + fee;

  const handleConfirm = () => {
    // Navigate to Loading screen which will then navigate to Payment screen for PIN entry
    // @ts-ignore
    navigation.navigate('Loading', {
      type: 'internal',
      usertag: recipientTag,
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
        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>
          Confirm Transfer
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Amount Section */}
        <View style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 20,
          paddingVertical: 40,
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 14, color: colors.white, opacity: 0.8, marginBottom: 8 }}>
            You're sending
          </Text>
          <Text style={{ fontSize: 42, fontWeight: '900', color: colors.white, marginBottom: 4 }}>
            ₦{parseInt(amount).toLocaleString()}
          </Text>
          <Text style={{ fontSize: 14, color: colors.white, opacity: 0.8 }}>
            to @{recipientTag}
          </Text>
        </View>

        {/* Transaction Details */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 }}>
            Transaction Details
          </Text>

          <View style={{
            backgroundColor: colors.white,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
          }}>
            {/* Recipient */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              paddingBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.gray + '20',
            }}>
              <Text style={{ fontSize: 14, color: colors.gray }}>Recipient</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <User size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                  @{recipientTag}
                </Text>
              </View>
            </View>

            {/* Amount */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 14, color: colors.gray }}>Amount</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                ₦{parseInt(amount).toLocaleString()}
              </Text>
            </View>

            {/* Fee */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 14, color: colors.gray }}>Transaction Fee</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.success }}>
                Free
              </Text>
            </View>

            {/* Total */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: colors.gray + '20',
            }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>Total</Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
                ₦{totalAmount.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Info Note */}
          <View style={{
            backgroundColor: colors.primary + '10',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
            <TickCircle size={20} color={colors.primary} style={{ marginRight: 12, marginTop: 2 }} />
            <Text style={{ flex: 1, fontSize: 13, color: colors.text, lineHeight: 20 }}>
              This transaction will be processed instantly. Make sure the recipient details are correct.
            </Text>
          </View>

          {/* Confirm Button */}
          <Button
            title="Confirm & Continue"
            onPress={handleConfirm}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default TransactionDetailsScreen;
