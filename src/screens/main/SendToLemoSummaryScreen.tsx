import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../theme/colors';
import { ArrowLeft, User } from 'iconsax-react-nativejs';
import Button from '../../components/Button';

const SendToLemoSummaryScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { recipientTag, amount } = route.params || {};

  const handleContinue = () => {
    // Navigate directly to Loading screen which will then navigate to Payment screen for PIN entry
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
        <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, textAlign: 'center', flex: 1, marginLeft: -24 }}>
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
            <Text style={{ fontSize: 48, fontWeight: '900', color: colors.text, marginBottom: 20 }}>
              ₦{parseInt(amount).toLocaleString()}
            </Text>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.primary + '10',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 10,
            }}>
              <User size={18} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                @{recipientTag}
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

export default SendToLemoSummaryScreen;
