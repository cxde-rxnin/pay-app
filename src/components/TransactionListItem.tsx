import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

type Props = {
  initials: string;
  name: string;
  amount: number;
  date: string;
  amountStyle?: object;
  nameStyle?: object;
};

const TransactionListItem: React.FC<Props> = ({ initials, name, amount, date, amountStyle, nameStyle }) => (
  <View style={itemStyles.container}>
    <View style={[itemStyles.avatar, { backgroundColor: amount >= 0 ? '#ECFDF5' : '#FEF2F2' }]}>
      <Text style={[itemStyles.avatarText, { color: amount >= 0 ? colors.success : colors.error }]}>{initials}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[itemStyles.name, nameStyle]}>{name}</Text>
      <Text style={itemStyles.date}>{date}</Text>
    </View>
    <Text style={[itemStyles.amount, { color: amount >= 0 ? colors.success : colors.error }, amountStyle]}>
      {amount >= 0 ? '+' : '-'}₦{Math.abs(amount).toLocaleString()}
    </Text>
  </View>
);

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 15,
    color: colors.primary,
  },
  date: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TransactionListItem;
