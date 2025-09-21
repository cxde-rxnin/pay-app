import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Eye, EyeSlash } from 'iconsax-react-nativejs';
import colors from '../theme/colors';

type Props = {
  balance: number;
  currency?: string;
};

const BalanceCard: React.FC<Props> = ({ balance, currency = 'NGN' }) => {
  const [showBalance, setShowBalance] = useState(true);
  return (
    <View style={[cardStyles.card, { position: 'relative' }]}> 
      <Text style={{ color: colors.gray, fontSize: 16, fontWeight: '500' }}>Total Balance ({currency})</Text>
      <View style={{ position: 'absolute', right: 0, top: 0, padding: 8 }}>
        <View onTouchEnd={() => setShowBalance((prev) => !prev)}>
          {showBalance ? (
            <Eye size={22} color={colors.gray} variant="Outline" />
          ) : (
            <EyeSlash size={22} color={colors.gray} variant="Outline" />
          )}
        </View>
      </View>
      <Text style={cardStyles.balance}>
        {showBalance ? `${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '******'}
      </Text>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
  balance: {
    color: colors.card,
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  pill: {
    backgroundColor: '#1F2937',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginRight: 10,
  },
  pillPrimary: {
    backgroundColor: colors.secondary,
  },
  pillText: {
    color: '#E5E7EB',
    fontSize: 14,
  },
});

export default BalanceCard;
