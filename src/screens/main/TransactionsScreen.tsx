import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles from '../../theme/styles';
import TransactionListItem from '../../components/TransactionListItem';
import colors from '../../theme/colors';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type AppTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Settings: undefined;
  Modals: { screen: string };
};

type ScreenProps = {
  navigation: BottomTabNavigationProp<AppTabParamList, 'Transactions'>;
};

const tabs = ['Internal', 'External', 'Utilities'];
const groupedTransactions = [
  {
    title: 'TODAY',
    data: [
      { initials: 'RK', name: 'Roland Kevin', amount: 1295, date: 'March 23 · 5:45AM' },
      { initials: 'JB', name: 'James Brown', amount: -3000, date: 'March 23 · 5:01AM' },
      { initials: 'RC', name: 'Ramon Close', amount: 392, date: 'March 23 · 4:41AM' },
      { initials: 'SO', name: 'Sanusi Olanrewaju', amount: -1211, date: 'March 23 · 3:01AM' },
    ],
  },
  {
    title: 'YESTERDAY',
    data: [
      { initials: 'KS', name: 'Kunle Sayo', amount: -942, date: 'March 22 · 14:30PM' },
      { initials: 'LF', name: 'Lekan Fuji', amount: 20, date: 'March 22 · 13:23PM' },
      { initials: 'FO', name: 'Femi Ogunsola', amount: 210, date: 'March 22 · 12:20PM' },
    ],
  },
];

const TransactionsScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <View style={[styles.screen, { backgroundColor: '#F7F8FA', paddingHorizontal: 0 }]}> 
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 8, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#222' }}>Transactions</Text>
        <TouchableOpacity style={{ padding: 6 }}>
          <Ionicons name="filter" size={22} color={colors.gray} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', backgroundColor: '#EEF2F7', borderRadius: 12, padding: 4, marginVertical: 16, marginHorizontal: 20 }}>
        {tabs.map((tab, idx) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(idx)}
            style={{ flex: 1, backgroundColor: activeTab === idx ? colors.white : 'transparent', paddingVertical: 10, borderRadius: 8, alignItems: 'center', shadowColor: activeTab === idx ? '#000' : undefined, shadowOpacity: activeTab === idx ? 0.04 : 0, shadowRadius: activeTab === idx ? 2 : 0 }}
          >
            <Text style={{ color: activeTab === idx ? colors.primary : colors.gray, fontWeight: '600', fontSize: 15 }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={groupedTransactions}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 8 }}>
            <Text style={{ marginVertical: 12, marginLeft: 24, color: colors.gray, fontWeight: '700', fontSize: 13 }}>{item.title}</Text>
            {item.data.map((tx, i) => (
              <TouchableOpacity key={i} onPress={() => navigation.navigate('Modals', { screen: 'TransactionDetails' })}>
                <View style={{ backgroundColor: colors.white, borderRadius: 16, marginHorizontal: 16, marginBottom: 8, padding: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 2 }}>
                  <TransactionListItem {...tx} amountStyle={{ color: tx.amount > 0 ? '#2ECC71' : '#E74C3C', fontWeight: '700', fontSize: 16 }} nameStyle={{ fontWeight: '600', fontSize: 15 }} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
};

export default TransactionsScreen;
